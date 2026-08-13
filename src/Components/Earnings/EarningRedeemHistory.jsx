import React, { useEffect, useRef, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { USER_ROLES, EARNING_REDEEM_HISTORY_SORT_BY, EARNING_REDEEM_STATUS, EARNING_REDEEM_PAYMENT_METHODS } from '@/Constants';
import convertToUTCISOString from '@/helpers/convertToUTCISOString';
import getRedeemEarningRequestsMerchantService from '@/services/earningServices/getRedeemEarningRequestsMerchant.service';
import getRedeemEarningRequestsAdminService from '@/services/earningServices/getRedeemEarningRequestsAdmin.service';
import redeemEarningService from '@/services/earningServices/redeemEarning.service';
import settleEarningRedeemRequestService from '@/services/earningServices/settleEarningRedeemRequest.service';
import getS3PutUrlService from '@/services/s3Services/getS3PutUrlService';
import s3FileUploadService from '@/services/s3Services/s3FileUploadService';
import getEarningsBalanceService from '@/services/earningServices/getEarningsBalance.service';

const BUCKET_URL = import.meta.env.VITE_APP_BUCKET_URL;

// ─── Pagination ──────────────────────────────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const addPage = (n) => {
    if (n < 1 || n > totalPages) return;
    pages.push({ number: n, isCurrent: n === currentPage });
  };

  addPage(1);
  if (totalPages <= 7) {
    for (let i = 2; i <= totalPages; i++) addPage(i);
  } else {
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    if (start > 2) pages.push({ number: '...' });
    for (let i = start; i <= end; i++) addPage(i);
    if (end < totalPages - 1) pages.push({ number: '...' });
    addPage(totalPages);
  }

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
          currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </button>
      {pages.map((page, idx) => (
        <button
          key={idx}
          onClick={() => page.number !== '...' && onPageChange(page.number)}
          className={`min-w-[30px] px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
            page.number === '...'
              ? 'cursor-default'
              : page.isCurrent
              ? 'bg-blue-500 text-white'
              : 'bg-white hover:bg-gray-100 border'
          }`}
        >
          {page.number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
          currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Next
      </button>
    </div>
  );
};

// ─── Composite user cell renderer ────────────────────────────────────────────
const UserCell = ({ name, email, phone }) => (
  <div style={{ lineHeight: 1.4, padding: '4px 0' }}>
    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{name || '—'}</div>
    <div style={{ fontSize: '0.72rem', color: '#555' }}>{email || '—'}</div>
    <div style={{ fontSize: '0.72rem', color: '#555' }}>{phone || '—'}</div>
  </div>
);

// ─── S3 key sanitizer ─────────────────────────────────────────────────────────
const sanitizeKey = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_/]+/g, '-')
    .replace(/-+/g, '-')
    .slice(-200);

