import React, { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Typography } from "@mui/material";
import requestVerifyEmailOTP from "../../services/requestVerifyEmailOTP";
import verifyEmailService from "../../services/verifyEmail";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const OTPModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated, emailVerified ,email, verifyEmail } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [sendingOTP, setSendingOTP] = useState(true)
  const [verifyingOTP, setVerifyingOTP] = useState(false)

  const requestOTP = async () => {
    try {
        setSendingOTP(true)
        const response = await requestVerifyEmailOTP(email)
        if (response?.success){
            toast.success(response?.message);
        } else {
            toast.error(response?.message);
        }
    } catch (error) {
        toast.error("Unexpected error");
    } finally {
        setSendingOTP(false)
    }
  }
  useEffect(() => {
    if (isAuthenticated && emailVerified){
        navigate('/verify')
    }
    requestOTP()
  },[isAuthenticated, emailVerified])
  const handleOtpChange = (e, index) => {
    const value = e.target.value.slice(0, 1); // Allow only one character
    if (!/^\d$/.test(value) && value !== "") {
      return; // Ignore non-digit input
    }
  
    const newOtp = [...otp];
    newOtp[index] = value; // Update the value if it's a digit
    setOtp(newOtp);
  
    // Automatically focus the next field if the current field is filled
    if (value !== "" && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };
  

  const handleKeyDown = (e, index) => {
    // Focus the previous field if backspace is pressed and current field is empty
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleVerify = async () => {
    setVerifyingOTP(true)
    try {
        if (otp.join("").length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
          } else {
            setError("");
            const response = await verifyEmailService(email,otp.join(""));
            if (response?.success) {
              verifyEmail()
              toast.success("Email verified successfully!");
            } else {
                toast.error("Verification failed, please try again.");
            }
          }
    } catch (error) {
        toast.error("Unexpected error");
    } finally {
        setVerifyingOTP(false)
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>OTP Verification</DialogTitle>
      <DialogContent className="flex flex-col">
        <Typography variant="body2" gutterBottom sx={{marginBottom : '16px'}}>
          Please enter the OTP sent to your email.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {otp.map((digit, index) => (
            <Grid item key={index}>
              <TextField
                id={`otp-input-${index}`}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputProps={{ maxLength: 1 }}
                variant="outlined"
                size="small"
                error={!!error}
                // helperText={error && index === 5 ? error : ""}
                style={{ width: "40px", textAlign: "center" }}
              />
            </Grid>
          ))}
        </Grid>
        <p className="text-red-400 mt-2">{error || ""}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button disabled={sendingOTP || verifyingOTP} onClick={handleVerify} color="primary">
          {sendingOTP ? 'Sending OTP...' : verifyingOTP ? 'Verifying...' : 'Verify' }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OTPModal;
