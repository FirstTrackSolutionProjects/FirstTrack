const API_URL = import.meta.env.VITE_APP_API_URL;

const requestSubmerchantReactivationService = async (submerchantId, options = {}) => {
	try {
		if (!submerchantId) throw new Error('Submerchant ID is required');

		const url = `${API_URL}/merchant/submerchants/${submerchantId}/request-activation`;
		const response = await fetch(url, {
			method: 'PATCH',
			headers: {
				Authorization: localStorage?.getItem('token'),
				Accept: 'application/json',
			},
			signal: options?.signal,
		});

		let data;
		try {
			data = await response.json();
		} catch {
			data = null;
		}

		if (!response.ok) {
			throw new Error(data?.message || 'Failed to request submerchant reactivation');
		}

		return data;
	} catch (error) {
		console.error(error);
		throw error instanceof Error ? error : new Error('An unexpected error occurred');
	}
};

export default requestSubmerchantReactivationService;