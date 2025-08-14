/** @format */

import express from "express";
import Complaint from "../models/Complaint.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Improved error logging
const logError = (error) => {
	console.error("Error: ", error);
};

// Create a new complaint
router.post("/", authenticateToken, async (req, res) => {
	try {
		const { title, description, category, branch, priority } = req.body;

		// Input validation
		if (!title || !description || !category || !branch) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const complaint = new Complaint({
			title,
			description,
			category,
			branch,
			priority,
			submittedBy: req.user._id,
		});

		const savedComplaint = await complaint.save();
		await savedComplaint.populate("submittedBy", "name email");
		res.status(201).json(savedComplaint);
	} catch (err) {
		logError(err);
		res.status(500).json({ message: "Error creating complaint" });
	}
});

// Get all complaints
router.get("/", authenticateToken, async (req, res) => {
	try {
		let query = {};

		// If not admin, only show user's own complaints
		if (req.user.role !== "admin") {
			query.submittedBy = req.user._id;
		}

		const complaints = await Complaint.find(query)
			.populate("submittedBy", "name email")
			.sort({ submittedAt: -1 });
		res.status(200).json(complaints);
	} catch (err) {
		logError(err);
		res.status(500).json({ message: "Error fetching complaints" });
	}
});

// Get complaint by ID
router.get("/:id", authenticateToken, async (req, res) => {
	try {
		const complaint = await Complaint.findById(req.params.id).populate(
			"submittedBy",
			"name email"
		);

		if (!complaint) {
			return res.status(404).json({ message: "Complaint not found" });
		}

		// Check if user can access this complaint
		if (
			req.user.role !== "admin" &&
			complaint.submittedBy._id.toString() !== req.user._id.toString()
		) {
			return res.status(403).json({ message: "Access denied" });
		}

		res.status(200).json(complaint);
	} catch (err) {
		logError(err);
		res.status(500).json({ message: "Error fetching complaint" });
	}
});

// Add response to complaint (Admin only)
router.post("/", authenticateToken, async (req, res) => {
	try {
		const { title, description, category, branch, priority } = req.body;

		if (!title || !description || !category || !branch) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Ensure req.user._id is valid
		if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		const complaint = new Complaint({
			title,
			description,
			category,
			branch,
			priority,
			submittedBy: req.user._id, // Ensure this is an ObjectId
		});

		const savedComplaint = await complaint.save();
		await savedComplaint.populate("submittedBy", "name email");
		res.status(201).json(savedComplaint);
	} catch (err) {
		console.error(err); // Log the error for debugging
		res.status(500).json({ message: "Error creating complaint" });
	}
});

// Update complaint status (Admin only)
router.patch("/:id/status", authenticateToken, async (req, res) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(403).json({ message: "Admin access required" });
		}

		const { status } = req.body;

		if (!status) {
			return res.status(400).json({ message: "Status is required" });
		}

		const complaint = await Complaint.findById(req.params.id);

		if (!complaint) {
			return res.status(404).json({ message: "Complaint not found" });
		}

		complaint.status = status;
		await complaint.save();

		res
			.status(200)
			.json({ message: "Complaint status updated successfully", complaint });
	} catch (err) {
		logError(err);
		res.status(500).json({ message: "Error updating complaint status" });
	}
});

export default router;
