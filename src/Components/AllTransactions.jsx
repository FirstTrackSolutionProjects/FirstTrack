import { useEffect, useState } from "react"
import * as XLSX from 'xlsx';
import getFilterStartDate from "../helpers/getFilterStartDate";
import getTodaysDate from "../helpers/getTodaysDate";
import convertToUTCISOString from "../helpers/convertToUTCISOString";
const API_URL = import.meta.env.VITE_APP_API_URL

const Card = ({transaction}) => {
    const date = transaction.date;
    const dateLocal = new Date(date).toLocaleString();
    return (
        <>
            {transaction.type ==="recharge" && <div className='p-4 border'>
                <p>Recharge</p>
                <p>{transaction.fullName}<span className="text-gray-500">({transaction.uid})</span></p>
                <p>Order Id : {transaction.order_id}</p>
                <p>Amount : {transaction.amount > 0? "+"+transaction.amount :transaction.amount}</p>
                <p>{dateLocal}</p>
            </div>}
            {transaction.type ==="manual" && <div className='p-4 border'>
                <p>Manual Recharge</p>
                <p>{transaction.fullName}<span className="text-gray-500">({transaction.beneficiary_id})</span></p>
                <p>Order Id : {transaction.recharge_id}</p>
                <p>Amount : {transaction.amount > 0? "+"+transaction.amount :transaction.amount}</p>
                <p>Reason : {transaction.reason}</p>
                <p>{dateLocal}</p>
            </div>}
            {transaction.type ==="expense" && <div className='p-4 border'>
                <p>Order Expense</p>
                <p>{transaction.fullName}<span className="text-gray-500">({transaction.uid})</span></p>
                <p>Order Id : {transaction.expense_order}</p>
                <p>Service : {transaction.service_name}</p>
                <p>Amount : -{transaction.expense_cost}</p>
                <p>{dateLocal}</p>
            </div>}
            {transaction.type ==="refund" && <div className='p-4 border'>
                <p>Order Refund</p>
                <p>{transaction.fullName}<span className="text-gray-500">({transaction.uid})</span></p>
                <p>Order Id : {transaction.refund_order}</p>
                <p>Service : {transaction.service_name}</p>
                <p>Amount : +{transaction.refund_amount}</p>
                <p>{dateLocal}</p>
            </div>}
            {transaction.type ==="dispute_charge" && <div className='p-4 border'>
                <p>Dispute Charge</p>
                <p>{transaction.fullName}<span className="text-gray-500">({transaction.uid})</span></p>
                <p>Order Id : {transaction.dispute_order}</p>
                <p>Service : {transaction.service_name}</p>
                <p>Amount : -{transaction.dispute_charge}</p>
                <p>{dateLocal}</p>
            </div>}
        </>
    )
}



const AllTransactions =  () => {
    const [transactions, setTransactions] = useState([])
    const [downloading, setDownloading] = useState(false);
    const [filters, setFilters] = useState({
        startDate: getFilterStartDate(), 
        endDate: getTodaysDate(), 
        merchant_email: ''
    })
    const [filteredTransactions, setFilteredTransactions] = useState([]);
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
                    'Authorization': localStorage.getItem('token')
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
            if (data.length){
                setTransactions(data)
                setFilteredTransactions(data)
            }
        }
        getVerifiedtransaction();
    },[]);

    const downloadExcelFromExport = async (filters) => {
      try {
        setDownloading(true)
        const payload = {
          startDate: filters.startDate ? convertToUTCISOString(new Date(filters.startDate).setHours(0,0,0,0)) : '',
          endDate: filters.endDate ? convertToUTCISOString(new Date(filters.endDate).setHours(23,59,59,999)) : '',
          merchant_email: filters.merchant_email
        }
        const response = await fetch(`${API_URL}/wallet/report/download/all`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
          body: JSON.stringify(payload),
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

   useEffect(() => {
  if (!transactions.length) return;

  const filteredData = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const startDate = filters.startDate ? new Date(convertToUTCISOString(filters.startDate)) : null;
    const endDate = filters.endDate ? new Date(convertToUTCISOString(`${filters.endDate}T23:59:59.999Z`)) : null;

    const isAfterStart =
      !startDate || transactionDate >= startDate;
    const isBeforeEnd =
      !endDate || transactionDate <= endDate;

    const matchesEmail =
      !filters.merchant_email ||
      (transaction.email &&
        transaction.email.toLowerCase() === filters.merchant_email.toLowerCase());

    return isAfterStart && isBeforeEnd && matchesEmail;
  });

  setFilteredTransactions(filteredData);
}, [transactions, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  }
  return (
    <>
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <div className='w-full p-8 flex flex-col items-center space-y-8'>
      <div className='text-center text-3xl font-medium text-black'>Transaction History</div>
      <details className="w-full p-2 bg-blue-500 rounded-xl text-white">
          <summary>Filters</summary>
          <div className="grid space-y-2 lg:grid-rows-1 lg:grid-cols-4 lg:space-y-0 lg:space-x-4 p-2 rounded-xl w-full bg-blue-500 text-black justify-evenly">
            <input
              className="p-1 rounded-xl"
              type="text"
              name="merchant_email"
              placeholder="Merchant Email"
              value={filters.merchant_email}
              onChange={handleFilterChange}
            />
            <input
              className="p-1 rounded-xl min-w-[260px] lg:min-w-0"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <input
              className="p-1 rounded-xl"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
            <button className="flex-1 min-w-48 bg-blue-700 p-3 rounded-xl text-white" onClick={downloading ? null : () => downloadExcelFromExport(filters)}>{downloading ? 'Downloading...' : 'Download Report'}</button>
          </div>
        </details>
      <div className='w-full bg-white p-8'>
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

export default AllTransactions
