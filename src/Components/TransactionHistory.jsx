import { useEffect, useState } from "react"
import getTodaysDate from "../helpers/getTodaysDate";
import * as XLSX from 'xlsx';
import getFilterStartDate from "../helpers/getFilterStartDate";
import { FaDownload } from "react-icons/fa";
import convertToUTCISOString from "../helpers/convertToUTCISOString";

const API_URL = import.meta.env.VITE_APP_API_URL
const Card = ({transaction}) => {
    const date = transaction.date;
    const formattedDate = new Date(date).toLocaleString();
    return (
        <>
            {transaction.type ==="recharge" && <div className='p-4 border'>
                <p>Recharge</p>
                <p>Order Id : {transaction.order_id}</p>
                <p>Amount : {transaction.amount > 0? "+"+transaction.amount :transaction.amount}</p>
                <p>{formattedDate}</p>
            </div>}
            {transaction.type ==="manual" && <div className='p-4 border'>
                <p>Manual Recharge</p>
                <p>Beneficiary Id : {transaction.beneficiary_id}</p>
                <p>Order Id : {transaction.recharge_id}</p>
                <p>Amount : {transaction.amount > 0? "+"+transaction.amount :transaction.amount}</p>
                <p>Reason : {transaction.reason}</p>
                <p>{formattedDate}</p>
            </div>}
            {transaction.type === "expense" && <div className='p-4 border'>
                <p>Order Expense</p>
                <p>Order Id : {transaction.expense_order}</p>
                <p>Service : {transaction.service_name}</p>
                <p>Amount : -{transaction.expense_cost}</p>
                <p>{formattedDate}</p>
            </div>}
            {transaction.type === "refund" && <div className='p-4 border'>
                <p>Order Refund</p>
                <p>Order Id : {transaction.refund_order}</p>
                <p>Service : {transaction.service_name}</p>
                <p>Amount : +{transaction.refund_amount}</p>
                <p>{formattedDate}</p>
            </div>}
            {transaction.type ==="dispute_charge" && <div className='p-4 border'>
                <p>Dispute Charge</p>
                <p>Order Id : {transaction.dispute_order}</p>
                <p>Service : {transaction.service_name}</p>
                <p>Amount : -{transaction.dispute_charge}</p>
                <p>{formattedDate}</p>
            </div>}
        </>
    )
}



