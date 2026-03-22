import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FileUpload, CheckCircle } from "@mui/icons-material";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import checkIncompleteRequest from "../services/checkIncompleteRequest";
import checkPendingRequest from "../services/checkPendingRequest";

const API_URL = import.meta.env.VITE_APP_API_URL;

// Define the Zod validation schema
const formSchema = z.object({
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  pin: z.string().min(1, "PIN Code is required").regex(/^\d{6}$/, "Invalid PIN Code"),
  aadhar: z.string().min(1, "Aadhar Number is required").regex(/^\d{12}$/, "Aadhar must be 12 digits"), // Regex for 12 digits
  pan: z.string().min(1, "PAN Number is required").regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"), // Standard PAN regex
  gst: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST format").or(z.literal("")).optional(), // Optional GST regex, allows empty string or undefined if not provided but validates if provided
  msme: z.string().or(z.literal("")).optional(), // Optional MSME, allowing empty string or undefined
  bank: z.string().min(1, "Bank Name is required"),
  ifsc: z.string().min(1, "IFSC Code is required").regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format"), // Standard IFSC regex
  account: z.string().min(1, "Account Number is required").regex(/^\d{9,18}$/, "Account number should be 9-18 digits"), // Common account number length
  cin: z.string().regex(/^[L|U][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{2}[0-9]{6}$/, "Invalid CIN format").or(z.literal("")).optional(), // Optional CIN regex
});

const FileUploadForm = ({ reqId, onNext }) => {
  const { id } = useAuth();
  const [fileData, setFileData] = useState({
    aadhar_doc: null,
    pan_doc: null,
    gst_doc: null,
    cancelledCheque: null,
    selfie_doc: null,
  });
  const [uploadStatus, setUploadStatus] = useState({
    aadhar_doc: false,
    pan_doc: false,
    gst_doc: false,
    cancelledCheque: false,
    selfie_doc: false,
  });
  const [uploadingFile, setUploadingFile] = useState(null); // To track which file is being uploaded

  const getDocumentStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/verification/documentStatus`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch document status.");
      }
      const data = await response.json();
      setUploadStatus(data.message);
    } catch (error) {
      toast.error(error.message || "Failed to load document statuses.");
    }
  }

  useEffect(()=>{
    getDocumentStatus();
  },[]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      // Basic validation for file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(files[0].type)) {
        toast.error("Invalid file type. Only JPG, PNG, and PDF are allowed.");
        e.target.value = null; // Clear the input
        setFileData((prevData) => ({ ...prevData, [name]: null }));
        return;
      }
      if (files[0].size > maxSize) {
        toast.error("File size exceeds 5MB limit.");
        e.target.value = null; // Clear the input
        setFileData((prevData) => ({ ...prevData, [name]: null }));
        return;
      }
      setFileData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFileData((prevData) => ({ ...prevData, [name]: null }));
    }
  };

  const handleUpload = async (name) => {
    if (!fileData[name]) {
      toast.warn("Please select a file to upload.");
      return;
    }

    setUploadingFile(name);
    try {
      const key = `merchant/${id}/verificationDocs/${reqId}/${name}`;
      const urlResponse = await fetch(`${API_URL}/s3/putUrl`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: key, filetype: fileData[name].type }),
      });

      if (!urlResponse.ok) {
        throw new Error("Failed to generate upload URL");
      }

      const { uploadURL } = await urlResponse.json();

      const uploadRequest = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": fileData[name].type },
        body: fileData[name],
      });

      if (!uploadRequest.ok) {
        throw new Error("Failed to upload file to S3");
      }

      const updateDocStatusRequest = await fetch(`${API_URL}/verification/documentStatus/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ name, key }),
      });

      if (!updateDocStatusRequest.ok) {
        throw new Error("Failed to update document status on server");
      }

      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [name]: true,
      }));
      toast.success("Upload successful!");
    } catch (error) {
      toast.error(`Error uploading ${name}: ${error.message}`);
    } finally {
      setUploadingFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadingFile) {
      toast.warn("Please wait for the current upload to complete.");
      return;
    }
    try{
        const request = await fetch(`${API_URL}/verification/submit`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: localStorage.getItem("token")
            }
        })
        const response = await request.json()
        if (response.success){
            toast.success(response.message)
            onNext()
        } else {
            toast.error(response.message)
        }
    } catch (error) {
        toast.error(`Error submitting verification form: ${error.message}`)
    }
  }

  const docs = [{
    name: "Aadhar Card*",
    id: "aadhar_doc",
    required: true
  },{
    name: "PAN Card*",
    id: "pan_doc",
    required: true
  },{
    name: "GST Document",
    id: "gst_doc",
    required: false
  },{
    name: "Cancelled Cheque",
    id: "cancelledCheque",
    required: false
  },{
    name: "Selfie Photo*",
    id: "selfie_doc",
    required: true
  }]

  const isFormValid = docs.every(doc => !doc.required || uploadStatus[doc.id]);

  return (
    <Box component={"form"} onSubmit={handleSubmit}
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 3,
        border: '1px solid #e0e0e0'
      }}
    >
      <Typography variant="h4" align="center" gutterBottom className="text-gray-900 font-extrabold mb-6">
        Upload Verification Documents
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Please upload the required documents to complete your merchant verification.
      </Typography>
      <Grid container spacing={4} className="w-full">
        {docs.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm h-full justify-between">
              <Typography variant="subtitle1" fontWeight="bold" className="text-gray-800 mb-2 text-center">
                {doc.name}
              </Typography>
              <TextField
                type="file"
                id={doc.id}
                name={doc.id}
                variant="outlined"
                fullWidth
                size="small"
                onChange={handleFileChange}
                inputProps={{ accept: "image/jpeg,image/png,application/pdf" }}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                sx={{
                  mt: 1,
                  bgcolor: '#1f2937',
                  '&:hover': { bgcolor: '#22c55e' },
                  color: 'white',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  py: 1.2,
                  px: 3,
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  fontSize: '0.875rem'
                }}
                fullWidth
                onClick={() => handleUpload(doc.id)}
                startIcon={<FileUpload />}
                disabled={!fileData[doc.id] || uploadingFile === doc.id}
              >
                {uploadingFile === doc.id ? 'Uploading...' : 'Upload'}
              </Button>
              {uploadStatus[doc.id] && (
                <Typography color="success.main" sx={{ mt: 1.5, display: 'flex', alignItems: 'center', fontWeight: 'medium' }}>
                  <CheckCircle sx={{ fontSize: 18, mr: 0.5 }} />
                  Uploaded
                </Typography>
              )}
              {doc.required && !uploadStatus[doc.id] && (
                <Typography color="error.main" sx={{ mt: 1, fontSize: '0.75rem' }}>
                  Required
                </Typography>
              )}
            </div>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        type="submit"
        sx={{
          mt: 6,
          bgcolor: isFormValid ? '#22c55e' : 'gray',
          '&:hover': { bgcolor: isFormValid ? '#1eab4e' : 'gray' },
          color: 'white',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          py: 1.5,
          px: 8,
          borderRadius: '1rem',
          boxShadow: isFormValid ? '0 6px 20px rgba(34, 197, 94, 0.3)' : 'none',
          transition: 'all 0.3s ease',
          fontSize: '1rem'
        }}
        disabled={!isFormValid || !!uploadingFile}
      >
        Submit Verification Request
      </Button>
    </Box>
  );
};

const TextForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    address: "",
    state: "",
    city: "",
    pin: "",
    aadhar: "",
    pan: "",
    gst: "",
    msme: "",
    bank: "",
    ifsc: "",
    account: "",
    cin: "",
  });
  const [errors, setErrors] = useState({});

  const fields = [
    { fieldId: "address", fieldTitle: "Address", required: true, helperText: "Enter your full address" },
    { fieldId: "state", fieldTitle: "State", required: true, helperText: "Enter your state" },
    { fieldId: "city", fieldTitle: "City", required: true, helperText: "Enter your city" },
    { fieldId: "pin", fieldTitle: "PIN Code", required: true, helperText: "Enter your 6-digit PIN code" },
    { fieldId: "aadhar", fieldTitle: "Aadhar Number", required: true, helperText: "Enter your 12-digit Aadhar number" },
    { fieldId: "pan", fieldTitle: "PAN Number", required: true, helperText: "Enter your 10-character PAN (e.g., ABCDE1234F)" },
    { fieldId: "gst", fieldTitle: "GST Number", required: false, helperText: "Enter your 15-digit GST number (optional)" },
    { fieldId: "msme", fieldTitle: "MSME Number", required: false, helperText: "Enter your MSME Udyam Registration number (optional)" },
    { fieldId: "bank", fieldTitle: "Bank Name", required: true, helperText: "Enter your bank name" },
    { fieldId: "ifsc", fieldTitle: "IFSC Code", required: true, helperText: "Enter your 11-character IFSC code (e.g., KKBK0000XXX)" },
    { fieldId: "account", fieldTitle: "Account Number", required: true, helperText: "Enter your bank account number" },
    { fieldId: "cin", fieldTitle: "CIN Number", required: false, helperText: "Enter your 21-character CIN number (optional)" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data using Zod schema
    const result = formSchema.safeParse(formData);

    if (result.success) {
      setErrors({}); // Clear previous errors

      // Proceed with the form submission
      try {
        const response = await fetch(
          `${API_URL}/verification/createIncompleteVerifyRequest`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify(formData),
          }
        );
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message);
          onNext();
        } else {
          toast.error(data.message || "Failed to create verification request.");
        }
      } catch (error) {
        toast.error(`Error submitting form: ${error.message}`);
      }
    } else {
      // Set validation errors
      const validationErrors = result.error.formErrors.fieldErrors;
      setErrors(validationErrors);
      toast.error("Please correct the highlighted errors.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 900, // Increased max width
        mx: "auto",
        p: 4, // Increased padding
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: 'background.paper', // Consistent white background
        borderRadius: 3, // Rounded corners
        boxShadow: 3, // Subtle shadow
        border: '1px solid #e0e0e0' // Light border
      }}
    >
      <Typography variant="h4" className="text-gray-900 font-extrabold mb-6"> {/* Stronger heading */}
        Merchant Verification Form
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Please fill in your business details for verification. All fields with an asterisk (*) are required.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}> {/* Increased spacing */}
        {fields.map((field, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}> {/* Responsive grid for 3 columns on large screens */}
            <TextField
              label={`${field.fieldTitle}${field.required ? '*' : ''}`} // Add asterisk to label
              variant="outlined"
              name={field.fieldId}
              value={formData[field.fieldId]}
              onChange={handleChange}
              fullWidth
              size="small" // Smaller input size
              error={Boolean(errors[field.fieldId])}
              helperText={errors[field.fieldId] ? errors[field.fieldId][0] : field.helperText}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px', // Slightly more rounded inputs
                  '&.Mui-focused fieldset': {
                    borderColor: '#22c55e', // Green focus border
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#22c55e', // Green label on focus
                },
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        type="submit"
        sx={{
          mt: 6, // Increased top margin
          bgcolor: '#22c55e', // Consistent green button
          '&:hover': { bgcolor: '#1eab4e' }, // Darker green on hover
          color: 'white',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          py: 1.5, // Increased padding
          px: 8, // Increased padding
          borderRadius: '1rem', // More rounded button
          boxShadow: '0 6px 20px rgba(34, 197, 94, 0.3)', // Larger shadow
          transition: 'all 0.3s ease', // Smooth transition
          fontSize: '1rem' // Larger font size
        }}
      >
        Save & Continue
      </Button>
    </Box>
  );
};

