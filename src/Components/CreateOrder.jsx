import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import WarehouseSelect from './UiComponents/WarehouseSelect';
import { toast } from 'react-toastify';
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
  wid: z.string({
    error: (issue) => {
      if (issue.input === undefined){
        return "Pickup Warehouse Name is required"
      }
      if (issue.code === "invalid_type"){
        return "Invalid Warehouse"
      }
    }
  }).min(1, "Pickup Warehouse Name is required"),
  // order: z.string().min(1, "Order ID is required"),
  // date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Invalid date format (DD/MM/YYYY)"),
  payMode: z.enum(['COD', 'Pre-paid', 'topay']),
  name: z.string().min(1, "Buyer's name is required"),
  email: z.string().email("Invalid email address").or(z.literal("")),
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
      box_no: z.coerce.number().min(1, "Box no. must be at least 1"),
      product_name: z.string().min(1, "Product name is required"),
      product_quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      selling_price: z.coerce.number().min(1, "Price must be atleast 1"),
      tax_in_percentage: z.coerce.number().min(0, "Tax must be a positive number"),
    })
  ),
  boxes: z.array(
    z.object({
      box_no: z.coerce.number().min(1, "Box no. must be at least 1"),
      length: z.coerce.number().min(1, "Length must be at greater than 0"),
      breadth: z.coerce.number().min(1, "Breadth must be at greater than 0"),
      height: z.coerce.number().min(1, "Height must be at greater than 0"),
      weight: z.coerce.number("Weight should be a number"),
      weight_unit: z.enum(['g','kg']),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1")
    })
  ),
  discount: z.coerce.number().min(0, "Must be a non-negative number"),
  cod: z.coerce.number().min(0, "COD must be a positive number"),
  shippingType: z.enum(['Surface', 'Express']),
  gst: z.string(),
  Cgst: z.string().optional(),
  pickupDate: z.string(),
  pickupTime: z.preprocess((a) => a + ':00', z.string()),
  shipmentValue: z.coerce.number().min(1, "Shipment value must be greater than 0"),
  insurance: z.boolean().optional(),
  ewaybill: z.string({
    error: (issue) => {
      if (issue.input === undefined){
        return "E-Waybill is required"
      }
      if (issue.code === "invalid_type"){
        return "Invalid E-Waybill"
      }
    }
  })
  .trim()
  .regex(/^\d{12}$/, "Invalid E-Waybill number")
  .or(z.literal("")),
  invoiceNumber: z.string().optional(),
  invoiceDate: z.string().optional(),
  invoiceAmount: z.coerce.number().min(1, "Invoice Amount must be a positive number"),
  invoiceUrl: z.string().optional(),
  isB2B: z.boolean(),
  customer_reference_number: z.string().max(15, "Customer Reference Number cannot exceed 15 characters")
}).refine((data) => !data.isB2B || (data.isB2B && !!data.invoiceUrl), {
  message: "Invoice is required for B2B shipments",
  path: ["invoiceUrl"],
}).refine((data) => ((data.shipmentValue < 50000) || Boolean(data.ewaybill?.trim())), {
  message: "Ewaybill is required for shipment value of at least 50000",
  path: ["ewaybill"],
}).refine((data) => !(data.payMode === 'COD' && (!data.cod || data.cod <= 0)), {
  message: "COD amount must be greater than 0 for COD orders",
  path: ["cod"],
}).refine((data) => !(data.payMode === 'Pre-paid' && data.cod > 0), {
  message: "COD amount must be 0 for Prepaid orders",
  path: ["cod"],
}).superRefine((data, ctx) => {
  const boxes = data.boxes;
  boxes.forEach((box, index) => {
    const weight_unit = box.weight_unit;
    if (weight_unit === "g") {
      if (box.weight < 50) {
        ctx.addIssue({
          code: "custom",
          message: "Weight must be greater than 50g",
          path: ["boxes", index, "weight"],
        });
      }
    } else if (weight_unit === "kg") {
      if (box.weight < 0.05) {
        ctx.addIssue({
          code: "custom",
          message: "Weight must be greater than 50g",
          path: ["boxes", index, "weight"],
        });
      }
    }
  });
});
const FullDetails = () => {
  const navigate = useNavigate();
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
      orders: [{ box_no: '1', product_name: '', product_quantity: 1, selling_price: 0, tax_in_percentage: 0 }],
      boxes: [{ box_no: 1, length: 10, breadth: 10, height: 10, weight: 1, weight_unit: 'kg', quantity: 1 }],
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
  const watchedOrders = useWatch({ control, name: 'orders' });
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

  // Auto-calculate shipment value from items price × quantity
  useEffect(() => {
    if (!watchedOrders || watchedOrders.length === 0) return;
    const total = watchedOrders.reduce((sum, item) => {
      const price = parseFloat(item.selling_price) || 0;
      const qty = parseInt(item.product_quantity) || 0;
      return sum + price * qty;
    }, 0);
    setValue('shipmentValue', total);
  }, [watchedOrders])

  const onSubmit = async (data) => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const istDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
        
    // Combine shipment pickup date and time into a single Date object
    const pickupDateAndTime = new Date(`${data.pickupDate}T${data.pickupTime}`);
        
    // Compare pickup time with the current IST time
    if (pickupDateAndTime < istDate) {
      toast.error('Pickup time is already passed. Please update and try again');
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
        toast.error('Please make sure every box has some items')
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
        toast.error('Some items have invalid box no.')
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
        navigate('/dashboard/shipments/domestic', {
          state: {
            orderId: result?.data?.orderId
          }
        });
        toast.success('Order created successfully');
      } else {
        toast.error('Order failed: ' + result.message);
        console.log(result.orders);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during creating order');
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
              <label className="text-sm font-medium text-gray-700" htmlFor="pickupDate">Pickup Date <span className="text-red-500">*</span></label>
              <input required
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="date"
                min={getTodaysDate()}
                id="pickupDate"
                {...register("pickupDate")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="pickupTime">Pickup Time <span className="text-red-500">*</span></label>
              <input required
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="time"
                id="pickupTime"
                {...register("pickupTime")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="payMode">Payment Method <span className="text-red-500">*</span></label>
              <select
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                id="payMode"
                {...register("payMode")}
              >
                <option value="COD">COD</option>
                <option value="Pre-paid">Prepaid</option>
                {/* <option value="topay">To Pay</option> */}
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
              <label className="text-sm font-medium text-gray-700" htmlFor="name">Buyer's Name <span className="text-red-500">*</span></label>
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
              <label className="text-sm font-medium text-gray-700" htmlFor="phone">Phone Number <span className="text-red-500">*</span></label>
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
              <label className="text-sm font-medium text-gray-700" htmlFor="address">Address Line <span className="text-red-500">*</span></label>
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
              <label className="text-sm font-medium text-gray-700" htmlFor="addressType">Address Type <span className="text-red-500">*</span></label>
              <select
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                id="addressType"
                {...register("addressType")}
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
              </select>
              {errors.addressType && <span className='text-red-500 text-sm'>{errors.addressType.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="postcode">Pincode <span className="text-red-500">*</span></label>
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
              <label className="text-sm font-medium text-gray-700" htmlFor="city">City <span className="text-red-500">*</span></label>
              <input
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="text"
                id="city"
                {...register("city")}
              />
              {errors.city && <span className='text-red-500 text-sm'>{errors.city.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="state">State <span className="text-red-500">*</span></label>
              <input
                className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="text"
                id="state"
                {...register("state")}
              />
              {errors.state && <span className='text-red-500 text-sm'>{errors.state.message}</span>}
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
              {errors.country && <span className='text-red-500 text-sm'>{errors.country.message}</span>}
            </div>
          </div>
          
          {/* <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <input
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              type="checkbox"
              id="same"
              {...register("same")}
            />
            <label className="text-sm font-medium text-gray-700 cursor-pointer" htmlFor="same">Billing Address same as Shipping Address</label>
          </div> */}
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

        {/* Packages Details Card — items nested inside each box */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6 border-b pb-2">
            <h2 className="text-xl font-semibold text-blue-600">Package Details (Boxes &amp; Items)</h2>
          </div>

          <div className="space-y-6">
            {boxes.fields.map((boxField, boxIndex) => {
              // Derive the 1-based box number for this card
              const boxNumber = boxIndex + 1;
              // Find items belonging to this box
              const boxItems = fields
                .map((f, i) => ({ field: f, index: i }))
                .filter(({ index }) => {
                  const val = watch(`orders[${index}].box_no`);
                  return parseInt(val) === boxNumber;
                });

              return (
                <div key={boxField.id} className="rounded-xl border border-blue-100 bg-blue-50/30 overflow-hidden relative group">

                  {/* ── Box dimension row ── */}
                  <div className="p-4 bg-white border-b border-blue-100">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">{boxNumber}</span>
                        <span className="text-sm font-semibold text-blue-700">Box {boxNumber}</span>
                      </div>
                      {watch('boxes').length > 1 && (
                        <button
                          type="button"
                          className="text-red-400 hover:text-red-600 transition p-1.5 rounded-full hover:bg-red-50"
                          title="Remove box"
                          onClick={() => {
                            const toRemove = fields
                              .map((f, i) => ({ i, box_no: parseInt(watch(`orders[${i}].box_no`)) }))
                              .filter(({ box_no }) => box_no === boxNumber)
                              .map(({ i }) => i)
                              .reverse();
                            toRemove.forEach(i => remove(i));
                            boxes.remove(boxIndex);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      <input type="hidden" value={boxNumber} {...register(`boxes[${boxIndex}].box_no`)} />
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">L (cm) <span className="text-red-500">*</span></label>
                        <input className="w-full border border-gray-300 py-2 px-3 rounded focus:ring-2 focus:ring-blue-500" type="number" {...register(`boxes[${boxIndex}].length`)} />
                        {errors.boxes?.[boxIndex]?.length && <span className='text-red-500 text-xs'>{errors.boxes[boxIndex].length.message}</span>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">W (cm) <span className="text-red-500">*</span></label>
                        <input className="w-full border border-gray-300 py-2 px-3 rounded focus:ring-2 focus:ring-blue-500" type="number" {...register(`boxes[${boxIndex}].breadth`)} />
                        {errors.boxes?.[boxIndex]?.breadth && <span className='text-red-500 text-xs'>{errors.boxes[boxIndex].breadth.message}</span>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">H (cm) <span className="text-red-500">*</span></label>
                        <input className="w-full border border-gray-300 py-2 px-3 rounded focus:ring-2 focus:ring-blue-500" type="number" {...register(`boxes[${boxIndex}].height`)} />
                        {errors.boxes?.[boxIndex]?.height && <span className='text-red-500 text-xs'>{errors.boxes[boxIndex].height.message}</span>}
                      </div>
                      <div className="space-y-1 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Weight <span className="text-red-500">*</span></label>
                        <div className="flex gap-1">
                          <input className="w-2/3 border border-gray-300 py-2 px-2 rounded focus:ring-2 focus:ring-blue-500" type="number" {...register(`boxes[${boxIndex}].weight`)} />
                          <select className="w-1/3 border border-gray-300 py-2 px-1 rounded text-xs" {...register(`boxes[${boxIndex}].weight_unit`)}>
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                          </select>
                        </div>
                        {errors.boxes?.[boxIndex]?.weight && <span className='text-red-500 text-xs'>{errors.boxes[boxIndex].weight.message}</span>}
                      </div>
                    </div>
                  </div>

                  {/* ── Items belonging to this box ── */}
                  <div className="p-4 space-y-3">
                    <div className="mb-1">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Items in Box {boxNumber}</span>
                    </div>

                    {boxItems.length === 0 && (
                      <p className="text-xs text-gray-400 italic py-2 text-center">No items yet — click &quot;+ Add Item&quot; to add one.</p>
                    )}

                    {boxItems.map(({ field, index }) => (
                      <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-3 bg-white rounded-lg border border-gray-100 shadow-sm group/item">
                        {/* hidden box_no — auto-set */}
                        <input type="hidden" value={boxNumber} {...register(`orders[${index}].box_no`)} />
                        <div className="md:col-span-5">
                          <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Product Name <span className="text-red-500">*</span></label>
                          <input className="w-full border border-gray-300 py-2 px-3 rounded focus:ring-2 focus:ring-green-400" type="text" {...register(`orders[${index}].product_name`)} placeholder="Item name" />
                          {errors.orders?.[index]?.product_name && <span className='text-red-500 text-xs'>{errors.orders[index].product_name.message}</span>}
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Qty <span className="text-red-500">*</span></label>
                          <input className="w-full border border-gray-300 py-2 px-3 rounded focus:ring-2 focus:ring-green-400" type="number" min={1} {...register(`orders[${index}].product_quantity`)} />
                          {errors.orders?.[index]?.product_quantity && <span className='text-red-500 text-xs'>{errors.orders[index].product_quantity.message}</span>}
                        </div>
                        <div className="md:col-span-3">
                          <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Price (₹) <span className="text-red-500">*</span></label>
                          <input className="w-full border border-gray-300 py-2 px-3 rounded focus:ring-2 focus:ring-green-400" type="number" min={0} {...register(`orders[${index}].selling_price`)} />
                          {errors.orders?.[index]?.selling_price && <span className='text-red-500 text-xs'>{errors.orders[index].selling_price.message}</span>}
                        </div>
                        {boxItems.length > 1 ? <div className="md:col-span-1 flex justify-center">
                          <button
                            type="button"
                            className="text-red-400 hover:text-red-600 transition p-1.5 rounded-full hover:bg-red-50"
                            onClick={() => remove(index)}
                            title="Remove item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>: null}
                      </div>
                    ))}

                    {/* Add Item — below the list, right-aligned */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm"
                        onClick={() => append({ box_no: boxNumber, product_name: '', product_quantity: 1, selling_price: 0, tax_in_percentage: 0 })}
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}

            {/* Add Box — below the list, right-aligned */}
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                onClick={() => boxes.append({ box_no: watch('boxes').length + 1, length: 10, breadth: 10, height: 10, weight: 1, weight_unit: 'kg', quantity: 1 })}
              >
                + Add Box
              </button>
            </div>
          </div>
        </div>
        {/* Shipment Info & Shipping Type Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-blue-600">Shipment Additional Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="shippingType">Shipping Type <span className="text-red-500">*</span></label>
              <select className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" id="shippingType" {...register("shippingType")}>
                <option value="Surface">Surface</option>
                <option value="Express">Express</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="shipmentValue">Shipment Value</label>
              <input readOnly className="w-full border border-gray-300 py-2 px-4 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" type="number" id="shipmentValue" {...register("shipmentValue")} />
              <p className="text-xs text-gray-400">Auto-calculated from item prices × quantities.</p>
              {errors.shipmentValue && <span className='text-red-500 text-sm'>{errors.shipmentValue.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="ewaybill">E-Waybill (If applicable)</label>
              <input className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500" type="text" id="ewaybill" {...register("ewaybill")} />
              {errors.ewaybill && <span className='text-red-500 text-sm'>{errors.ewaybill.message}</span>}
            </div>
            {/* <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="discount">Discount</label>
              <input className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500" type="number" id="discount" {...register("discount")} />
            </div> */}
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
