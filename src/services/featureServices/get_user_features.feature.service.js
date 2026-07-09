
const API_URL = import.meta.env.VITE_APP_API_URL;

const getUserFeaturesService = async () => {
    try {
        const url = `${API_URL}/features/users/me`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: localStorage?.getItem('token'),
                Accept: 'application/json',
            },
        });

        let data;
        try {
            data = await response.json();
        } catch {
            data = null;
        }

        if (!response.ok) {
            throw new Error(data?.message || 'Failed to fetch user features');
        }

        if (data?.success === false) {
            throw new Error(data?.message || 'Failed to fetch user features');
        }

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
};

export default getUserFeaturesService;