import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_APP_API_URL
const LoginForm = ({authMode}) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate()
  const [reset,setReset] = useState(false);
  const [isOtp,setIsOtp] = useState(false);
  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({
    email : '',
    password : '',
   
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleLogin = async (event) => {
    event.preventDefault();  // Prevent the default form submission
    
    // Make the API call
    await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(async (result) => {
        if (result.success) {
          await fetch(`${API_URL}/emailVerified`,{
            method : 'POST',
            headers: {'Content-Type': 'application/json',
              'Accept': 'application/json'},
             body: JSON.stringify({email : formData.email})
          }).then(response => response.json()).then((data) => {
            if (data.emailVerified && result.verified){
              login(formData.email, result.token);
              navigate('/dashboard')
            }
            else if (!data.emailVerified){
              setToken(result.token);
              setIsOtp(true) 
            }
            else if (data.emailVerified && !result.verified){
              login(formData.email, result.token);
              navigate('/verify')
            }
          })
        } else {
          alert('Login failed: ' + result.message);
          // Handle login failure
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert(error.message);
      });
  };
  return (
    <>
      {reset && <ResetPassword reset={reset} setReset={setReset}/>}
      {isOtp && <OtpVerification email={formData.email} setIsOtp={setIsOtp} token={token}/>}
      <div className={` transition-all duration-500  overflow-hidden  flex items-center flex-col  ${authMode==2?"w-full h-56" : ""} ${authMode==1?"hidden" : ""} ${authMode==0?"w-0 h-0" : ""} `}>
        <div className="text-center text-3xl font-medium ">
          Welcome back, Partner
        </div>
        <form action="" onSubmit={handleLogin} className="w-full sm:w-auto flex px-3 flex-col mt-3 space-y-3 sm:space-y-3 text-black">
          <input required type="email" placeholder="E-mail" value={formData.email} onChange={handleChange} name="email" className="py-2 px-3 rounded-xl w-full sm:w-[400px]" />
          <input required type="password" placeholder="Password"name="password" value={formData.password} onChange={handleChange} className="py-2 px-3 rounded-xl  w-full sm:w-[400px]"/>
          <div>
          <p className="text-white" onClick={()=>setReset(!reset)}>Reset Your Password</p>
          <button type="submit" className="py-2 px-3 rounded-xl  w-full sm:w-[400px] border border-white text-white hover:bg-[rgba(135,206,235,0.3)]">Login</button>
          </div>
        </form>
        </div>
        </>
  )
}


const RegisterForm = ({authMode}) => {
  const [isOtp, setIsOtp] = useState(false)
  const [token, setToken] = useState(null)
  const [formData, setFormData] = useState({
    business_name : '',
    name : '',
    mobile : '',
    reg_email : '',
    reg_password : '',
    confirm_password : '',
    pin : ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();  
    if (formData.reg_password !== formData.confirm_password) {
      alert('Both Password and Confirm Password must match');
      return;
    }
    const response = await fetch(`${API_URL}/serviceCheck`, {
      method: 'POST',
      headers : {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json'
      },
      body : JSON.stringify({code : formData.pin})
    })
    const data = await response.json()

    if (!(data.data.delivery_codes.length)){
      alert('Sorry, We are not available at your location yet')
      return;
    }
    
    
    fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          setToken(result.token)
          setIsOtp(true)
          // login(formData.reg_email, result.token)
          // navigate('/verify');
        } else {
          alert('Register failed: ' + result.message)
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during register');
      });
  };
  
  return (
    <>
      {isOtp && <OtpVerification email={formData.reg_email} setIsOtp={setIsOtp} token={token}/>}
      <div className={` transition-all duration-500  overflow-hidden  flex flex-col items-center justify-center  ${authMode==1?"w-full h-[500px] " : ""} ${authMode==2?"hidden" : ""} ${authMode==0?"w-0 h-0" : ""}`}>
      <div className="text-center text-xl sm:text-3xl font-medium mb-5 ">
          Welcome to the team, Partner
        </div>
        <form action="" className="w-full sm:w-auto flex px-3 flex-col space-y-3 sm:space-y-5 text-black" onSubmit={handleSubmit}>
          <input required type="text" placeholder="Business Name" name="business_name" value={formData.business_name} onChange={handleChange} className="py-2 px-3 rounded-xl  w-full sm:w-[400px]" />
          <input required type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} name="name" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]" />
          
          <div className="w-full space-x-4 flex justify-between">
          <input required type="text" placeholder="Mobile" value={formData.mobile} onChange={handleChange} name="mobile" className="py-2 px-3 rounded-xl  w-full sm:w-[190px]" />
          <input required type="text" placeholder="Postal Code" value={formData.pin} onChange={handleChange} name="pin" className="py-2 px-3 rounded-xl  w-full sm:w-[190px]" />
          </div>
          <input required type="email" placeholder="Your E-mail Address" value={formData.reg_email} onChange={handleChange} name="reg_email" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]" />
          <input required type="password" name="reg_password" placeholder="Password" value={formData.reg_password} onChange={handleChange} className="py-2 px-3 rounded-xl  w-full sm:w-[400px]"/>
          <input required type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="Confirm Password" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]"/>

          <button type="submit" className="py-2 px-3 rounded-xl  w-full sm:w-[400px] border border-white text-white hover:bg-[rgba(135,206,235,0.3)]">Register</button>
        </form>
        </div>
    </>
  )
}

