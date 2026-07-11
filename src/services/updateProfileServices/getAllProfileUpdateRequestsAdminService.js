const API_URL = import.meta.env.VITE_APP_API_URL;

const getAllProfileUpdateRequestsAdminService = async ({ page = 1, userIdentifier = '' } = {}) => {
    const params = new URLSearchParams({ page: String(page) });
    if (userIdentifier) params.set('userIdentifier', userIdentifier);

    const response = await fetch(`${API_URL}/update-profile-requests?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('token'),
        },
    });
    if (!response.ok) throw new Error('Failed to fetch profile update requests');
    const result = await response.json();
    return result.data;
};

export default getAllProfileUpdateRequestsAdminService;
