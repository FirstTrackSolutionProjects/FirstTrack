import React, { useEffect, useState } from 'react'
const API_URL = import.meta.env.VITE_APP_API_URL
const Form = () => {
    const [isTracking, setIsTracking] = useState(false)
    const [formData,setFormData] = useState({
        awb : ''
    })

    useEffect(() => {
        const storedTrackId = localStorage.getItem('track');
        if (storedTrackId) {
            // Temporarily set form data and immediately initiate tracking
            const trackImmediately = async () => {
                setIsTracking(true);
                try {
                    const data = await fetch(`${API_URL}/shipment/track`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ awb: storedTrackId })
                    }).then(response => response.json());
                    setTrackingData(data);
                } catch (e) {
                    console.error("Error tracking from localStorage:", e);
                } finally {
                    setIsTracking(false);
                }
                localStorage.removeItem('track'); // Clear after use
            };
            // Set the form data so the input reflects it, even if just for a moment
            setFormData({ awb: storedTrackId });
            trackImmediately();
        }
    }, []);

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
            console.error("Error submitting tracking request:", e);
        } finally {
            setIsTracking(false)
        }
    }
    return (
        <>
            <div className='w-full p-4 sm:p-8 flex flex-col items-center space-y-8 sm:space-y-16 mb-8 font-inter'>
                <div className='text-center text-3xl sm:text-4xl font-extrabold text-gray-900'>Track your Parcel</div>
                
        <form className="flex flex-col items-center space-y-8 w-full max-w-md" onSubmit={handleSubmit}>
            <div className='flex w-full'>
                <input
                    type="text"
                    name="awb"
                    value={formData.awb}
                    onChange={handleChange}
                    className="flex-grow border border-gray-300 py-3 px-5 rounded-l-xl bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 text-gray-800 placeholder-gray-500"
                    placeholder="Enter Tracking Id/AWB"
                    aria-label="Tracking ID or AWB"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-3 px-6 rounded-r-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isTracking}
                >
                    {isTracking ? 'Tracking...' : 'Track'}
                </button>
            </div>
        </form>
            </div>
            {trackingData && <ResultModal data={trackingData} onClose={closeResultModal} />}
        </>
    )
}

const Card = ({ scan }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100">
            <div className="flex flex-col space-y-1">
                <div className="font-semibold text-gray-800">{scan.Instructions}</div>
                <div className="text-sm text-gray-600">{scan.ScannedLocation}</div>
                <div className="text-xs text-gray-500 mt-1">{scan.ScanDateTime}</div>
            </div>
        </div>
    )
}
const FlightGoCard = ({ scan }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100">
            <div className="flex flex-col space-y-1">
                <div className="font-semibold text-gray-800">{scan.event_description}</div>
                <div className="text-sm text-gray-600">{scan.event_location}</div>
                <div className="text-xs text-gray-500 mt-1">{scan.event_at}</div>
            </div>
        </div>
    )
}
const MovinCard = ({ scan }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100">
            <div className="flex flex-col space-y-1">
                <div className="font-semibold text-gray-800">{scan.package_status}</div>
                <div className="text-xs text-gray-500 mt-1">{scan.timestamp}</div>
            </div>
        </div>
    )
}

const PickrrCard = ({ scan }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100">
            <div className='flex flex-col space-y-1'>
                <div className='font-semibold text-gray-800'>{scan.remarks}</div>
                {scan.location && <div className='text-sm text-gray-600'>{scan.location}</div>}
                <div className='text-xs text-gray-500 mt-1'>{scan.timestamp}</div>
            </div>
        </div>
    )
}

const DillikingCard = ({ scan }) => {
    const date = scan.event_date;
    const time = scan.event_time;
    // Assuming date is YYYYMMDD and time is HHMM
    const formattedDate = date ? `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}` : '';
    const formattedTime = time ? `${time.substring(0, 2)}:${time.substring(2, 4)}` : '';
    const dateTime = (formattedDate || formattedTime) ? `${formattedDate} ${formattedTime}`.trim() : 'N/A';

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100">
            <div className='flex flex-col space-y-1'>
                <div className='font-semibold text-gray-800'>{scan.remark}</div>
                {scan.location && <div className='text-sm text-gray-600'>{scan.location}</div>}
                <div className='text-xs text-gray-500 mt-1'>{dateTime}</div>
            </div>
        </div>
    )
}

const ShiprocketCard = ({ scan }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100">
            <div className='flex flex-col space-y-1'>
                <div className='font-semibold text-gray-800'>{scan["sr-status-label"]}</div>
                {scan.location && <div className='text-sm text-gray-600'>{scan.location}</div>}
                <div className='text-xs text-gray-500 mt-1'>{scan.date}</div>
            </div>
        </div>
    )
}

const IntargosCard = ({ scan }) => {
  return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100">
            <div className='flex flex-col space-y-1'>
                <div className='font-semibold text-gray-800'>{`(${scan.Status}) ${scan.Remark}`}</div>
                {scan.Location && <div className='text-sm text-gray-600'>{scan.Location}</div>}
                <div className='text-xs text-gray-500 mt-1'>{scan.DateandTime}</div>
            </div>
        </div>
    )
}

