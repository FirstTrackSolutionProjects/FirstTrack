import React, { useState, useEffect } from 'react'
import { load } from "@cashfreepayments/cashfree-js"
import { useAuth } from "../context/AuthContext"
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_APP_API_URL;

const WalletRechargeModal = ({onClose}) => {
    const [amount, setAmount] = useState(500)
    //Cashfree Integration Starts
    const [cashfree, setCashfree] = useState()
    const initializeSDK = async () => {          
        const cashfree = await load({
            mode: "production"
        });
        setCashfree(cashfree)
    };
    useEffect(() => {
        initializeSDK()
    }, [])

    useEffect(()=>{
        console.log(cashfree)
    },[cashfree])
    const getOrderId = async () => {
        const request = await fetch(`${API_URL}/wallet/cashfree/create/order`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
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
    const handleSubmit = async (e) => {
        e.preventDefault()
        const orderData = await getOrderId()
        console.log(orderData)
        if(orderData?.success){
            await doPayment(orderData?.paymentSessionId, orderData?.orderId)
        } else {
            toast.error("Failed to recharge, please try again!");
        }
    }
    //Cashfree Integration Ends
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.5)]'>
      <form className='relative mx-2 w-full sm:w-[500px] flex flex-col items-center bg-white rounded-2xl p-8 space-y-8' onSubmit={handleSubmit}>
      <div className='absolute right-6 hover:bg-blue-500 w-7 h-7 rounded-full flex items-center justify-center hover:text-white' onClick={onClose}>
          X
        </div>
        <div className='text-2xl font-medium text-center'>Wallet Recharge</div>
        
      <input
        type="number"
        value={amount}
        min={1}
        onChange={(e) => setAmount(e.target.value)}
        className='w-full border py-2 px-4 rounded-3xl'
      />
      <div className='flex w-full justify-evenly'>
      <button className='w-20 border py-2 px-4 rounded-3xl hover:bg-blue-500 hover:text-white' onClick={()=>{setAmount(500)}}>500</button>
      <button className='w-20 border py-2 px-4 rounded-3xl hover:bg-blue-500 hover:text-white' onClick={()=>{setAmount(1000)}}>1000</button>
      <button className='w-20 border py-2 px-4 rounded-3xl hover:bg-blue-500 hover:text-white' onClick={()=>{setAmount(2000)}}>2000</button>
      </div>
      <button type='submit' className='w-40 border py-2 px-4 rounded-3xl hover:text-white hover:bg-blue-500'>Recharge Wallet</button>
      </form>
    </div>
  )
}

export default WalletRechargeModal
