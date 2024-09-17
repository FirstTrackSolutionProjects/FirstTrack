import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
const API_URL = import.meta.env.VITE_APP_API_URL
const Form = () => {
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
    const handleSubmit = async (e) => {
        try{
            e.preventDefault();
        } catch (e) {}
        const data = await fetch(`${API_URL}/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(response => response.json())
        setTrackingData(data)
    }
    return (
        <>
            <div className='w-full md:pt-16 font-inter'>
                <div className='w-full p-8 flex flex-col items-center space-y-16 mb-8'>
                    <div className='text-center text-3xl font-medium'>Track your Parcel</div>
                    
        <form className="flex flex-col items-center  space-y-8" onSubmit={handleSubmit}>
            {/* <div className='flex space-x-8'>

            <div className='flex space-x-1'>
            <input type="radio" id='awb' name='isWaybill' checked value={true} onChange={handleChange} />
            <label htmlFor="awb">AWB</label>
            </div>
            <div className='flex space-x-1'>
            <input type="radio" id='order' name='isWaybill' value={false} onChange={handleChange} />
            <label htmlFor="order">Order Id</label>
            </div>
            </div> */}
            <div className='flex'>
            <input type="text" name="awb" value={formData.id} onChange={handleChange} className="border py-2 px-4 rounded-l-xl bg-blue-50" placeholder="Enter Tracking Id/AWB" />
            <button className="border py-2 px-4 rounded-r-xl bg-blue-50">Track</button>
            </div>
        </form>
                </div>
            </div>
            {trackingData && <Result data={trackingData} />}
        </>
    )
}

const Card = ({scan}) => {
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
const FlightGoCard = ({scan}) => {
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
const MovinCard = ({scan}) => {
    return (
        <>
         <div className="w-full h-16 bg-white relative items-center px-8 flex border-b space-x-4">
                <div>{scan.timestamp}</div>
                <div className="absolute right-8 cursor-pointer">{scan.package_status}</div>
            </div>
        </>
    )
}

const Result = ({data}) => {
    useEffect(() => {
        console.log(data)
    },[data])
    return (
        <>
            <div className={`w-full p-8 overflow-hidden  `}>
                    {data?.id == 1 ? data?.data.ShipmentData[0].Shipment.Scans.slice().reverse().map((scan, index)=>(
                        <Card key={index} scan={scan.ScanDetail} />
                    )) : null}
                    {data?.id == 2 ? data?.data.docket_events.map((scan, index)=>(
                        <FlightGoCard key={index} scan={scan} />
                    )): null}
                    {data?.id == 3 ? data?.data.map((scan, index)=>(
                        <MovinCard key={index} scan={scan} />
                    )): null}
            </div>
        
        </>
    )
}

const DomesticTracking = () => {
  return (
    <>
        
        <Form />
        
    </>
  )
}

export default DomesticTracking
