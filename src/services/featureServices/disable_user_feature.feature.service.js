


const API_URL = import.meta.env.VITE_APP_API_URL;

const disableUserFeatureService = async ({ featureId, userRoleId }) => {
    try {
        const url = `${API_URL}/features/${featureId}/user-roles/${userRoleId}/disable`;
        const response = await fetch(url, {
            method: 'PATCH',
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
            throw new Error(data?.message || 'Failed to disable user feature');
        }

        if (data?.success === false) {
            throw new Error(data?.message || 'Failed to disable user feature');
        }

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
};

export default disableUserFeatureService;