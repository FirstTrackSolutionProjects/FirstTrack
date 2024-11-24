import { useEffect , useState  } from 'react'
const API_URL = import.meta.env.VITE_APP_API_URL
const View = ({merchant, balance ,fullName, email, phone,isActive, uid  , gst, setView, businessName, cin, aadhar_number, pan_number, address, city, state, pin, accountNumber, ifsc, bank}) => {
    const [isActivated, setIsActivated] = useState(isActive)
    const activate = () => {
        fetch(`${API_URL}/merchant/activate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({uid})
        }).then(response => response.json()).then(result => alert(result.message)).then(()=>setIsActivated(true));
    }
    const deactivate = () => {
        fetch(`${API_URL}/merchant/deactivate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({uid})
        }).then(response => response.json()).then(result => alert(result.message)).then(()=>setIsActivated(false));
    }
    const [profilePhoto, setProfilePhoto] = useState(null)
    useEffect(()=>{
        const getProfilePhoto = async () => {
            await fetch(`${API_URL}/s3/getUrl`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Accept' : 'application/json',
                    'Authorization' : localStorage.getItem('token')
                },
                body : JSON.stringify({key : merchant['selfie_doc']})
            }).then((response)=>response.json()).then(result => setProfilePhoto(result.downloadURL))
        }
        getProfilePhoto()
    })
    const handleDownload = async (name) => {
        await fetch(`${API_URL}/s3/getUrl`, {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization' : localStorage.getItem('token')
        },
        body : JSON.stringify({key : merchant[name]})
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
                <div className='relative p-8 max-w-[500px] bg-white rounded-2xl overflow-hidden space-y-8'>
                <p className='absolute top-5 right-6 cursor-pointer' onClick={()=>{setView(false)}}>X</p>
                    <p className='text-2xl font-medium text-center'>Merchant Details</p>
                    <div className='w-full space-y-6'>
                        <div className='w-full flex items-center justify-center space-x-8'>
                            <div className='flex justify-center items-center w-32 h-32'>
                                <img src={`${profilePhoto?profilePhoto:"user.webp"}`}/>
                            </div>
                            <div className=''>
                                <p className='font-medium text-xl'>{businessName}</p>
                                <p className='font-medium text-sm text-gray-600'>({fullName})</p>
                                <p className='font-medium text-sm text-gray-600'>{email}</p>
                                <p className='font-medium text-sm text-gray-600'>{phone}</p>
                                <p className='font-medium text-sm text-green-400'>Balance : {balance}</p>
                            </div>
                        </div>
                        <div className='w-full font-medium text-gray-700'>
                            <p>GSTIN : {gst} <span className="cursor-pointer" onClick={()=>handleDownload('gst_doc')}>[PDF]</span></p>
                            <p>CIN : {cin}</p>
                            <p>Aadhar Number : {aadhar_number} <span className="cursor-pointer" onClick={()=>handleDownload('aadhar_doc')}>[PDF]</span></p>
                            <p>PAN Number : {pan_number} <span className="cursor-pointer" onClick={()=>handleDownload('pan_doc')}>[PDF]</span></p>
                            <p>Address : {address}</p>
                            <p>City : {city}</p>
                            <p>State : {state}</p>
                            <p>Pincode : {pin}</p>
                            <p>Bank Name : {bank}</p>
                            <p>A/C No. : {accountNumber}</p>
                            <p>IFSC : {ifsc}</p>
                            <p>Cancelled Cheque : <span className="cursor-pointer" onClick={()=>handleDownload('cancelledCheque')}>[PDF]</span></p>
                        </div>
                    </div>
                    <button onClick={isActivated?()=>deactivate():()=>activate()}  className={` ${isActivated?"bg-red-500":"bg-green-500"} text-white mx-2  py-2 px-4 rounded-3xl`}>
                        {isActivated? "Deactivate" : "Activate"}
                    </button>
                </div>
            </div>
        </>
    )
}


const Card = ({merchant}) => {
    const [view, setView] = useState(false)
    return (
        <>
            { view && <View {...merchant} merchant={merchant} setView={setView} />}
            <div className='p-4 border' onClick={()=>setView(true)}>
                <p>User Id : {merchant.uid}</p>
                <p>Name : {merchant.fullName}</p>
                <p>Business Name : {merchant.businessName}</p>
            </div>
        </>
    )
}



const MerchantManage =  () => {
    const [merchants, setMerchants] = useState([    ])
    const [email, setEmail] = useState('');
    const [filteredMerchants, setFilteredMerchants] = useState([]);
    useEffect(() => {
        const getVerifiedMerchant = async () => {
            const response = await fetch(`${API_URL}/merchant/verified`, {
                method: 'POST',
                headers: { 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const data = await response.json();
            if (data.message.length){
                setMerchants(data.message)
                setFilteredMerchants(data.message)
            }
        }
        getVerifiedMerchant();
    },[]);
    const handleEmailChange = (e) => {
        const query = e.target.value;
        setEmail(query);
    }
    useEffect(()=>{
        if (email==""){
            setFilteredMerchants(merchants)
            return;
        }
        const filtered = merchants.filter(merchant => 
            ((merchant.email).startsWith(email))
          );
      
          setFilteredMerchants(filtered);
    },[email])
  return (
    <>
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <div className='w-full p-8 flex flex-col items-center space-y-8'>
      <div className='text-center text-3xl font-medium text-black'>Verified Merchants</div>
      <div className="flex space-x-4">
      <input
        type="email"
        placeholder="Merchant Email"
        value={email}
        onChange={handleEmailChange}
      />
    </div>
      <div className='w-full bg-white p-8'>
        {filteredMerchants.length > 0 ? (
        filteredMerchants.map(((merchant,index)=>(
            <Card key={index}  merchant={merchant}/>
        )))
      ) : (
        null
      )}
      </div>
      </div>
    </div>
    </>
  )
}

export default MerchantManage
