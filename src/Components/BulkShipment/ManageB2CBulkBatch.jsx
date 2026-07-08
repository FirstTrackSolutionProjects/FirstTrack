import { useEffect, useMemo, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import getB2CBulkShipmentBatches from '@/services/bulkServices/get_batches.bulk.service'
import { toast } from 'react-toastify'

const ManageB2CBulkBatch = () => {
    // Data state
    const [rows, setRows] = useState([])
    const [rowCount, setRowCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0) // 0-based for DataGrid; backend expects 1-based
    const pageSize = 10 // matches backend's fixed limit

    // Filters
    const [batchName, setBatchName] = useState('')

    // Columns definition
    const columns = useMemo(() => [
        {
            field: 'name',
            headerName: 'Batch Name',
            flex: 1,
            minWidth: 180,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => {
                const status = params.value
                const colorMap = {
                    IDLE: { bg: '#f0fdf4', color: '#16a34a', border: '#86efac' },
                    PROCESSING: { bg: '#fff7ed', color: '#ea580c', border: '#fdba74' },
                }
                const style = colorMap[status] || { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' }
                return (
                    <span
                        style={{
                            backgroundColor: style.bg,
                            color: style.color,
                            border: `1px solid ${style.border}`,
                            borderRadius: 9999,
                            padding: '2px 10px',
                            fontSize: 12,
                            fontWeight: 600,
                            letterSpacing: 0.3,
                        }}
                    >
                        {status}
                    </span>
                )
            },
        },
        {
            field: 'total_shipments',
            headerName: 'Total Shipments',
            width: 150,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'manifested_shipments',
            headerName: 'Manifested',
            width: 130,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 170,
            renderCell: (params) => {
                if (!params.value) return '—'
                const date = new Date(params.value)
                return date.toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div className="flex items-center space-x-2 h-full">
                    <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-2xl text-sm cursor-pointer hover:bg-blue-600 transition-colors"
                        onClick={() => { /* TODO: implement View logic */ }}
                    >
                        View
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-500 text-white rounded-2xl text-sm cursor-pointer hover:bg-gray-600 transition-colors"
                        onClick={() => { /* TODO: implement Reports logic */ }}
                    >
                        Reports
                    </button>
                </div>
            ),
        },
    ], [])

    // Debounced fetch — triggers on page or batchName change
    useEffect(() => {
        let active = true
        const handler = setTimeout(async () => {
            setLoading(true)
            try {
                const params = { page: page + 1 } // backend is 1-based
                if (batchName.trim()) params.batchName = batchName.trim()

                const res = await getB2CBulkShipmentBatches(params)
                if (!active) return

                setRows(res?.rows || [])
                setRowCount(res?.pagination?.total_count || 0)
            } catch (e) {
                if (!active) return
                console.error(e)
                toast.error(e.message || 'Failed to load batches')
                setRows([])
                setRowCount(0)
            } finally {
                if (active) setLoading(false)
            }
        }, 400) // debounce delay

        return () => { active = false; clearTimeout(handler) }
    }, [page, batchName])

    const handleBatchNameChange = (e) => {
        setBatchName(e.target.value)
        setPage(0) // reset to first page on filter change
    }

    // Custom pagination bar (consistent with app pattern)
    const totalPages = Math.max(1, Math.ceil((rowCount || 0) / pageSize))
    const start = rowCount ? page * pageSize + 1 : 0
    const end = rowCount ? Math.min((page + 1) * pageSize, rowCount) : 0

    const PaginationBar = () => (
        <div className="w-full h-16 bg-white relative items-center px-4 flex border-t rounded-b-xl">
            <div className="text-sm text-gray-600">
                {loading ? 'Loading…' : `Showing ${start}–${end} of ${rowCount}`}
            </div>
            <div className="ml-auto flex items-center space-x-2">
                <button
                    className={`px-3 py-1 bg-red-500 rounded text-white ${page <= 0 || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-red-600'}`}
                    onClick={() => { if (page > 0 && !loading) setPage(page - 1) }}
                    disabled={page <= 0 || loading}
                >
                    Prev
                </button>
                <div className="text-sm text-gray-700">
                    Page {page + 1} of {totalPages}
                </div>
                <button
                    className={`px-3 py-1 bg-red-500 rounded text-white ${(page + 1) >= totalPages || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-red-600'}`}
                    onClick={() => { if ((page + 1) < totalPages && !loading) setPage(page + 1) }}
                    disabled={(page + 1) >= totalPages || loading}
                >
                    Next
                </button>
            </div>
        </div>
    )

    return (
        <div className="py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
            <div className="w-full max-w-[1200px] px-6 flex flex-col items-stretch space-y-6">

                {/* Header */}
                <div className="w-full flex items-center justify-between">
                    <div className="text-3xl font-medium text-black">Manage B2C Batches</div>
                </div>

                {/* Filter */}
                <div className="w-full bg-white p-4 rounded-xl shadow-sm border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            className="border rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Search by Batch Name…"
                            value={batchName}
                            onChange={handleBatchNameChange}
                        />
                    </div>
                </div>

                {/* DataGrid */}
                <div className="w-full bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="p-3" style={{ height: 540 }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            getRowId={(row) => row.id}
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
    )
}

export default ManageB2CBulkBatch