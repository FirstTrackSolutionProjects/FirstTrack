import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Typography, TextField, Button, Stepper, Step, StepLabel,
    CircularProgress, Alert, Chip
} from '@mui/material';
import { MuiFileInput } from 'mui-file-input';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { InputAdornment } from '@mui/material';
import { toast } from 'react-toastify';
import { z } from 'zod';
import getMerchantProfileService from '../services/updateProfileServices/getMerchantProfileService';
import getMyProfileUpdateRequestService from '../services/updateProfileServices/getMyProfileUpdateRequestService';

const API_URL = import.meta.env.VITE_APP_API_URL;

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const basicSchema = z.object({
    fullName: z.string().min(3, 'Full Name must be at least 3 characters'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Phone must be 10 digits starting with 6/7/8/9'),
});

const personalSchema = z.object({
    address: z.string().min(20, 'Address must be at least 20 characters').max(255, 'Address too long').or(z.literal('')),
    state: z.string().min(3, 'State too short').max(100).or(z.literal('')),
    city: z.string().min(3, 'City too short').max(100).or(z.literal('')),
    pin: z.string().regex(/^[1-9]\d{5}$/, 'Invalid pincode').or(z.literal('')),
    accountNumber: z.string().or(z.literal('')),
    ifsc: z.string().or(z.literal('')),
    bank: z.string().or(z.literal('')),
});

const businessSchema = z.object({
    business_name: z.string().min(3, 'Business name must be at least 3 characters'),
    gst: z.string().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, 'Invalid GST number').or(z.literal('')),
    cin: z.string().regex(/^([LUu]{1})(\d{5})([A-Za-z]{2})(\d{4})([A-Za-z]{3})(\d{6})$/, 'Invalid CIN').or(z.literal('')),
    msme: z.string().regex(/^(UDYAM-[A-Z]{2}-\d{2}-\d{7})$/, 'Invalid MSME (use UDYAM-XX-00-0000000)').or(z.literal('')),
});

const kycSchema = z.object({
    aadhar_number: z.string().regex(/^\d{12}$/, 'Aadhar must be 12 digits').or(z.literal('')),
    pan_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN (capital letters)').or(z.literal('')),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STAGES = ['Basic Details', 'Personal Details', 'Business Details', 'KYC Details', 'Review'];

const EMPTY_FORM = {
    // Basic
    fullName: '', phone: '',
    // Personal
    address: '', state: '', city: '', pin: '',
    accountNumber: '', ifsc: '', bank: '',
    // Business
    business_name: '', gst: '', cin: '', msme: '',
    // KYC
    aadhar_number: '', pan_number: '',
};

const EMPTY_FILES = {
    cancelledCheque: null,
    selfie_doc: null,
    gst_doc: null,
    aadhar_doc: null,
    pan_doc: null,
};

// Maps profile API field names → form field names
const mapProfileToForm = (data) => ({
    fullName: data.fullName || '',
    phone: data.phone || '',
    address: data.address || '',
    state: data.state || '',
    city: data.city || '',
    pin: data.pin || '',
    accountNumber: data.accountNumber || '',
    ifsc: data.ifsc || '',
    bank: data.bank || '',
    business_name: data.business_name || '',
    gst: data.gst || '',
    cin: data.cin || '',
    msme: data.msme || '',
    aadhar_number: data.aadhar_number || '',
    pan_number: data.pan_number || '',
});

// Returns only fields that have changed vs original
const getChangedFields = (current, original) => {
    const changes = {};
    Object.keys(current).forEach((key) => {
        if (current[key] !== original[key]) {
            changes[key] = { old: original[key], new: current[key] };
        }
    });
    return changes;
};

const FIELD_LABELS = {
    fullName: 'Full Name', phone: 'Phone',
    address: 'Address', state: 'State', city: 'City', pin: 'Pincode',
    accountNumber: 'Account Number', ifsc: 'IFSC Code', bank: 'Bank Name',
    business_name: 'Business Name', gst: 'GST Number', cin: 'CIN Number', msme: 'MSME Number',
    aadhar_number: 'Aadhar Number', pan_number: 'PAN Number',
    cancelledCheque: 'Cancelled Cheque', selfie_doc: 'Selfie Document',
    gst_doc: 'GST Document', aadhar_doc: 'Aadhar Document', pan_doc: 'PAN Document',
};

// ─── File Upload Helper ───────────────────────────────────────────────────────

const uploadFileToS3 = async (file, key) => {
    const urlRes = await fetch(`${API_URL}/s3/putUrl`, {
        method: 'POST',
        headers: {
            Authorization: localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: key, filetype: file.type, isPublic: true }),
    });
    if (!urlRes.ok) throw new Error('Failed to get upload URL');
    const { uploadURL } = await urlRes.json();
    const uploadRes = await fetch(uploadURL, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
    });
    if (!uploadRes.ok) throw new Error('Failed to upload file');
    return key;
};

