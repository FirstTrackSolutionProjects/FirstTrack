import React, { useState } from 'react';
import axios from 'axios';
import { FaUserAlt, FaEnvelope, FaLock, FaBuilding, FaPhone } from 'react-icons/fa';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/register`, { email, password });
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
        alert('Registration failed, please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
