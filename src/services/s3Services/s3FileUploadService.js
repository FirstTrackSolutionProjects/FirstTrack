const s3FileUploadService = async (uploadUrl, file, filetype) => {
    try {
        const response = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": filetype },
            body: file,
          });
        
        if (!response.ok) {
            throw new Error(`Failed to upload file`);
        }

    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export default s3FileUploadService;