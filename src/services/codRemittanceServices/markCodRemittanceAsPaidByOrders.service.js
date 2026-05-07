
const API_URL = import.meta.env.VITE_APP_API_URL

const markCodRemittanceAsPaidByOrdersService = async (payload) => {
    try {
        const response = await fetch(`${API_URL}/cod-remittance/mark-paid`, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
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

export default markCodRemittanceAsPaidByOrdersService;