import React ,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import DashCard from './DashCard';
import { Admincards, Merchantcards } from '../Constants';
import { useAuth } from '../context/AuthContext.jsx';
const DashHome = () => {
  const {admin, verified, name} = useAuth()
  const navigate = useNavigate();
  const page = admin === 1 ? <div>Admin</div> : <div>Merchant</div>
  const cards = admin === 1 ? Admincards : Merchantcards

  useEffect(() => {
    
    if (!verified) {
      navigate('/login');  // Redirect to login if no user is found
    } 
  }, [verified]);

  return (
    <div className='bg-gray-200'>
      <div className='text-center '>
      <div className='flex gap-1 mt-5 text-xl justify-center'>Welcome <span className='font-semibold'>{name}</span>! </div> 
      </div>
      {/*Card*/}
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 p-5 '>
          {cards.map((card) =>(
            <DashCard key={card.id} title={card.title} count={card.count}/>
          ))}
          
        </div> 
    </div>
  )
}

export default DashHome;
