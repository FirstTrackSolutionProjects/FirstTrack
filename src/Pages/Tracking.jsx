import React, { useEffect, useState } from 'react'
import { FaShippingFast, FaSearch, FaTimes, FaMapMarkerAlt, FaClock, FaQuestionCircle } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer'; // For scroll animations
import { whyChooseUs } from '../Constants'; // Assuming these are useful
import { Link } from 'react-router-dom';

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
            {/* Main container for the tracking page, now with adjusted vertical padding instead of min-height */}
            <div className='w-full font-sans tracking-page-bg py-20 sm:py-24 p-4 sm:p-6 lg:p-8 flex items-center justify-center'>
                {/* Card-like container for the form */}
                <div className='bg-gradient-to-br from-white to-green-50 p-6 sm:p-8 rounded-2xl shadow-2xl border border-green-100 max-w-lg w-full transform hover:scale-[1.01] transition-transform duration-300 ease-in-out relative overflow-hidden group'>
                    {/* Decorative elements - made larger and with subtle hover effects */}
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-green-200 rounded-full opacity-60 transform rotate-45 group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                    <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-200 rounded-full opacity-60 transform -rotate-45 group-hover:scale-110 transition-transform duration-300 ease-out"></div>
                    {/* Additional subtle decorative elements */}
                    <div className="absolute top-1/4 left-0 w-16 h-16 bg-green-100 rounded-full opacity-30 blur-sm group-hover:translate-x-2 transition-all duration-300"></div>
                    <div className="absolute bottom-1/4 right-0 w-16 h-16 bg-emerald-100 rounded-full opacity-30 blur-sm group-hover:-translate-x-2 transition-all duration-300"></div>

                    <div className='text-center text-3xl sm:text-4xl font-extrabold text-green-700 mb-4 sm:mb-5 flex items-center justify-center gap-3'>
                        <FaShippingFast className="text-emerald-500 text-3xl sm:text-4xl" />
                        Track Your Parcel
                    </div>
                    
                    <form className="flex flex-col items-center space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                        <div className='relative flex w-full max-w-md'>
                            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10 text-lg" />
                            <input type="text" name="awb" value={formData.awb} onChange={handleChange}
                                className="flex-grow border-2 border-green-200 focus:border-green-600 focus:ring-2 focus:ring-green-300 py-3 pl-12 pr-6 rounded-full bg-white text-lg placeholder-gray-400 outline-none transition-all duration-200 ease-in-out shadow-md focus:shadow-lg text-gray-800 min-w-0"
                                placeholder="Enter Tracking ID/AWB"
                                aria-label="Tracking ID or AWB number" />
                            <button className="ml-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3 px-4 sm:px-8 rounded-full shadow-xl hover:shadow-green-400/50 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-lg flex-shrink-0 relative overflow-hidden"
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
        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden relative transform scale-95 animate-scaleIn border border-green-100"> {/* Changed max-w-md to max-w-lg for better content display */}
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
  

const TrackingPageIntro = () => (
    <section className="py-10 bg-gradient-to-r from-green-50 to-emerald-50 text-center"> {/* Reduced vertical padding */}
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-4 animate-fadeIn">
                Real-Time <span className="text-emerald-600">Shipment Tracking</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto animate-fadeIn delay-100">
                Stay updated with every movement of your parcel, from pickup to delivery. 
                Enter your tracking ID below to get instant status updates.
            </p>
        </div>
    </section>
);

const HowToTrackSection = () => (
    <section className="py-12 bg-white"> {/* Reduced vertical padding */}
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-lg shadow-md bg-white border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <FaSearch className="text-green-600 text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Enter Tracking ID</h3>
                    <p className="text-gray-600">Locate your unique Tracking ID or AWB number from your shipment confirmation.</p>
                </div>
                <div className="p-6 rounded-lg shadow-md bg-white border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <FaShippingFast className="text-green-600 text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Click 'Track'</h3>
                    <p className="text-gray-600">Submit the ID using the track button to initiate the search.</p>
                </div>
                <div className="p-6 rounded-lg shadow-md bg-white border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <FaMapMarkerAlt className="text-green-600 text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Get Updates</h3>
                    <p className="text-gray-600">View real-time status, location, and estimated delivery.</p>
                </div>
            </div>
        </div>
    </section>
);

const WhyTrackWithUsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-12 bg-gray-50"> {/* Reduced vertical padding */}
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Benefits of Our Tracking System
        </h2>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10"
        >
          {whyChooseUs.slice(0, 4).map((item, index) => ( // Use first 4 items from whyChooseUs
            <div
              key={index}
              className={`bg-white border border-gray-100 shadow-sm hover:shadow-xl rounded-2xl p-6 flex flex-col items-center text-center transform transition-all duration-700 ${
                inView
                  ? `opacity-100 translate-y-0 delay-[${index * 150}ms]`
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="w-16 h-16 bg-green-50 flex items-center justify-center rounded-full mb-5 shadow-sm">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-8 h-8 md:w-10 md:h-10 object-contain"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrackingFAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        { q: "What is an AWB/Tracking ID?", a: "An AWB (Airway Bill) or Tracking ID is a unique number assigned to your shipment for identification and tracking purposes. It allows you to monitor its journey in real-time." },
        { q: "How often are tracking updates available?", a: "Tracking information is updated regularly as your shipment passes through various checkpoints. Major updates occur at pickup, transit points, and delivery." },
        { q: "What if my tracking ID doesn't work?", a: "If your tracking ID is not working, please double-check the number for any typos. If the issue persists, contact our customer support with your order details." },
        { q: "Can I track international shipments here?", a: "Yes, our system supports tracking for both domestic and international shipments. Simply enter your assigned tracking ID." },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-12 bg-gray-100"> {/* Reduced vertical padding */}
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
                    Frequently Asked Questions about Tracking
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                            <button
                                className="flex justify-between items-center w-full p-4 text-left font-semibold text-lg text-gray-700 focus:outline-none"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span>{faq.q}</span>
                                <span className="text-xl">
                                    {openIndex === index ? '-' : '+'}
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="px-4 pb-4 pt-2 text-gray-600 border-t border-gray-100">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const DomesticTracking = () => {
  return (
    <div className="font-inter">
        <TrackingPageIntro />
        <Form /> {/* The main tracking input form */}
        <HowToTrackSection />
        <WhyTrackWithUsSection />
        <TrackingFAQSection />
        {/* Optional: Add a CTA for contact support if tracking fails */}
        <section className="py-10 bg-green-600 text-white text-center"> {/* Reduced vertical padding */}
            <div className="max-w-3xl mx-auto px-4">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Need further assistance?</h3>
                <p className="text-lg mb-6">Our support team is here to help you with any tracking issues.</p>
                <Link to="/contact" className="inline-block bg-white text-green-700 hover:bg-gray-100 py-3 px-8 rounded-full font-semibold text-lg shadow-md transition duration-300">
                    Contact Support
                </Link>
            </div>
        </section>
    </div>
  )
}

export default DomesticTracking
