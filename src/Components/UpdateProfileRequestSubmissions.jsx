import { useCallback, useEffect, useState } from 'react';
import {
    Box, Button, Dialog, DialogContent, DialogTitle,
    IconButton, Chip, Divider, Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import getAllProfileUpdateRequestsAdminService from '../services/updateProfileServices/getAllProfileUpdateRequestsAdminService';

const API_URL = import.meta.env.VITE_APP_API_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const openUrl = (url) => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

const DataField = ({ label, value }) => {
    if (!value) return null;
    return (
        <div>
            <span style={{ fontWeight: 600, fontSize: 13, color: '#555' }}>{label}: </span>
            <span style={{ fontSize: 13 }}>{value}</span>
        </div>
    );
};

const DocLink = ({ label, url }) => {
    if (!url) return null;
    return (
        <div>
            <span style={{ fontWeight: 600, fontSize: 13, color: '#555' }}>{label}: </span>
            <span
                style={{ color: '#2563eb', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}
                onClick={() => openUrl(url)}
            >
                [Open Document]
            </span>
        </div>
    );
};

// ─── View Dialog ──────────────────────────────────────────────────────────────

const ViewDialog = ({ row, onClose, onApprove, onReject }) => {
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);

    if (!row) return null;

    const handleApprove = async () => {
        setApproving(true);
        try {
            const res = await fetch(`${API_URL}/update-profile-requests/${row.REQUEST_ID}/approve`, {
                method: 'PATCH',
                headers: { Accept: 'application/json', Authorization: localStorage.getItem('token') },
            });
            const result = await res.json();
            if (result.success) {
                toast.success(result.message || 'Request approved');
                onApprove();
                onClose();
            } else {
                toast.error(result.message || 'Failed to approve');
            }
        } catch (e) {
            toast.error('Error: ' + e.message);
        } finally {
            setApproving(false);
        }
    };

    const handleReject = async () => {
        setRejecting(true);
        try {
            const res = await fetch(`${API_URL}/update-profile-requests/${row.REQUEST_ID}/reject`, {
                method: 'PATCH',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: localStorage.getItem('token') },
                body: JSON.stringify({ message: 'Rejected by admin' }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success(result.message || 'Request rejected');
                onReject();
                onClose();
            } else {
                toast.error(result.message || 'Failed to reject');
            }
        } catch (e) {
            toast.error('Error: ' + e.message);
        } finally {
            setRejecting(false);
        }
    };

    return (
        <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pr: 6 }}>
                Profile Update Request
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    {/* User Info */}
                    <Box>
                        <Typography variant="overline" color="text.secondary">Requested By</Typography>
                        <Box display="flex" flexDirection="column" gap={0.5} mt={0.5}>
                            <DataField label="Name" value={row.USER_NAME} />
                            <DataField label="Email" value={row.USER_EMAIL} />
                            <DataField label="Phone" value={row.USER_PHONE} />
                            <DataField label="Request ID" value={row.REQUEST_ID} />
                            <DataField label="Requested At" value={new Date(row.REQUESTED_AT).toLocaleString()} />
                        </Box>
                    </Box>

                    <Divider />

                    {/* Basic */}
                    {(row.NEW_FULL_NAME || row.NEW_PHONE) && (
                        <Box>
                            <Typography variant="overline" color="text.secondary">Basic Details</Typography>
                            <Box mt={0.5} display="flex" flexDirection="column" gap={0.5}>
                                <DataField label="Full Name" value={row.NEW_FULL_NAME} />
                                <DataField label="Phone" value={row.NEW_PHONE} />
                            </Box>
                        </Box>
                    )}

                    {/* Personal */}
                    {(row.NEW_ADDRESS || row.NEW_CITY || row.NEW_STATE || row.NEW_PIN || row.NEW_ACCOUNT_NUMBER || row.NEW_BANK || row.NEW_IFSC || row.NEW_CANCELLED_CHEQUE || row.NEW_SELFIE_DOC) && (
                        <Box>
                            <Typography variant="overline" color="text.secondary">Personal Details</Typography>
                            <Box mt={0.5} display="flex" flexDirection="column" gap={0.5}>
                                <DataField label="Address" value={row.NEW_ADDRESS} />
                                <DataField label="City" value={row.NEW_CITY} />
                                <DataField label="State" value={row.NEW_STATE} />
                                <DataField label="Pincode" value={row.NEW_PIN} />
                                <DataField label="Bank" value={row.NEW_BANK} />
                                <DataField label="Account No." value={row.NEW_ACCOUNT_NUMBER} />
                                <DataField label="IFSC" value={row.NEW_IFSC} />
                                <DocLink label="Cancelled Cheque" url={row.NEW_CANCELLED_CHEQUE} />
                                <DocLink label="Selfie" url={row.NEW_SELFIE_DOC} />
                            </Box>
                        </Box>
                    )}

                    {/* Business */}
                    {(row.NEW_BUSINESS_NAME || row.NEW_GST || row.NEW_CIN || row.NEW_MSME || row.NEW_GST_DOC) && (
                        <Box>
                            <Typography variant="overline" color="text.secondary">Business Details</Typography>
                            <Box mt={0.5} display="flex" flexDirection="column" gap={0.5}>
                                <DataField label="Business Name" value={row.NEW_BUSINESS_NAME} />
                                <DataField label="GST" value={row.NEW_GST} />
                                <DataField label="CIN" value={row.NEW_CIN} />
                                <DataField label="MSME" value={row.NEW_MSME} />
                                <DocLink label="GST Document" url={row.NEW_GST_DOC} />
                            </Box>
                        </Box>
                    )}

                    {/* KYC */}
                    {(row.NEW_AADHAR_NUMBER || row.NEW_PAN_NUMBER || row.NEW_AADHAR_DOC || row.NEW_PAN_DOC) && (
                        <Box>
                            <Typography variant="overline" color="text.secondary">KYC Details</Typography>
                            <Box mt={0.5} display="flex" flexDirection="column" gap={0.5}>
                                <DataField label="Aadhar Number" value={row.NEW_AADHAR_NUMBER} />
                                <DocLink label="Aadhar Document" url={row.NEW_AADHAR_DOC} />
                                <DataField label="PAN Number" value={row.NEW_PAN_NUMBER} />
                                <DocLink label="PAN Document" url={row.NEW_PAN_DOC} />
                            </Box>
                        </Box>
                    )}

                    <Divider />

                    {/* Actions */}
                    <Box display="flex" gap={1.5} justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleApprove}
                            disabled={approving || rejecting}
                            sx={{ minWidth: 110 }}
                        >
                            {approving ? 'Approving...' : 'Approve'}
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleReject}
                            disabled={approving || rejecting}
                            sx={{ minWidth: 110 }}
                        >
                            {rejecting ? 'Rejecting...' : 'Reject'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pages = [];
    const addPage = (n) => pages.push({ n, isCurrent: n === currentPage });
    addPage(1);
    if (totalPages <= 7) {
        for (let i = 2; i < totalPages; i++) addPage(i);
    } else {
        if (currentPage <= 4) {
            for (let i = 2; i <= 5; i++) addPage(i);
            pages.push({ n: '...', isCurrent: false });
        } else if (currentPage >= totalPages - 3) {
            pages.push({ n: '...', isCurrent: false });
            for (let i = totalPages - 4; i < totalPages; i++) addPage(i);
        } else {
            pages.push({ n: '...', isCurrent: false });
            for (let i = currentPage - 1; i <= currentPage + 1; i++) addPage(i);
            pages.push({ n: '...', isCurrent: false });
        }
    }
    if (totalPages > 1) addPage(totalPages);

    return (
        <div className="flex items-center justify-center space-x-1 mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded text-sm ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                Prev
            </button>
            {pages.map((p, idx) => (
                <button
                    key={idx}
                    onClick={() => p.n !== '...' && onPageChange(p.n)}
                    className={`min-w-[32px] px-2 py-1 rounded text-sm ${p.n === '...' ? 'cursor-default' : p.isCurrent ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 border'}`}
                    disabled={p.n === '...'}
                >
                    {p.n}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded text-sm ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                Next
            </button>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const UpdateProfileRequestSubmissions = () => {
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [viewRow, setViewRow] = useState(null);
    const [userIdentifier, setUserIdentifier] = useState('');
    const [debouncedId, setDebouncedId] = useState('');

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedId(userIdentifier), 500);
        return () => clearTimeout(t);
    }, [userIdentifier]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllProfileUpdateRequestsAdminService({ page, userIdentifier: debouncedId });
            setRows((data?.data || []).map((r) => ({ id: r.REQUEST_ID, ...r })));
            setRowCount(data?.pagination?.count || 0);
            setTotalPages(data?.pagination?.totalPages || 1);
        } catch (err) {
            setError(err?.message || 'Failed to load requests');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const columns = [
        { field: 'REQUEST_ID', headerName: 'Request ID', minWidth: 160, flex: 1 },
        {
            field: 'user',
            headerName: 'Merchant',
            minWidth: 220,
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.5, height: '100%' }}>
                    <div style={{ fontWeight: 600 }}>{params.row.USER_NAME}</div>
                    <div style={{ color: '#777', fontSize: 12 }}>{params.row.USER_EMAIL}</div>
                    <div style={{ color: '#777', fontSize: 12 }}>{params.row.USER_PHONE}</div>
                </Box>
            ),
        },
        {
            field: 'sections',
            headerName: 'Changed Sections',
            minWidth: 200,
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                const r = params.row;
                const sections = [];
                if (r.NEW_FULL_NAME || r.NEW_PHONE) sections.push('Basic');
                if (r.NEW_ADDRESS || r.NEW_CITY || r.NEW_BANK || r.NEW_CANCELLED_CHEQUE) sections.push('Personal');
                if (r.NEW_BUSINESS_NAME || r.NEW_GST || r.NEW_CIN) sections.push('Business');
                if (r.NEW_AADHAR_NUMBER || r.NEW_PAN_NUMBER) sections.push('KYC');
                return (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center', height: '100%' }}>
                        {sections.map((s) => <Chip key={s} label={s} size="small" />)}
                    </Box>
                );
            },
        },
        {
            field: 'REQUESTED_AT',
            headerName: 'Requested At',
            minWidth: 160,
            renderCell: (p) => new Date(p.value).toLocaleString(),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 200,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', height: '100%' }}>
                    <Button size="small" variant="outlined" onClick={() => setViewRow(params.row)} sx={{ textTransform: 'none', minWidth: 54 }}>
                        View
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="success"
                        sx={{ textTransform: 'none', minWidth: 80 }}
                        onClick={async () => {
                            try {
                                const res = await fetch(`${API_URL}/update-profile-requests/${params.row.REQUEST_ID}/approve`, {
                                    method: 'PATCH',
                                    headers: { Accept: 'application/json', Authorization: localStorage.getItem('token') },
                                });
                                const result = await res.json();
                                if (result.success) { toast.success(result.message); fetchData(); }
                                else toast.error(result.message);
                            } catch (e) { toast.error('Error: ' + e.message); }
                        }}
                    >
                        Approve
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        sx={{ textTransform: 'none', minWidth: 68 }}
                        onClick={async () => {
                            try {
                                const res = await fetch(`${API_URL}/update-profile-requests/${params.row.REQUEST_ID}/reject`, {
                                    method: 'PATCH',
                                    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: localStorage.getItem('token') },
                                    body: JSON.stringify({ message: 'Rejected by admin' }),
                                });
                                const result = await res.json();
                                if (result.success) { toast.success(result.message); fetchData(); }
                                else toast.error(result.message);
                            } catch (e) { toast.error('Error: ' + e.message); }
                        }}
                    >
                        Reject
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <div className="py-10 w-full flex flex-col items-center">
            <div className="w-full max-w-7xl px-4 flex flex-col gap-4">
                <h1 className="text-2xl font-semibold text-center">Merchant Profile Update Requests</h1>

                {/* Filter */}
                <div className="bg-blue-500 text-white p-4 rounded-lg">
                    <input
                        value={userIdentifier}
                        onChange={(e) => { setUserIdentifier(e.target.value); setPage(1); }}
                        placeholder="Search by name, email or phone..."
                        className="p-2 rounded text-black bg-white w-full max-w-sm"
                    />
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                {/* DataGrid */}
                <div style={{ width: '100%', background: 'white' }} className="rounded-lg border">
                    <DataGrid
                        autoHeight
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        rowHeight={80}
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

                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

            {/* View Dialog */}
            <ViewDialog
                row={viewRow}
                onClose={() => setViewRow(null)}
                onApprove={fetchData}
                onReject={fetchData}
            />
        </div>
    );
};

export default UpdateProfileRequestSubmissions;
