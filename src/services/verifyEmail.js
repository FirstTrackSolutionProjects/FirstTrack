
const API_URL = import.meta.env.VITE_APP_API_URL
const verifyEmail = async (email, otp) => {
    try {
      const registerRequest = await fetch(`${API_URL}/email/verification/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({email, otp}),
      });
      const data = await registerRequest.json();
      console.log(data);
      return data;
    } catch (err) {
      return err;
    }
  };
  
  export default verifyEmail;
  