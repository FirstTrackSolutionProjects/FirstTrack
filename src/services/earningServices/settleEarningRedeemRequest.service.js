const API_URL = import.meta.env.VITE_APP_API_URL;

/**
 * @param {number} requestId
 * @param {{ transaction_id: string, transaction_doc: string }} body
 */
const settleEarningRedeemRequestService = async (requestId, body) => {
    try {
        const response = await fetch(`${API_URL}/wallet/earnings/redeem/${requestId}/settle`, {
            method: 'POST',
            headers: {
                Authorization: localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error('Something went wrong');
        }

        if (!data?.success) {
            throw new Error(data?.message || 'Failed to settle redeem request');
        }

        return data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
};

export default settleEarningRedeemRequestService;
