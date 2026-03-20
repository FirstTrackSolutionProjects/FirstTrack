import React, { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  Box,
  Paper,
  TextField,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography, // Added Typography for consistent text styling
  CircularProgress, // Added for loading indicators
  Stack, // For better layout of filter fields
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh'; // Added for Reset Filters
import { toast } from "react-toastify";
import convertToUTCISOString from "../helpers/convertToUTCISOString";

const API_URL = import.meta.env.VITE_APP_API_URL;

const timestampToDate = (timestamp) => {
  const date = new Date(timestamp);
  // Using toLocaleString for better user experience, ensuring timezone awareness
  // For consistency, I will ensure this is used everywhere, or a standard ISO format.
  // The original format was `YYYY-MM-DD HH:MM`. Let's stick to that for now for minimal change,
  // but improve its presentation.
  const formattedTimestamp = date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, '0') + "-" +
    String(date.getDate()).padStart(2, '0') + " " +
    String(date.getHours()).padStart(2, '0') + ":" +
    String(date.getMinutes()).padStart(2, '0');
  return formattedTimestamp;
}

const DelhiveryStatusCard = ({ report, status }) => {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>AWB: {report.awb}</Typography>
      <Typography variant="subtitle1" gutterBottom>Ref Id: {report.ref_id}</Typography>
      {status?.Status?.Status && <Typography variant="body1" gutterBottom>Status: {status.Status.Status}</Typography>}
      <Box mt={2}>
        {status?.Scans && status.Scans.length > 0 ? (
          status.Scans.map((scan, index) => {
            const timestamp = scan.ScanDetail.ScanDateTime;
            const formattedTimestamp = timestampToDate(timestamp);
            return (
              <Box key={index} mb={1} sx={{ borderLeft: '3px solid #1976d2', pl: 1 }}>
                <Typography variant="body2">
                  <Typography component="span" fontWeight="medium">{formattedTimestamp}</Typography> | {scan.ScanDetail.ScannedLocation} | {scan.ScanDetail.Instructions}
                </Typography>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">No scan details available.</Typography>
        )}
      </Box>
    </Box>
  );
}

const MovinStatusCard = ({ report, status }) => {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>AWB: {report.awb}</Typography>
      {status?.scans?.length ? <Typography variant="subtitle1" gutterBottom>Currently At: {status?.latestLocation}</Typography> : null}
      <Box mt={2}>
        {status?.scans?.length ? (
          status.scans.slice().reverse().map((scan, index) => { // Use slice() to avoid reversing original array
            const date = scan.timestamp;
            const formattedTimestamp = timestampToDate(date);
            return (
              <Box key={index} mb={1} sx={{ borderLeft: '3px solid #4caf50', pl: 1 }}>
                <Typography variant="body2">
                  <Typography component="span" fontWeight="medium">{formattedTimestamp}</Typography> | {scan.package_status}
                </Typography>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">Shipment is not yet picked up.</Typography>
        )}
      </Box>
    </Box>
  );
}

const PickrrStatusCard = ({ report, status }) => {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>AWB: {report.awb}</Typography>
      <Box mt={2}>
        {status?.length ? (
          status.slice().reverse().map((scan, index) => {
            const date = scan.timestamp;
            const formattedTimestamp = timestampToDate(date);
            return (
              <Box key={index} mb={1} sx={{ borderLeft: '3px solid #ff9800', pl: 1 }}>
                <Typography variant="body2">
                  <Typography component="span" fontWeight="medium">{formattedTimestamp}</Typography> | {scan.location} | {scan.remarks}
                </Typography>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">Shipment is not yet picked up.</Typography>
        )}
      </Box>
    </Box>
  );
}

const ShiprocketStatusCard = ({ report, status }) => {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>AWB: {report.awb}</Typography>
      <Box mt={2}>
        {status?.length ? (
          status.slice().reverse().map((scan, index) => {
            return (
              <Box key={index} mb={1} sx={{ borderLeft: '3px solid #9c27b0', pl: 1 }}>
                <Typography variant="body2" fontWeight="medium">{scan["sr-status-label"]}</Typography>
                <Typography variant="caption" color="text.secondary">{scan.location}</Typography>
                <Typography variant="caption" color="text.secondary">{scan.date}</Typography>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">Shipment is not yet picked up.</Typography>
        )}
      </Box>
    </Box>
  );
}

const IntargosStatusCard = ({ report, status }) => {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>AWB: {report.awb}</Typography>
      <Box mt={2}>
        {status?.length ? (
          status.slice().reverse().map((scan, index) => {
            return (
              <Box key={index} mb={1} sx={{ borderLeft: '3px solid #00bcd4', pl: 1 }}>
                <Typography variant="body2">
                  <Typography component="span" fontWeight="medium">{scan.DateandTime}</Typography> | {scan.Location} | ({scan.Status}) {scan.Remark}
                </Typography>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">Shipment is not yet picked up.</Typography>
        )}
      </Box>
    </Box>
  );
}

const EkartStatusCard = ({ report, status }) => {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>AWB: {report.awb}</Typography>
      <Box mt={2}>
        {status?.length ? (
          status.slice().reverse().map((scan, index) => {
            return (
              <Box key={index} mb={1} sx={{ borderLeft: '3px solid #e91e63', pl: 1 }}>
                <Typography variant="body2" fontWeight="medium">{scan.status}</Typography>
                <Typography variant="caption" color="text.secondary">{scan.location}</Typography>
                <Typography variant="caption" color="text.secondary">{scan.date} {scan.time}</Typography>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">Shipment is not yet picked up.</Typography>
        )}
      </Box>
    </Box>
  );
}

const ReportCard = ({ report, status }) => {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>AWB: {report.awb}</Typography>
      {report?.lrn ? <Typography variant="subtitle1" gutterBottom>LRN: {report.lrn}</Typography> : null}
      <Box mt={2}>
        {status?.length ? (
          status.map((scan, index) => {
            return (
              <Box key={index} mb={1} sx={{ borderLeft: '3px solid #757575', pl: 1 }}>
                <Typography variant="body2" fontWeight="medium">{scan.status}</Typography>
                {scan?.description ? <Typography variant="caption" color="text.secondary">{scan.description}</Typography> : null}
                {scan?.location ? <Typography variant="caption" color="text.secondary">{scan.location}</Typography> : null}
                <Typography variant="caption" color="text.secondary">{scan.timestamp}</Typography>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">Shipment is not yet picked up.</Typography>
        )}
      </Box>
    </Box>
  );
}

const ViewDialog = ({ isOpen, onClose, report }) => {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getReport = async () => {
      if (!report?.ref_id || !report?.serviceId) return;
      
      setIsLoading(true);
      setStatus(null);
      
      try {
        const response = await fetch(`${API_URL}/shipment/domestic/report`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
          body: JSON.stringify({ 
            ref_id: report.ref_id, 
            serviceId: report.serviceId 
          }),
        });
        const result = await response.json();
        if (result.success) {
          setStatus(result.data || []);
        } else {
          console.error('Failed to fetch status:', result);
          toast.error(result.message || 'Failed to fetch status details.');
        }
      } catch (error) {
        console.error('Error fetching status:', error);
        toast.error('Error fetching status details.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      getReport();
    }
  }, [report?.ref_id, report?.serviceId, isOpen]);

  const renderStatus = () => {
    if (isLoading) return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
        <Typography ml={2}>Loading status...</Typography>
      </Box>
    );
    
    // Check if status is explicitly null or empty array and we are not loading.
    if (!status && !isLoading) {
      return (
        <Box p={2}>
          <Typography variant="body1" color="text.secondary">No status data available for this shipment.</Typography>
        </Box>
      );
    }

    switch(report?.serviceId) {
      case 1:
      case 2:
        return <DelhiveryStatusCard report={report} status={status} />;
      case 3:
        return <MovinStatusCard report={report} status={status} />;
      case 5:
        return <PickrrStatusCard report={report} status={status} />;
      case 6:
        return <ShiprocketStatusCard report={report} status={status} />;
      case 8:
        return <IntargosStatusCard report={report} status={status} />;
      case 11:
        return <EkartStatusCard report={report} status={status} />;
      default:
        return <ReportCard report={report} status={status} />;
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Shipment Status for AWB: {report?.awb || 'N/A'}</Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {renderStatus()}
      </DialogContent>
    </Dialog>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  const addPageNumber = (pageNum) => {
    pages.push({
      number: pageNum,
      isCurrent: pageNum === currentPage
    });
  };

  if (totalPages <= 1) return null; // Hide pagination if only one page

  addPageNumber(1);

  if (totalPages <= 7) {
    for (let i = 2; i < totalPages; i++) {
      addPageNumber(i);
    }
  } else {
    if (currentPage <= 4) {
      for (let i = 2; i <= 5; i++) {
        addPageNumber(i);
      }
      pages.push({ number: '...', isCurrent: false, key: 'ellipsis-start' });
      addPageNumber(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push({ number: '...', isCurrent: false, key: 'ellipsis-end' });
      for (let i = totalPages - 4; i < totalPages; i++) {
        addPageNumber(i);
      }
    } else {
      pages.push({ number: '...', isCurrent: false, key: 'ellipsis-start-middle' });
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        addPageNumber(i);
      }
      pages.push({ number: '...', isCurrent: false, key: 'ellipsis-end-middle' });
      addPageNumber(totalPages);
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={3} gap={1}>
      <Button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outlined"
        size="small"
        startIcon={<span className="hidden sm:inline">Prev</span>}
        sx={{ minWidth: { xs: 'auto', sm: 80 } }}
      >
        <span className="sm:hidden">Prev</span>
      </Button>
      
      {pages.map((page, idx) => (
        <Button
          key={page.key || idx}
          onClick={() => page.number !== '...' && onPageChange(page.number)}
          variant={page.isCurrent ? "contained" : "outlined"}
          size="small"
          disabled={page.number === '...'}
          sx={{ minWidth: 36, px: 1 }}
        >
          {page.number}
        </Button>
      ))}
      
      <Button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outlined"
        size="small"
        endIcon={<span className="hidden sm:inline">Next</span>}
        sx={{ minWidth: { xs: 'auto', sm: 80 } }}
      >
        <span className="sm:hidden">Next</span>
      </Button>
    </Box>
  );
};

const Listing = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [filters, setFilters] = useState({
    merchant_email: "",
    merchant_name: "",
    awb: "",
    ord_id: "",
    serviceId: "",
    startDate: "",
    endDate: ""
  });
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []); // Fetch services only once on mount

  useEffect(() => {
    fetchReports();
  }, [page, filters]); // Refetch reports when page or filters change

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/services/active-shipments/domestic`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
      });
      const result = await response.json();
      if (result.success) {
        setServices(result.services);
      } else {
        console.error('Failed to fetch services:', result.message);
        toast.error(result.message || 'Failed to fetch services.');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Error fetching services.');
    }
  };

  const fetchReports = async () => {
    setIsLoading(true);
    const startDate = filters.startDate ? convertToUTCISOString(new Date(filters.startDate).setHours(0,0,0,0)) : '';
    const endDate = filters.endDate ? convertToUTCISOString(new Date(filters.endDate).setHours(23,59,59,999)) : '';
    const queryParams = new URLSearchParams({
      page,
      merchant_email: filters.merchant_email,
      merchant_name: filters.merchant_name,
      awb: filters.awb,
      ord_id: filters.ord_id,
      serviceId: filters.serviceId,
      startDate: startDate,
      endDate: endDate
    });

    try {
      const response = await fetch(`${API_URL}/shipment/domestic/reports/admin?${queryParams}`, {
        headers: {
          'Authorization': localStorage.getItem('token'),
        },
      });
      const data = await response.json();
      if (data.success) {
        setReports(data.reports);
        setTotalPages(data.totalPages);
      } else {
        console.error('Failed to fetch reports:', data.message);
        toast.error(data.message || 'Failed to fetch reports.');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Error fetching reports.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (row) => {
    const cancel = confirm(`Do you want to cancel shipment with Order ID: ${row.ord_id}?`);
    if (!cancel) return;
    try {
      const response = await fetch(`${API_URL}/shipment/cancel`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ order: row.ord_id })
      });
      const result = await response.json();
      if (result.message.status) {
        toast.success(result.message.remark);
        fetchReports(); // Refresh the report list
      } else {
        toast.error(result.message.remark || "Your shipment has not been cancelled");
        console.log(result.message);
      }
    } catch (error) {
      console.error('Error cancelling shipment:', error);
      toast.error('Error cancelling shipment.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    setPage(1); // Reset to first page on filter change
  };

  const handleResetFilters = () => {
    setFilters({
      merchant_email: "",
      merchant_name: "",
      awb: "",
      ord_id: "",
      serviceId: "",
      startDate: "",
      endDate: ""
    });
    setPage(1); // Reset to first page
  };

  const columns = [
    { field: 'ref_id', headerName: 'Reference ID', width: 130 },
    { field: 'ord_id', headerName: 'Order ID', width: 130 },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 180,
      renderCell: (params) => 
        params.value ? new Date(params.value).toLocaleString() : ''
    },
    { field: 'fullName', headerName: 'Merchant Name', width: 180 },
    { field: 'email', headerName: 'Merchant Email', width: 200 },
    { field: 'awb', headerName: 'AWB', width: 150 },
    { 
      field: 'service_name', 
      headerName: 'Service', 
      width: 150
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220, // Increased width for better button spacing
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" height="100%">
          <Button
            variant="outlined" // Changed to outlined for a cleaner look
            size="small"
            onClick={() => {
              setSelectedReport(params.row);
              setIsViewOpen(true);
            }}
          >
            View Status
          </Button>
          {!params.row.cancelled && [1,2,5,6,7,8].includes(params.row.serviceId) && (
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleCancel(params.row)}
            >
              Cancel
            </Button>
          )}
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ width: '100%', p: { xs: 1.5, sm: 2, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">Shipment Reports</Typography>
        </Box>

        <Paper 
          elevation={1} 
          sx={{
            mb: 3,
            p: 2,
            bgcolor: 'grey.50', // Changed background color for better contrast
            borderRadius: 2, 
            overflowX: 'auto', // Enable horizontal scroll for filters on small screens
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.1)',
            },
          }}
        >
          <Stack
            direction="row"
            spacing={2} // Increased spacing between filter elements
            alignItems="center"
            sx={{
              minWidth: 'max-content', // Ensures items don't wrap prematurely
              py: 1, // Add vertical padding for better visual spacing
            }}
          >
            <TextField
              label="Merchant Name"
              variant="outlined"
              size="small"
              name="merchant_name"
              value={filters.merchant_name}
              onChange={handleFilterChange}
              sx={{ minWidth: 180 }}
              InputLabelProps={{ shrink: true }} // Always show label for consistency
            />
            <TextField
              label="Merchant Email"
              variant="outlined"
              size="small"
              name="merchant_email"
              value={filters.merchant_email}
              onChange={handleFilterChange}
              sx={{ minWidth: 200 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Order ID"
              variant="outlined"
              size="small"
              name="ord_id"
              value={filters.ord_id}
              onChange={handleFilterChange}
              sx={{ minWidth: 150 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="AWB"
              variant="outlined"
              size="small"
              name="awb"
              value={filters.awb}
              onChange={handleFilterChange}
              sx={{ minWidth: 150 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Start Date"
              variant="outlined"
              size="small"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              sx={{ minWidth: 160 }}
              InputLabelProps={{ shrink: true }} // Essential for date inputs
            />
            <TextField
              label="End Date"
              variant="outlined"
              size="small"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              sx={{ minWidth: 160 }}
              InputLabelProps={{ shrink: true }} // Essential for date inputs
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="service-select-label" shrink>Service</InputLabel>
              <Select
                labelId="service-select-label"
                value={filters.serviceId}
                onChange={handleFilterChange}
                label="Service"
                name="serviceId"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {services.map((service) => (
                  <MenuItem key={service.service_id} value={service.service_id}>
                    {service.service_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton
              aria-label="download reports"
              onClick={async () => {
                try {
                  const payload = {
                    merchant_email: filters.merchant_email,
                    merchant_name: filters.merchant_name,
                    awb: filters.awb,
                    ord_id: filters.ord_id,
                    serviceId: filters.serviceId,
                    startDate: filters.startDate ? convertToUTCISOString(new Date(filters.startDate).setHours(0,0,0,0)) : '',
                    endDate: filters.endDate ? convertToUTCISOString(new Date(filters.endDate).setHours(23,59,59,999)) : ''
                  }
                  const response = await fetch(`${API_URL}/shipment/domestic/reports/download/admin`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': localStorage.getItem('token'),
                    },
                    body: JSON.stringify(payload)
                  });
                  const data = await response.json();
                  if (!data.success) {
                    throw new Error(data.message || 'Failed to download reports');
                  }
                  const worksheet = XLSX.utils.json_to_sheet(data.data);
                  const workbook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
                  
                  const date = new Date().toISOString().split('T')[0];
                  XLSX.writeFile(workbook, `shipment_reports_${date}.xlsx`);
                  toast.success('Reports downloaded successfully!');
                } catch (error) {
                  console.error('Download failed:', error);
                  toast.error(error?.message || 'Failed to download reports');
                }
              }}
              sx={{ 
                bgcolor: 'primary.main', // Use primary color for main action
                color: 'white',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                minWidth: 40,
                height: 40, // Ensure consistent height with text fields
              }}
            >
              <DownloadIcon />
            </IconButton>
            <IconButton
              aria-label="reset filters"
              onClick={handleResetFilters}
              sx={{ 
                bgcolor: 'grey.400', // Different color for reset
                color: 'white',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'grey.500',
                },
                minWidth: 40,
                height: 40, // Ensure consistent height
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Stack>
        </Paper>

        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={reports}
            columns={columns}
            loading={isLoading}
            hideFooter={true} // Custom pagination below
            disableRowSelectionOnClick
            getRowId={(row) => row.ref_id}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'action.hover', // Lighter header background
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell': {
                py: '8px', // Adjust cell padding
              },
            }}
          />
        </Box>

        <Pagination 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </Paper>

      <ViewDialog
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        report={selectedReport}
      />
    </Box>
  );
};

export default function AllShipmentReports() {
  return (
    <Box sx={{ py: 4, width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Listing />
    </Box>
  );
}