const TransactionHistory =  () => {
    const [transactions, setTransactions] = useState([])
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const [filters, setFilters] = useState({
        type: "",
        orderId: "",
        startDate: getFilterStartDate(),
        endDate: getTodaysDate()
    })
    useEffect(() => {
        const getVerifiedtransaction = async () => {
            const recharge = await fetch(`${API_URL}/wallet/recharges`, {
                method: 'POST',
                headers: { 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const recharges = await recharge.json();
            const data = recharges.data
            const manual = await fetch(`${API_URL}/wallet/manualRecharges`, {
                method: 'POST',
                headers: { 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const manuals = await manual.json();
            data.push(...manuals.data)
            const expense = await fetch(`${API_URL}/wallet/expenses`, {
                method: 'POST',
                headers: { 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const expenses = await expense.json();
            data.push(...expenses.data)
            const refund = await fetch(`${API_URL}/wallet/refunds`, {
                method: 'POST',
                headers: { 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const refunds = await refund.json();
            data.push(...refunds.data)

            const disputeCharge = await fetch(`${API_URL}/wallet/dispute-charges`, {
                method: 'GET',
                headers: { 'Accept': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const disputeCharges = await disputeCharge.json();
            data.push(...disputeCharges.data)
            
            // console.log("recharge", transactions.data)
            data.forEach(obj => {
                if (!(obj.date instanceof Date)) {
                    obj.dateObj = new Date(obj.date);
                }
            });
            data.sort((a, b) => a.dateObj - b.dateObj).reverse();
            if (data.length)
                setTransactions(data)
        }
        getVerifiedtransaction();
    },[]);
    useEffect(() => {
    if (!transactions.length) {
        return;
    }

    const filteredData = transactions.filter((transaction) => {
        // Get the relevant ID based on transaction type and convert to string
        const searchId = String(
            transaction?.expense_order || 
            transaction?.recharge_id || 
            transaction?.refund_order || 
            transaction?.order_id || 
            transaction?.dispute_order || 
            ''
        );

        // Type filtering - normalize strings and handle null/undefined
        const transactionType = String(transaction.type || '').toLowerCase();
        const searchType = String(filters.type || '').toLowerCase();
        const typeMatch = !searchType || transactionType.includes(searchType);

        // Order ID filtering - normalize strings
        const normalizedSearchId = searchId.toLowerCase();
        const searchOrderId = String(filters?.orderId || '').toLowerCase();
        const orderMatch = !searchOrderId || normalizedSearchId.includes(searchOrderId);

        // Date filtering
        const fromDate = new Date(convertToUTCISOString(filters.startDate));
        
        const toDate = new Date(convertToUTCISOString(`${filters.endDate}T23:59:59.999Z`));

        const dateMatch = transaction.dateObj >= fromDate && transaction.dateObj <= toDate;

        return typeMatch && orderMatch && dateMatch;
    });

    // Sort by date in descending order using dateObj
    const sortedData = [...filteredData].sort((a, b) => b.dateObj - a.dateObj);

    setFilteredTransactions(sortedData);
}, [transactions, filters]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  }

  const downloadExcelFromExport = async (filters) => {
        try {
          setDownloading(true)
          const response = await fetch(`${API_URL}/wallet/report/download`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify(filters),
          });
  
          const result = await response.json();
  
          if (!result.success) {
            alert('Error exporting data');
            return;
          }
  
          const workbook = XLSX.utils.book_new();
  
          const rows = result.data || [];
          const worksheet = XLSX.utils.json_to_sheet(rows);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
          XLSX.writeFile(workbook, `TransactionExport_${Date.now()}.xlsx`);
        } catch (err) {
          console.error('Error exporting to Excel:', err);
        } finally {
          setDownloading(false)
        }
      };
  return (
    <>
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <div className='w-full p-8 flex flex-col items-center space-y-8'>
      <div className='text-center text-3xl font-medium text-black'>Transaction History</div>
      <details className="w-full p-2 bg-blue-500 rounded-xl text-white">
          <summary>Filters</summary>
          <div className=" items-center lg:justify-center flex flex-col lg:flex-row lg:items-center ">
            <div className="grid sm:grid-rows-2 sm:grid-cols-2 lg:grid-rows-1 lg:grid-cols-4 gap-2 p-2 rounded-xl w-full bg-blue-500 text-black justify-evenly">
            <select
                className="p-1 w-full rounded-xl"
                name="type"
                value={filters?.type}
                onChange={handleChange}
                >
                <option value="">All Types</option>
                <option value="recharge">Recharge</option>
                <option value="manual">Manual Recharge</option>
                <option value="expense">Expense</option>
                <option value="refund">Refund</option>
                <option value="dispute_charge">Dispute Charge</option>
            </select>
            <input
              className="p-1 rounded-xl"
              type="text"
              name="orderId"
              placeholder="Order ID/Recharge ID"
              value={filters?.orderId}
              onChange={handleChange}
            />
            <input
        className="p-1 rounded-xl"
        type="date"
        name="startDate"
        value={filters.startDate}
        onChange={handleChange}
    />
    <input
        className="p-1 rounded-xl"
        type="date"
        name="endDate"
        value={filters.endDate}
        onChange={handleChange}
    />
          </div>
          {/* <button className="w-48 sm:w-full flex justify-center lg:w-10 lg:h-10 bg-blue-700 p-3 rounded-xl text-white" onClick={downloading ? null : () => downloadExcelFromExport(filters)}><FaDownload /></button> */}
          </div>
        </details>
      <div className='w-full bg-white px-8 pb-8 pt-2'>
        <p className="text-center py-2">{`Showing results from ${filters?.startDate} to ${filters?.endDate}`}</p>
        {filteredTransactions.length > 0 ? (
        filteredTransactions.map(((transaction,index)=>(
            <Card key={index}  transaction={transaction}/>
        )))
      ) : (
        null
      )}
      </div>
      </div>
    </div>
    </>
  )
}

export default TransactionHistory
