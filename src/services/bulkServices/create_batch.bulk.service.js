
const API_URL = import.meta.env.VITE_APP_API_URL

const createB2CBulkShipmentsService = async ({
    excelS3Key,
    batchName,
    wid,
}) => {
    try {
        if (!excelS3Key) {
            throw new Error("Excel S3 key is required");
        }
        if (!batchName) {
            throw new Error("Batch name is required");
        }
        if (!wid) {
            throw new Error("Warehouse is required");
        }

        const response = await fetch(`${API_URL}/bulk/b2c/batch`, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                excelS3Key,
                batchName,
                wid,
            }),
        });

        let data = await response.text();
        try {
            data = JSON.parse(data);
        } catch {
            console.error(data);
            throw new Error("Something went wrong");
        }

        if (!data.success) {
            throw new Error(data.message || "Failed to create batch");
        }

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export default createB2CBulkShipmentsService;