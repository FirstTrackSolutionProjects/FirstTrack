import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_APP_API_URL
import * as XLSX from 'xlsx'

const timestampToDate = (timestamp) => {
  const date = new Date(timestamp);
  const formattedTimestamp = date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, '0') + "-" +
    String(date.getDate()).padStart(2, '0') + " " +
    String(date.getHours()).padStart(2, '0') + ":" +
    String(date.getMinutes()).padStart(2, '0');
  return formattedTimestamp;
}

const DelhiveryStatusCard = ({ report, status }) => {
  return (
    <div>
      <p>AWB : {report.awb}</p>
      <p>Ref Id: {report.ref_id}</p>
      <p>Status : {status.Status.Status}</p>
      {
        (status.Scans).map((scan, index) => {
          const timestamp = scan.ScanDetail.ScanDateTime;
          const formattedTimestamp = timestampToDate(timestamp);
          return (
            <div>{formattedTimestamp} | {scan.ScanDetail.ScannedLocation} | {scan.ScanDetail.Instructions} </div>
          )
        })
      }
    </div>
  )
}

const MovinStatusCard = ({ report, status }) => {
  return (
    <div className="flex flex-col">
      <p className="mt-5">AWB : {report.awb}</p>
      {status.scans?.length ? <p className="mb-5">Currently At : {status?.latestLocation}</p> : null}
      {status.scans?.length ?
        (status.scans).reverse().map((scan, index) => {
          const date = scan.timestamp
          const formattedTimestamp = timestampToDate(date);
          return (
            <div className="flex space-x-5">
              <div>{formattedTimestamp}</div>
              <div>{scan.package_status}</div>
            </div>
          )
        }) : "Shipment is not yet picked up"
      }
    </div>
  )
}

const PickrrStatusCard = ({ report, status }) => {
  return (
    <div className="flex flex-col">
      <p className="mt-5">AWB : {report.awb}</p>

      {status.length ?
        (status).reverse().map((scan, index) => {
          const date = scan.timestamp
          const formattedTimestamp = timestampToDate(date);
          return (
            <div>{formattedTimestamp} | {scan.location} | {scan.remarks} </div>
          )
        }) : "Shipment is not yet picked up"
      }
    </div>
  )
}

const ShiprocketStatusCard = ({ report, status }) => {
  return (
    <div className="flex flex-col">
      <p className="mt-5">AWB : {report.awb}</p>

      {status.length ?
        (status).reverse().map((scan, index) => {
          return (
            <div className='flex flex-col justify-center'>
              <div className='font-bold'>{scan["sr-status-label"]}</div>
              <div>{scan.location}</div>
              <div>{scan.date}</div>
            </div>
          )
        }) : "Shipment is not yet picked up"
      }
    </div>
  )
}

const View = ({ report, setIsView }) => {
  const [status, setStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const getReport = async () => {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/shipment/domestic/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ ref_id: report.ref_id, serviceId: report.serviceId, categoryId: report.categoryId }),
      }).then(response => response.json()).then((result) => {
        if (result.success) {
          setStatus(result.data || [])
        }
        setIsLoading(false)
      })
      setIsLoading(false)
    }
    getReport();
  }, [])

  useEffect(() => {
    console.log(status)
  }, [status])

  return (
    <>
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex z-50 justify-center items-center">
        <div className="bg-white p-4  border">
          <div onClick={() => setIsView(false)}>X</div>
          {
            isLoading ? <div>Loading...</div> : null
          }
          {
            status && report.serviceId == 1 ? <DelhiveryStatusCard report={report} status={status} /> : null
          }
          {
            status && report.serviceId == 2 ? <DelhiveryStatusCard report={report} status={status} /> : null
          }
          {
            status && report.serviceId == 3 ? <MovinStatusCard report={report} status={status} /> : null
          }
          {
            status && report.serviceId == 5? <PickrrStatusCard report={report} status={status} /> : null
          }
          {
            status && report.serviceId == 6? <ShiprocketStatusCard report={report} status={status} /> : null
          }
        </div>
      </div>

    </>
  )
}

const Card = ({ report }) => {
  const [view, setIsView] = useState(false)
  const [isCancelled, setIsCancelled] = useState(report.cancelled ? true : false)
  const [isShipped, setIsShipped] = useState(report.awb ? true : false)
  const cancelShipment = async () => {
    const cancel = confirm('Do you want to cancel this shipment?');
    if (!cancel) return;
    await fetch(`${API_URL}/shipment/cancel`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify({ order: report.ord_id })
    }).then(response => response.json()).then(async result => {
      if (result.message.status) {
        setIsCancelled(true)
        alert(result.message.remark)
      }
      else {
        alert("Your shipment has not been cancelled")
        console.log(result.message)
      }
    })
  }
  return (
    <>
      {view ? <View report={report} setIsView={setIsView} /> : null}
      <div className="w-full h-24 bg-white relative items-center px-4 sm:px-8 flex border-b">
        <div>
          <div className="text-sm font-bold">
            {report.ref_id}
            <span className="text-gray-500">({report.ord_id})</span>
          </div>
          <div className="text-[10px] text-gray-500">
            {report.fullName}
          </div>
          <div className="text-[10px] text-gray-500">
            {report.email}
          </div>
          <div className="text-[10px] text-gray-500">
            {report.awb}
          </div>
          <div className="text-[10px] text-gray-500">
            {report.date ? report.date.toString().split('T')[0] + ' ' + report.date.toString().split('T')[1].split('.')[0] : null}
          </div>
        </div>
        <div className="absolute right-4 sm:right-8 flex space-x-2">
          {report.status}
          <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={() => setIsView(true)}>View</div>

          {isShipped && !isCancelled && [1,2,6].includes(report.serviceId) ? <div className="px-3 py-1 bg-red-500  rounded-3xl text-white cursor-pointer" onClick={() => cancelShipment()}>Cancel</div> : null}
          {isCancelled ? <div className="px-3 py-1 bg-red-500  rounded-3xl text-white cursor-pointer" >Cancelled</div> : null}
        </div>
      </div>
    </>
  );
};

const getTodaysDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const todayDate = yyyy + '-' + mm + '-' + dd;
  return todayDate;
}

const ShipmentReportDownloadDialog = () => {
  const [downloading, setDownloading] = useState(false)
  const todayDate = getTodaysDate()
  const [formData, setFormData] = useState({
    startDate: todayDate,
    endDate: todayDate
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }
  const handleDownload = async () => {
    setDownloading(true)
    const dataRequest = await fetch(`${API_URL}/shipment/domestic/reports/download`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify(formData)
    })
    const dataResponse = await dataRequest.json();
    const worksheet = XLSX.utils.json_to_sheet(dataResponse.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'data.xlsx');
    setDownloading(false)
  };
  return (
    <>
      <div className="flex flex-wrap justify-evenly items-center w-full bg-blue-300 mx-4 p-3 rounded-xl space-y-2 sm:space-y-0 sm:space-x-2 ">
        <input
          className="p-2 rounded-xl flex-[2] min-w-48"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />
        {/* <p className="mx-2 font-medium">to</p> */}
        <input
          className="p-2 rounded-xl flex-[2] min-w-48"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
        <button className="flex-1 min-w-48 bg-blue-700 p-3 rounded-xl text-white" onClick={downloading ? null : handleDownload}>{downloading ? 'Downloading...' : 'Download Report'}</button>
      </div>
    </>
  )
}

const Listing = () => {
  const [reports, setReports] = useState([])
  const [email, setEmail] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);
  const [filters, setFilters] = useState({
    email: "",
    orderId: "",
    name: "",
    awb: ""
  });
  useEffect(() => {

    fetch(`${API_URL}/shipment/domestic/reports/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          result.rows.sort((a, b) => parseInt(a.ref_id) - parseInt(b.ref_id)).reverse();
          setReports(result.rows);
        } else {
          alert('Fetch failed: ' + result.message)
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during fetching reports');
      });
  }, []);

  useEffect(() => {
    if (!reports.length) {
      return;
    }
    const filteredData = reports.filter((report) => {
      return (
        (filters.name === "" || report.fullName.toLowerCase().startsWith(filters.name.toLowerCase())) &&
        (filters.email === "" || report.email.toString().startsWith(filters.email)) &&
        (filters.orderId === "" || (report.ord_id.toLowerCase() == filters.orderId.toLowerCase())) &&
        (filters.awb === "" || (report.awb.toLowerCase() == filters.awb.toLowerCase()))
      );
    });
    setFilteredReports(filteredData)
  }, [reports, filters]);
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFilters({...filters, [name]: value });
  }
  // useEffect(() => {
  //   if (email == "") {
  //     setFilteredReports([])
  //     setTimeout(() => {
  //       setFilteredReports(reports)
  //     })
  //     return;
  //   }
  //   setFilteredReports([])
  //   setTimeout(() => {
  //     const filtered = reports.filter(report =>
  //       ((report.email).startsWith(email))
  //     );
  //     setFilteredReports(filtered);
  //     console.log(filtered)
  //   })
  // }, [email])
  return (
    <>
      <div
        className={`w-full p-4 flex flex-col items-center space-y-6`}
      >
        <div className="w-full h-16 px-4  relative flex">
          <div className="text-2xl font-medium">SHIPMENT REPORTS</div>
        </div>
        <ShipmentReportDownloadDialog />

        <details className="w-full p-2 bg-blue-500 rounded-xl text-white">
          <summary>Filters</summary>
          <div className="grid space-y-2 lg:grid-rows-1 lg:grid-cols-4 lg:space-y-0 lg:space-x-4 p-2 rounded-xl w-full bg-blue-500 text-black justify-evenly">
            <input
              className="p-1 rounded-xl min-w-[260px] lg:min-w-0"
              type="text"
              name="name"
              placeholder="Merchant Name"
              value={filters.name}
              onChange={handleChange}
            />
            <input
              className="p-1 rounded-xl"
              type="email"
              name="email"
              placeholder="Merchant Email"
              value={filters.email}
              onChange={handleChange}
            />
            <input
              className="p-1 rounded-xl"
              type="text"
              name="orderId"
              placeholder="Order Id"
              value={filters.orderId}
              onChange={handleChange}
            />
            <input
              className="p-1 rounded-xl"
              type="text"
              name="awb"
              placeholder="AWB"
              value={filters.awb}
              onChange={handleChange}
            />
          </div>
        </details>

        <div className="w-full">

          {(filteredReports).map((report, index) => (
            <Card key={index} report={report} />
          ))}
        </div>
      </div>
    </>
  );
};
const NDR = () => {
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <Listing />
    </div>
  )
}

export default NDR
