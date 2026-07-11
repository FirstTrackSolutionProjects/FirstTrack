const API_URL = import.meta.env.VITE_APP_API_URL;

const getMyProfileUpdateRequestService = async () => {
    const response = await fetch(`${API_URL}/update-profile-requests/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('token'),
        },
    });
    if (!response.ok) throw new Error('Failed to check pending profile update request');
    return response.json();
};

export default getMyProfileUpdateRequestService;
