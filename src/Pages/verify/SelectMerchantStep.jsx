import React from "react";
import {
  Box,
  CircularProgress,
  Radio,
  Typography,
} from "@mui/material";

const SelectMerchantStep = ({
  requests = [],
  loading = false,
  error = null,
  selectedId = null,
  onSelect,
  stepError,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      </Box>
    );
  }

  if (requests.length === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No pending merchant requests found. A merchant must send you a join
          request before you can complete verification.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select the merchant you are joining...
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {requests.map((request) => {
          const isSelected = selectedId === request.merchant_user_role_id;
          return (
            <Box
              key={request.id}
              onClick={() => onSelect?.(request.merchant_user_role_id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                border: isSelected ? "2px solid black" : "1px solid #e0e0e0",
                borderRadius: 2,
                p: 2,
                cursor: "pointer",
                backgroundColor: isSelected ? "#f5f5f5" : "#fff",
                transition: "border-color 0.15s, background-color 0.15s",
                "&:hover": {
                  borderColor: isSelected ? "black" : "#9e9e9e",
                },
              }}
            >
              <Radio
                checked={isSelected}
                onChange={() => onSelect?.(request.merchant_user_role_id)}
                onClick={(e) => e.stopPropagation()}
                sx={{ color: "black", "&.Mui-checked": { color: "black" }, p: 0 }}
                inputProps={{
                  "aria-label": `Select merchant ${request.merchant_name}`,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={600} noWrap>
                  {request.merchant_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {request.merchant_email}
                </Typography>
                {request.merchant_phone && (
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {request.merchant_phone}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {stepError && (
        <Typography color="error" variant="body2" sx={{ mt: 1.5 }}>
          {stepError}
        </Typography>
      )}
    </Box>
  );
};

export default SelectMerchantStep;
