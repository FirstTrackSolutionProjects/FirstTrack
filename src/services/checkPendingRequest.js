
const API_URL = import.meta.env.VITE_APP_API_URL
const checkPendingRequest = async () => {
    try {
      const pendingVerificationRequests = await fetch(`${API_URL}/verification/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token'),
        }
      });
      if (!pendingVerificationRequests.ok) {
        throw new Error('Failed to get requests');
      }
  
      const data = await pendingVerificationRequests.json();
      console.log(data);
      return data;
    } catch (err) {
      throw new Error(err)
    }
  };
  
  export default checkPendingRequest;
  