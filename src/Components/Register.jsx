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
import EmailOTPVerificationModal from "./Modals/EmailOTPVerificationModal";

const RegisterForm = () => {
  const { isAuthenticated, login, verified, emailVerified } = useAuth();
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    reg_email: "",
    reg_password: "",
    confirm_password: "",
    business_name: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false); // State for registration password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility


  const closeEmailModal = () => {
    setEmailModalOpen(false);
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let validationErrors = {};

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      validationErrors.name = "Full name should contain alphabets only";
    }

    if (!/\S+@\S+\.\S+/.test(formData.reg_email)) {
      validationErrors.reg_email = "Invalid email format"; // Changed from 'email' to 'reg_email' to match formData key
    }

    if (formData.reg_password.length < 4) {
      validationErrors.reg_password = "Password should be at least 4 characters";
    }

    if (formData.reg_password !== formData.confirm_password) {
      validationErrors.confirm_password = "Passwords do not match";
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      validationErrors.mobile = "Mobile number should be exactly 10 digits";
    }

    return validationErrors;
  };

  useEffect(()=>{
    // console.log("validation", isAuthenticated) // Removed console.log
    if (isAuthenticated && verified){
      navigate("/dashboard")
    } else if (isAuthenticated && emailVerified){
      navigate("/verify")
    } else if (isAuthenticated){
      setEmailModalOpen(true);
    }
  },[isAuthenticated, verified, emailVerified, navigate]) // Added dependencies for useEffect

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptTerms) {
    toast.error("Please accept Terms & Conditions");
    return;
  }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const registerResponse = await register(formData)
        if (registerResponse?.success) {
          toast.success("User registered successfully!");
          await login(registerResponse?.token)
        } else {
          toast.error(registerResponse?.message || "Registration failed, please try again.");
        }
      } catch (err) {
        toast.error("Unexpected Error Occurred"); // Corrected typo
      }
    } else {
      setErrors(validationErrors);
      toast.error("Please check form format!");
    }
  };

  const toggleRegPasswordVisibility = () => setShowRegPassword(!showRegPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <>
    {emailModalOpen && <EmailOTPVerificationModal open={emailModalOpen} onClose={closeEmailModal}  />}
    <div className="flex flex-col justify-center px-4 md:px-8">
      <div className="w-full max-w-md mx-auto">
        <h2 className="mt-3 text-center text-2xl md:text-3xl font-bold text-gray-900"> {/* Increased font size */}
          Get Yourself <span className="text-[#22c55e]">Registered</span> {/* Consistent green color */}
        </h2>
      </div>
      <div className="mt-3 w-full max-w-md mx-auto">
        <div className="bg-white py-6 px-6 shadow-xl rounded-lg border border-gray-100"> {/* Added shadow, border, more padding */}
          <form onSubmit={handleSubmit} className="space-y-5"> {/* Slightly reduced space-y */}
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"> {/* Added mb-1 */}
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
                  className="block w-full pl-10 pr-3 py-2.5 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors duration-200" // Enhanced focus styling, slightly increased py
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
              {errors.reg_email && ( // Corrected error key
                <p className="text-red-500 text-xs mt-1">{errors.reg_email}</p>
              )}
            </div>

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
                  className="block w-full pl-10 pr-10 py-2.5 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors duration-200" // Adjusted py and focus
                  placeholder="Password"
                />
                <button
                    type="button"
                    onClick={toggleRegPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer" // Improved hover state
                >
                    {showRegPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.reg_password && ( // Corrected error key
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
                  className="block w-full pl-10 pr-10 py-2.5 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors duration-200" // Adjusted py and focus
                  placeholder="Confirm Password"
                />
                <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer" // Improved hover state
                >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMobileAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  placeholder="1234567890"
                />
              </div>
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBuilding className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  placeholder="Business Name"
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-[#22c55e] border-gray-300 rounded focus:ring-green-500" // Consistent green focus ring
                />
              </div>
              <div className="ml-2 text-sm">
                <label className="text-gray-600">
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#22c55e] hover:underline transition-colors duration-200">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-[#22c55e] hover:underline transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>


            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={!acceptTerms}
               className={`w-full py-3 px-4 rounded-lg shadow-md text-base font-semibold text-white transition-all duration-300 transform hover:-translate-y-0.5 ${acceptTerms ? "bg-[#1f2937] hover:bg-[#22c55e]" : "bg-gray-400 cursor-not-allowed"}`}
                >
                Register
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[#22c55e] hover:underline transition-colors duration-200">
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
    <div className="bg-[#f8fafc] font-inter p-2 md:p-6 min-h-[calc(100vh-86px)] flex items-center justify-center"> {/* Adjusted background, padding, and layout for centering */}
      <div className="flex flex-col md:flex-row max-w-5xl mx-auto rounded-xl shadow-2xl overflow-hidden"> {/* Added rounded corners and larger shadow to the main container */}
        <div className="w-full md:w-1/2 bg-neutral-50 flex items-center justify-center p-4"> {/* Adjusted width and removed explicit height */}
          <img
            src="images/register.gif"
            alt="Register Illustration"
            className="w-full object-contain h-auto max-h-[500px] rounded-lg shadow-md"
          />
        </div>
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center"> {/* Adjusted width */}
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
