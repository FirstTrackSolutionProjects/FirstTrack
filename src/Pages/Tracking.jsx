import React, { useEffect, useState } from 'react'
import { FaShippingFast, FaSearch, FaTimes, FaMapMarkerAlt, FaClock } from 'react-icons/fa'; // Added icons
const API_URL = import.meta.env.VITE_APP_API_URL

const Form = () => {
    const [isTracking, setIsTracking] = useState(false)
    const [formData,setFormData] = useState({
        awb : ''
    })

    useEffect(() => {
        if (localStorage.getItem('track')){
            const awbFromStorage = localStorage.getItem('track');
            setFormData({ awb: awbFromStorage });
            localStorage.removeItem('track');
            // Optionally, trigger handleSubmit directly if desired
            // Note: Directly calling handleSubmit might need a refactor
            // to pass the AWB directly, or a delay to ensure state updates.
            // For now, only populate the input.
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
      };
    const [trackingData,setTrackingData] = useState(null)
    const closeResultModal = () => {
        setTrackingData(null)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.awb) return; // Prevent submission if AWB is empty
        setIsTracking(true)
        try{
            const data = await fetch(`${API_URL}/shipment/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            setTrackingData(data)
        } catch (error) {
            console.error("Tracking error: ", error);
            // Optionally set an error state to display in the UI
            setTrackingData({ error: 'Failed to fetch tracking data. Please try again.' });
        } finally {
            setIsTracking(false)
        }
    }
    return (
        <>
            {/* Main container for the tracking page, ensuring it takes up sufficient height */}
            <div className='w-full min-h-[calc(100vh-80px)] flex items-center justify-center font-sans tracking-page-bg p-4 sm:p-6 lg:p-8'>
                {/* Card-like container for the form */}
                <div className='bg-gradient-to-br from-white to-green-50 p-6 sm:p-10 rounded-2xl shadow-2xl border border-green-100 max-w-lg w-full transform hover:scale-[1.01] transition-transform duration-300 ease-in-out relative overflow-hidden group'>
                    {/* Decorative elements - made larger and with subtle hover effects */}
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-green-200 rounded-full opacity-60 transform rotate-45 group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                    <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-200 rounded-full opacity-60 transform -rotate-45 group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                    {/* Additional subtle decorative elements */}
                    <div className="absolute top-1/4 left-0 w-16 h-16 bg-green-100 rounded-full opacity-30 blur-sm group-hover:translate-x-2 transition-all duration-300"></div>
                    <div className="absolute bottom-1/4 right-0 w-16 h-16 bg-emerald-100 rounded-full opacity-30 blur-sm group-hover:-translate-x-2 transition-all duration-300"></div>

                    <div className='text-center text-3xl sm:text-4xl font-extrabold text-green-700 mb-6 sm:mb-8 flex items-center justify-center gap-3'>
                        <FaShippingFast className="text-emerald-500 text-3xl sm:text-4xl" />
                        Track Your Parcel
                    </div>
                    
                    <form className="flex flex-col items-center space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
                        <div className='relative flex w-full max-w-md'> {/* Ensures the input and button take full width of the card */}
                            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10 text-lg" />
                            <input type="text" name="awb" value={formData.awb} onChange={handleChange}
                                className="flex-grow border-2 border-green-200 focus:border-green-600 focus:ring-2 focus:ring-green-300 py-3 pl-12 pr-6 rounded-full bg-white text-lg placeholder-gray-400 outline-none transition-all duration-200 ease-in-out shadow-md focus:shadow-lg text-gray-800 min-w-0"
                                placeholder="Enter Tracking ID/AWB"
                                aria-label="Tracking ID or AWB number" />
                            <button className="ml-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3 px-3 sm:px-8 rounded-full shadow-xl hover:shadow-green-400/50 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-lg flex-shrink-0 relative overflow-hidden"
                                    disabled={isTracking || !formData.awb}>
                                <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative z-10">{isTracking ? 'Tracking...' : 'Track'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {trackingData && <ResultModal data={trackingData} onClose={closeResultModal} />}
        </>
    )
}

// Unified Timeline Event Card
const TimelineEventCard = ({ status, description, location, timestamp, isLast }) => {
    return (
        <div className="flex items-start mb-6 last:mb-0">
            <div className="flex flex-col items-center mr-4">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center relative z-10">
                    {/* You could add an icon here based on status if needed */}
                </div>
                {!isLast && <div className="w-0.5 bg-green-200 h-full -mt-0.5"></div>}
            </div>
            <div className="bg-green-50 bg-opacity-80 p-4 rounded-lg flex-grow shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100">
                <div className="font-semibold text-green-800 text-base sm:text-lg mb-1">{status}</div>
                {description && <div className="text-gray-700 text-sm mb-1">{description}</div>}
                {(location || timestamp) && (
                    <div className="flex flex-col sm:flex-row sm:items-center text-gray-500 text-xs sm:text-sm mt-2 pt-2 border-t border-green-100">
                        {location && (
                            <div className="flex items-center mr-4">
                                <FaMapMarkerAlt className="mr-1 text-green-400" /> {location}
                            </div>
                        )}
                        {timestamp && (
                            <div className="flex items-center">
                                <FaClock className="mr-1 text-green-400" /> {timestamp}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Modified Card components to use TimelineEventCard
const Card = ({ scan }) => {
    return (
        <TimelineEventCard
            status={scan.Instructions || "Status Update"}
            location={scan.ScannedLocation}
            timestamp={scan.ScanDateTime}
        />
    );
};
const FlightGoCard = ({ scan }) => {
    return (
        <TimelineEventCard
            status={scan.event_description}
            location={scan.event_location}
            timestamp={scan.event_at}
        />
    );
};
const MovinCard = ({ scan }) => {
    return (
        <TimelineEventCard
            status={scan.package_status}
            timestamp={scan.timestamp}
        />
    );
};

const PickrrCard = ({ scan }) => {
    return (
        <TimelineEventCard
            status={scan.remarks}
            location={scan.location}
            timestamp={scan.timestamp}
        />
    );
};

const DillikingCard = ({ scan }) => {
    const date = scan.event_date;
    const time = scan.event_time;
    const formattedDate = date ? `${date.substr(0,4)}/${date.substr(4,6)}/${date.substr(6,8)}` : '';
    const formattedTime = time ? `${time.substr(0,2)}:${time.substr(2,4)}` : '';
    const dateTime = formattedDate && formattedTime ? `${formattedDate} ${formattedTime}` : formattedDate || formattedTime;

    return (
        <TimelineEventCard
            status={scan.remark}
            location={scan.location}
            timestamp={dateTime}
        />
    );
};

const ShiprocketCard = ({ scan }) => {
    return (
        <TimelineEventCard
            status={scan["sr-status-label"]}
            location={scan.location}
            timestamp={scan.date}
        />
    );
};

const IntargosCard = ({ scan }) => {
  return (
    <TimelineEventCard
        status={`(${scan.Status}) ${scan.Remark}`}
        location={scan.Location}
        timestamp={scan.DateandTime}
    />
    )
}

const EkartCard = ({ scan }) => {
  return (
    <TimelineEventCard
        status={scan.status}
        location={scan.location}
        timestamp={`${scan.date} ${scan.time}`}
    />
  )
}

const TrackingCard = ({ scan }) => {
    return (
        <TimelineEventCard
            status={scan?.status}
            description={scan?.description}
            location={scan?.location}
            timestamp={scan?.timestamp}
        />
    )
}

const ResultModal = ({ data, onClose }) => {
    useEffect(() => {
      // console.log("data : ", data); // Keep this for debugging if needed
    }, [data]);

    // Handle potential error messages from the API
    if (data && data.error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-white to-red-50 rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative text-center border border-red-100">
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl leading-none"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <FaTimes />
                    </button>
                    <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Error
                    </h2>
                    <p className="text-gray-700 text-lg">{data.error}</p>
                    <p className="text-gray-500 text-sm mt-2">Please check the AWB number and try again.</p>
                </div>
            </div>
        );
    }
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden relative transform scale-95 animate-scaleIn border border-green-100">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl leading-none"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
          <div className="w-full p-6 sm:p-8 pb-4 max-h-[inherit] flex flex-col">
            <h1 className='text-center text-3xl font-bold text-green-700 mb-6 border-b pb-4 relative'>
                <FaShippingFast className="inline-block text-emerald-500 text-2xl mr-2 mb-1" />
                Shipment Tracking
            </h1>
            <div className="overflow-y-auto pr-2 custom-scrollbar"> {/* Custom scrollbar for better aesthetics */}
                <div className="relative pl-6"> {/* Timeline container */}
                    <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-green-300 transform -translate-x-1/2"></div> {/* Vertical line */}
                    {/* Conditional Rendering for Cards */}
                    {(data?.id === 1 || data?.id === 2) &&
                    data?.data.ShipmentData[0].Shipment.Scans.slice()
                        .reverse()
                        .map((scan, index, arr) => (
                            <TimelineEventCard
                                key={index}
                                status={scan.ScanDetail.Instructions || "Status Update"}
                                location={scan.ScanDetail.ScannedLocation}
                                timestamp={scan.ScanDetail.ScanDateTime}
                                isLast={index === arr.length - 1}
                            />
                        ))}
                    {data?.id === 3 &&
                    data?.data.map((scan, index, arr) => (
                        <MovinCard key={index} scan={scan} isLast={index === arr.length - 1} />
                    ))}
                    {data?.id === 4 &&
                    data?.data.docket_events.map((scan, index, arr) => (
                        <FlightGoCard key={index} scan={scan} isLast={index === arr.length - 1} />
                    ))}
                    {data?.id === 5 &&
                    data?.data.reverse().map((scan, index, arr) => (
                        <PickrrCard key={index} scan={scan} isLast={index === arr.length - 1} />
                    ))}
                    {data?.id === 6 &&
                    data?.data.map((scan, index, arr) => (
                        <ShiprocketCard key={index} scan={scan} isLast={index === arr.length - 1} />
                    ))}
                    {data?.id === 7 &&
                    data?.data.map((scan, index, arr) => (
                        <DillikingCard key={index} scan={scan} isLast={index === arr.length - 1} />
                    ))}
                    {data?.id === 8 &&
                    data?.data.map((scan, index, arr) => (
                        <IntargosCard key={index} scan={scan} isLast={index === arr.length - 1} />
                    ))}
                    {data?.id === 11 &&
                    data?.data.map((scan, index, arr) => (
                        <EkartCard key={index} scan={scan} isLast={index === arr.length - 1} />
                    ))}
                    {![1,2,3,4,5,6,7,8,11].includes(data.id) && data?.data?.map((scan, index, arr) => (
                        <TrackingCard key={index} scan={scan} isLast={index === arr.length - 1} />
                    ))}
                    {data?.data?.length === 0 && (
                        <div className="text-center text-gray-600 py-8">No tracking information available for this AWB.</div>
                    )}
                </div>
            </div>
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
