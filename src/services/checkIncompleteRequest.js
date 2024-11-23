
const API_URL = import.meta.env.VITE_APP_API_URL
const checkIncompleteRequest = async () => {
    try {
      const incompleteVerificationRequests = await fetch(`${API_URL}/verification/incomplete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token'),
        }
      });
      if (!incompleteVerificationRequests.ok) {
        throw new Error('Failed to get requests');
      }
  
      const data = await incompleteVerificationRequests.json();
      console.log(data);
      return data;
    } catch (err) {
      throw new Error(err)
    }
  };
  
  export default checkIncompleteRequest;
  