// ─── TextField wrapper ────────────────────────────────────────────────────────

const FormField = ({ fieldId, label, helperText, formData, onChange, errors, changed }) => (
    <TextField
        label={label}
        variant="outlined"
        size="small"
        name={fieldId}
        value={formData[fieldId]}
        onChange={onChange}
        fullWidth
        error={Boolean(errors[fieldId])}
        helperText={errors[fieldId]?.[0] || helperText}
        sx={changed ? { '& fieldset': { borderColor: '#f59e0b !important', borderWidth: '2px' } } : {}}
    />
);

// ─── Stage 1: Basic ───────────────────────────────────────────────────────────

const BasicStage = ({ formData, onChange, errors, original }) => (
    <Box display="flex" flexDirection="column" gap={2}>
        <FormField fieldId="fullName" label="Full Name *" helperText="Enter your full name" formData={formData} onChange={onChange} errors={errors} changed={formData.fullName !== original.fullName} />
        <FormField fieldId="phone" label="Phone *" helperText="10-digit mobile number" formData={formData} onChange={onChange} errors={errors} changed={formData.phone !== original.phone} />
    </Box>
);

// ─── Stage 2: Personal ────────────────────────────────────────────────────────

const PersonalStage = ({ formData, onChange, errors, original, files, onFileChange }) => (
    <Box display="flex" flexDirection="column" gap={2}>
        <FormField fieldId="address" label="Address" helperText="Full address (min 20 chars)" formData={formData} onChange={onChange} errors={errors} changed={formData.address !== original.address} />
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
            <FormField fieldId="state" label="State" helperText="" formData={formData} onChange={onChange} errors={errors} changed={formData.state !== original.state} />
            <FormField fieldId="city" label="City" helperText="" formData={formData} onChange={onChange} errors={errors} changed={formData.city !== original.city} />
            <FormField fieldId="pin" label="Pincode" helperText="6-digit pincode" formData={formData} onChange={onChange} errors={errors} changed={formData.pin !== original.pin} />
            <FormField fieldId="bank" label="Bank Name" helperText="" formData={formData} onChange={onChange} errors={errors} changed={formData.bank !== original.bank} />
            <FormField fieldId="accountNumber" label="Account Number" helperText="" formData={formData} onChange={onChange} errors={errors} changed={formData.accountNumber !== original.accountNumber} />
            <FormField fieldId="ifsc" label="IFSC Code" helperText="" formData={formData} onChange={onChange} errors={errors} changed={formData.ifsc !== original.ifsc} />
        </Box>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
            <FileField fieldId="selfie_doc" label="Selfie Document" helperText="Upload new selfie (png/jpeg only)" files={files} onFileChange={onFileChange} selfieOnly />
            <FileField fieldId="cancelledCheque" label="Cancelled Cheque" helperText="Upload new cheque (png/jpeg/pdf)" files={files} onFileChange={onFileChange} />
        </Box>
    </Box>
);

// ─── Stage 3: Business ───────────────────────────────────────────────────────

