import React from "react";
import { useState, useEffect } from "react";
import {
	Users,
	Vote,
	MessageSquare,
	Award,
	Activity,
	Calendar,
	Bell,
	Clock,
	TrendingUp,
	AlertCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { apiService } from "../../services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "../../app.css";

export function Dashboard() {
	const { user } = useAuth();
	const [stats, setStats] = useState([
		{
			title: "Active Students",
			value: "0",
			change: "Loading...",
			icon: Users,
			color: "bg-blue-500",
		},
		{
			title: "Ongoing Elections",
			value: "0",
			change: "Loading...",
			icon: Vote,
			color: "bg-green-500",
		},
		{
			title: "Active Clubs",
			value: "0",
			change: "Loading...",
			icon: Award,
			color: "bg-purple-500",
		},
		{
			title: "Pending Complaints",
			value: "0",
			change: "Loading...",
			icon: MessageSquare,
			color: "bg-orange-500",
		},
	]);
	const [recentActivities, setRecentActivities] = useState([]);
	const [upcomingEvents, setUpcomingEvents] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchDashboardData = async () => {
		try {
			setLoading(true);
			
			// Fetch stats from API
			const statsData = await apiService.request('/stats');
			
			// Update stats with real data
			setStats([
				{
					title: "Active Students",
					value: statsData.totalStudents?.toLocaleString() || "0",
					change: "+12%",
					icon: Users,
					color: "bg-blue-500",
				},
				{
					title: "Ongoing Elections",
					value: statsData.activeElections?.toString() || "0",
					change: "2 ending soon",
					icon: Vote,
					color: "bg-green-500",
				},
				{
					title: "Active Clubs",
					value: statsData.totalClubs?.toString() || "0",
					change: "+5 this month",
					icon: Award,
					color: "bg-purple-500",
				},
				{
					title: "Pending Complaints",
					value: statsData.pendingComplaints?.toString() || "0",
					change: "-8 resolved",
					icon: MessageSquare,
					color: "bg-orange-500",
				},
			]);

			// Mock recent activities (in real app, this would come from API)
			setRecentActivities([
				{
					id: 1,
					title: "New election started: Student Union President",
					time: "2 hours ago",
					type: "election",
				},
				{
					id: 2,
					title: "Drama Club submitted monthly report",
					time: "4 hours ago",
					type: "club",
				},
				{
					id: 3,
					title: "Complaint resolved: Library access issue",
					time: "1 day ago",
					type: "complaint",
				},
			]);

			// Mock upcoming events
			setUpcomingEvents([
				{
					id: 1,
					title: "Annual Cultural Festival",
					date: "2024-02-15",
					time: "09:00 AM",
					location: "Main Campus",
				},
				{
					id: 2,
					title: "Student Council Meeting",
					date: "2024-02-10",
					time: "02:00 PM",
					location: "Conference Hall",
				},
			]);

		} catch (error) {
			console.error('Failed to fetch dashboard data:', error);
			toast.error('Failed to load dashboard data');
		} finally {
			setLoading(false);
		}
	};

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 18) return "Good afternoon";
		return "Good evening";
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						{getGreeting()}, {user?.name || "Admin"}!
					</h1>
					<p className="text-gray-600 mt-2">
						Here's what's happening in your student portal today.
					</p>
				</motion.div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{stats.map((stat, index) => {
						const Icon = stat.icon;
						return (
							<motion.div
								key={stat.title}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">
											{stat.title}
										</p>
										<p className="text-2xl font-bold text-gray-900 mt-2">
											{stat.value}
										</p>
										<p className="text-sm text-gray-500 mt-1">{stat.change}</p>
									</div>
									<div className={`${stat.color} p-3 rounded-lg`}>
										<Icon className="w-6 h-6 text-white" />
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>

				{/* Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Recent Activity */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
						className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Recent Activity
							</h3>
							<Bell className="w-5 h-5 text-gray-400" />
						</div>
						{loading ? (
							<div className="flex items-center justify-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
							</div>
						) : (
							<div className="space-y-4">
								{recentActivities.length > 0 ? (
									recentActivities.map((activity) => (
										<div
											key={activity.id}
											className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
											<div
												className={`w-2 h-2 mt-2 rounded-full ${
													activity.type === "election"
														? "bg-green-500"
														: activity.type === "club"
														? "bg-purple-500"
														: "bg-orange-500"
												}`}></div>
											<div className="flex-1">
												<p className="text-sm font-medium text-gray-900">
													{activity.title}
												</p>
												<p className="text-xs text-gray-500">{activity.time}</p>
											</div>
										</div>
									))
								) : (
									<div className="text-center py-8">
										<AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
										<p className="text-gray-500">No recent activities</p>
									</div>
								)}
							</div>
						)}
					</motion.div>

					{/* Upcoming Events */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.5 }}
						className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Upcoming Events
							</h3>
							<Calendar className="w-5 h-5 text-gray-400" />
						</div>
						{loading ? (
							<div className="flex items-center justify-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
							</div>
						) : (
							<div className="space-y-4">
								{upcomingEvents.length > 0 ? (
									upcomingEvents.map((event) => (
										<div
											key={event.id}
											className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
											<h4 className="font-medium text-gray-900 mb-2">
												{event.title}
											</h4>
											<div className="flex items-center space-x-4 text-sm text-gray-600">
												<div className="flex items-center space-x-1">
													<Calendar className="w-4 h-4" />
													<span>{new Date(event.date).toLocaleDateString()}</span>
												</div>
												<div className="flex items-center space-x-1">
													<Clock className="w-4 h-4" />
													<span>{event.time}</span>
												</div>
											</div>
											<p className="text-sm text-gray-500 mt-1">{event.location}</p>
										</div>
									))
								) : (
									<div className="text-center py-8">
										<Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
										<p className="text-gray-500">No upcoming events</p>
									</div>
								)}
							</div>
						)}
					</motion.div>
				</div>

				{/* Quick Actions */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Quick Actions
					</h3>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{[
							{
								title: "Create Election",
								icon: Vote,
								color: "bg-green-500",
								href: "/admin/elections/create",
							},
							{
								title: "Manage Clubs",
								icon: Award,
								color: "bg-purple-500",
								href: "/admin/clubs",
							},
							{
								title: "View Complaints",
								icon: MessageSquare,
								color: "bg-orange-500",
								href: "/admin/complaints",
							},
							{
								title: "System Activity",
								icon: Activity,
								color: "bg-blue-500",
								href: "/admin/activity",
							},
						].map((action) => {
							const Icon = action.icon;
							return (
								<button
									key={action.title}
									className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group">
									<div
										className={`${action.color} p-3 rounded-lg mb-3 group-hover:scale-110 transition-transform`}>
										<Icon className="w-6 h-6 text-white" />
									</div>
									<span className="text-sm font-medium text-gray-700">
										{action.title}
									</span>
								</button>
							);
						})}
					</div>
				</motion.div>
			</div>
		</div>
	);
}