const OtpVerification = ({email, setIsOtp, token}) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email : email,
    otp : ''
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/verifyEmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify(formData),
  }).then(response => response.json()).then(result => {
    if (result.success) {
      setIsOtp(false)
      login(email, token)
      navigate('/verify')
    }
    else {
      alert(result.message)
    }
  })
  }
  const handleOtp = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/sendVerifyEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({email : formData.email}),
    }).then(response => response.json()).then(result => alert(result.message))
}
  return (
    <>
      <div className={`absolute inset-0 flex items-center justify-center bg-white`}>
        <div className="top-3 right-3 absolute z-50 text-black" onClick={()=>setIsOtp(false)}>X</div>
      <form action="" onSubmit={handleSubmit} className="w-full sm:w-auto flex px-3 flex-col mt-3 space-y-3 sm:space-y-5 text-black">
        <input type="email" placeholder="Email Address" value={formData.email} readOnly name="email" className="py-2 px-3 border-black rounded-xl flex-1 sm:w-[400px]" />
        <div className='flex flex-1 space-x-2'>
        <input type="text" placeholder="OTP" name="otp" value={formData.otp} onChange={handleChange} className="py-2 px-3 rounded-xl border-black w-[180px] sm:w-[284px]"/>
            <button onClick={handleOtp} className="py-2 px-1 rounded-xl text-sm  w-[100px] border border-black  hover:bg-[rgba(135,206,235,1)]">Request OTP</button>
          </div>
          <button type="submit" className="py-2 px-3 rounded-xl  w-full sm:w-[400px] border border-black  hover:bg-[rgba(135,206,235,1)]">Verify Email</button>
        </form>
      </div>
    </>
  )
}

const Login = ({authMode, setAuthMode}) => {
  const [isOtp, setIsOtp] = useState(false);
  return (
    <div className={`absolute  flex  z-20 ${authMode?"w-full delay-0":"w-0 delay-500"} justify-center  items-center transition-all duration-1000`}>
      <div className={` shadow-cabCard shadow-[hsl(197,71%,73%)] relative pt-5 pb-5 flex flex-col items-center transition-all duration-500 w-[400px] sm:w-[600px] md:w-[760px]  overflow-hidden  lg:w-[700px] rounded-xl bg-[rgba(135,206,235,0.3)]  ${authMode?"":"w-0"} `}>
      <p className='absolute top-4 right-6 z-50 cursor-pointer text-white' onClick={()=>setAuthMode(0)}>X</p>
        <img src="logo.webp" alt="" className="w-auto" />
          <RegisterForm authMode={authMode} setIsOtp={setIsOtp}/>
          <LoginForm authMode={authMode} setIsOtp={setIsOtp} />
        
      </div>
    </div>
  )
}

export default Login
