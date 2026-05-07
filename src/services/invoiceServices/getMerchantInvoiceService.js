
const API_URL = import.meta.env.VITE_APP_API_URL

const getMerchantInvoiceService = async (formData) => {
    try {
        if (!formData || typeof formData !== 'object') {
            throw new Error('Form data must be provided as an object');
        }
        const { merchantId, month, year} = formData;
        if (!merchantId || !month || !year) {
            throw new Error('Merchant, Month, and Year are required fields');
        }
        const response = await fetch(`${API_URL}/shipment/invoice/${merchantId}/${month}/${year}`, {
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
            throw new Error(data?.message || "Failed to fetch merchant invoice");
        }

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export default getMerchantInvoiceService;