import React, { useEffect, useState } from "react";
import {
  FaUserAlt,
  FaEnvelope,
  FaLock,
  FaMobileAlt,
  FaBuilding,
  FaEye, // Import FaEye
  FaEyeSlash, // Import FaEyeSlash
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import register from "../services/register";
import { useAuth } from "../context/AuthContext";
import { requestRegistrationOTPService } from "../services/requestRegistrationOTP";


const RegisterForm = () => {
  const { isAuthenticated, login, verified } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    reg_email: "",
    reg_password: "",
    confirm_password: "",
    phone: "",
    otp: "", // Added OTP field
  });

  const [errors, setErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP related states
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0); // Countdown for OTP resend
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let validationErrors = {};

    if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) { // Trim name before validation
      validationErrors.name = "Full name should contain alphabets only";
    }

    // Stricter email validation and trimming
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.reg_email.trim())) {
      validationErrors.reg_email = "Invalid email format";
    }

    if (formData.reg_password.length < 4) {
      validationErrors.reg_password = "Password should be at least 4 characters";
    }

    if (formData.reg_password !== formData.confirm_password) {
      validationErrors.confirm_password = "Passwords do not match";
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) { // Trim phone before validation
      validationErrors.phone = "Phone number should be exactly 10 digits";
    }

    if (showOtpField && !/^\d{6}$/.test(formData.otp.trim())) { // OTP validation (trimming added)
      validationErrors.otp = "OTP must be a 6-digit number.";
    }

    return validationErrors;
  };

  useEffect(() => {
    if (isAuthenticated && verified) {
      navigate("/dashboard");
    } else if (isAuthenticated) {
      navigate("/verify");
    }
  }, [isAuthenticated, verified, navigate]);

  // OTP Timer useEffect
  useEffect(() => {
    let timerInterval;
    if (otpSent && otpTimer > 0) {
      timerInterval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [otpSent, otpTimer]);


  const handleRequestOtp = async () => {
    const trimmedEmail = formData.reg_email.trim(); // Trim email before validation and use
    // Use stricter email validation
    const emailValidation = !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail);
    if (emailValidation) {
      setErrors((prev) => ({ ...prev, reg_email: "Invalid email format" }));
      toast.error("Please enter a valid email address.");
      return;
    }
    setErrors((prev) => ({ ...prev, reg_email: undefined })); // Clear email error if valid

    setIsRequestingOtp(true);
    try {
      const response = await requestRegistrationOTPService(trimmedEmail); // Use trimmed email
      if (response?.message) {
        toast.success(response.message);
        setOtpSent(true);
        setShowOtpField(true);
        setOtpTimer(60); // Start 60-second countdown
      } else {
        toast.error(response?.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.error || err?.message || "Failed to send OTP.";
      toast.error(errorMessage);
      setShowOtpField(false); // Hide OTP field if request fails initially
      setOtpSent(false); // Reset OTP sent state
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast.error("Please accept Terms & Conditions");
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      if (otpSent && !formData.otp) {
        toast.error("Please enter the OTP sent to your email.");
        return;
      }
      const payload = {
        fullName: formData.name.trim(),
        email: formData.reg_email.trim(), // Use trimmed email for payload
        password: formData.reg_password,
        phone: formData.phone.trim(),
        otp: formData.otp.trim(),
      };
      
      try {
        const registerResponse = await register(payload); // Send correctly mapped payload
        if (registerResponse?.success) {
          toast.success(registerResponse.message || "User registered successfully!");
          await login(registerResponse.token);
          // Redirection to /verify is handled by useEffect for consistency with login
        } else {
          toast.error(registerResponse?.message || "Registration failed, please try again.");
        }
      } catch (err) {
        // Since register service throws the error message string directly
        const errorMessage = typeof err === 'string' ? err : (err?.message || "An unexpected error occurred during registration.");
        toast.error(errorMessage);
      }
    } else {
      setErrors(validationErrors);
      toast.error("Please check form details and correct errors!");
    }
  };

  const toggleRegPasswordVisibility = () => setShowRegPassword(!showRegPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Use stricter email validation and trimming for OTP button logic
  const isEmailValidForOtp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.reg_email.trim());

  return (
    <>
    <div className="flex flex-col justify-center px-4 md:px-8">
      <div className="w-full max-w-md mx-auto">
        <h2 className="mt-3 text-center text-2xl md:text-3xl font-bold text-gray-900">
          Get Yourself <span className="text-[#22c55e]">Registered</span>
        </h2>
      </div>
      <div className="mt-3 w-full max-w-md mx-auto">
        <div className="bg-white py-6 px-6 shadow-xl rounded-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  placeholder="Your full name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="reg_email"
                  value={formData.reg_email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  placeholder="you@example.com"
                />
              </div>
              {errors.reg_email && (
                <p className="text-red-500 text-xs mt-1">{errors.reg_email}</p>
              )}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={isRequestingOtp || otpTimer > 0 || !isEmailValidForOtp}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isRequestingOtp || otpTimer > 0 || !isEmailValidForOtp
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isRequestingOtp
                    ? "Sending OTP..."
                    : otpSent && otpTimer > 0
                    ? `Resend OTP in ${otpTimer}s`
                    : otpSent
                    ? "Resend OTP"
                    : "Send OTP"}
                </button>
              </div>
            </div>

            {/* OTP Field (Conditionally Rendered) */}
            {showOtpField && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification OTP
                </label>
                <div className="relative mt-1">
                  <input
                    type="text" // Use text for OTP to allow leading zeros and easier input
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="block w-full pl-3 pr-3 py-2.5 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors duration-200 text-center tracking-widest text-lg"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showRegPassword ? "text" : "password"}
                  name="reg_password"
                  value={formData.reg_password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  placeholder="Password"
                />
                <button
                    type="button"
                    onClick={toggleRegPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                    {showRegPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.reg_password && (
                <p className="text-red-500 text-xs mt-1">{errors.reg_password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  placeholder="Confirm Password"
                />
                <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMobileAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  placeholder="1234567890"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-[#22c55e] border-gray-300 rounded focus:ring-green-500"
                />
              </div>
              <div className="ml-2 text-sm">
                <label className="text-gray-600">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 hover:underline transition-colors duration-200">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-blue-600 hover:underline transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>


            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={!acceptTerms || (otpSent && !formData.otp)}
                className={`w-full py-3 px-4 rounded-lg shadow-md text-base font-semibold text-white transition-all duration-300 transform hover:-translate-y-0.5 ${acceptTerms && (!otpSent || (otpSent && formData.otp)) ? "bg-[#1f2937] hover:bg-[#22c55e]" : "bg-gray-400 cursor-not-allowed"}`}
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline transition-colors duration-200">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

const Register = () => {
  return (
    <div className="bg-[#f8fafc] font-inter p-2 md:p-6 min-h-[calc(100vh-86px)] flex items-center justify-center">
      <div className="flex flex-col md:flex-row max-w-5xl mx-auto rounded-xl shadow-2xl overflow-hidden">
        <div className="w-full md:w-1/2 bg-neutral-50 flex items-center justify-center p-4">
          <img
            src="images/register.gif"
            alt="Register Illustration"
            className="w-full object-contain h-auto max-h-[500px] rounded-lg shadow-md"
          />
        </div>
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
