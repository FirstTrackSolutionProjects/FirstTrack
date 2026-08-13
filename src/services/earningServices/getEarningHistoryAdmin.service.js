const API_URL = import.meta.env.VITE_APP_API_URL;

/**
 * @param {{ page: number, merchant_identifier?: string, submerchant_identifier?: string, order_identifier?: string, from_date?: string, to_date?: string, sort_by?: string }} params
 */
const getEarningHistoryAdminService = async (params = {}) => {
    try {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/wallet/earnings/history/admin?${query}`, {
            method: 'GET',
            headers: {
                Authorization: localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
        });

        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error('Something went wrong');
        }

        if (!data?.success) {
            throw new Error(data?.message || 'Failed to fetch earning history');
        }

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
};

export default getEarningHistoryAdminService;
