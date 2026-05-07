
const getHsnCodesByDescService = async (description) => {
    try {
        if (!description || typeof description !== 'string' || description.trim().length < 3) {
            throw new Error('Item Description is required and should be at least 3 characters long');
        }
        const response = await fetch(`https://services.gst.gov.in/commonservices/hsn/search/qsearch?inputText=${encodeURIComponent(description.trim())}&selectedType=byDesc&category=P`);
        if (!response.ok) {
            throw new Error('Failed to fetch HSN codes');
        }
        const data = await response.json();
        const hsnCodes = data.data;
        return hsnCodes;
    } catch (error) {
        throw error;
    }
}

export default getHsnCodesByDescService;