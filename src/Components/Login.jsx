import React, { useEffect, useState } from 'react';
import { FaUserAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Added FaEye, FaEyeSlash
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import loginService from '../services/login';
import { useAuth } from '../context/AuthContext';
import EmailOTPVerificationModal from './Modals/EmailOTPVerificationModal'
import { toast } from 'react-toastify';

const LoginForm = () => {
  const { isAuthenticated, emailVerified ,login, verified } = useAuth();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const navigate = useNavigate();

  const closeEmailModal = () => {
    setEmailModalOpen(false);
  }

  useEffect(()=>{
    if (isAuthenticated && verified){
      navigate('/dashboard')
    } else if(isAuthenticated && emailVerified){
      navigate('/verify')
    } else if (isAuthenticated){
      setEmailModalOpen(true)
    }
  },[isAuthenticated, verified, emailVerified, navigate]) // Added dependencies for useEffect

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        email,
        password
      }
      const loginResponse = await loginService(formData)

      if (loginResponse.success) {
        login(loginResponse.token)
        toast.success("Login Successful") // Corrected typo
      } else {
        toast.error(loginResponse.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An unexpected error occurred."); // Better error handling
    }
  };

  const togglePasswordVisibility = () => { // Function to toggle password visibility
    setShowPassword(!showPassword);
  };

  return (
    <>
    {emailModalOpen && <EmailOTPVerificationModal open={emailModalOpen} onClose={closeEmailModal} />}
    {/*form 2 */}
    <div className="py-5 flex flex-col justify-center items-center px-4"> {/* Added horizontal padding */}
      <div className=" w-full max-w-md">
        <h2 className="md:mt-10 text-center text-2xl md:text-3xl font-bold text-gray-900"> {/* Increased font size */}
          Sign <span className='text-[#22c55e]'>in</span> to your account {/* Consistent green color */}
        </h2>
      </div>

      <div className="mt-8 w-full max-w-md">
        <div className="bg-white py-6 md:py-10 px-6 rounded-lg shadow-xl border border-gray-100"> {/* Added shadow, border, more padding */}
          <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1"> {/* Added mb-1 */}
                Email address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserAlt className="text-gray-400" />
                </div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                 required 
                  id="email"
                  name="email"
                  className="block w-full text-sm md:text-base pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors duration-200" // Enhanced focus styling, slightly increased py
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1"> {/* Added mb-1 */}
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  required
                  className="block w-full text-sm md:text-base pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors duration-200" // Enhanced focus styling, slightly increased py
                  placeholder="Password"
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer" // Improved hover state
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-sm text-right">
              <a href="#" className="text-gray-600 hover:text-[#22c55e] transition-colors duration-200"> {/* Consistent green hover */}
                Forgot your password?
              </a>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className={"w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white focus:outline-none bg-[#1f2937] hover:bg-[#22c55e] transition-all duration-300 transform hover:-translate-y-0.5"} // Enhanced button styling
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" /> {/* Lighter border */}
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <Link to="/register"><div className='text-center text-sm my-4 text-gray-500'> {/* Adjusted text size and color */}
              New User? <span className='text-[#22c55e] hover:underline transition-colors duration-200'>Create a new account!</span> {/* Consistent green color */}
            </div></Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

const Login=()=>{
  return(
    <div className='bg-[#f8fafc] font-inter p-2 md:p-6 min-h-[calc(100vh-86px)] flex items-center justify-center'> {/* Adjusted background, padding, and layout for centering */}
    <div className='block md:flex max-w-5xl mx-auto rounded-xl shadow-2xl overflow-hidden'> {/* Added rounded corners and larger shadow to the main container */}
      <div className='md:w-1/2 border-gray-100 border md:h-auto bg-white flex flex-col justify-center'> {/* Adjusted width and removed explicit height */}
        <LoginForm/>
      </div>
      <div className='md:w-1/2 bg-neutral-50 border border-gray-100 flex items-center justify-center p-4'> {/* Adjusted width and removed explicit height */}
        <img src='images/login.gif' className='w-full object-contain h-auto max-h-[500px] rounded-lg shadow-md' alt="Login Illustration"></img> {/* Added max-height, rounded corners, and shadow */}
      </div>
    </div>
    </div>
  )
}

export default Login;
