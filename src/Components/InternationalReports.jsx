import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_APP_API_URL
const View  = ({report, setIsView}) => {
  const [status, setStatus] = useState(null)
  useEffect(() => {
    
    const getReport = async () => {
      const response = await fetch(`${API_URL}/shipment/international/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ awb : report.awb })
      })
      const data = await response.json();
      setStatus(data.track);
    }
    getReport();
  },[])
  return (
    <>
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex z-50 justify-center items-center">
          <div className="bg-white p-4  border">
            <div onClick={()=>setIsView(false)}>X</div>
            {
              status ? <div>
              <p>AWB : {report.awb}</p>
              <p>Order Id: {report.iid}</p>
              <p>Status : {status[0].docket_info[4][1]}</p>
              {
                (status[0].docket_events).map((scan,index)=> {
                  return (
                  <div>{scan.event_at} | {scan.event_location} | {scan.event_description} </div>
                  )
              })
              }
            </div> : "Loading..."
            }
          </div>
      </div>
      
    </>
  )
}

const Card = ({ report }) => {
  
  
  const [view, setIsView] = useState(false)
  return (
    <>
      {view && <View report={report} setIsView={setIsView}/>}
      <div className="w-full h-24 bg-white relative items-center px-4 sm:px-8 flex border-b">
      <div className="text-[10px] text-gray-500">
          <div className="text-sm font-bold text-black">{report.ref_id} <span className="text-gray-500">{`(${report.iid})`}</span></div>
          {
            report.isAdmin? <><div >{report.fullName}</div>
            <div >{report.email}</div></> : <><div >{report.consignee_name}</div>
            </>
          }
            <div> {report.awb?`AWB : ${report.awb}`:null}</div>
            <div>{report.date ? report.date.toString().split('T')[0] + ' ' + report.date.toString().split('T')[1].split('.')[0] : null}</div>
          </div>
        <div className="absolute right-4 sm:right-8 flex space-x-2">
        {/* {report.status} */}
        <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={()=>setIsView(true)}>View</div>
        </div>
      </div>
    </>
  );
};

const Listing = () => {
  const [reports, setReports] = useState([])
  useEffect(() => {

      fetch(`${API_URL}/shipment/international/all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
        })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              result.order.sort((a,b) => a.date - b.date).reverse();
              setReports(result.order);
            } else {
              alert('Fetch failed: ' + result.message)
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during fetching reports');
          });
  },[]);
  return (
    <>
      <div
        className={`w-full p-4 flex flex-col items-center space-y-6`}
      >
        <div className="w-full h-16 px-4  relative flex">
          <div className="text-2xl font-medium">SHIPMENT REPORTS</div>
        </div>
        <div className="w-full">
        
          {reports.map((report, index) => (
            <Card key={index} report={report} />
          ))}
        </div>
      </div>
    </>
  );
};
const InternationalReports = () => {
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <Listing/>
    </div>
  )
}

export default InternationalReports
