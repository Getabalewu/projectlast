import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Smartphone,
  User,
  Shield,
  Settings,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { adminCredentials } from "../../data/adminCredentials";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export function LoginForm() {
  const [accessType, setAccessType] = useState("student");
  const [loginMethod, setLoginMethod] = useState("university");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    studentId: "",
    otp: "",
    adminRole: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);

  const { login, loginWithGoogle } = useAuth();

  const adminRoles = [
    { value: "president", label: "President" },
    { value: "student_din", label: "Student Din" },
    { value: "vice_president", label: "Vice President" },
    { value: "secretary", label: "Secretary" },
    { value: "speaker", label: "Speaker" },
    { value: "academic_affairs", label: "Academic Affairs" },
    { value: "general_service", label: "General Service" },
    { value: "dining_services", label: "Dining Services" },
    { value: "sports_culture", label: "Sports & Culture" },
    { value: "clubs_associations", label: "Clubs & Associations" },
  ];

  const handleEmailChange = (email) => {
    setFormData((prev) => ({ ...prev, email, adminRole: "" }));

    if (accessType === "admin" && email) {
      const matchingCredentials = adminCredentials.filter(
        (cred) => cred.email.toLowerCase() === email.toLowerCase()
      );

      if (matchingCredentials.length > 0) {
        setAvailableRoles(matchingCredentials.map((cred) => cred.role));
      } else {
        setAvailableRoles([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (accessType === "admin") {
        if (!formData.adminRole) {
          toast.error("Please select admin role");
          return;
        }

        if (availableRoles.length === 0) {
          toast.error("This email does not have admin access");
          return;
        }

        if (!availableRoles.includes(formData.adminRole)) {
          toast.error("This email is not authorized for this role");
          return;
        }

        await login(
          formData.email,
          formData.password,
          formData.otp,
          formData.adminRole
        );
        toast.success("Admin access granted");
      } else {
        if (loginMethod === "google") {
          await loginWithGoogle();
          toast.success("Login successful");
        } else {
          if (!showOtpField) {
            setShowOtpField(true);
            toast.success("OTP has been sent");
          } else {
            await login(formData.email, formData.password, formData.otp);
            toast.success("Login successful");
          }
        }
      }
    } catch (error) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      handleEmailChange(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-6"
          >
            <span className="text-white font-bold text-2xl">DBU</span>
          </motion.div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600">Please enter your credentials.</p>
          </div>
        </div>

        {/* Access Type Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => {
              setAccessType("student");
              setFormData((prev) => ({ ...prev, adminRole: "", email: "" }));
              setAvailableRoles([]);
            }}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              accessType === "student"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Student Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAccessType("admin");
              setLoginMethod("university");
              setFormData((prev) => ({ ...prev, email: "", adminRole: "" }));
              setAvailableRoles([]);
            }}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              accessType === "admin"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Student Login Method Toggle */}
        {accessType === "student" && (
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginMethod("university")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === "university"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              University Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("google")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === "google"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Google
            </button>
          </div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Admin Email */}
          {accessType === "admin" && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="admin@dbu.edu.et"
                />
              </div>
              {formData.email && availableRoles.length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  This email does not have admin access
                </p>
              )}
            </div>
          )}

          {/* Admin Role Selection */}
          {accessType === "admin" &&
            formData.email &&
            availableRoles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <label
                  htmlFor="adminRole"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Administrative Role
                </label>
                <div className="relative">
                  <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    id="adminRole"
                    name="adminRole"
                    required
                    value={formData.adminRole}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">-- Select Role --</option>
                    {adminRoles
                      .filter((role) => availableRoles.includes(role.value))
                      .map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                  </select>
                </div>
                <p className="mt-2 text-sm text-green-600">
                  {availableRoles.length} role(s) available
                </p>
              </motion.div>
            )}

          {/* Student Forms */}
          {accessType === "student" && loginMethod === "university" && (
            <>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="example@dbu.edu.et"
                  />
                </div>
              </div>

              {/* Student ID */}
              <div>
                <label
                  htmlFor="studentId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Student ID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="DBU-2021-001"
                  />
                </div>
              </div>
            </>
          )}

          {/* Password */}
          {(accessType === "admin" ||
            (accessType === "student" && loginMethod === "university")) && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* OTP Field */}
          {showOtpField && accessType === "student" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                OTP
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">OTP has been sent</p>
            </motion.div>
          )}

          {/* Google Login Display */}
          {accessType === "student" && loginMethod === "google" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-6">
                Sign in with your Google account
              </p>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={
              isLoading ||
              (accessType === "admin" &&
                (!formData.email || availableRoles.length === 0))
            }
            className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading...
              </div>
            ) : (
              <>
                {accessType === "admin"
                  ? "Admin Access"
                  : loginMethod === "google"
                  ? "Login with Google"
                  : showOtpField
                  ? "Verify OTP"
                  : "Login"}
              </>
            )}
          </motion.button>

          {/* Admin Credentials Info */}
          {accessType === "admin" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-2">
                  Demo Admin Credentials:
                </p>
                <div className="grid grid-cols-1 gap-1 text-blue-700">
                  <span>• president@dbu.edu.et (password: admin123)</span>
                  <span>• studentdin@dbu.edu.et (password: admin123)</span>
                  <span>• academic@dbu.edu.et (password: admin123)</span>
                  <span>• clubs@dbu.edu.et (password: admin123)</span>
                  <span>• dining@dbu.edu.et (password: admin123)</span>
                  <span>• sports@dbu.edu.et (password: admin123)</span>
                </div>
              </div>
            </div>
          )}

          {/* Student Demo Credentials */}
          {accessType === "student" && loginMethod === "university" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm">
                <p className="font-medium text-green-800 mb-2">
                  Demo Student Credentials:
                </p>
                <div className="grid grid-cols-1 gap-1 text-green-700">
                  <span>• student@dbu.edu.et (password: student123)</span>
                  <span>• Any email with any password works for demo</span>
                </div>
              </div>
            </div>
          )}
        </motion.form>
      </motion.div>
    </div>
  );
}