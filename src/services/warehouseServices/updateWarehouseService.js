

const API_URL = import.meta.env.VITE_APP_API_URL

const updateWarehouseService = async (wid, formData) => {
    try {
        const response = await fetch(`${API_URL}/warehouse/update`, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                wid: wid,
                ...formData
            })
        });
        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("Something went wrong");
        }

        if (!data?.success) {
            throw new Error(data?.message);
        };
        return data?.data ?? true;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export default updateWarehouseService;