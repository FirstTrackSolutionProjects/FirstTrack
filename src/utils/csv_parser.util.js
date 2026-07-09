import Papa from "papaparse";

const parseCSVToJSON = (csvFile) => {
    const parseResult = Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false
    })
    const jsonRecords = parseResult.data;
    return jsonRecords;
}

export default parseCSVToJSON;