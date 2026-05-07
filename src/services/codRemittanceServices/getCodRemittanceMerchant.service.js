
const API_URL = import.meta.env.VITE_APP_API_URL

const getCodRemittanceMerchantService = async (filters) => {
    try {
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/cod-remittance/merchant?${query}`, {
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
            throw new Error(data?.message);
        }

        return data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export default getCodRemittanceMerchantService;