import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Home from './Pages/Home'
import About from './Pages/About'
import Contact from './Pages/Contact'
import FAQ from './Components/FAQ'
import PrivacyPolicy from './Components/PrivacyPolicy'
import Terms from './Components/Terms'
import RefundCancellation from './Components/RefundCancellation'
import DomesticTracking from './Pages/Tracking'
import Price from './Pages/Price'
import Blogs from './Pages/Blogs'
import Login from './Components/Login'
import Register from './Components/Register'
import Dashboard from './Components/Dashboard'
import Verify from './Pages/Verify'
// import TicketRaise from './Pages/TicketRaise'
import { ToastContainer } from 'react-toastify'
import FloatingAssistant from './Components/FloatingAssistant';
import MobileBottomNavbar from './Components/MobileBottomNavbar';

const App = () => {
  const { pathname } = useLocation();

  const isDashboard = pathname.startsWith('/dashboard');

  // Scroll to top on route change
  useEffect(() => {
    // Attempt to scroll the main document body or the root element to the top.
    // This addresses scenarios where the main scrollable area might not be the window itself.
    const scrollableElement = document.getElementById('root') || document.body;
    if (scrollableElement) {
      scrollableElement.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback to window scroll if no specific element is identified
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);

  return (
    <div className='App font-inter text-gray-800 pb-20 md:pb-0'>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <Header/>
      <Routes>
      
        <Route path='/' element={<Home/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/contact' element={<Contact/>}></Route>
        <Route path='/track' element={<DomesticTracking/>}></Route>
        <Route path='/blog' element={<Blogs/>}></Route>
        <Route path='/pricing' element={<Price/>}></Route>
        <Route path='/faq' element={<FAQ/>}></Route>
        <Route path='/privacy' element={<PrivacyPolicy/>}></Route>
        <Route path='/terms' element={<Terms/>}></Route>
        <Route path='/refund-cancel' element={<RefundCancellation/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/dashboard/*' element={<Dashboard/>}></Route>
        <Route path='/verify' element={<Verify/>}></Route>
        {/* <Route path='/ticket' element={<TicketRaise/>}></Route> */}
      </Routes>
      <FloatingAssistant />
      <div className="md:block">
        {
          (pathname.startsWith('/dashboard') ||
            pathname.startsWith('/login') ||
            pathname.startsWith('/register') ||
            pathname.startsWith('/track')) // Fixed path match for /track
          ? null 
          : <Footer />
        }
      </div>
      <MobileBottomNavbar 
        isDashboardRoute={isDashboard} 
      />
    </div>
  )
}

export default App