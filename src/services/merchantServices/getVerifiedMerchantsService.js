
const API_URL = import.meta.env.VITE_APP_API_URL

const getVerifiedMerchantsService = async (params = {}) => {
    try {
        const qp = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') qp.set(k, v);
        });
        // Ensure query params are appended correctly with a leading '?'
        const query = qp.toString();
        const url = query ? `${API_URL}/merchant/verified?${query}` : `${API_URL}/merchant/verified`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
            }
        });
        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("Something went wrong");
        }

        if (!data?.success) {
            throw new Error(data?.message || "Failed to fetch verified merchants");
        }

        // Return the entire payload to support pagination (totalCount, page, etc.)
        return data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export default getVerifiedMerchantsService;