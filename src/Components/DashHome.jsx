import React ,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import DashCard from './DashCard';
import { Admincards, Merchantcards } from '../Constants';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_APP_API_URL
const DashHome = () => {
  const {admin, verified, name, businessName} = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    
    if (!verified) {
      navigate('/login');  // Redirect to login if no user is found
    } 
  }, [verified]);
  const [summary, setSummary] = useState(null)
  // Removed console.log for summary
  // useEffect(()=>{
  //   console.log(summary)
  // },[summary])

  
  useEffect(() => {
      const getStatistics = async () => {
        await fetch(`${API_URL}/dashboard/statistics`, {
          method: 'POST',
          headers: { 'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          }
        }).then(response => response.json()).then(response => {setSummary(response); /* Removed console.log(response) */});
      }
      getStatistics()
  },[])

  return (
    <div className='bg-[#f8fafc] min-h-full p-4 md:p-8'> {/* Adjusted background to match dashboard, added padding */}
      <div className='text-left mb-8'>
        <h1 className='text-3xl md:text-4xl font-extrabold text-[#1f2937]'>
          {(() => {
            const hour = new Date().getHours();
            if (hour < 12) return 'Good Morning, ☀️';
            if (hour < 18) return 'Good Afternoon, 🌤️';
            return 'Good Evening, 🌙';
          })()}
        </h1>
        <h2 className='text-2xl md:text-3xl font-bold text-[#1f2937] mt-1'>
          <span className='text-[#22c55e]'>{businessName || name}</span> 👋
        </h2>
        <p className='text-gray-500 mt-3 text-lg'>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          <span className='mx-2'>•</span>
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
        </p>
      </div>
      {/*Card Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'> {/* Enhanced grid for more columns on larger screens and increased gap */}
            {admin ? <DashCard title="Total Merchants" count={summary?summary.merchant:0} /> : null}
            <DashCard title="Total Warehouses" count={summary?summary.warehouse:0} />
            <DashCard title="Total Shipments" count={summary?summary.shipment:0} />
            <DashCard title="Total Delivered" count={summary?summary.delivered:0} />
            <DashCard title="Pending Pickups" count={summary?summary.unDelivered:0} />
            <DashCard title={admin?`Total Revenue`:`Total Wallet Recharge`} count={summary? (admin ? summary.revenue : summary.total_recharge) :0}/>
            <DashCard title="Parcel on process" count={summary?summary.inTransit:0} />
            {/* <DashCard title="Parcel Return" count="0" /> */}
            {/* <DashCard title="NDR Parcel" count="0" /> */}
          {/* {cards.map((card) =>(
            <DashCard key={card.id} title={card.title} count={card.count}/>
          ))} */}
          
        </div>
    </div>
  )
}

export default DashHome;
