import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Home from './Pages/Home'
import About from './Pages/About'
import Contact from './Pages/Contact'
import FAQ from './Components/FAQ'
import PrivacyPolicy from './Components/PrivacyPolicy'
import Terms from './Components/Terms'
import DomesticTracking from './Pages/Tracking'
import Price from './Pages/Price'
import Blogs from './Pages/Blogs'
import Login from './Components/Login'
import Register from './Components/Register'
import Dashboard from './Components/Dashboard'
import Verify from './Pages/Verify'

const App = () => {
  return (
    <div className='App'>
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
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/dashboard/*' element={<Dashboard/>}></Route>
        <Route path='/verify' element={<Verify/>}></Route>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
