
const API_URL = import.meta.env.VITE_APP_API_URL
const checkPendingUpdateProfileRequest = async () => {
    try {
      const pendingUpdateProfileRequests = await fetch(`${API_URL}/update-profile-requests`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token'),
        }
      });
      if (!pendingUpdateProfileRequests.ok) {
        throw new Error('Failed to get requests');
      }
  
      const data = await pendingUpdateProfileRequests.json();
      return data;
    } catch (err) {
      throw new Error(err)
    }
  };
  
  export default checkPendingUpdateProfileRequest;
  