const Verify = () => {  
  const navigate = useNavigate();  
  const {isAuthenticated ,verified, emailVerified} = useAuth()
  const [step, setStep] = useState(1);
  const [reqId, setReqId] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  const nextStep = () => setStep((prevStep) => prevStep + 1);

  const incompleteRequest = async () => {
    try {
      const response = await checkIncompleteRequest();
      if (response.success){
          setReqId(response.message.reqId)
          setStep(2)
          return true; // Indicate success
      }
      return false;
    } catch (error) {
      toast.error(error.message || "Failed to check incomplete request.");
      return false;
    }
  }

  const pendingRequest = async () => {
    try {
      const response = await checkPendingRequest();
      if (response.success){
          setStep(3)
          return true; // Indicate success
      }
      return false;
    } catch (error) {
      toast.error(error.message || "Failed to check pending request.");
      return false;
    }
  }

  useEffect(()=>{
    const checkVerificationStatus = async () => {
      setLoading(true);
      if (!isAuthenticated){
        navigate('/login');
      } else if (verified){
        navigate('/dashboard');
      } else if (!emailVerified){
        // This case should ideally trigger email verification modal on login, 
        // but if they landed here, redirect to login to ensure flow
        navigate('/login'); 
      } else {
        // User is authenticated, email verified, but not merchant verified
        // Check for existing requests
        const isPending = await pendingRequest();
        if (!isPending) { // If no pending request, check for incomplete
          await incompleteRequest();
        }
      }
      setLoading(false);
    };
    
    checkVerificationStatus();
  },[isAuthenticated, verified, emailVerified, navigate])

  if (loading) {
    return (
      <Box sx={{ minHeight: "calc(100vh - 86px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h6" color="text.secondary">Loading verification status...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 86px)", // Ensure it takes up available height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        bgcolor: '#f8fafc', // Consistent background color
        fontFamily: 'Inter, sans-serif' // Apply font
      }}
    >
      {step === 1 && <TextForm onNext={incompleteRequest} />}
      {step === 2 && <FileUploadForm reqId={reqId} onNext={nextStep} />}
      {step === 3 && (
        <Box
          sx={{
            maxWidth: 600,
            mx: "auto",
            p: 4,
            textAlign: "center",
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 3,
            border: '1px solid #e0e0e0'
          }}
        >
          <CheckCircle sx={{ fontSize: 80, color: '#22c55e', mb: 3 }} />
          <Typography variant="h5" component="h2" gutterBottom className="text-gray-900 font-extrabold">
            Verification Request Submitted!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Thank you for submitting your verification details. Our team is now reviewing your information.
            You will be notified once your account has been verified. This usually takes 2-3 business days.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Verify;