const BusinessStage = ({ formData, onChange, errors, original, files, onFileChange }) => (
    <Box display="flex" flexDirection="column" gap={2}>
        <FormField fieldId="business_name" label="Business Name *" helperText="" formData={formData} onChange={onChange} errors={errors} changed={formData.business_name !== original.business_name} />
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
            <FormField fieldId="gst" label="GST Number" helperText="15-char GSTIN" formData={formData} onChange={onChange} errors={errors} changed={formData.gst !== original.gst} />
            <FormField fieldId="cin" label="CIN Number" helperText="Company Identification Number" formData={formData} onChange={onChange} errors={errors} changed={formData.cin !== original.cin} />
            <FormField fieldId="msme" label="MSME Number" helperText="UDYAM-XX-00-0000000" formData={formData} onChange={onChange} errors={errors} changed={formData.msme !== original.msme} />
            <FileField fieldId="gst_doc" label="GST Document" helperText="Upload GST certificate (png/jpeg/pdf)" files={files} onFileChange={onFileChange} />
        </Box>
    </Box>
);

// ─── Stage 4: KYC ────────────────────────────────────────────────────────────

const KycStage = ({ formData, onChange, errors, original, files, onFileChange }) => (
    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
        <FormField fieldId="aadhar_number" label="Aadhar Number" helperText="12-digit number" formData={formData} onChange={onChange} errors={errors} changed={formData.aadhar_number !== original.aadhar_number} />
        <FileField fieldId="aadhar_doc" label="Aadhar Document" helperText="Upload Aadhar (png/jpeg/pdf)" files={files} onFileChange={onFileChange} />
        <FormField fieldId="pan_number" label="PAN Number" helperText="10-char PAN (capital letters)" formData={formData} onChange={onChange} errors={errors} changed={formData.pan_number !== original.pan_number} />
        <FileField fieldId="pan_doc" label="PAN Document" helperText="Upload PAN (png/jpeg/pdf)" files={files} onFileChange={onFileChange} />
    </Box>
);

// ─── File Field ───────────────────────────────────────────────────────────────

const FileField = ({ fieldId, label, helperText, files, onFileChange, selfieOnly = false }) => (
    <MuiFileInput
        label={label}
        size="small"
        helperText={helperText}
        placeholder="Select file to change"
        id={fieldId}
        name={fieldId}
        onChange={(val) => onFileChange(val, fieldId, selfieOnly)}
        value={files[fieldId]}
        clearIconButtonProps={{ title: 'Remove', children: <CloseIcon fontSize="small" /> }}
        fullWidth
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <AttachFileIcon fontSize="small" />
                </InputAdornment>
            ),
        }}
    />
);

// ─── Stage 5: Review ─────────────────────────────────────────────────────────

