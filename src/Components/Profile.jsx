import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { USER_ROLES } from '@/Constants' // Import USER_ROLES
const API_URL = import.meta.env.VITE_APP_API_URL
const Profile = () => {
  const admin = jwtDecode(localStorage.getItem('token')).admin;
  const [profileData, setProfileData] = useState({
    name: '', // Maps to fullName from backend
    business_name: '', // Maps to business_name from backend
    email: '',
    phone: '',
    msme: '',
    cin: '',
    gstin: '', // Maps to gst from backend
    aadhar: '', // Maps to aadhar_number from backend
    pan: '', // Maps to pan_number from backend
    address: '',
    city: '',
    state: '',
    pin: '', // Maps to pin from backend
    bank: '',
    account_number: '', // Maps to accountNumber from backend
    ifsc: '',
    designation: '', // Only for admin
    selfie_doc: null,
    aadhar_doc: null,
    pan_doc: null,
    gst_doc: null,
    cancelledCheque: null,
  })
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [userRole, setUserRole] = useState(null) // State to store the user's role

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role); // Set the user role
    }
  }, []); // Run once on component mount to decode token

  useEffect(()=>{
      const getProfilePhoto = async () => {
          if (!profileData?.selfie_doc) {
              setProfilePhoto(null);
              return;
          }
          await fetch(`${API_URL}/s3/getUrl`, {
              method : 'POST',
              headers : {
                  'Content-Type' : 'application/json',
                  'Accept' : 'application/json',
                  'Authorization' : localStorage.getItem('token')
              },
              body : JSON.stringify({key : profileData['selfie_doc']})
          }).then((response)=>response.json()).then(result => setProfilePhoto(result.downloadURL))
          .catch(error => {
              console.error("Failed to fetch profile photo URL:", error);
              setProfilePhoto(null);
          });
      }
      getProfilePhoto()
  },[profileData.selfie_doc]) // Rerun when selfie_doc changes
  useEffect(() => {
    const getProfileData = async () => {
      if (!userRole) return; // Wait until userRole is determined

      let endpoint = '';
      let method = 'POST'; // Default method for admin/merchant

      if (userRole === USER_ROLES.ADMIN) {
        endpoint = `${API_URL}/admin/profile`;
        method = 'POST';
      } else if (userRole === USER_ROLES.MERCHANT) {
        endpoint = `${API_URL}/merchant/profile`;
        method = 'POST';
      } else if (userRole === USER_ROLES.SUBMERCHANT) {
        endpoint = `${API_URL}/submerchants/profile`;
        method = 'GET'; // Submerchant endpoint is GET
      } else {
        console.error('Unknown user role:', userRole);
        return;
      }

      try {
        const response = await fetch(endpoint, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('token'),
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const data = result.data; // Backend sends data in `result.data`

        if (data) {
          setProfileData({
            name: data.fullName || '',
            business_name: data.business_name || '', // Corrected field name from backend
            email: data.email || '',
            phone: data.phone || '',
            msme: data.msme || '',
            cin: data.cin || '',
            gstin: data.gst || '', // Backend field is 'gst'
            aadhar: data.aadhar_number || '',
            pan: data.pan_number || '', // Corrected field name from backend
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            pin: data.pin || '',
            bank: data.bank || '',
            account_number: data.accountNumber || '',
            ifsc: data.ifsc || '',
            designation: data.designation || '', // Admin specific, will be empty for others
            selfie_doc: data.selfie_doc || null,
            aadhar_doc: data.aadhar_doc || null,
            pan_doc: data.pan_doc || null,
            gst_doc: data.gst_doc || null,
            cancelledCheque: data.cancelledCheque || null,
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        // Optionally, reset profileData or show an error message
        setProfileData({
            name: '', business_name: '', email: '', phone: '', msme: '', cin: '', gstin: '',
            aadhar: '', pan: '', address: '', city: '', state: '', pin: '', bank: '',
            account_number: '', ifsc: '', designation: '', selfie_doc: null, aadhar_doc: null,
            pan_doc: null, gst_doc: null, cancelledCheque: null,
        });
      }
    };

    getProfileData();
  }, [userRole]); // Rerun when userRole changes
  // Function to handle document download - similar to MerchantManage.jsx
  const handleDownload = async (key) => {
      try {
          const response = await fetch(`${API_URL}/s3/getUrl`, {
              method : 'POST',
              headers : {
                  'Content-Type' : 'application/json',
                  'Accept' : 'application/json',
                  'Authorization' : localStorage.getItem('token')
              },
              body : JSON.stringify({key : key})
          });
          const result = await response.json();
          if (result.downloadURL) {
              const link = document.createElement('a');
              link.href = result.downloadURL;
              link.target = '_blank';
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          } else {
              console.error("No download URL received for:", key);
              // Optionally show a toast error
          }
      } catch (error) {
          console.error("Error downloading document:", error);
          // Optionally show a toast error
      }
  };

  // Helper component to render a detail row if value exists, with optional document link
  const DetailRow = ({ label, value, docKey }) => {
    // Only show if value is not empty/null or a valid document key exists AND document data is present
    if (!value && !(docKey && profileData[docKey])) return null;

    return (
      <p>
        <span className='font-medium'>{label}</span> : {value}
        {docKey && profileData[docKey] && (
            <span className="cursor-pointer text-blue-500 ml-2" onClick={() => handleDownload(profileData[docKey])}>[PDF]</span>
        )}
      </p>
    );
  };

  return (
    <div className=" w-full h-full flex flex-col items-center overflow-x-hidden">
      <div className='w-full h-full bg-white p-8 flex flex-col items-center'>
        <div className='text-center text-3xl font-medium text-black mb-8'>
          {userRole === USER_ROLES.ADMIN ? "Admin" : userRole === USER_ROLES.MERCHANT ? "Merchant" : userRole === USER_ROLES.SUBMERCHANT ? "Submerchant" : "Profile"}
        </div>
        <div className=' border-2  relative p-6 md:max-w-[500px] w-full bg-white rounded-2xl overflow-y-auto space-y-8'>
          <div className='w-full space-y-6'>
            <div className='w-full flex items-center flex-col md:flex-row justify-center space-x-8'>
              <div className='flex justify-center items-center w-32 h-32'>
                <img src={profilePhoto || '/user.webp'} alt="Profile" className="object-contain" />
              </div>
              <div className=''>
                <p className='font-medium text-xl'>{profileData.business_name || profileData.name}</p>
                {/* Display full name in parenthesis only if business name is also present */}
                {profileData.business_name && profileData.name && <p className='font-medium text-sm text-gray-600'>({profileData.name})</p>}
                <p className='font-medium text-sm text-gray-600'>{profileData.email}</p>
                <p className='font-medium text-sm text-gray-600'>{profileData.phone}</p>
                {/* Balance will come from a different endpoint typically, for now, keep coming soon */}
                <p className='font-medium text-sm text-green-400'>Balance : (Coming Soon)</p>
              </div>
            </div>
            <div className='w-full font-medium text-gray-700'>
              {(userRole === USER_ROLES.ADMIN && profileData.designation) ? <p>Designation : {profileData.designation}</p> : null}

              <div className='w-full'>
                <DetailRow label="Address" value={profileData.address} />
                <DetailRow label="GSTIN" value={profileData.gstin} docKey="gst_doc" />
                <DetailRow label="CIN" value={profileData.cin} />
                <DetailRow label="MSME/UDYOG" value={profileData.msme} />
                <DetailRow label="Aadhar Number" value={profileData.aadhar} docKey="aadhar_doc" />
                <DetailRow label="PAN Number" value={profileData.pan} docKey="pan_doc" />
                <DetailRow label="City" value={profileData.city} />
                <DetailRow label="State" value={profileData.state} />
                <DetailRow label="Pincode" value={profileData.pin} />
                <DetailRow label="Bank Name" value={profileData.bank} />
                <DetailRow label="A/C No." value={profileData.account_number} />
                <DetailRow label="IFSC" value={profileData.ifsc} />
                {profileData.cancelledCheque && <p>Cancelled Cheque : <span className="cursor-pointer text-blue-500" onClick={()=>handleDownload(profileData.cancelledCheque)}>[PDF]</span></p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