// ─── Main Component ───────────────────────────────────────────────────────────
const EarningRedeemHistory = () => {
  const { role } = useAuth();
  const isAdmin = role === USER_ROLES.ADMIN;
  const isMerchant = role === USER_ROLES.MERCHANT;

  const [earningsBalance, setEarningsBalance] = useState(null);

  // Fetch earnings balance once on mount (merchant only)
  useEffect(() => {
    if (isMerchant) {
      getEarningsBalanceService()
        .then((data) => setEarningsBalance(data?.earnings ?? null))
        .catch((e) => console.warn('Failed to fetch earnings balance', e));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── List state ──────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    merchant_identifier: '',
    from_date: '',
    to_date: '',
    status: '',
    sort_by: EARNING_REDEEM_HISTORY_SORT_BY.LATEST_REQUEST,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRows = async (usePage = page, useFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      const from_date = useFilters.from_date
        ? convertToUTCISOString(new Date(useFilters.from_date).setHours(0, 0, 0, 0))
        : '';
      const to_date = useFilters.to_date
        ? convertToUTCISOString(new Date(useFilters.to_date).setHours(23, 59, 59, 999))
        : '';

      const payload = { ...useFilters, page: usePage, from_date, to_date };

      const data = isAdmin
        ? await getRedeemEarningRequestsAdminService(payload)
        : await getRedeemEarningRequestsMerchantService(payload);

      setRows((data?.rows || []).map((r, idx) => ({ ...r, _rowId: r.id ?? idx })));
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch (e) {
      setError(e?.message || 'Failed to load redeem requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows(page, filters);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const t = setTimeout(() => {
      if (page === 1) fetchRows(1, filters);
      else setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ── Redeem modal (merchant) ─────────────────────────────────────────────────
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [redeemForm, setRedeemForm] = useState({ amount: '', paymentMethod: EARNING_REDEEM_PAYMENT_METHODS.BANK_TRANSFER });
  const [redeemSubmitting, setRedeemSubmitting] = useState(false);
  const [redeemError, setRedeemError] = useState('');

  const openRedeemModal = () => {
    setRedeemForm({ amount: '', paymentMethod: EARNING_REDEEM_PAYMENT_METHODS.BANK_TRANSFER });
    setRedeemError('');
    setRedeemOpen(true);
  };

  const handleRedeemSubmit = async () => {
    setRedeemSubmitting(true);
    setRedeemError('');
    try {
      await redeemEarningService({
        amount: Number(redeemForm.amount),
        paymentMethod: redeemForm.paymentMethod,
      });
      setRedeemOpen(false);
      fetchRows(page, filters);
    } catch (e) {
      setRedeemError(e?.message || 'Failed to submit redeem request');
    } finally {
      setRedeemSubmitting(false);
    }
  };

  // ── Settle modal (admin) ────────────────────────────────────────────────────
  const [settleOpen, setSettleOpen] = useState(false);
  const [settleTargetId, setSettleTargetId] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [transactionDoc, setTransactionDoc] = useState('');
  const [docFile, setDocFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [settleSubmitting, setSettleSubmitting] = useState(false);
  const [settleError, setSettleError] = useState('');

  const openSettleModal = (requestId) => {
    setSettleTargetId(requestId);
    setTransactionId('');
    setTransactionDoc('');
    setDocFile(null);
    setUploadError('');
    setSettleError('');
    setSettleOpen(true);
  };

  const closeSettleModal = () => {
    if (settleSubmitting || isUploading) return;
    setSettleOpen(false);
  };

  const handleDocFileChange = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setUploadError('');
    setDocFile(file);
    try {
      const maxSizeBytes = 15 * 1024 * 1024;
      if (file.size > maxSizeBytes) throw new Error('File size must be 15MB or less');
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) throw new Error('Only PDF or image files are allowed');

      setIsUploading(true);
      const ext = file.name.includes('.') ? file.name.split('.').pop() : '';
      const base = sanitizeKey(file.name.replace(/\.[^.]+$/, '')) || 'transaction-doc';
      const key = `earning_redeem_docs/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}${ext ? '.' + ext : ''}`;

      const putUrl = await getS3PutUrlService(key, file.type, true);
      await s3FileUploadService(putUrl, file, file.type);
      setTransactionDoc(key);
    } catch (err) {
      setUploadError(err?.message || 'Failed to upload document');
      setTransactionDoc('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSettleSubmit = async () => {
    if (!transactionId.trim()) {
      setSettleError('Transaction Number is required');
      return;
    }
    if (!transactionDoc.trim()) {
      setSettleError('Transaction Document is required');
      return;
    }
    setSettleSubmitting(true);
    setSettleError('');
    try {
      await settleEarningRedeemRequestService(settleTargetId, {
        transaction_id: transactionId.trim(),
        transaction_doc: transactionDoc.trim(),
      });
      setSettleOpen(false);
      fetchRows(page, filters);
    } catch (e) {
      setSettleError(e?.message || 'Failed to settle request');
    } finally {
      setSettleSubmitting(false);
    }
  };

  // ── Columns ─────────────────────────────────────────────────────────────────
  const columns = [
    { field: 'id', headerName: 'Request ID', width: 110 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      renderCell: (params) => `₹ ${Number(params.value || 0).toFixed(2)}`,
    },
    { field: 'payment_method', headerName: 'Payment Method', width: 160 },
    { field: 'transaction_id', headerName: 'Transaction Number', width: 190 },
    {
      field: 'transaction_doc',
      headerName: 'Transaction Document',
      width: 200,
      renderCell: (params) => (
        <Button
          disabled={!params.value}
          onClick={() =>
            params.value &&
            window.open(`${BUCKET_URL}${params.value}`, '_blank', 'noopener,noreferrer')
          }
          variant="contained"
          color={params.value ? 'primary' : 'inherit'}
          size="small"
          sx={{ borderRadius: 1 }}
        >
          <span className="text-white text-xs">DOCUMENT</span>
        </Button>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const isPending = params.value === EARNING_REDEEM_STATUS.PENDING;
        return (
          <Chip
            label={params.value || '—'}
            size="small"
            color={isPending ? 'warning' : 'success'}
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      field: 'requested_at',
      headerName: 'Requested At',
      width: 190,
      renderCell: (params) => (params.value ? new Date(params.value).toLocaleString() : '—'),
    },
    {
      field: 'settled_at',
      headerName: 'Settled At',
      width: 190,
      renderCell: (params) => (params.value ? new Date(params.value).toLocaleString() : '—'),
    },
    ...(isAdmin
      ? [
          {
            field: 'merchant_name',
            headerName: 'Merchant Details',
            width: 220,
            renderCell: (params) => (
              <UserCell
                name={params.row.merchant_name}
                email={params.row.merchant_email}
                phone={params.row.merchant_phone}
              />
            ),
          },
          {
            field: '_actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => {
              const isPending = params.row.status === EARNING_REDEEM_STATUS.PENDING;
              if (!isPending) return null;
              return (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => openSettleModal(params.row.id)}
                  sx={{ borderRadius: 1 }}
                >
                  Settle
                </Button>
              );
            },
          },
        ]
      : []),
  ];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {isAdmin ? 'Merchant Earning Redeem Requests' : 'Earning Redeem History'}
          </h2>
          {isMerchant && (
            <Button variant="contained" color="primary" onClick={openRedeemModal}>
              Redeem
            </Button>
          )}
        </div>

        {/* Filter bar */}
        <Paper sx={{ width: '100%', p: 2, mb: 3 }}>
          <Box
            sx={{
              mb: 1,
              p: 2,
              bgcolor: 'primary.main',
              borderRadius: 2,
              '& .MuiTextField-root': { bgcolor: 'background.paper', borderRadius: 1 },
              overflowX: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <Box display="flex" gap={1} sx={{ minWidth: 'fit-content' }}>
              {/* Merchant identifier — admin only */}
              {isAdmin && (
                <TextField
                  label="Merchant (name / email / phone)"
                  variant="outlined"
                  size="small"
                  name="merchant_identifier"
                  value={filters.merchant_identifier}
                  onChange={onFilterChange}
                  sx={{ mr: 1, minWidth: '220px' }}
                  InputLabelProps={{ sx: { backgroundColor: 'white', px: 0.5, borderRadius: 1 } }}
                />
              )}

              {/* From date */}
              <TextField
                label="From Date"
                type="date"
                size="small"
                name="from_date"
                value={filters.from_date}
                onChange={onFilterChange}
                sx={{ mr: 1, minWidth: '150px' }}
                InputLabelProps={{ shrink: true, sx: { backgroundColor: 'white', px: 0.5, borderRadius: 1 } }}
              />

              {/* To date */}
              <TextField
                label="To Date"
                type="date"
                size="small"
                name="to_date"
                value={filters.to_date}
                onChange={onFilterChange}
                sx={{ mr: 1, minWidth: '150px' }}
                InputLabelProps={{ shrink: true, sx: { backgroundColor: 'white', px: 0.5, borderRadius: 1 } }}
              />

              {/* Status */}
              <FormControl size="small" sx={{ minWidth: '150px', mr: 1 }}>
                <InputLabel id="status-label" className="bg-white w-full">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={filters.status}
                  onChange={onFilterChange}
                  label="Status"
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                >
                  <MenuItem value=""><em>All</em></MenuItem>
                  {Object.entries(EARNING_REDEEM_STATUS).map(([key, val]) => (
                    <MenuItem key={key} value={val}>
                      {val.charAt(0) + val.slice(1).toLowerCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Sort by */}
              <FormControl size="small" sx={{ minWidth: '200px', mr: 1 }}>
                <InputLabel id="sort-by-label" className="bg-white w-full">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  name="sort_by"
                  value={filters.sort_by}
                  onChange={onFilterChange}
                  label="Sort By"
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                >
                  {Object.entries(EARNING_REDEEM_HISTORY_SORT_BY).map(([key, val]) => (
                    <MenuItem key={key} value={val}>
                      {val.charAt(0) + val.slice(1).toLowerCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Paper>

        {/* Earnings balance tile — merchant only */}
        {isMerchant && (
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box
              sx={{
                flex: 1,
                maxWidth: 240,
                p: 2,
                borderRadius: 1,
                bgcolor: '#ecfdf3',
                border: '1px solid #bbf7d0',
              }}
            >
              <div className="text-xs font-semibold text-gray-600">Earnings Balance</div>
              <div className="text-lg font-bold">
                {earningsBalance !== null ? `₹ ${Number(earningsBalance).toFixed(2)}` : '—'}
              </div>
            </Box>
          </Box>
        )}

        {error && <div className="text-red-600 mb-3">{error}</div>}

        {/* Data grid */}
        <div className="bg-white rounded-md border" style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            loading={loading}
            hideFooter
            getRowId={(row) => row._rowId}
            rowHeight={72}
            columns={columns}
          />
        </div>

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* ── Redeem Modal (Merchant only) ───────────────────────────────────── */}
      <Dialog open={redeemOpen} onClose={() => !redeemSubmitting && setRedeemOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Redeem Earnings</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Amount (min ₹200)"
              type="number"
              value={redeemForm.amount}
              onChange={(e) => setRedeemForm((prev) => ({ ...prev, amount: e.target.value }))}
              size="small"
              inputProps={{ min: 200, step: 1 }}
              disabled={redeemSubmitting}
            />

            <FormControl size="small" disabled={redeemSubmitting}>
              <InputLabel id="redeem-payment-method-label">Payment Method</InputLabel>
              <Select
                labelId="redeem-payment-method-label"
                value={redeemForm.paymentMethod}
                onChange={(e) => setRedeemForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                label="Payment Method"
              >
                {Object.entries(EARNING_REDEEM_PAYMENT_METHODS).map(([key, val]) => (
                  <MenuItem key={key} value={val}>{val}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {redeemError && <div className="text-red-600 text-sm">{redeemError}</div>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRedeemOpen(false)} disabled={redeemSubmitting}>Cancel</Button>
          <Button
            onClick={handleRedeemSubmit}
            disabled={redeemSubmitting || !redeemForm.amount}
            variant="contained"
            color="primary"
          >
            {redeemSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Settle Modal (Admin only) ──────────────────────────────────────── */}
      <Dialog open={settleOpen} onClose={closeSettleModal} fullWidth maxWidth="sm">
        <DialogTitle>Settle Redeem Request #{settleTargetId}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Transaction Number"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              size="small"
              disabled={settleSubmitting || isUploading}
              required
            />

            <div>
              <label className="block text-sm font-medium mb-1">
                Transaction Document (PDF / Image) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleDocFileChange}
                disabled={isUploading || settleSubmitting}
              />
              {isUploading && <div className="text-sm text-blue-600 mt-1">Uploading...</div>}
              {uploadError && <div className="text-sm text-red-600 mt-1">{uploadError}</div>}
              {transactionDoc && !isUploading && (
                <div className="text-xs text-green-700 mt-1 break-all">Uploaded: {transactionDoc}</div>
              )}
            </div>

            {settleError && <div className="text-red-600 text-sm">{settleError}</div>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSettleModal} disabled={settleSubmitting || isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleSettleSubmit}
            disabled={settleSubmitting || isUploading || !transactionId.trim() || !transactionDoc}
            variant="contained"
            color="success"
          >
            {settleSubmitting ? 'Settling...' : 'Settle'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EarningRedeemHistory;
