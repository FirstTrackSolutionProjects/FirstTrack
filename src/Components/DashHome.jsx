import React ,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import DashCard from './DashCard';
import { Admincards, Merchantcards } from '../Constants/index';

const DashHome = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));
  const page = userData.isAdmin === 1 ? <div>Admin</div> : <div>Merchant</div>
  const cards = userData.isAdmin === 1 ? Admincards : Merchantcards

  useEffect(() => {
    
    if (!userData) {
      navigate('/login');  // Redirect to login if no user is found
    } else {
      setUser(userData);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear the token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Navigate to the homepage
    navigate('/');
  };

  if (!user) {
    return <div><h1>ERROR</h1></div>; // Loading or redirecting
  }


  return (
    <div className='bg-gray-200'>
      <div className='text-center '>
      <div className='flex gap-1 mt-5 justify-center'>Welcome to <span className='font-semibold'>{page}</span> Dashboard! </div> 
      <p>Your name: <span className='font-bold text-green-600'> {user.fullName} </span></p>
      </div>
      <div className="flex justify-center">
      <button onClick={handleLogout} className=' mt-5 py-2  px-4 text-center bg-green-700 text-white  rounded-full'>
        Log Out
      </button>
      </div>
      {/*Card*/}
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 p-5'>
          {cards.map((card) =>(
            <DashCard key={card.id} title={card.title} count={card.count}/>
          ))}
          
        </div> 
    </div>
  )
}

export default DashHome;
