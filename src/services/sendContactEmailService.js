
const API_URL = import.meta.env.VITE_APP_API_URL
const sendContactEmailService = async (name, email, mobile, subject, message) => {
    try {
      const response = await fetch(`${API_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({name, email, mobile, subject, message}),
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      return err;
    }
  };
  
  export default sendContactEmailService;
  