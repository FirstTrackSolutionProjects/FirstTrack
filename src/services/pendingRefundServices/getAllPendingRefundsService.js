
const API_URL = import.meta.env.VITE_APP_API_URL

const getAllPendingRefundsService = async () => {
    try {
        const response = await fetch(`${API_URL}/pending-refunds/`, {
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

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export default getAllPendingRefundsService;