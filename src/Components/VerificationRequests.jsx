import { useCallback, useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../Constants';
import getVerificationRequestsAdminService from '../services/verificationServices/getVerificationRequestsAdminService';

const API_URL = import.meta.env.VITE_APP_API_URL;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const openUrl = (url) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// ─── ViewDialog ───────────────────────────────────────────────────────────────

const ViewDialog = ({ row, onClose }) => {
    if (!row) return null;

    const field = (label, value) => (
        <div key={label}>
            <span className="font-semibold text-gray-600 text-sm">{label}: </span>
            <span className="text-sm">{value || '—'}</span>
        </div>
    );

    const docLink = (label, url) =>
        url ? (
            <div key={label}>
                <span className="font-semibold text-gray-600 text-sm">{label}: </span>
                <span
                    className="text-blue-600 cursor-pointer text-sm underline"
                    onClick={() => openUrl(url)}
                >
                    [PDF]
                </span>
            </div>
        ) : field(label, null);

    return (
        <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pr: 6 }}>
                Verification Request #{row.VERIFICATION_ID}
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                    size="small"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <div className="space-y-3">
                    <p className="text-lg font-medium">{row.BUSINESS_NAME || row.USER_NAME}</p>
                    <div className="flex justify-center mb-4">
                        <img
                            src={row.SELFIE_DOC || 'user.webp'}
                            alt="Selfie"
                            className="w-28 h-28 object-cover rounded-full border"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {field('Type', row.USER_ROLE)}
                        {field('Name', row.USER_NAME)}
                        {field('Email', row.USER_EMAIL)}
                        {field('Phone', row.USER_PHONE)}
                        {row.USER_ROLE === USER_ROLES.SUBMERCHANT && field('Merchant', row.MERCHANT_USER_NAME)}
                        {row.USER_ROLE === USER_ROLES.SUBMERCHANT && field('Merchant Email', row.MERCHANT_USER_EMAIL)}
                        {field('Business Name', row.BUSINESS_NAME)}
                        {field('GSTIN', row.GST)}
                        {field('CIN', row.CIN)}
                        {field('MSME', row.MSME)}
                        {field('Aadhar No.', row.AADHAR_NUMBER)}
                        {field('PAN No.', row.PAN_NUMBER)}
                        {field('Address', row.ADDRESS)}
                        {field('City', row.CITY)}
                        {field('State', row.STATE)}
                        {field('Pincode', row.PIN)}
                        {field('Bank', row.BANK)}
                        {field('A/C No.', row.ACCOUNT_NUMBER)}
                        {field('IFSC', row.IFSC)}
                        {docLink('Aadhar Doc', row.AADHAR_DOC)}
                        {docLink('PAN Doc', row.PAN_DOC)}
                        {docLink('GST Doc', row.GST_DOC)}
                        {docLink('Cancelled Cheque', row.CANCELLED_CHEQUE)}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    const addPage = (num) => pages.push({ number: num, isCurrent: num === currentPage });
    addPage(1);
    if (totalPages <= 7) {
        for (let i = 2; i < totalPages; i++) addPage(i);
    } else {
        if (currentPage <= 4) {
            for (let i = 2; i <= 5; i++) addPage(i);
            pages.push({ number: '...', isCurrent: false });
        } else if (currentPage >= totalPages - 3) {
            pages.push({ number: '...', isCurrent: false });
            for (let i = totalPages - 4; i < totalPages; i++) addPage(i);
        } else {
            pages.push({ number: '...', isCurrent: false });
            for (let i = currentPage - 1; i <= currentPage + 1; i++) addPage(i);
            pages.push({ number: '...', isCurrent: false });
        }
    }
    if (totalPages > 1) addPage(totalPages);

    return (
        <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
            </button>
            {pages.map((p, idx) => (
                <button
                    key={idx}
                    onClick={() => p.number !== '...' && onPageChange(p.number)}
                    className={`min-w-[30px] px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${p.number === '...' ? 'cursor-default' : p.isCurrent ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border'}`}
                    disabled={p.number === '...'}
                >
                    {p.number}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                Next
            </button>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const VerificationRequests = () => {
    const { role } = useAuth();

    // Data state
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    // Dialog
    const [viewRow, setViewRow] = useState(null);

    // Filters
    const [filters, setFilters] = useState({ userIdentifier: '', verificationRole: '' });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    // Debounce — 500ms (matching AllTransactions.jsx pattern)
    useEffect(() => {
        const t = setTimeout(() => setDebouncedFilters(filters), 500);
        return () => clearTimeout(t);
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPage(1);
    };

    // Fetch
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getVerificationRequestsAdminService({
                page,
                userIdentifier: debouncedFilters.userIdentifier,
                verificationRole: debouncedFilters.verificationRole,
            });
            setRows((data?.data || []).map((r) => ({ id: r.VERIFICATION_ID, ...r })));
            setRowCount(data?.pagination?.count || 0);
            setTotalPages(data?.pagination?.totalPages || 1);
        } catch (err) {
            setError(err?.message || 'Failed to load verification requests');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedFilters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Admin-only guard
    if (role !== USER_ROLES.ADMIN) {
        return (
            <div className="py-16 w-full flex justify-center items-center">
                <p className="text-gray-500 text-lg">Access denied. Admin only.</p>
            </div>
        );
    }

    const columns = [
        { field: 'VERIFICATION_ID', headerName: 'ID', width: 70 },
        { field: 'USER_ROLE', headerName: 'Type', width: 120 },
        {
            field: 'user_details',
            headerName: 'User',
            minWidth: 220,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.5, height: '100%', whiteSpace: 'normal' }}>
                    <div style={{ fontWeight: 600 }}>{params.row.USER_NAME}</div>
                    <div style={{ color: '#555' }}>{params.row.USER_EMAIL}</div>
                    <div style={{ color: '#555' }}>{params.row.USER_PHONE}</div>
                </Box>
            ),
        },
        {
            field: 'merchant_details',
            headerName: 'Merchant',
            minWidth: 220,
            sortable: false,
            renderCell: (params) =>
                params.row.USER_ROLE === USER_ROLES.SUBMERCHANT ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.5, height: '100%', whiteSpace: 'normal' }}>
                        <div style={{ fontWeight: 600 }}>{params.row.MERCHANT_USER_NAME}</div>
                        <div style={{ color: '#555' }}>{params.row.MERCHANT_USER_EMAIL}</div>
                        <div style={{ color: '#555' }}>{params.row.MERCHANT_USER_PHONE}</div>
                    </Box>
                ) : (
                    <span style={{ color: '#bdbdbd' }}>—</span>
                ),
        },
        {
            field: 'REQUESTED_AT',
            headerName: 'Requested At',
            minWidth: 170,
            renderCell: (p) => new Date(p.value).toLocaleString(),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 230,
            sortable: false,
            renderCell: (params) => {
                const handleApprove = async () => {
                    try {
                        const response = await fetch(
                            `${API_URL}/verification/${params.row.VERIFICATION_ID}/accept`,
                            {
                                method: 'PATCH',
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': localStorage.getItem('token'),
                                },
                            }
                        );
                        const result = await response.json();
                        alert(result.message || 'Verification request accepted successfully');
                        fetchData();
                    } catch (e) {
                        console.error(e);
                        alert('Failed to accept verification request');
                    }
                };

                const handleReject = async () => {
                    try {
                        const response = await fetch(
                            `${API_URL}/verification/${params.row.VERIFICATION_ID}/reject`,
                            {
                                method: 'PATCH',
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': localStorage.getItem('token'),
                                },
                            }
                        );
                        const result = await response.json();
                        alert(result.message || 'Verification request rejected successfully');
                        fetchData();
                    } catch (e) {
                        console.error(e);
                        alert('Failed to reject verification request');
                    }
                };

                const handleView = () => setViewRow(params.row);

                return (
                    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', height: '100%' }}>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={handleView}
                            sx={{ minWidth: 54, textTransform: 'none' }}
                        >
                            View
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={handleApprove}
                            sx={{ minWidth: 72, textTransform: 'none' }}
                        >
                            Approve
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={handleReject}
                            sx={{ minWidth: 58, textTransform: 'none' }}
                        >
                            Reject
                        </Button>
                    </Box>
                );
            },
        },
    ];

    return (
        <div className="py-10 w-full flex flex-col items-center">
            <div className="w-full max-w-7xl px-4 flex flex-col gap-4">
                <h1 className="text-2xl font-semibold text-center">Verification Requests</h1>

                {/* Filters */}
                <div className="bg-blue-500 text-white p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                        <input
                            name="userIdentifier"
                            value={filters.userIdentifier}
                            onChange={handleFilterChange}
                            placeholder="Name, Email or Phone"
                            className="p-2 rounded text-black bg-white w-full"
                        />
                        <select
                            name="verificationRole"
                            value={filters.verificationRole}
                            onChange={handleFilterChange}
                            className="p-2 rounded text-black bg-white w-full"
                        >
                            <option value="">ALL TYPES</option>
                            <option value={USER_ROLES.MERCHANT}>MERCHANT</option>
                            <option value={USER_ROLES.SUBMERCHANT}>SUBMERCHANT</option>
                        </select>
                    </div>
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                {/* DataGrid */}
                <div style={{ width: '100%', background: 'white' }} className="rounded-lg border">
                    <DataGrid
                        autoHeight
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        rowHeight={90}
                        paginationMode="server"
                        rowCount={rowCount}
                        pageSizeOptions={[PAGE_SIZE]}
                        initialState={{ pagination: { paginationModel: { pageSize: PAGE_SIZE, page: 0 } } }}
                        hideFooterPagination
                        disableColumnMenu
                        disableRowSelectionOnClick
                        rowSelection={false}
                    />
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                />
            </div>

            {/* View Dialog */}
            <ViewDialog row={viewRow} onClose={() => setViewRow(null)} />
        </div>
    );
};

export default VerificationRequests;
