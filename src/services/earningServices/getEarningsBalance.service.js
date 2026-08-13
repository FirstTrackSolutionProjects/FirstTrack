const API_URL = import.meta.env.VITE_APP_API_URL;

const getEarningsBalanceService = async () => {
    try {
        const response = await fetch(`${API_URL}/wallet/earnings/balance`, {
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
            throw new Error(data?.message || 'Failed to fetch earnings balance');
        }

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
};

export default getEarningsBalanceService;
