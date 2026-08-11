import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, IconButton, Button, Typography, Divider, Tabs, Tab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { toast } from "react-toastify";

// Helper function to format timestamp (re-used from Listing.jsx)
const timestampToDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  const formattedTimestamp = date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, '0') + "-" +
    String(date.getDate()).padStart(2, '0') + " " +
    String(date.getHours()).padStart(2, '0') + ":" +
    String(date.getMinutes()).padStart(2, '0');
  return formattedTimestamp;
};

const GenericTrackingShareCard = ({ scan }) => (
  <div className="w-full px-4 py-3 flex items-start gap-4">
    <div className="mt-1 w-3 h-3 rounded-full bg-sky-700 shadow shadow-sky-200" />
    <div className="flex-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className='font-bold text-sm text-gray-800'>{scan?.status || '—'}</div>
      {scan?.description && <div className='text-xs text-gray-600'>{scan.description}</div>}
      {scan?.location && <div className='text-xs text-gray-500'>{scan.location}</div>}
      {scan?.timestamp && <div className='text-xs text-gray-400'>{timestampToDate(scan.timestamp)}</div>}
    </div>
  </div>
);


const TrackingShareDialog = ({ isOpen, onClose, trackingData, report, isInternational=false }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setLoading(trackingData === null);
      setActiveTab(0); // reset to first tab whenever dialog opens or data refreshes
    } else {
      setLoading(true);
      setActiveTab(0);
    }
  }, [isOpen, trackingData]);

  // Safely extract the array of TrackShipmentResultFactory items
  const getAwbResults = () => {
    if (!trackingData?.success || !trackingData?.data) return [];
    return Array.isArray(trackingData.data) ? trackingData.data : [trackingData.data];
  };

  const getTrackingLink = () => {
    // Determine which tracking ID to use (AWB for domestic, ref_id for international)
    const trackingId = isInternational ? report?.ref_id : report?.awb;
    return trackingId ? `${window.location.origin}/track?awb=${trackingId}` : '';
  };

  const generateTrackingMessage = () => {
    if (!report) return "No shipment details available.";

    // Determine values based on available properties (domestic vs. international)
    const awbNumber = isInternational ? report.ref_id || 'N/A' : report.awb || 'N/A';
    const orderId = isInternational ? report.iid || 'N/A' : report.ord_id || 'N/A';
    const customerName = isInternational ? report.consignee_name || 'N/A' : report.customer_name || 'N/A';

    let destinationAddress = 'N/A';
    if (isInternational) {
      if (report.consignee_city) {
        destinationAddress = `${report.consignee_city}, ${report.consignee_state || ''}`;
        if (report.consignee_zip_code) destinationAddress += ` - ${report.consignee_zip_code}`;
      }
    } else { // Domestic
      if (report.shipping_city) {
        destinationAddress = `${report.shipping_city}, ${report.shipping_state || ''}`;
        if (report.shipping_postcode) destinationAddress += ` - ${report.shipping_postcode}`;
      }
    }

    let message = `*🚚 First Track - Shipment Tracking Update 🚚*\n\n`;
    message += `*----- Shipment Details ----*\n`;
    message += `📦 *AWB:* ${awbNumber}\n`;
    if (!isInternational) { // Show Order ID only for domestic shipments
      message += `🛒 *Order ID:* ${orderId}\n`;
    }
    message += `👤 *Customer:* ${customerName}\n`;
    message += `📍 *Destination:* ${destinationAddress}\n`;
    if (!isInternational && report.service_name) { // Show Courier/Vendor for domestic shipments
      message += `🚚 *Courier Service:* ${report.service_name}\n`;
    }
    message += `*----------------------------*\n\n`;

    if (loading || !trackingData || !trackingData.success) {
      message += `*🗓️ Tracking History:*\n`;
      message += `_Tracking information is currently unavailable or still loading._\n`;
      return message;
    }

    const awbResults = getAwbResults();

    if (awbResults.length === 0) {
      message += `*🗓️ Tracking History:*\n_No detailed scan history available yet._\n`;
    } else {
      awbResults.forEach((result) => {
        const awbLabel = result.awb || 'N/A';
        const events = Array.isArray(result.events) ? result.events : [];
        message += `*🗓️ Tracking History — AWB: ${awbLabel}*\n`;
        if (events.length > 0) {
          events.slice().reverse().forEach((scan) => {
            const status = scan.status || 'N/A';
            const loc = scan.location || '';
            const time = timestampToDate(scan.timestamp);
            message += `• *${time}* - *${status}*${loc ? ` at ${loc}` : ''}\n`;
          });
        } else {
          message += `_No events recorded for this AWB._\n`;
        }
        message += `\n`;
      });
    }

    const trackingLink = getTrackingLink();
    message += `\n🔗 *Live Tracking Link:* ${trackingLink || 'N/A'}`;
    
    return message;
  };

  const handleCopyLink = () => {
    const link = getTrackingLink();
    if (link) {
      navigator.clipboard.writeText(link)
        .then(() => toast.success("Tracking link copied!"))
        .catch(() => toast.error("Failed to copy link."));
    }
  };

  const handleCopyInfo = () => {
    const message = generateTrackingMessage();
    navigator.clipboard.writeText(message)
      .then(() => toast.success("Full tracking info copied!"))
      .catch(() => toast.error("Failed to copy info."));
  };

  const handleShareWhatsApp = () => {
    const message = generateTrackingMessage();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderTrackingCards = () => {
    if (loading) {
      return (
        <Box p={4} textAlign="center" display="flex" flexDirection="column" alignItems="center" gap={2}>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-800"></div>
          <Typography color="text.secondary">Fetching updates...</Typography>
        </Box>
      );
    }

    if (!trackingData || !trackingData.success) {
      return (
        <Box p={4} textAlign="center">
          <Typography variant="body1" color="error">
            {trackingData?.message || "Failed to load tracking details."}
          </Typography>
        </Box>
      );
    }

    const awbResults = getAwbResults();

    if (awbResults.length === 0) {
      return (
        <Box p={4} textAlign="center">
          <Typography variant="body1" color="text.secondary">No updates available yet.</Typography>
        </Box>
      );
    }

    const activeResult = awbResults[activeTab] ?? awbResults[0];
    const events = Array.isArray(activeResult?.events) ? activeResult.events : [];

    return (
      <Box>
        {/* Tab Bar */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                minWidth: 'auto',
                px: 2,
              },
              '& .Mui-selected': {
                color: 'primary.main',
              },
            }}
          >
            {awbResults.map((result, index) => (
              <Tab
                key={index}
                label={result.awb || `AWB ${index + 1}`}
                id={`awb-tab-${index}`}
                aria-controls={`awb-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box
          role="tabpanel"
          id={`awb-tabpanel-${activeTab}`}
          aria-labelledby={`awb-tab-${activeTab}`}
        >
          {events.length === 0 ? (
            <Box p={4} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                No events recorded for this AWB yet.
              </Typography>
            </Box>
          ) : (
            <div className="relative">
              <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gray-200" />
              {events.slice().reverse().map((scan, index) => {
                if (!scan) return null;
                return <GenericTrackingShareCard key={index} scan={scan} />;
              })}
            </div>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: { xs: 2, sm: 3 }, 
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
          m: { xs: 1, sm: 2 }
        }
      }}
    >
      <DialogTitle sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
          <Typography variant="h6" fontWeight="700" color="text.primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Track Shipment: {report?.iid ? report.ref_id : report?.awb || 'N/A'}
          </Typography>
          <IconButton onClick={onClose} sx={{ '&:hover': { bgcolor: 'grey.100' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider sx={{ mt: 2 }} />
      </DialogTitle>
      
      <DialogContent sx={{ p: { xs: 2, sm: 3 }, pt: 0, maxHeight: '70vh' }}>
        {renderTrackingCards()}
      </DialogContent>

      <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: 1.5, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopyLink}
          disabled={!(report?.iid ? report.ref_id : report?.awb)}
          sx={{ textTransform: 'none', borderRadius: 1.5 }}
        >
          Copy Link
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopyInfo}
          disabled={loading || !trackingData?.success}
          sx={{ textTransform: 'none', borderRadius: 1.5 }}
        >
          Copy Info
        </Button>
        <Button
          variant="contained"
          size="small"
          color="success"
          startIcon={<WhatsAppIcon />}
          onClick={handleShareWhatsApp}
          disabled={loading || !trackingData?.success}
          sx={{ textTransform: 'none', borderRadius: 1.5, bgcolor: '#25D366', '&:hover': { bgcolor: '#128C7E' } }}
        >
          Share on WhatsApp
        </Button>
      </Box>
    </Dialog>
  );
};

export default TrackingShareDialog;