const API_URL = import.meta.env.VITE_APP_API_URL

const getS3PutUrlService = async (key, filetype, isPublic) => {
    try {
        const response = await fetch(`${API_URL}/s3/putUrl`, {
            method: "POST",
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ filename: key, filetype: filetype, isPublic: isPublic }),
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

        return data?.uploadURL;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export default getS3PutUrlService;