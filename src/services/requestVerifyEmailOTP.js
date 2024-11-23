
const API_URL = import.meta.env.VITE_APP_API_URL
const requestVerifyEmailOTP = async (email) => {
    try {
      const registerRequest = await fetch(`${API_URL}/email/verification/request/otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({email}),
      });
      const data = await registerRequest.json();
      console.log(data);
      return data;
    } catch (err) {
      return err;
    }
  };
  
  export default requestVerifyEmailOTP;
  