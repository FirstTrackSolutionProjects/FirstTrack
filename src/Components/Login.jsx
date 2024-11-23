import React, { useEffect, useState } from 'react';
import { FaUserAlt, FaLock } from "react-icons/fa";
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
  },[isAuthenticated])

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
        toast.success(loginResponse.message)
      } else {
        toast.error(loginResponse.message)
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <>
    {emailModalOpen && <EmailOTPVerificationModal verifyEmail={email} open={emailModalOpen} onClose={closeEmailModal} />}
    {/*form 2 */}
    <div className="py-5 flex flex-col justify-center items-center ">
      <div className=" w-full max-w-md">
        <h2 className="md:mt-10 text-center text-xl md:text-2xl font-bold text-gray-900">
          Sign <span className='text-green-600'>in</span> to your account
        </h2>
      </div>

      <div className="mt-8  w-full max-w-md">
        <div className="bg-white py-3 md:py-8 px-4  ">
          <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserAlt className="text-gray-400" />
                </div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                 required 
                  id="email"
                  name="email"
                  className="block w-full text-sm md:text-base pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  "
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  required
                  className="block w-full text-sm md:text-base pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  "
                  placeholder="Password"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-sm text-right">
              <a href="#" className=" text-gray-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-green-600 focus:outline-none "
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <Link to="/register"><div className='text-center text-base my-4 text-gray-400'>
              New User? <span className='text-blue-600'>Create a new account!</span>
            </div></Link>
            {/* 
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div>
                <button
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Google
                </button>
              </div>

              <div>
                <button
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Facebook
                </button>
              </div>

              <div>
                <button
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Twitter
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

const Login=()=>{
  return(
    <div className='bg-gray-200 font-inter p-2 md:p-0'>
    <div className='block md:flex max-w-5xl mx-auto py-4 md:py-8'>
      <div className='md:w-[40%]  border-gray-100 border md:h-screen bg-white'>
        <LoginForm/>
      </div>
      <div className='md:w-[60%] border bg-neutral-50 bordergray-100 border-t-gray-100 h-fit md:h-screen'>
        <img src='images/login.gif' className='w-full object-contain h-full'></img>
      </div>
    </div>
    </div>
  )
}

export default Login;
