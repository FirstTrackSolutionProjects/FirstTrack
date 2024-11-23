import React, { useEffect, useState } from "react";
import {
  FaUserAlt,
  FaEnvelope,
  FaLock,
  FaMobileAlt,
  FaBuilding,
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
      validationErrors.email = "Invalid email format";
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
    console.log("validation", isAuthenticated)
    if (isAuthenticated && verified){
      navigate("/dashboard")
    } else if (isAuthenticated && emailVerified){
      navigate("/verify")
    } else if (isAuthenticated){
      setEmailModalOpen(true);
    }
  },[isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        toast.error("Unexpected Error Occured");
      }
    } else {
      setErrors(validationErrors);
      toast.error("Please check form format!");
    }
  };

  return (
    <>
    {emailModalOpen && <EmailOTPVerificationModal open={emailModalOpen} onClose={closeEmailModal}  />}
    <div className="flex flex-col justify-center px-4 md:px-8">
      <div className="w-full max-w-md mx-auto">
        <h2 className="mt-3 text-center text-xl md:text-2xl font-bold text-gray-900">
          Get Yourself <span className="text-green-600">Registered</span>
        </h2>
      </div>
      <div className="mt-3 w-full max-w-md mx-auto">
        <div className="bg-white py-5 px-4 shadow-md rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
                  className="block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm"
                  placeholder="Your full name"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
                  className="block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.reg_email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="reg_password"
                  value={formData.reg_password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm"
                  placeholder="Password"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.reg_password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm"
                  placeholder="Confirm Password"
                />
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-sm">{errors.confirm_password}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
                  className="block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm"
                  placeholder="1234567890"
                />
              </div>
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
                  className="block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm"
                  placeholder="Business Name"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-black text-white rounded-md shadow-md hover:bg-green-600"
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-gray-500 hover:text-blue-500">
              Already have an account? Sign In
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
    <div className="bg-gray-200 font-inter p-2 md:p-4">
      <div className="flex flex-col md:flex-row max-w-5xl mx-auto py-4 md:py-8">
        <div className="w-full md:w-1/2 h-72 md:h-auto border bg-neutral-50">
          <img
            src="images/register.gif"
            alt="Register Illustration"
            className="w-full object-contain h-full"
          />
        </div>
        <div className="w-full md:w-1/2 bg-white">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