const ReviewStage = ({ formData, original, files }) => {
    const changedText = getChangedFields(formData, original);
    const changedFiles = Object.keys(files).filter((k) => files[k] !== null);
    const hasChanges = Object.keys(changedText).length > 0 || changedFiles.length > 0;

    if (!hasChanges) {
        return (
            <Alert severity="warning" sx={{ mt: 1 }}>
                No changes detected. Please modify at least one field before submitting.
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Only changed fields are shown below. These will be submitted for admin review.
            </Typography>
            <Box display="flex" flexDirection="column" gap={1.5}>
                {Object.entries(changedText).map(([key, { old: oldVal, new: newVal }]) => (
                    <Box key={key} p={1.5} borderRadius={1} sx={{ bgcolor: '#fffbeb', border: '1px solid #f59e0b' }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                            {FIELD_LABELS[key] || key}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mt={0.5}>
                            <Chip label={oldVal || '(empty)'} size="small" color="default" sx={{ textDecoration: 'line-through', opacity: 0.6 }} />
                            <Typography variant="caption">→</Typography>
                            <Chip label={newVal || '(empty)'} size="small" color="warning" />
                        </Box>
                    </Box>
                ))}
                {changedFiles.map((key) => (
                    <Box key={key} p={1.5} borderRadius={1} sx={{ bgcolor: '#fffbeb', border: '1px solid #f59e0b' }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                            {FIELD_LABELS[key] || key}
                        </Typography>
                        <Chip label={`New file: ${files[key]?.name}`} size="small" color="warning" sx={{ mt: 0.5 }} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

// ─── Pending Screen ───────────────────────────────────────────────────────────

const PendingScreen = () => (
    <Box className="h-[calc(100vh-64px)] w-full flex justify-center items-center">
        <Box textAlign="center" maxWidth={480} p={4}>
            <Typography variant="h5" fontWeight={600} mb={2}>Request Pending</Typography>
            <Typography color="text.secondary">
                You already have a profile update request pending review by an admin.
                You will be notified once the admin takes action.
            </Typography>
        </Box>
    </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const UpdateProfileRequest = () => {
    const [stage, setStage] = useState(0); // 0-4
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [files, setFiles] = useState(EMPTY_FILES);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState('');
    const [hasPending, setHasPending] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const originalData = useRef(EMPTY_FORM);

    // On mount — fetch existing profile + check pending
    useEffect(() => {
        const init = async () => {
            try {
                const [profile, pending] = await Promise.all([
                    getMerchantProfileService(),
                    getMyProfileUpdateRequestService(),
                ]);

                if (pending?.success) {
                    setHasPending(true);
                } else {
                    const mapped = mapProfileToForm(profile);
                    setFormData(mapped);
                    originalData.current = mapped;
                }
            } catch (err) {
                toast.error('Failed to load profile data: ' + err.message);
            } finally {
                setInitLoading(false);
            }
        };
        init();
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }, []);

    const handleFileChange = useCallback((value, name, selfieOnly = false) => {
        if (!value) {
            setFiles((prev) => ({ ...prev, [name]: null }));
            return;
        }
        const allowedTypes = selfieOnly
            ? ['image/png', 'image/jpeg']
            : ['image/png', 'image/jpeg', 'application/pdf'];
        if (!allowedTypes.includes(value.type)) {
            toast.error(selfieOnly ? 'Only PNG or JPEG allowed for selfie' : 'Only PNG, JPEG, or PDF allowed');
            setFiles((prev) => ({ ...prev, [name]: null }));
            return;
        }
        setFiles((prev) => ({ ...prev, [name]: value }));
    }, []);

    const validateStage = useCallback(() => {
        const schemas = [basicSchema, personalSchema, businessSchema, kycSchema];
        if (stage >= 4) return true; // Review stage — no extra validation
        try {
            const stageFields = {
                0: ['fullName', 'phone'],
                1: ['address', 'state', 'city', 'pin', 'accountNumber', 'ifsc', 'bank'],
                2: ['business_name', 'gst', 'cin', 'msme'],
                3: ['aadhar_number', 'pan_number'],
            };
            const subset = Object.fromEntries(stageFields[stage].map((k) => [k, formData[k]]));
            schemas[stage].parse(subset);
            setErrors({});
            return true;
        } catch (e) {
            const fieldErrors = {};
            e.errors.forEach((err) => {
                const path = err.path[0];
                if (path) fieldErrors[path] = [err.message];
            });
            setErrors(fieldErrors);
            return false;
        }
    }, [stage, formData]);

    const handleNext = () => {
        if (validateStage()) setStage((s) => s + 1);
    };

    const handleBack = () => {
        setErrors({});
        setStage((s) => s - 1);
    };

    const handleSubmit = async () => {
        const changedText = getChangedFields(formData, originalData.current);
        const changedFiles = Object.keys(files).filter((k) => files[k] !== null);
        if (Object.keys(changedText).length === 0 && changedFiles.length === 0) {
            toast.warning('No changes detected. Nothing to submit.');
            return;
        }

        setLoading('Uploading documents...');
        try {
            // Upload only changed files
            const fileUrls = { ...Object.fromEntries(Object.keys(files).map((k) => [k, null])) };
            for (const key of changedFiles) {
                const s3Key = `merchant/profile-update-docs/${Date.now()}/${key}`;
                fileUrls[key] = await uploadFileToS3(files[key], s3Key);
            }

            setLoading('Submitting request...');

            const BASIC_DATA = {
                fullName: formData.fullName,
                phone: formData.phone,
            };

            const PERSONAL_DATA = {
                address: formData.address,
                state: formData.state,
                city: formData.city,
                pin: formData.pin,
                accountNumber: formData.accountNumber,
                ifsc: formData.ifsc,
                bank: formData.bank,
                cancelledCheque: fileUrls.cancelledCheque,
                selfie_doc: fileUrls.selfie_doc,
            };

            const BUSINESS_DATA = {
                business_name: formData.business_name,
                gst: formData.gst,
                gst_doc: fileUrls.gst_doc,
                cin: formData.cin,
                msme: formData.msme,
            };

            const KYC_DATA = {
                aadhar_number: formData.aadhar_number,
                aadhar_doc: fileUrls.aadhar_doc,
                pan_number: formData.pan_number,
                pan_doc: fileUrls.pan_doc,
            };

            const response = await fetch(`${API_URL}/update-profile-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: localStorage.getItem('token'),
                },
                body: JSON.stringify({ BASIC_DATA, PERSONAL_DATA, BUSINESS_DATA, KYC_DATA }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Profile update request submitted successfully!');
                setSubmitted(true);
            } else {
                toast.error(result.message || 'Submission failed');
            }
        } catch (err) {
            toast.error('Error: ' + err.message);
        } finally {
            setLoading('');
        }
    };

    if (initLoading) {
        return (
            <Box className="h-[calc(100vh-64px)] w-full flex justify-center items-center">
                <CircularProgress />
            </Box>
        );
    }

    if (hasPending || submitted) return <PendingScreen />;

    const changedFields = getChangedFields(formData, originalData.current);
    const changedFiles = Object.keys(files).filter((k) => files[k] !== null);
    const hasChanges = Object.keys(changedFields).length > 0 || changedFiles.length > 0;

    return (
        <Box sx={{ maxWidth: 720, mx: 'auto', p: { xs: 2, sm: 4 } }}>
            {/* Header */}
            <Typography variant="h5" fontWeight={700} textAlign="center" mb={0.5}>
                Profile Update Request
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                Fields highlighted in amber have been changed from your current profile.
                Only changed fields will be reviewed by the admin.
            </Typography>

            {/* Stepper */}
            <Stepper activeStep={stage} alternativeLabel sx={{ mb: 4 }}>
                {STAGES.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Stage Content */}
            <Box
                sx={{
                    p: { xs: 2, sm: 3 },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    minHeight: 200,
                }}
            >
                {stage === 0 && (
                    <BasicStage formData={formData} onChange={handleChange} errors={errors} original={originalData.current} />
                )}
                {stage === 1 && (
                    <PersonalStage formData={formData} onChange={handleChange} errors={errors} original={originalData.current} files={files} onFileChange={handleFileChange} />
                )}
                {stage === 2 && (
                    <BusinessStage formData={formData} onChange={handleChange} errors={errors} original={originalData.current} files={files} onFileChange={handleFileChange} />
                )}
                {stage === 3 && (
                    <KycStage formData={formData} onChange={handleChange} errors={errors} original={originalData.current} files={files} onFileChange={handleFileChange} />
                )}
                {stage === 4 && (
                    <ReviewStage formData={formData} original={originalData.current} files={files} />
                )}
            </Box>

            {/* Navigation */}
            <Box display="flex" justifyContent="space-between" mt={3} gap={2}>
                <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={stage === 0 || Boolean(loading)}
                    sx={{ minWidth: 110 }}
                >
                    Back
                </Button>

                {stage < 4 ? (
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={Boolean(loading)}
                        sx={{ minWidth: 110, bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={Boolean(loading) || !hasChanges}
                        sx={{ minWidth: 140, bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
                    >
                        {loading || 'Submit Request'}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default UpdateProfileRequest;
