import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const API_URL = import.meta.env.VITE_APP_API_URL
const ChangePassword = () => {
    const INITIAL_STATE = {
        oldPassword : '',
        newPassword : '',
        confirmNewPassword : ''
    }
    const [formData, setFormData] = useState(INITIAL_STATE)
    // States to toggle password visibility
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            alert('New password must match the Confirm new password')
            return;
        }
        await fetch(`${API_URL}/password/change`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(formData),
        }).then(response => response.json()).then(result => alert(result.message))
        setFormData(INITIAL_STATE)
    }
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Toggle functions for password visibility
  const toggleOldPasswordVisibility = () => setShowOldPassword(!showOldPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmNewPasswordVisibility = () => setShowConfirmNewPassword(!showConfirmNewPassword);

  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <div className='w-full p-8 flex flex-col items-center'>
      <div className='text-center text-3xl font-medium text-black mb-8'>Change Password</div>
      <form action="" onSubmit={handleSubmit} className="w-full sm:w-auto flex px-3 flex-col mt-3 space-y-3 sm:space-y-5 text-black">
          <div className="relative">
            <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Old Password"
                value={formData.oldPassword}
                onChange={handleChange}
                name="oldPassword"
                className="py-2 px-3 rounded-xl w-full sm:w-[400px] pr-10" // Added pr-10 for icon space
            />
            <button
                type="button"
                onClick={toggleOldPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
            >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="py-2 px-3 rounded-xl  w-full sm:w-[400px] pr-10" // Added pr-10 for icon space
            />
            <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
            >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <input
                type={showConfirmNewPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="py-2 px-3 rounded-xl  w-full sm:w-[400px] pr-10" // Added pr-10 for icon space
            />
            <button
                type="button"
                onClick={toggleConfirmNewPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
            >
                {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className="py-2 px-3 rounded-xl  w-full sm:w-[400px] border border-black  hover:bg-[rgba(135,206,235,1)]">Change password</button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
