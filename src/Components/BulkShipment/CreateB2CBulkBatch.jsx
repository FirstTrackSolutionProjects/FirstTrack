import React, { useState, useRef, useCallback } from 'react';
import { Box, Paper, Button, Typography, TextField, CircularProgress, Divider } from '@mui/material';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { toast } from 'react-toastify';
import parseCSVToJSON from '@/utils/csv_parser.util';
import { excelValidationSchema, SAMPLE_DATA } from '@/Constants/bulk_excel_columns';
import getB2CBulkShipmentExcelUploadUrlService from '@/services/bulkServices/get_excel_upload_url.bulk.service';
import createB2CBulkShipmentsService from '@/services/bulkServices/create_batch.bulk.service';
import s3FileUploadService from '@/services/s3Services/s3FileUploadService';
import WarehouseSelect from '@/Components/UiComponents/WarehouseSelect';

const generateExcel = (data, fileName) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(link.href);
};

const UploadSection = ({ file, fileInputRef, handleFileChange, handleDownloadSample }) => (
  <Paper sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center', boxShadow: 3, border: '2px dashed #fcd3d3' }}>
    <>
      <Typography variant="h6" gutterBottom>Upload Domestic Bulk Shipment File</Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Please upload your `.csv` file following the provided format.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' } // Responsive stack for buttons
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={() => fileInputRef.current.click()}
          sx={{ mr: { xs: 0, sm: 2 }, bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}
        >
          Choose File
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadSample}
          sx={{ color: '#ef4444', borderColor: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}
        >
          Download Sample
        </Button>
      </Box>
      {file && <Typography variant="caption" display="block" sx={{ mt: 1 }}>{file.name}</Typography>}
    </>
  </Paper>
);

const BatchForm = ({ batchName, setBatchName, wid, setWid, onCreateBatch, isCreating }) => (
  <Paper sx={{ p: { xs: 2, sm: 4 }, boxShadow: 3, mt: 3 }}>
    <Typography variant="h6" gutterBottom>
      Batch Details
    </Typography>
    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
      Enter a name for this batch and select the pickup warehouse, then click <strong>Create Batch</strong>.
    </Typography>

    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
      <TextField
        label="Batch Name"
        variant="outlined"
        size='small'
        fullWidth
        value={batchName}
        onChange={(e) => setBatchName(e.target.value)}
        disabled={isCreating}
        placeholder="e.g. July Week 1 Shipments"
        inputProps={{ maxLength: 100 }}
      />

      <Box sx={{ width: '100%' }}>
        <WarehouseSelect
          value={wid}
          onChange={(val) => setWid(val)}
        />
      </Box>
    </Box>

    <Divider sx={{ mb: 2 }} />

    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        variant="contained"
        startIcon={isCreating ? <CircularProgress size={18} color="inherit" /> : <AddCircleOutlineIcon />}
        onClick={onCreateBatch}
        disabled={isCreating || !batchName.trim() || !wid}
        sx={{
          bgcolor: '#ef4444',
          '&:hover': { bgcolor: '#dc2626' },
          '&:disabled': { bgcolor: '#fca5a5', color: '#fff' },
          minWidth: 160,
        }}
      >
        {isCreating ? 'Creating...' : 'Create Batch'}
      </Button>
    </Box>
  </Paper>
);

// --- Main Component: BulkShipment.jsx ---

const CreateB2CBulkBatch = () => {
  const [file, setFile] = useState(null);
  const [batchName, setBatchName] = useState('');
  const [wid, setWid] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.match(/\.(csv)$/i)) {
      toast.error('Only .csv files are supported.');
      return;
    }

    setFile(uploadedFile);

    try {
      const fileName = uploadedFile.name;
      const csvString = await uploadedFile.text();
      const rawData = parseCSVToJSON(csvString);
      if (rawData.length === 0) {
        toast.error('The uploaded file is empty or contains no data rows.');
        handleRemoveFile();
        return;
      }

      const errorData = [];
      rawData.forEach((item, index) => {
        const { error } = excelValidationSchema.safeParse(item);
        if (error) {
          errorData.push({
            'Row': index + 2,
            'Errors': error.issues.map(issue => issue.message).join(', ')
          })
        }
      })

      if (errorData.length > 0) {
        generateExcel(errorData, `Error_File_${fileName}`)
        toast.error(`Error in file`);
        handleRemoveFile()
        return
      }
      toast.success("Valid File")

    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred during file processing.');
      handleRemoveFile();
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = useCallback(() => {
    setFile(null);
  }, []);

  const handleCreateBatch = async () => {
    if (!file) {
      toast.error('Please select a valid CSV file first.');
      return;
    }
    if (!batchName.trim()) {
      toast.error('Please enter a batch name.');
      return;
    }
    if (!wid) {
      toast.error('Please select a pickup warehouse.');
      return;
    }

    setIsCreating(true);
    try {
      // Step 1: Get pre-signed S3 upload URL
      const { uploadUrl, excelS3Key } = await getB2CBulkShipmentExcelUploadUrlService({
        filename: file.name,
      });

      // Step 2: Upload file directly to S3
      await s3FileUploadService(uploadUrl, file, 'text/csv');

      // Step 3: Create batch record in backend
      await createB2CBulkShipmentsService({
        excelS3Key,
        batchName: batchName.trim(),
        wid,
      });

      toast.success('Batch created successfully!');

      // Reset form
      setFile(null);
      setBatchName('');
      setWid('');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create batch. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // --- Render Sections ---

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: { xs: 1, sm: 2, md: 4 },
        boxSizing: 'border-box',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1600, px: { xs: 1, sm: 2 }, flexShrink: 0 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Domestic Bulk Shipment
        </Typography>
      </Box>

      {/* Content Area - Uses responsive padding */}
      <Paper
        sx={{
          width: '100%',
          maxWidth: 1600,
          flexGrow: 1,
          minHeight: { xs: '60vh', md: '80vh' },
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, sm: 3, md: 4 },
          boxShadow: 3
        }}
      >

        <UploadSection
          file={file}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleDownloadSample={() => generateExcel(SAMPLE_DATA, 'FirstTrack_Domestic_Bulk_Shipment_Sample.csv')}
        />

        {file && (
          <BatchForm
            batchName={batchName}
            setBatchName={setBatchName}
            wid={wid}
            setWid={setWid}
            onCreateBatch={handleCreateBatch}
            isCreating={isCreating}
          />
        )}

      </Paper>
    </Box>
  );
};

export default CreateB2CBulkBatch;