import { useEffect , useMemo, useState  } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import AddSubmerchantModal from '../Modals/AddSubmerchantModal'
import UpdateSubmerchantMarginModal from '../Modals/UpdateSubmerchantMarginModal'
import getMySubmerchantsService from '@/services/merchantServices/getMySubmerchantsService'
import requestSubmerchantReactivationService from '@/services/merchantServices/requestSubmerchantReactivationService'
import { toast } from 'react-toastify'
import requestSubmerchantsService from '@/services/merchantServices/requestSubmerchantService'
import cancelSubmerchantRequestService from '@/services/merchantServices/cancelSubmerchantRequestService'


const MySubmerchants =  () => {
    // Data state
    const [rows, setRows] = useState([])
    const [rowCount, setRowCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0) // 0-based for DataGrid; backend expects 1-based
    const pageSize = 20 // backend is fixed to 20

    // Filters
    const [filters, setFilters] = useState({
        submerchant_name: '',
        submerchant_email: '',
        submerchant_phone: '',
        status: '',
    })

    // Add submerchant modal + refetch trigger
    const [openAddSubmerchantModal, setOpenAddSubmerchantModal] = useState(false)
    const [refreshIndex, setRefreshIndex] = useState(0)

    // Update margin modal
    const [openUpdateMarginModal, setOpenUpdateMarginModal] = useState(false)
    const [selectedSubmerchantId, setSelectedSubmerchantId] = useState(null)
    const [selectedCurrentMargin, setSelectedCurrentMargin] = useState(null)


    const handleRequestReactivation = async (submerchantId) => {
        if (!confirm('Are you sure you want to request reactivation for this submerchant?')) return
        try {
            setLoading(true)
            const res = await requestSubmerchantReactivationService(submerchantId)
            toast.success(res.message || 'Reactivation request submitted successfully')
            setRefreshIndex(prev => prev + 1)
        } catch (err) {
            toast.error(err.message || 'Failed to submit reactivation request')
        } finally {
            setLoading(false)
        }
    }

    const handleRequestAgain = async (email) => {
        if (!confirm('Are you sure you want to request again for this submerchant?')) return
        try {
            setLoading(true)
            const res = await requestSubmerchantsService({email});
            toast.success(res.message || 'Request submitted successfully')
            setRefreshIndex(prev => prev + 1)
        } catch (err) {
            toast.error(err.message || 'Failed to submit request')
        } finally {
            setLoading(false)
        }
    }

    const handleCancelRequest = async (requestId) => {
        if (!confirm('Are you sure you want to cancel this request?')) return
        try {            
            setLoading(true)
            const res = await cancelSubmerchantRequestService(requestId)
            toast.success(res.message || 'Request cancelled successfully')
            setRefreshIndex(prev => prev + 1)
        } catch (err) {
            toast.error(err.message || 'Failed to cancel request')
        } finally {
            setLoading(false)
        }
    }

    // Columns definition
    const columns = useMemo(() => [
        { field: 'user_role_id', headerName: 'Account ID', width: 100 },
        { field: 'SUBMERCHANT_NAME', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'SUBMERCHANT_EMAIL', headerName: 'Email', flex: 1.2, minWidth: 200 },
        { field: 'SUBMERCHANT_PHONE', headerName: 'Phone', width: 140 },
        { field: 'MARGIN', headerName: 'Margin %', width: 110 },
        { field: 'STATUS', headerName: 'Status', width: 110 },
        { field: 'actions', headerName: 'Actions', width: 400, sortable: false, filterable: false, renderCell: (params)=> {
            return (
            <>
                        <div className="flex items-center space-x-2">
                            {
                                ['REQUESTED'].includes(params.row.STATUS) ? (
                                    <>
                                        <button
                                            className="px-3 py-1 bg-red-500 text-white rounded-2xl text-sm"
                                            onClick={() => handleCancelRequest(params.row.REQUEST_ID)}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : null
                            }

                            {params.row.STATUS === 'ACTIVE' ? (
                                <>
                                    <button
                                        className="px-3 py-1 bg-blue-500 text-white rounded-2xl text-sm"
                                        onClick={() => {
                                            setSelectedSubmerchantId(params.row.user_role_id)
                                            setSelectedCurrentMargin(params.row.MARGIN)
                                            setOpenUpdateMarginModal(true)
                                        }}
                                    >
                                        Update Margin
                                    </button>
                                </>
                            ) : null}
                            {['INACTIVE'].includes(params.row.STATUS) ? (
                                <>
                                <button
                                    className="px-3 py-1 bg-blue-500 text-white rounded-2xl text-sm"
                                    onClick={() => handleRequestReactivation(params.row.user_role_id)}
                                    disabled={loading}
                                >
                                    Request Reactivation
                                </button>
                                </>
                            ) : null}
                            {['CANCELLED', 'REJECTED'].includes(params.row.STATUS) ? (
                                <>
                                <button
                                    className="px-3 py-1 bg-blue-500 text-white rounded-2xl text-sm"
                                    onClick={() => handleRequestAgain(params.row.SUBMERCHANT_EMAIL)}
                                    disabled={loading}
                                >
                                    Request Again
                                </button>
                                </>
                            ) : null}
                        </div>
            </>
        )} }
    ], [loading])

    // Debounced fetch
    useEffect(() => {
        let active = true
        const handler = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await getMySubmerchantsService({
                    page: page + 1, // backend is 1-based
                    ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '' && v !== undefined && v !== null))
                });
                if (!active) return
                const rows = res?.data || []
                const pagination = res?.pagination || {}
                setRows(rows)
                setRowCount(pagination?.totalCount || 0)
            } catch (e) {
                console.error(e)
                setRows([])
                setRowCount(0)
            } finally {
                if (active) setLoading(false)
            }
        }, 400) // debounce

        return () => { active = false; clearTimeout(handler) }
    }, [page, filters, refreshIndex])

    const handleFilterChange = (key) => (e) => {
        const value = e.target.value
        setFilters((prev) => ({ ...prev, [key]: value }))
        setPage(0) // reset to first page on filter change
    }

    // Custom pagination bar (consistent with app buttons/look)
    const totalPages = Math.max(1, Math.ceil((rowCount || 0) / pageSize))
    const start = rowCount ? (page * pageSize) + 1 : 0
    const end = rowCount ? Math.min((page + 1) * pageSize, rowCount) : 0

    const PaginationBar = () => (
        <div className="w-full h-16 bg-white relative items-center px-4 flex border-t rounded-b-xl">
            <div className="text-sm text-gray-600">
                {loading ? 'Loading…' : `Showing ${start}-${end} of ${rowCount}`}
            </div>
            <div className="ml-auto flex items-center space-x-2">
                <button
                    className={`px-3 py-1 bg-blue-500 rounded text-white ${page <= 0 || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => { if (page > 0 && !loading) setPage(page - 1) }}
                    disabled={page <= 0 || loading}
                >
                    Prev
                </button>
                <div className="text-sm text-gray-700">
                    Page {page + 1} of {totalPages}
                </div>
                <button
                    className={`px-3 py-1 bg-blue-500 rounded text-white ${(page + 1) >= totalPages || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => { if ((page + 1) < totalPages && !loading) setPage(page + 1) }}
                    disabled={(page + 1) >= totalPages || loading}
                >
                    Next
                </button>
            </div>
        </div>
    )

    return (
        <>
            <AddSubmerchantModal
                open={openAddSubmerchantModal}
                onClose={() => setOpenAddSubmerchantModal(false)}
                onSuccess={() => setRefreshIndex((v) => v + 1)}
            />
            <UpdateSubmerchantMarginModal
                open={openUpdateMarginModal}
                onClose={() => {
                    setOpenUpdateMarginModal(false)
                    setSelectedSubmerchantId(null)
                    setSelectedCurrentMargin(null)
                }}
                submerchantId={selectedSubmerchantId}
                currentMargin={selectedCurrentMargin}
                onSuccess={() => setRefreshIndex((v) => v + 1)}
            />
            <div className="py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
                <div className='w-full max-w-[1200px] px-6 flex flex-col items-stretch space-y-6'>
                    <div className='w-full flex items-center justify-between'>
                        <div className='text-3xl font-medium text-black'>My Submerchants</div>
                        <button
                            className='px-4 py-2 bg-blue-500 text-white rounded'
                            onClick={() => setOpenAddSubmerchantModal(true)}
                        >
                            Add Submerchant
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="w-full bg-white p-4 rounded-xl shadow-sm border">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                className="border rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-red-400"
                                placeholder="User Name"
                                value={filters.submerchant_name}
                                onChange={handleFilterChange('submerchant_name')}
                            />
                            <input
                                type="email"
                                className="border rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-red-400"
                                placeholder="User Email"
                                value={filters.submerchant_email}
                                onChange={handleFilterChange('submerchant_email')}
                            />
                            <input
                                type="text"
                                className="border rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-red-400"
                                placeholder="User Phone"
                                value={filters.submerchant_phone}
                                onChange={handleFilterChange('submerchant_phone')}
                            />
                            <select
                                className="border rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-red-400"
                                value={filters.status}
                                onChange={handleFilterChange('status')}
                            >
                                <option value=''>All</option>
                                <option value='REQUESTED'>Requested</option>
                                <option value='ACTIVE'>Active</option>
                                <option value='INACTIVE'>Rejected</option>
                                <option value='CANCELLED'>Cancelled</option>
                                <option value='REJECTED'>Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* DataGrid */}
                    <div className='w-full bg-white rounded-xl shadow-sm border overflow-hidden'>
                        <div className='p-3' style={{ height: 540 }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            getRowId={(row) => row.user_role_id}
                            loading={loading}
                            rowCount={rowCount}
                            pageSizeOptions={[pageSize]}
                            paginationMode="server"
                            paginationModel={{ page, pageSize }}
                            onPaginationModelChange={(model) => {
                                if (model.page !== page) setPage(model.page)
                            }}
                            disableRowSelectionOnClick
                            density="compact"
                            disableColumnMenu
                            hideFooter
                            rowHeight={64}
                            columnHeaderHeight={64}
                            sx={{
                                border: '1px solid #000',
                                borderRadius: 0,
                                '& .MuiDataGrid-columnHeaders': {
                                  borderBottom: '1px solid #000',
                                  backgroundColor: '#A34757',
                                color: '#FFF',
                                },
                                '& .MuiDataGrid-columnHeader': {
                                  backgroundColor: '#A34757',
                                  fontWeight: 'bold',
                                  },
                                '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
                                  borderRight: '1px solid #000',
                                },
                                '& .MuiDataGrid-columnHeader:first-of-type, & .MuiDataGrid-cell:first-of-type': {
                                  borderLeft: '1px solid #000',
                                },
                                '& .MuiDataGrid-row': {
                                  borderBottom: '1px solid #000',
                                },
                            }}
                        />
                        </div>
                        <PaginationBar />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MySubmerchants
