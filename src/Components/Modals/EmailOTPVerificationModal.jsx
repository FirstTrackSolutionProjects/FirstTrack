import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Typography } from "@mui/material";

const OTPModal = ({ open, onClose, onVerify }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

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

  const handleVerify = () => {
    if (otp.join("").length !== 6) {
      setError("Please enter a valid 6-digit OTP");
    } else {
      setError("");
      onVerify(otp.join("")); // Join the array into a single OTP string and call the verify function
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
        <Button onClick={handleVerify} color="primary">
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OTPModal;
