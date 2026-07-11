const API_URL = import.meta.env.VITE_APP_API_URL;

const getMerchantProfileService = async () => {
    const response = await fetch(`${API_URL}/merchant/profile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('token'),
        },
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    const result = await response.json();
    return result.data;
};

export default getMerchantProfileService;
