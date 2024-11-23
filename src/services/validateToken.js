
const API_URL = import.meta.env.VITE_APP_API_URL
const validateToken = async () => {
    try {
      const valdiateRequest = await fetch(`${API_URL}/auth/token/decode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token'),
        }
      });
      if (!valdiateRequest.ok) {
        throw new Error('Failed to register user');
      }
  
      const data = await valdiateRequest.json();
      console.log(data);
      return data;
    } catch (err) {
      throw new Error(err)
    }
  };
  
  export default validateToken;
  