import React ,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import DashCard from './DashCard';
import { Admincards, Merchantcards } from '../Constants';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_APP_API_URL
const DashHome = () => {
  const {admin, verified, name} = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    
    if (!verified) {
      navigate('/login');  // Redirect to login if no user is found
    } 
  }, [verified]);
  const [summary, setSummary] = useState(null)
  useEffect(()=>{
    console.log(summary)
  },[summary])

  
  useEffect(() => {
      const getStatistics = async () => {
        await fetch(`${API_URL}/dashboard/statistics`, {
          method: 'POST',
          headers: { 'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          }
        }).then(response => response.json()).then(response => {setSummary(response); console.log(response)});
      }
      getStatistics()
  },[])

  return (
    <div className='bg-gray-200'>
      <div className='text-center '>
      <div className='flex gap-1 mt-5 text-xl justify-center'>Welcome <span className='font-semibold'>{name}</span>! </div> 
      </div>
      {/*Card*/}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-8 p-5 '>
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
