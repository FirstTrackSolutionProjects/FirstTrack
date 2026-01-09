import React, { useEffect, useState } from 'react'
const API_URL = import.meta.env.VITE_APP_API_URL
const Form = () => {
    const [isTracking, setIsTracking] = useState(false)
    const [formData,setFormData] = useState({
        awb : ''
    })

    useEffect(() => {
        if (localStorage.getItem('track')){
            setFormData({id: localStorage.getItem('track'), isWaybill: true})
            localStorage.setItem('track','')
            // handleSubmit(1)
        }
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]:type === 'radio' ? checked : value
        }));
      };
    const [trackingData,setTrackingData] = useState(null)
    const closeResultModal = () => {
        setTrackingData(null)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsTracking(true)
        try{
            const data = await fetch(`${API_URL}/shipment/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            }).then(response => response.json())
            setTrackingData(data)
        } catch (e) {
            console.log(e)
        } finally {
            setIsTracking(false)
        }
    }
    return (
        <>
            <div className='w-full md:pt-16 font-inter'>
                <div className='w-full p-8 flex flex-col items-center space-y-16 mb-8'>
                    <div className='text-center text-3xl font-medium'>Track your Parcel</div>
                    
        <form className="flex flex-col items-center  space-y-8" onSubmit={handleSubmit}>
            <div className='flex'>
            <input type="text" name="awb" value={formData.id} onChange={handleChange} className="border py-2 px-4 rounded-l-xl bg-blue-50" placeholder="Enter Tracking Id/AWB" />
            <button className="border py-2 px-4 rounded-r-xl bg-blue-50" disabled={isTracking}>{isTracking?'Tracking...':'Track'}</button>
            </div>
        </form>
                </div>
            </div>
            {trackingData && <ResultModal data={trackingData} onClose={closeResultModal} />}
        </>
    )
}

const Card = ({ scan }) => {
    return (
        <>
            <div className="w-full h-16 bg-white relative items-center px-8 flex border-b space-x-4">
                <div>{scan.ScanDateTime}</div>
                <div>{scan.ScannedLocation}</div>
                <div className="absolute right-8 cursor-pointer">{scan.Instructions}</div>
            </div>
        </>
    )
}
const FlightGoCard = ({ scan }) => {
    return (
        <>
            <div className="w-full h-16 bg-white relative items-center px-8 flex border-b space-x-4">
                <div>{scan.event_at}</div>
                <div>{scan.event_location}</div>
                <div className="absolute right-8 cursor-pointer">{scan.event_description}</div>
            </div>
        </>
    )
}
const MovinCard = ({ scan }) => {
    return (
        <>
            <div className="w-full h-16 bg-white relative items-center px-8 flex border-b space-x-4">
                <div>{scan.timestamp}</div>
                <div className="absolute right-8 cursor-pointer">{scan.package_status}</div>
            </div>
        </>
    )
}

const PickrrCard = ({ scan }) => {
    return (
        <>
            <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
                <div className='flex flex-col items-center justify-center'>
                    <div className='font-bold'>{scan.remarks}</div>
                    <div>{scan.location}</div>
                    <div>{scan.timestamp}</div>
                </div>
            </div>
        </>
    )
}

const DillikingCard = ({ scan }) => {
    const date = scan.event_date;
    const time = scan.event_time;
    const formattedDate = `${date.substr(0,4)}/${date.substr(4,6)}/${date.substr(6,8)}`
    const formattedTime = `${time.substr(0,2)}:${time.substr(2,4)}`
    return (
    <>
        <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
            <div className='flex flex-col items-center justify-center'>
                <div className='font-bold'>{scan.remark}</div>
                <div>{scan.location}</div>
                <div>{`${formattedDate} ${formattedTime}`}</div>
            </div>
        </div>
    </>
    )
}

const ShiprocketCard = ({ scan }) => {
    return (
    <>
        <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
            <div className='flex flex-col items-center justify-center'>
                <div className='font-bold'>{scan["sr-status-label"]}</div>
                <div>{scan.location}</div>
                <div>{scan.date}</div>
            </div>
        </div>
    </>
    )
}

const IntargosCard = ({ scan }) => {
  return (
    <>
        <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
            <div className='flex flex-col items-center justify-center'>
                <div className='font-bold'>{`(${scan.Status}) ${scan.Remark}`}</div>
                <div>{scan.Location}</div>
                <div>{scan.DateandTime}</div>
            </div>
        </div>
    </>
    )
}

const EkartCard = ({ scan }) => {
  return (
    <>
      <div className="w-full py-3 bg-white relative items-center px-8 flex border-b space-x-4">
        <div>
          <div>{scan.status}</div>
          <div>{scan.location}</div>
          <div>{scan.date} {scan.time}</div>
        </div>
      </div>
    </>
  )
}


const ResultModal = ({ data, onClose }) => {
    useEffect(() => {
      console.log("data : ", data);
    }, [data]);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md max-h-screen overflow-hidden relative">
          <button
            className="absolute top-2 right-6 z-50 text-gray-400 hover:text-gray-600 text-3xl"
            onClick={onClose}
          >
            ×
          </button>
          <div className="w-full p-4 overflow-y-auto max-h-[80vh]">
          <h1 className='text-center text-2xl text-bold'>Shipment Tracking</h1>
            {/* Conditional Rendering for Cards */}
            {(data?.id === 1 || data?.id === 2) &&
              data?.data.ShipmentData[0].Shipment.Scans.slice()
                .reverse()
                .map((scan, index) => <Card key={index} scan={scan.ScanDetail} />)}
            {data?.id === 3 &&
              data?.data.map((scan, index) => (
                <MovinCard key={index} scan={scan} />
              ))}
            {data?.id === 4 &&
              data?.data.docket_events.map((scan, index) => (
                <FlightGoCard key={index} scan={scan} />
              ))}
            {data?.id === 5 &&
              data?.data.reverse().map((scan, index) => (
                <PickrrCard key={index} scan={scan} />
              ))}
            {data?.id === 6 &&
              data?.data.map((scan, index) => (
                <ShiprocketCard key={index} scan={scan} />
              ))}
            {data?.id === 7 &&
              data?.data.map((scan, index) => (
                <DillikingCard key={index} scan={scan} />
              ))}
              {data?.id === 8 &&
              data?.data.map((scan, index) => (
                <IntargosCard key={index} scan={scan} />
              ))}
              {data?.id === 11 &&
              data?.data.map((scan, index) => (
                <EkartCard key={index} scan={scan} />
              ))}
          </div>
        </div>
      </div>
    );
  };
  

const DomesticTracking = () => {
  return (
    <>
        
        <Form />
        
    </>
  )
}

export default DomesticTracking