const EkartCard = ({ scan }) => {
  return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100">
            <div className='flex flex-col space-y-1'>
                <div className='font-semibold text-gray-800'>{scan.status}</div>
                {scan.location && <div className='text-sm text-gray-600'>{scan.location}</div>}
                <div className='text-xs text-gray-500 mt-1'>{scan.date} {scan.time}</div>
            </div>
        </div>
  )
}

const TrackingCard = ({ scan }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100">
            <div className='flex flex-col space-y-1'>
                <div className='font-semibold text-gray-800'>{scan?.status}</div>
                {scan?.description && <div className='text-sm text-gray-700'>{scan.description}</div>}
                {scan?.location && <div className='text-sm text-gray-600'>{scan.location}</div>}
                {scan?.timestamp && <div className='text-xs text-gray-500 mt-1'>{scan.timestamp}</div>}
            </div>
        </div>
    )
}


const ResultModal = ({ data, onClose }) => {
    useEffect(() => {
      // console.log("data : ", data); // Keep if needed for debugging, otherwise remove
    }, [data]);
  
    // Determine the tracking ID to display, if available and consistent across providers
    const trackingIdToDisplay = data?.data?.awb || data?.data?.[0]?.awb || data?.data?.ShipmentData?.[0]?.Shipment?.AWB;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col relative transform scale-95 animate-scale-up">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h2 className='text-xl sm:text-2xl font-semibold text-gray-800'>Shipment Tracking</h2>
            {trackingIdToDisplay && <span className="text-gray-600 text-xs sm:text-sm">AWB: <span className="font-mono font-medium">{trackingIdToDisplay}</span></span>}
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-700 text-3xl sm:text-4xl font-light leading-none"
              onClick={onClose}
              aria-label="Close tracking results"
            >
              &times;
            </button>
          </div>
          <div className="flex-grow p-4 sm:p-6 overflow-y-auto custom-scrollbar">
            {/* Conditional Rendering for Cards */}
            {(data?.id === 1 || data?.id === 2) && data?.data?.ShipmentData?.[0]?.Shipment?.Scans?.length > 0 ?
              data.data.ShipmentData[0].Shipment.Scans.slice()
                .reverse()
                .map((scan, index) => <Card key={index} scan={scan.ScanDetail} />)
                : (data?.id === 1 || data?.id === 2) && <p className="text-center text-gray-500">No scans found for this shipment.</p>
            }
            {data?.id === 3 && data?.data?.length > 0 ?
              data.data.map((scan, index) => (
                <MovinCard key={index} scan={scan} />
              )) : data?.id === 3 && <p className="text-center text-gray-500">No scans found for this shipment.</p>
            }
            {data?.id === 4 && data?.data?.docket_events?.length > 0 ?
              data.data.docket_events.map((scan, index) => (
                <FlightGoCard key={index} scan={scan} />
              )) : data?.id === 4 && <p className="text-center text-gray-500">No scans found for this shipment.</p>
            }
            {data?.id === 5 && data?.data?.length > 0 ?
              data.data.slice().reverse().map((scan, index) => (
                <PickrrCard key={index} scan={scan} />
              )) : data?.id === 5 && <p className="text-center text-gray-500">No scans found for this shipment.</p>
            }
            {data?.id === 6 && data?.data?.length > 0 ?
              data.data.map((scan, index) => (
                <ShiprocketCard key={index} scan={scan} />
              )) : data?.id === 6 && <p className="text-center text-gray-500">No scans found for this shipment.</p>
            }
            {data?.id === 7 && data?.data?.length > 0 ?
              data.data.map((scan, index) => (
                <DillikingCard key={index} scan={scan} />
              )) : data?.id === 7 && <p className="text-center text-gray-500">No scans found for this shipment.</p>
            }
            {data?.id === 8 && data?.data?.length > 0 ?
              data.data.map((scan, index) => (
                <IntargosCard key={index} scan={scan} />
              )) : data?.id === 8 && <p className="text-center text-gray-500">No scans found for this shipment.</p>
            }
            {data?.id === 11 && data?.data?.length > 0 ?
              data.data.map((scan, index) => (
                <EkartCard key={index} scan={scan} />
              )) : data?.id === 11 && <p className="text-center text-gray-500">No scans found for this shipment.</p>
            }
            {![1, 2, 3, 4, 5, 6, 7, 8, 11].includes(data?.id) && data?.data?.length > 0 ?
              data.data.map((scan, index) => (
                <TrackingCard key={index} scan={scan} />
              )) : !data?.data?.length && <p className="text-center text-gray-500">No scans found for this shipment.</p>}
          </div>
          <div className="p-3 sm:p-4 border-t border-gray-200 flex justify-end">
            <button
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  

const DomesticTracking = () => {
  return (
    <div className='bg-gray-50 min-h-screen py-12'>
        <div className='container mx-auto px-4'>
            <Form />
        </div>
    </div>
  )
}

export default DomesticTracking
