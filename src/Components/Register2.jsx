import React, { useState } from "react";
import axios from 'axios';
import { FaUserAlt, FaEnvelope, FaLock, FaMobileAlt, FaBuilding } from "react-icons/fa";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm_password: "",
    business_name: "",
    mobile: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let validationErrors = {};

    // Full Name Validation: Alphabets only (A-Z, a-z)
    if (!/^[A-Za-z\s]+$/.test(formData.fullName)) {
      validationErrors.fullName = "Full name should contain alphabets only";
    }

    // Email Validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Invalid email format";
    }

    // Password Length Validation
    if (formData.password.length < 4 ) {
      validationErrors.password = "Password should be between 4 characters";
    }

    // Confirm Password Validation
    if (formData.password !== formData.confirm_password) {
      validationErrors.confirm_password = "Passwords do not match";
    }

    // Mobile Number Validation: Exactly 10 digits
    if (!/^\d{10}$/.test(formData.mobile)) {
      validationErrors.mobile = "Mobile number should be exactly 10 digits";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      console.log("Validations check passed", formData);
      // Perform further actions like making an API request
      try {
        const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/register`, formData);
        console.log(res.data);  // Log response for debugging
        if (res && res.data) {
          alert('User registered successfully!');
        } else {
          alert('Unexpected response format');
        }
      } catch (err) {
        console.error(err);  // Log error for debugging
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message);  // Show server error message if available
          
        } else {
          console.error(err);
          alert('Registration failed, please try again.');
          
        }
      }
    } else {
      setErrors(validationErrors);
      alert('Please check form format!')
    }

    

  };

  return (
    <div className="h-[700px]  flex flex-col justify-center md:px-8">
      <div className="w-full max-w-md">
        <h2 className=" mt-3 text-center text-xl md:text-2xl font-bold text-gray-900">Get Yourself <span className="text-green-600">Registered</span></h2>
      </div>
      <div className="mt-3 w-full max-w-md">
        <div className="bg-white py-5 px-4">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserAlt className="text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  "
                  placeholder="Your full name"
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  "
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  "
                  placeholder="Password"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  "
                  placeholder="Confirm Password"
                />
              </div>
              {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password}</p>}
            </div>

            {/* Mobile Number Field */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMobileAlt className="text-gray-400" />
                </div>
                <input
                  id="mobile"
                  name="mobile"
                  type="text"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  "
                  placeholder="9634567890"
                />
              </div>
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
            </div>

            {/* Business Name Field */}
            <div>
              <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">Business Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBuilding className="text-gray-400" />
                </div>
                <input
                  id="business_name"
                  name="business_name"
                  type="text"
                  value={formData.business_name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  "
                  placeholder="Business Name"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-black focus:outline-none "
              >
                Register
              </button>
            </div>
            <div className="mt-6">
            

            <Link to="/login"><div className='text-center text-base my-4 text-gray-400'>
              Already Registered? <span className='text-blue-600'>Log In!</span>
            </div></Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
const Register2 =()=>{
    return(
        <div className='bg-gray-200 font-inter p-2 md:p-8'>
    <div className='block md:flex max-w-5xl mx-auto py-4 md:py-8'>
      
      <div className='md:w-[55%] border bg-white border-gray-100 border-t-gray-100'>
        <img src='images/register.gif' className='w-full object-contain h-full'></img>
      </div>
      <div className='md:w-[45%] h-[710px]  border-gray-100 border  bg-white'>
        <RegisterForm/>
      </div>
    </div>
    </div>
    )
}
export default Register2;
