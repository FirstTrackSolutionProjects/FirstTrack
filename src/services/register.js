
const API_URL = import.meta.env.VITE_APP_API_URL
const register = async (formData) => {
    try {
      const registerRequest = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await registerRequest.json();
      console.log(data);
      return data;
    } catch (err) {
      return err;
    }
  };
  
  export default register;
  