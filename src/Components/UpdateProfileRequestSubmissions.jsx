import { Box, Button } from '@mui/material';
import { useEffect , useState  } from 'react'
import { toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_APP_API_URL

const View = ({request, reqId, uid ,fullName, email, phone, gst, setView, businessName, cin, aadhar_number, pan_number, address, city,  state, pin, accountNumber, ifsc, bank, gstDoc, aadharDoc, cancelledCheque, panDoc}) => {
    const [accepting, setAccepting] = useState(false)
    const [rejecting, setRejecting] = useState(false)
    const handleApprove = async () => {
        setAccepting(true)
        await fetch(`${API_URL}/update-profile-requests/approve`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : localStorage.getItem('token'),
            },
            body: JSON.stringify({req_id : reqId})
        }).then(response => response.json()).then(result => toast.success(result.message));
        setAccepting(false)
    }
    const [profilePhoto, setProfilePhoto] = useState(null)
    const handleReject = async () => {
        setRejecting(true)
        await fetch(`${API_URL}/update-profile-requests/reject`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : localStorage.getItem('token'),
            },
            body: JSON.stringify({req_id: reqId})
        }).then(response => response.json()).then(result => toast.success(result.message));
        setRejecting(false)
    }
    useEffect(()=>{
        const getProfilePhoto = async () => {
            if (!request?.selfieDoc) return;
            await fetch(`${API_URL}/s3/getUrl`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Accept' : 'application/json',
                    'Authorization' : localStorage.getItem('token')
                },
                body : JSON.stringify({key : request['selfieDoc']})
            }).then((response)=>response.json()).then(result => setProfilePhoto(result.downloadURL))
        }
        getProfilePhoto()
    },[])
    const handleDownload = async (name) => {
        await fetch(`${API_URL}/s3/getUrl`, {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization' : localStorage.getItem('token')
        },
        body : JSON.stringify({key : request[name]})
    }).then(response => response.json()).then(async result => {
        const link = document.createElement('a');
        link.href = result.downloadURL;
        link.target = '_blank'
        link.style.display = 'none'; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    })
    }
    return (
        <>
            <div className='absolute inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex justify-center items-center overflow-y-auto'>
                <div className='relative p-6 w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[30%] max-h-[95%] overflow-y-auto bg-white  space-y-8'>
                <p className='absolute top-5 right-6 cursor-pointer' onClick={()=>{setView(false)}}>X</p>
                    <div>
                    <p className='text-2xl font-medium text-center'>Updated Details</p>
                    <p className='text-center'>(Following will be updated)</p>
                    </div>
                    <div className='w-full space-y-6 px-8'>
                        {
                          request?.selfieDoc ? <div className='w-full flex items-center justify-center space-x-8'>
                          <div className='flex justify-center items-center w-32 h-32'>
                              <img src={`${profilePhoto?profilePhoto:"/user.webp"}`}/>
                          </div>
                            </div>: null
                        }
                        <div className='w-full font-medium text-gray-700 mt-6'>
                            <p>Business Name: {businessName}</p>
                            <p>Full Name: {fullName}</p>
                            {phone && <p>Phone: {phone}</p>}
                            {gst && <p>GSTIN : {gst}</p>}
                            {cin && <p>CIN : {cin}</p>}
                            {aadhar_number && <p>Aadhar Number : {aadhar_number}</p>}
                            {pan_number && <p>PAN Number : {pan_number}</p>}
                            {address && <p>Address : {address}</p>}
                            {city && <p>City : {city}</p>}
                            {state && <p>State : {state}</p>}
                            {pin && <p>Pincode : {pin}</p>}
                            {bank && <p>Bank Name : {bank}</p>}
                            {accountNumber && <p>A/C No. : {accountNumber}</p>}
                            {ifsc && <p>IFSC : {ifsc}</p>}
                            <Box className="grid grid-cols-2 grid-rows-2 my-2" gap={1}>
                                {cancelledCheque && <Button sx={{backgroundColor: '#60A5FF', color:'white'}} onClick={()=>handleDownload('cancelledCheque')}>Cancelled Cheque</Button>}
                                {gstDoc && <Button sx={{backgroundColor: '#60A5FF', color:'white'}} onClick={()=>handleDownload('gstDoc')}>GST Document</Button>}
                                {aadharDoc && <Button sx={{backgroundColor: '#60A5FF', color:'white'}} onClick={()=>handleDownload('aadharDoc')}>Aadhar Document</Button>}
                                {panDoc && <Button sx={{backgroundColor: '#60A5FF', color:'white'}} onClick={()=>handleDownload('panDoc')}>PAN Document</Button>}
                            </Box>
                        </div>
                    </div>
                    <Box className='w-full flex justify-center' gap={1}>
                    <Button onClick={handleApprove} sx={{backgroundColor:"#33AA33", color: 'white'}} className='w-32'>
                        {accepting?'Approving...':'Approve'}
                    </Button>
                    <Button onClick={handleReject} sx={{backgroundColor:"#EE3333", color: 'white'}} className='w-32'>
                        {rejecting?'Rejecting...':'Reject'}
                    </Button>
                    </Box>
                </div>
            </div>
        </>
    )
}



const Card = ({ request }) => {
  const [view, setView] = useState(false);

  return (
    <>
      {view && <View {...request} request={request} setView={setView} />}
      <div
        className="p-6 border border-gray-300 rounded-lg shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow duration-300"
        onClick={() => setView(true)}
      >
        <div className='flex w-full justify-end mb-2'>
          <p className="text-xs text-gray-500 ">{new Date(request.created_at).toLocaleDateString()}</p>
        </div>
        {/* Top Row */}
        <div className="flex items-center mb-2">
          <h3 className="text-xs font-semibold text-gray-400">{request.reqId}</h3>
        </div>
        
        {/* Requested By Section */}
        <p className="text-sm sm:text-lg md:text-xl text-gray-700">
          <span className="font-medium text-gray-900">
            {request.request_from}
          </span>{" "}
          <span className="text-gray-400">({request.uid})</span>
        </p>
      </div>
    </>
  );
};



const UpdateProfileRequestSubmissions =  () => {
    const [requests, setRequests] = useState([])
    useEffect(() => {
        const getUpdateProfileRequests = async () => {
            const response = await fetch(`${API_URL}/update-profile-requests/all`, {
                method: 'GET',
                headers: { 
                    'Accept': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const data = await response.json();
            setRequests(data.message)
        }
        getUpdateProfileRequests();
    },[]);
  return (
    <>
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <div className='w-full p-8 flex flex-col items-center space-y-8'>
      <div className='text-center text-3xl font-medium text-black'>Merchant Update Profile Requests</div>
      <div className='w-full bg-white py-8 px-4'>
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

export default UpdateProfileRequestSubmissions
