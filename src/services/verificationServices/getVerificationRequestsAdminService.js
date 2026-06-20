const API_URL = import.meta.env.VITE_APP_API_URL;

const getVerificationRequestsAdminService = async (params) => {
	try {
		// Strip blank/null params to keep URL clean
		const cleanParams = Object.fromEntries(
			Object.entries(params).filter(([, v]) => v !== '' && v != null)
		);
		const queryParams = new URLSearchParams(cleanParams);
		const response = await fetch(`${API_URL}/verification?${queryParams}`, {
			method: 'GET',
			headers: {
				Authorization: localStorage.getItem('token'),
				Accept: 'application/json',
			},
		});

		let data;
		try {
			data = await response.json();
		} catch {
			throw new Error('Something went wrong');
		}

		if (!data?.success) {
			throw new Error(data?.message || 'Failed to fetch verification requests');
		}

		return data?.data;
	} catch (error) {
		console.error(error);
		throw error instanceof Error ? error : new Error('An unexpected error occurred');
	}
};

export default getVerificationRequestsAdminService;
