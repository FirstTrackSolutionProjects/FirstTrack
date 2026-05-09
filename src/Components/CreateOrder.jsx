import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import WarehouseSelect from './UiComponents/WarehouseSelect';
const API_URL = import.meta.env.VITE_APP_API_URL

const getTodaysDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0'); // Hours in 24-hour format
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

const getPickupTime = (string) => {
  const currentTime = getCurrentTime();
  //Increment by 1 hour
  let hour = parseInt(currentTime.split(':')[0]) + 1;
  let minute = currentTime.split(':')[1];
  if (hour >= 24) {
    hour = hour - 24;
  }
  hour = String(hour).padStart(2, '0');
  return `${hour}:${minute}`;
}

const schema = z.object({
  wid: z.string().min(1, "Pickup Warehouse Name is required"),
  // order: z.string().min(1, "Order ID is required"),
  // date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Invalid date format (DD/MM/YYYY)"),
  payMode: z.enum(['COD', 'Pre-paid', 'topay']),
  name: z.string().min(1, "Buyer's name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
  address: z.string().min(1, "Shipping address is required"),
  addressType: z.enum(['home', 'office']),
  postcode: z.string().regex(/^\d{6}$/, "Invalid postcode"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  same: z.boolean(),
  Baddress: z.string().optional(),
  BaddressType: z.enum(['home', 'office']).optional(),
  Bpostcode: z.string().optional(),
  Bcity: z.string().optional(),
  Bstate: z.string().optional(),
  Bcountry: z.string().optional(),
  orders: z.array(
    z.object({
      box_no: z.preprocess(
        (a) => parseInt(a, 10),
        z.number().min(1, "Box no. must be at least 1")),
      product_name: z.string().min(1, "Product name is required"),
      product_quantity: z.preprocess(
        (a) => parseInt(a, 10),
        z.number().min(1, "Quantity must be at least 1")),
      selling_price: z.preprocess(
        (a) => parseInt(a, 10),
        z.number().min(0, "Price must be a non-negative number")),
      tax_in_percentage: z.preprocess(
        (a) => parseInt(a, 10),
        z.number().min(0, "Tax must be a positive number")),
    })
  ),
  boxes: z.array(
    z.object({
      box_no: z.preprocess(
        (a) => parseInt(a, 10),
        z.number().min(1, "Box no. must be at least 1")),
      length: z.preprocess(
        (a) => parseInt(a, 10),
        z.number().min(1, "Length must be at greater than 0")),
      breadth: z.preprocess(
        (a) => parseInt(a, 10),
        z.number().min(1, "Breadth must be at greater than 0")),
      height: z.preprocess(
        (a) => parseInt(a, 10),
        z.number().min(1, "Height must be at greater than 0")),
      weight: z.preprocess(
        (a) => parseInt(a, 10),
        z.number().min(1, "Weight must be at greater than 0")),
        weight_unit: z.enum(['g','kg']),
      quantity: z.preprocess(
        (a) => parseInt(a, 10),
        z.number().min(1, "Quantity must be at least 1")
      )
    })
  ),
  discount: z.preprocess(
    (a) => parseInt(a, 10),
    z.number().min(0, "Must be a non-negative number")),
  cod: z.preprocess(
    (a) => parseInt(a, 10),
    z.number().min(0, "COD must be a positive number")),
  shippingType: z.enum(['Surface', 'Express']),
  gst: z.string(),
  Cgst: z.string().optional(),
  pickupDate: z.string(),
  pickupTime: z.preprocess((a) => a + ':00', z.string()),
  shipmentValue: z.preprocess(
    (a) => parseFloat(a),
    z.number().min(1, "Shipment value must be greater than 0")
  ),
  insurance: z.boolean().optional(),
  ewaybill: z.string().optional(),
  invoiceNumber: z.string().optional(),
  invoiceDate: z.string().optional(),
  invoiceAmount: z.preprocess(
    (a) => parseInt(a, 10),
    z.number().min(1, "Invoice Amount must be a positive number")),
  invoiceUrl: z.string().optional(),
  isB2B: z.boolean(),
  customer_reference_number: z.string().max(15, "Customer Reference Number cannot exceed 15 characters")
}).refine((data) => !data.isB2B || (data.isB2B && !!data.invoiceUrl), {
  message: "Invoice is required for B2B shipments",
  path: ["invoiceUrl"],
}).refine((data) => (data.shipmentValue < 50000) || (data.ewaybill && data.ewaybill.length > 0), {
  message: "Ewaybill is required for invoice amount of at least 50000",
  path: ["ewaybill"], // Error path
});
const FullDetails = () => {
  const { register, control, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      pickupDate: getTodaysDate(),
      pickupTime: getPickupTime(),
      payMode: 'Pre-paid',
      postcode: '',
      Bpostcode: '',
      same: true,
      shipmentValue: 0,
      insurance: false,
      discount: 0,
      cod: 0,
      addressType: "home",
      BaddressType: "home",
      shippingType: "Surface",
      country: "India",
      Bcountry: "India",
      orders: [{ box_no: '1', product_name: '', product_quantity: 0, selling_price: 0, tax_in_percentage: 0 }],
      boxes: [{ box_no: 1, length: 0, breadth: 0, height: 0, weight: 0, weight_unit: 'kg', quantity: 1 }],
      invoiceAmount: 1,
      isB2B: false,
      invoiceUrl: '',
      gst: ''
    }
  });
  useEffect(() => {
    console.log(errors)
  }, [errors])
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'orders'
  });
  const boxes = useFieldArray({
    control,
    name: 'boxes'
  });
  useEffect(() => {

    const pinToAdd = async () => {
      try {
        await fetch(`https://api.postalpincode.in/pincode/${watch('postcode')}`)
          .then(response => response.json())
          .then(result => {
            const city = result[0].PostOffice[0].District
            const state = result[0].PostOffice[0].State
            setValue('city', city)
            setValue('state', state)
          })
      } catch (e) {
        setValue('city', '')
        setValue('state', '')
      }
    }
    if (watch('postcode').length == 6) pinToAdd()
  }, [watch('postcode')])
  useEffect(() => {
    const pinToAdd = async () => {
      try {
        await fetch(`https://api.postalpincode.in/pincode/${watch('Bpostcode')}`)
          .then(response => response.json())
          .then(result => {
            const city = result[0].PostOffice[0].District
            const state = result[0].PostOffice[0].State
            setValue('Bcity', city)
            setValue('Bstate', state)
          })
      } catch (e) {
        setValue('Bcity', '')
        setValue('Bstate', '')
      }
    }
    if (watch('Bpostcode').length == 6) pinToAdd()
  }, [watch('Bpostcode')])

  const onSubmit = async (data) => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const istDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
        
    // Combine shipment pickup date and time into a single Date object
    const pickupDateAndTime = new Date(`${data.pickupDate}T${data.pickupTime}`);
        
    // Compare pickup time with the current IST time
    if (pickupDateAndTime < istDate) {
        alert('Pickup time is already passed. Please update and try again');
        return;
    }
    let boxFlag = 0
    for (let i = 0; i < data.boxes.length; i++) {
      for (let j = 0; j < data.orders.length; j++) {
        if (parseInt(data.orders[j].box_no) == i + 1) {
          boxFlag = 1
        }
      }
      if (boxFlag == 0) {
        alert('Please make sure every box has some items')
        return
      }
      boxFlag = 0
    }

    let itemFlag = 0
    for (let i = 0; i < data.orders.length; i++) {
      for (let j = 0; j < data.boxes.length; j++) {
        if (data.orders[i].box_no == data.boxes[j].box_no) {
          itemFlag = 1
        }
      }
      if (itemFlag == 0) {
        alert('Some items have invalid box no.')
        return
      }
      itemFlag = 0
    }
    try {
      const response = await fetch(`${API_URL}/order/domestic/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        alert('Order created successfully');
      } else {
        alert('Order failed: ' + result.message);
        console.log(result.orders);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during Order');
    }
  };
  const [invoice, setInvoice] = useState(null);
  const handleInvoice = (e) => {
    const { files } = e.target;
    setInvoice(files[0]);
  };

  const handleInvoiceUpload = async () => {
    if (!invoice) {
      return;
    }
    const invoiceUuid = uuidv4();
    const key = `invoice/${invoiceUuid}`;
    const filetype = invoice.type;


    const putUrlReq = await fetch(`${API_URL}/s3/putUrl`, {
      method: "POST",
      headers: {
        'Authorization': localStorage.getItem("token"),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ filename: key, filetype: filetype, isPublic: true }),
    }).catch(err => { console.error(err); alert("err"); return });
    const putUrlRes = await putUrlReq.json();

    const uploadURL = putUrlRes.uploadURL;
    await fetch(uploadURL, {
      method: "PUT",
      headers: {
        'Content-Type': filetype
      },
      body: invoice,
    }).then(response => {
      if (response.status == 200) {
        setValue("invoiceUrl", key);
        alert("Invoice uploaded successfully!");
      } else {
        setValue("invoiceUrl", null)
        alert("Failed to upload invoice!");
      }
    })



  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10">Enter Shipping Details</div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Warehouse Selection Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-blue-600">Pickup Warehouse</h2>
          <div className="w-full">
            <WarehouseSelect
              onChange={(wid)=>setValue("wid", wid)}
              value={watch("wid")}
            />
            {errors.wid && <span className='text-red-500 text-sm mt-1 block'>{errors.wid.message}</span>}
          </div>
        </div>

        {/* Pickup & Payment Details Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-blue-600">Pickup & Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="pickupDate">Pickup Date</label>
              <input required
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="date"
                min={getTodaysDate()}
                id="pickupDate"
                {...register("pickupDate")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="pickupTime">Pickup Time</label>
              <input required
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="time"
                id="pickupTime"
                {...register("pickupTime")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="payMode">Payment Method</label>
              <select
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                id="payMode"
                {...register("payMode")}
              >
                <option value="COD">COD</option>
                <option value="Pre-paid">Prepaid</option>
                <option value="topay">To Pay</option>
              </select>
              {errors.payMode && <span className='text-red-500 text-sm'>{errors.payMode.message}</span>}
            </div>
          </div>
        </div>

        {/* Buyer Information Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-blue-600">Buyer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="name">Buyer's Name</label>
              <input
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="text"
                id="name"
                {...register("name")}
                placeholder="Ex. John Doe"
              />
              {errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
              <input
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="email"
                id="email"
                {...register("email")}
                placeholder="Ex. john@example.com"
              />
              {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="phone">Phone Number</label>
              <input
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="text"
                id="phone"
                {...register("phone")}
                placeholder="Ex. 9876543210"
              />
              {errors.phone && <span className='text-red-500 text-sm'>{errors.phone.message}</span>}
            </div>
          </div>
        </div>

        {/* Shipping Address Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-blue-600">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="address">Address Line</label>
              <input
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="text"
                maxLength={100}
                id="address"
                {...register("address")}
                placeholder="Ex. 123 Street, Landmark"
              />
              {errors.address && <span className='text-red-500 text-sm'>{errors.address.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="addressType">Address Type</label>
              <select
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                id="addressType"
                {...register("addressType")}
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="postcode">Pincode</label>
              <input
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="text"
                id="postcode"
                {...register("postcode")}
                placeholder="Ex. 123456"
              />
              {errors.postcode && <span className='text-red-500 text-sm'>{errors.postcode.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="city">City</label>
              <input
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="text"
                id="city"
                {...register("city")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="state">State</label>
              <input
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="text"
                id="state"
                {...register("state")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="country">Country</label>
              <input
                className="w-full border border-gray-300 py-2 px-4 rounded-lg bg-gray-50"
                type="text"
                id="country"
                readOnly
                {...register("country")}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <input
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              type="checkbox"
              id="same"
              {...register("same")}
            />
            <label className="text-sm font-medium text-gray-700 cursor-pointer" htmlFor="same">Billing Address same as Shipping Address</label>
          </div>
        </div>

        {/* Billing Address Card (Conditional) */}
        {!watch("same") && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-blue-600">Billing Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="Baddress">Billing Address</label>
                <input
                  className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  type="text"
                  id="Baddress"
                  {...register("Baddress")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="BaddressType">Billing Address Type</label>
                <select
                  className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  id="BaddressType"
                  {...register("BaddressType")}
                >
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="Bpostcode">Billing Pincode</label>
                <input
                  className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  type="text"
                  id="Bpostcode"
                  {...register("Bpostcode")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="Bcity">Billing City</label>
                <input
                  className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  type="text"
                  id="Bcity"
                  {...register("Bcity")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="Bstate">Billing State</label>
                <input
                  className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  type="text"
                  id="Bstate"
                  {...register("Bstate")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="Bcountry">Billing Country</label>
                <input
                  className="w-full border border-gray-300 py-2 px-4 rounded-lg bg-gray-50"
                  type="text"
                  id="Bcountry"
                  readOnly
                  {...register("Bcountry")}
                />
              </div>
            </div>
          </div>
        )}

        {/* Packages Details Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-xl font-semibold text-blue-600">Package Details (Boxes)</h2>
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
              onClick={() => boxes.append({ box_no: watch('boxes').length + 1, length: 0, breadth: 0, height: 0, weight: 0, weight_unit: 'kg', quantity: 1 })}
            >
              + Add Box
            </button>
          </div>
          
          <div className="space-y-6">
            {boxes.fields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Box No.</label>
                    <input 
                      className="w-full bg-gray-100 border-none py-2 px-3 rounded text-gray-700 font-bold" 
                      type="text" 
                      value={index + 1} 
                      {...register(`boxes[${index}].box_no`)}
                      readOnly 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">L (cm)</label>
                    <input className="w-full border border-gray-300 py-2 px-3 rounded focus:ring-2 focus:ring-blue-500" type="number" {...register(`boxes[${index}].length`)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">W (cm)</label>
                    <input className="w-full border border-gray-300 py-2 px-3 rounded focus:ring-2 focus:ring-blue-500" type="number" {...register(`boxes[${index}].breadth`)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">H (cm)</label>
                    <input className="w-full border border-gray-300 py-2 px-3 rounded focus:ring-2 focus:ring-blue-500" type="number" {...register(`boxes[${index}].height`)} />
                  </div>
                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Weight</label>
                    <div className="flex gap-1">
                      <input className="w-2/3 border border-gray-300 py-2 px-2 rounded focus:ring-2 focus:ring-blue-500" type="number" {...register(`boxes[${index}].weight`)} />
                      <select className="w-1/3 border border-gray-300 py-2 px-1 rounded text-xs" {...register(`boxes[${index}].weight_unit`)}>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                      </select>
                    </div>
                  </div>
                </div>
                {watch('boxes').length > 1 && (
                  <button type="button" className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 md:opacity-0 md:group-hover:opacity-100 transition shadow-sm border border-red-200" onClick={() => boxes.remove(index)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Items/Orders Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-xl font-semibold text-blue-600">Product Details</h2>
            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
              onClick={() => append({ box_no: 1, product_name: '', product_quantity: 0, selling_price: 0, tax_in_percentage: 0 })}
            >
              + Add Product
            </button>
          </div>
          
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-xl border border-gray-100 group relative">
                <div className="md:col-span-1">
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Box</label>
                  <input className="w-full border border-gray-300 py-2 px-3 rounded" type="number" {...register(`orders[${index}].box_no`)} />
                </div>
                <div className="md:col-span-4">
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Product Name</label>
                  <input className="w-full border border-gray-300 py-2 px-3 rounded" type="text" {...register(`orders[${index}].product_name`)} placeholder="Item name" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Qty</label>
                  <input className="w-full border border-gray-300 py-2 px-3 rounded" type="number" {...register(`orders[${index}].product_quantity`)} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Price</label>
                  <input className="w-full border border-gray-300 py-2 px-3 rounded" type="number" {...register(`orders[${index}].selling_price`)} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Tax (%)</label>
                  <input className="w-full border border-gray-300 py-2 px-3 rounded" type="number" {...register(`orders[${index}].tax_in_percentage`)} />
                </div>
                <div className="md:col-span-1 text-center">
                  {fields.length > 1 && (
                    <button type="button" className="text-red-500 hover:text-red-700 transition p-2" onClick={() => remove(index)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Shipment Info & Shipping Type Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-blue-600">Shipment Additional Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="shippingType">Shipping Type</label>
              <select className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" id="shippingType" {...register("shippingType")}>
                <option value="Surface">Surface</option>
                <option value="Express">Express</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="shipmentValue">Shipment Value</label>
              <input className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500" type="number" id="shipmentValue" {...register("shipmentValue")} />
              {errors.shipmentValue && <span className='text-red-500 text-sm'>{errors.shipmentValue.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="ewaybill">E-Waybill (If applicable)</label>
              <input className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500" type="text" id="ewaybill" {...register("ewaybill")} />
              {errors.ewaybill && <span className='text-red-500 text-sm'>{errors.ewaybill.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="discount">Discount</label>
              <input className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500" type="number" id="discount" {...register("discount")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="cod">COD Amount</label>
              <input className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500" type="number" min={watch("payMode") == "Pre-paid" ? 0 : 1} id="cod" {...register("cod")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="customer_reference_number">Customer Ref No.</label>
              <input className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500" type="text" id="customer_reference_number" {...register("customer_reference_number")} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-6 items-center">
            <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg flex-1 min-w-[250px]">
              <input className="w-5 h-5 text-orange-600 rounded border-gray-300" type="checkbox" id="insurance" {...register("insurance")} />
              <label className="text-sm font-medium text-gray-700 cursor-pointer" htmlFor="insurance">Add Insurance for this shipment</label>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg flex-1 min-w-[250px]">
              <input className="w-5 h-5 text-purple-600 rounded border-gray-300" type="checkbox" id="isB2B" {...register("isB2B")} />
              <label className="text-sm font-medium text-gray-700 cursor-pointer" htmlFor="isB2B">This is a B2B Shipment</label>
            </div>
          </div>
        </div>

        {/* Tax Details Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-blue-600">Tax & B2B Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="gst">Seller GSTIN</label>
              <input className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500" type="text" id="gst" {...register("gst")} />
              {errors.gst && <span className='text-red-500 text-sm'>{errors.gst.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="Cgst">Customer GSTIN (For B2B)</label>
              <input className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500" type="text" id="Cgst" {...register("Cgst")} />
            </div>
            
            {watch("isB2B") && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="invoiceNumber">Invoice Number</label>
                    <input className="w-full border border-gray-300 py-2 px-4 rounded-lg" type="text" {...register("invoiceNumber")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="invoiceDate">Invoice Date</label>
                    <input className="w-full border border-gray-300 py-2 px-4 rounded-lg" type="date" {...register("invoiceDate")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="invoiceAmount">Invoice Amount</label>
                    <input className="w-full border border-gray-300 py-2 px-4 rounded-lg" type="number" {...register("invoiceAmount")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="invoiceFile">Upload Invoice Copy</label>
                    <div className="flex gap-2">
                      <input className="flex-1 border border-gray-300 py-1.5 px-3 rounded-lg text-sm" type="file" onChange={handleInvoice} />
                      <button type='button' className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition" onClick={handleInvoiceUpload}>Upload</button>
                    </div>
                    {errors.invoiceUrl && <span className='text-red-500 text-xs block'>{errors.invoiceUrl.message}</span>}
                  </div>
                </>
              )}
          </div>
        </div>

        <div className="w-full flex justify-center pt-6 pb-12">
          <button
            className="w-full md:w-64 bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1 active:scale-95"
            type="submit"
          >
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
};

const CreateOrder = () => {
  const [step, setStep] = useState(0)
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      {/* {step==0 && <InitialDetails setStep={setStep} />} */}
      <FullDetails />
    </div>
  );
};

export default CreateOrder;
