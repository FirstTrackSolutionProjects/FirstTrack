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
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { USER_ROLES, EARNING_HISTORY_SORT_BY } from '@/Constants';
import convertToUTCISOString from '@/helpers/convertToUTCISOString';
import getEarningHistoryMerchantService from '@/services/earningServices/getEarningHistoryMerchant.service';
import getEarningHistoryAdminService from '@/services/earningServices/getEarningHistoryAdmin.service';

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

// ─── Main Component ───────────────────────────────────────────────────────────
const EarningHistory = () => {
  const { role } = useAuth();
  const isAdmin = role === USER_ROLES.ADMIN;

  const [filters, setFilters] = useState({
    submerchant_identifier: '',
    merchant_identifier: '',
    order_identifier: '',
    from_date: '',
    to_date: '',
    sort_by: EARNING_HISTORY_SORT_BY.LATEST_EARNING,
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
        ? await getEarningHistoryAdminService(payload)
        : await getEarningHistoryMerchantService(payload);

      setRows((data?.rows || []).map((r, idx) => ({ ...r, _rowId: r.id ?? idx })));
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch (e) {
      setError(e?.message || 'Failed to load earning history');
    } finally {
      setLoading(false);
    }
  };

  // On page change
  useEffect(() => {
    fetchRows(page, filters);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // On filter change (debounced, skip first mount)
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const t = setTimeout(() => {
      if (page === 1) {
        fetchRows(1, filters);
      } else {
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ─── Columns ───────────────────────────────────────────────────────────────
  const columns = [
    { field: 'ord_id', headerName: 'Order ID', width: 140 },
    { field: 'awb', headerName: 'AWB', width: 160 },
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
        ]
      : []),
    {
      field: 'submerchant_name',
      headerName: 'Submerchant Details',
      width: 220,
      renderCell: (params) => (
        <UserCell
          name={params.row.submerchant_name}
          email={params.row.submerchant_email}
          phone={params.row.submerchant_phone}
        />
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      renderCell: (params) => `₹ ${Number(params.value || 0).toFixed(2)}`,
    },
    {
      field: 'created_at',
      headerName: 'Date',
      width: 200,
      renderCell: (params) => (params.value ? new Date(params.value).toLocaleString() : '—'),
    },
  ];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        {isAdmin ? 'Merchant Earning History' : 'Earning History'}
      </h2>

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

            {/* Submerchant identifier */}
            <TextField
              label="Submerchant (name / email / phone)"
              variant="outlined"
              size="small"
              name="submerchant_identifier"
              value={filters.submerchant_identifier}
              onChange={onFilterChange}
              sx={{ mr: 1, minWidth: '220px' }}
              InputLabelProps={{ sx: { backgroundColor: 'white', px: 0.5, borderRadius: 1 } }}
            />

            {/* Order / AWB search */}
            <TextField
              label="Order ID / AWB"
              variant="outlined"
              size="small"
              name="order_identifier"
              value={filters.order_identifier}
              onChange={onFilterChange}
              sx={{ mr: 1, minWidth: '160px' }}
              InputLabelProps={{ sx: { backgroundColor: 'white', px: 0.5, borderRadius: 1 } }}
            />

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

            {/* Sort by */}
            <FormControl size="small" sx={{ minWidth: '180px', mr: 1 }}>
              <InputLabel id="sort-by-label" className="bg-white w-full">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                name="sort_by"
                value={filters.sort_by}
                onChange={onFilterChange}
                label="Sort By"
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              >
                {Object.entries(EARNING_HISTORY_SORT_BY).map(([key, val]) => (
                  <MenuItem key={key} value={val}>
                    {val.charAt(0) + val.slice(1).toLowerCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

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
  );
};

export default EarningHistory;
