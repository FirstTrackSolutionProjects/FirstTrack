import React, { useState, useEffect } from 'react'
import { load } from "@cashfreepayments/cashfree-js"
import { useAuth } from "../context/AuthContext"
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_APP_API_URL;

const WalletRechargeModal = ({onClose}) => {
    const [amount, setAmount] = useState(500)
    //Cashfree Integration Starts
    const [cashfree, setCashfree] = useState()
    const [paymentId, setPaymentId] = useState('')
    const { business_name, email, phone } = useAuth();
    const [loading, setLoading] = useState(false)
    const initializeSDK = async () => {          
        const cashfree = await load({
            mode: "production"
        });
        setCashfree(cashfree)
    };
    useEffect(() => {
        initializeSDK()
    }, [])

    const getOrderId = async () => {
        const request = await fetch(`${API_URL}/wallet/cashfree/create/order`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                orderAmount : amount
            })
        })

        if (request.ok){
            const response = await request.json()
            console.log(response)
            return {success : true, paymentSessionId : response.data.payment_session_id, orderId : response.data.order_id}
        }
        return {success : false}
    }

    const checkPaymentStatus = async (orderId) => {
        const request = await fetch(`${API_URL}/wallet/cashfree/check/payment`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                orderId : orderId
            })
        })
        if (request.ok){
            const response = await request.json()
            console.log(response)
            if (response.success){
                toast.success("Recharge successful!");
            } else {
                toast.error("Failed to recharge");
            }
        }
    }
    const doPayment = async (paymentSessionId, orderId) => {
        let checkoutOptions = {
            paymentSessionId: paymentSessionId,
            redirectTarget: "_modal",
        };
        cashfree.checkout(checkoutOptions).then((result) => {
            if(result.error){
                // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
                toast.error("Failed to recharge");
                console.log(result.error);
            }
            if(result.redirect){
                // This will be true when the payment redirection page couldnt be opened in the same window
                // This is an exceptional case only when the page is opened inside an inAppBrowser
                // In this case the customer will be redirected to return url once payment is completed
                console.log("Payment will be redirected");
            }
            if(result.paymentDetails){
                // This will be called whenever the payment is completed irrespective of transaction status
                checkPaymentStatus(orderId)
                console.log("Payment has been completed, Check for Payment Status");
                console.log(result.paymentDetails.paymentMessage);
            }
        });
    };
    const handleCashfreeRecharge = async (e) => {
        e.preventDefault()
        try{
            setLoading(true)
            const orderData = await getOrderId()
            console.log(orderData)
            if(orderData?.success){
                await doPayment(orderData?.paymentSessionId, orderData?.orderId)
            } else {
                toast.error("Failed to recharge, please try again!");
            }
        } catch (error) {
            toast.error(error.message || "Recharge Failed! If payment is deducted from your account, please contact support team.")
        } finally {
            setLoading(false)
        }
    }
    //Cashfree Integration Ends

    //Razorpay Integration Starts
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
    const handleRazorpayRecharge = async (e) => {
      e.preventDefault()
      try{
        const response = await fetch(`${API_URL}/wallet/razorpay/CreateOrderId`, {
          method: 'POST',
          body: JSON.stringify({ amount }),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('token')
          },
        });
        const data = await response.json();

        const res = await loadRazorpayScript();
      
        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          return;
        }
      

        const options = {
          key: import.meta.env.VITE_APP_RAZORPAY_API_ID, // Replace with your Razorpay key ID
          amount: amount*100, // Amount is in paise (50000 paise = INR 500)
          currency: 'INR',
          name: 'First Track',
          description: 'Wallet Recharge',
          image: 'images/logo3.jpg',
          order_id: data.id,
          handler: async function (response) {
            const verifyResponse = await fetch(`${API_URL}/wallet/verify/recharge`, {
              method: 'POST',
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('token')
              },
            });
            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              toast.success("Recharge successful!");
              setPaymentId(response.razorpay_payment_id);
            } else {
              toast.error(verifyData.error);
            }
          },
          prefill: {
            name: business_name,
            email: email,
            contact: phone,
          },
          notes: {
            address: 'First Track',
          },
          theme: {
            color: '#3399cc',
          },
        };
      
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.error(error)
        toast.error(error.message || "Recharge Failed! If payment is deducted from your account, please contact support team.")
      } finally {
        setLoading(false)
      }
    };
    //Razorpay Integration Ends
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.5)]'>
      <form className='relative mx-2 w-full sm:w-[500px] flex flex-col items-center bg-white rounded-2xl p-8 space-y-8'>
      <div className='absolute right-6 hover:bg-blue-500 w-7 h-7 rounded-full flex items-center justify-center hover:text-white' onClick={onClose}>
          X
        </div>
        <div className='text-2xl font-medium text-center'>Wallet Recharge</div>
        
      <input
        type="number"
        value={amount}
        min={100}
        onChange={(e) => setAmount(e.target.value)}
        className='w-full border py-2 px-4 rounded-3xl'
      />
      <div className='flex w-full justify-evenly'>
      <button type='button' className='w-20 border py-2 px-4 rounded-3xl hover:bg-blue-500 hover:text-white' onClick={()=>{setAmount((prev) => prev+500)}}>+500</button>
      <button type='button' className='w-20 border py-2 px-4 rounded-3xl hover:bg-blue-500 hover:text-white' onClick={()=>{setAmount((prev) => prev+1000)}}>+1000</button>
      <button type='button' className='w-20 border py-2 px-4 rounded-3xl hover:bg-blue-500 hover:text-white' onClick={()=>{setAmount((prev) => prev+2000)}}>+2000</button>
      </div>
      <div className='flex w-full justify-evenly'>
      <div className='flex justify-center flex-col'>
        <button onClick={handleRazorpayRecharge} disabled={loading}><img referrerpolicy="origin" src="https://badges.razorpay.com/badge-light.png " style = {{ height: "45px" , width: "113px", cursor: "pointer" }} alt = "Razorpay | Payment Gateway | Neobank" /></button>
        <div className='text-[10px]'>Active</div>
      </div>
      <div className='block sm:hidden'>
        <button onClick={handleCashfreeRecharge} disabled={loading}><img referrerpolicy="origin" src="https://mma.prnewswire.com/media/1714361/Cashfree_Payments_Logo.jpg?w=200" style = {{ height: "45px" , width: "113px", border: "2px solid #bbb", cursor: "pointer" }} alt = "Cashfree | Payment Gateway" /></button>
        <div className='text-[10px]'>UPI working on mobile device only</div>
      </div>
      </div>
      </form>
    </div>
  )
}

export default WalletRechargeModal
