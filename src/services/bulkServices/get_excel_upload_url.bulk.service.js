
const API_URL = import.meta.env.VITE_APP_API_URL

const getB2CBulkShipmentExcelUploadUrlService = async ({
    filename
}) => {
    try {
        if (!filename) {
            throw new Error("File name is required");
        }

        const response = await fetch(`${API_URL}/bulk/b2c/batch/get-excel-upload-url`, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename
            })
        });

        let data = await response.text();
        try {
            data = JSON.parse(data);
        } catch {
            console.error(data);
            throw new Error("Something went wrong");
        }

        if (!data.success) {
            throw new Error(data.message || "Failed to get upload url");
        }

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export default getB2CBulkShipmentExcelUploadUrlService;