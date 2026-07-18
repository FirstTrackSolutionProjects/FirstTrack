import { useEffect , useState  } from 'react'
const API_URL = import.meta.env.VITE_APP_API_URL

const Card = ({request}) => {
    return (
        <>
            <div className='p-4 border cursor-pointer'>
                <p>Request Id : {request.name}</p>
                <p>User Id : {request.email}</p>
                <p>Name : {request.phone}</p>
                <p>Business Name : {request.message}</p>
            </div>
        </>
    )
}

const ContactSubmissions =  () => {
    const [requests, setRequests] = useState([])
    useEffect(() => {
        const getVerificationRequests = async () => {
            const response = await fetch(`${API_URL}/contact/all`, {
                method: 'POST',
                headers: { 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const data = await response.json();
            setRequests(data.data)
        }
        getVerificationRequests();
    },[]);
  return (
    <>
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <div className='w-full p-8 flex flex-col items-center space-y-8'>
      <div className='text-center text-3xl font-medium text-black'>Contact Requests</div>
      <div className='w-full bg-white p-8'>
        {
            requests.map(((request,index)=>(
                <Card key={index}  request={request}/>
            )))
        }
      </div>
      </div>
    </div>
    </>
  )
}

export default ContactSubmissions
