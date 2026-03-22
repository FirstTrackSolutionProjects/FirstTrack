import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

// NOTE: This component is named 'Register' but its content suggests it's a simple form.
// If it's intended to be a ResetPassword component, its functionality would need to change.
// For now, adding password visibility to the existing 'password' input.
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming this is still a register endpoint as per the original code
      const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/register`, { email, password });
      alert('User registered successfully!');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const togglePasswordVisibility = () => { // Function to toggle password visibility
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '20px auto', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
      />
      <div style={{ position: 'relative' }}>
        <input
          type={showPassword ? "text" : "password"} // Dynamic type based on showPassword state
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '100%', paddingRight: '40px' }} // Added paddingRight for icon
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle eye icon */}
        </button>
      </div>
      <button type="submit" style={{ padding: '10px 15px', borderRadius: '4px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}>Register</button>
    </form>
  );
};

export default Register;
