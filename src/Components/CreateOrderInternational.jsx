import React, { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_APP_API_URL
const FullDetails = () => {
  const [dockets, setDockets] = useState([
    { box_no: 1 , docket_weight: 0 , length: 0 , breadth : 0, height : 0  }
]);
const handleDeleteDocket = (index) => {
  const newDockets = dockets.filter((_, i) => i !== index).map((docket, i) => ({
    ...docket,
    box_no: i + 1,
  }));
  setDockets(newDockets);
};
const handleAddDocket = () => {
  setDockets([...dockets, { box_no: dockets.length + 1, docket_weight: 0 , length: 0 , breadth : 0, height : 0  }]);
};
  const [items, setItems] = useState([
    { hscode: '' , box_no: '' , quantity: 0 , rate: 0 , description: '' , unit: 'Pc', unit_weight: 0, igst_amount : 0 }
]);
  const [formData, setFormData] = useState({
    wid : '',
    contents : '',
    serviceCode: 'MELBOURNE',
    consigneeName : '',
    consigneeCompany : '',
    consigneeContact : '',
    countryCode : '+91',
    consigneeEmail : '',
    consigneeAddress : '',
    consigneeAddress2 : '',
    consigneeAddress3: '',
    consigneeCity : '',
    consigneeState : '',
    consigneeCountry : 'CA',
    consigneeZipCode : '',
    dockets : dockets,
    items : items,
    actual_weight : '',
    gst : '',
    shippingType : 'CARGO',
    price : ''
  })
  const [warehouses, setWarehouses] = useState([])
  useEffect(() => {
    const getWarehouses = async () => {
      await fetch(`${API_URL}/warehouse/warehouses`,{
        method : 'POST',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        }
      }).then(response => response.json()).then(result => setWarehouses(result.rows))
    }
    getWarehouses();
  }, [])
  const addProduct = () => {
    setItems([...items, { hscode: '' , box_no: '' , quantity: 0 , rate: 0 , description: '' , unit: 'Pc', unit_weight: 0, igst_amount : 0 }]);

  };
  const removeProduct = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    setFormData((prev)=>({
      ...prev,
      items: items
    }))
  };
  const handleDocket = (index, event) => {
    const { name, value } = event.target;
    const updatedDockets = [...dockets];
    updatedDockets[index][name] = value;
    setDockets(updatedDockets);
    setFormData((prev)=>({
      ...prev,
      dockets: dockets
    }))
  };
  const handleItems = (index, event) => {
    
    const { name, value } = event.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
    setFormData((prev)=>({
      ...prev,
      items: items
    }))
  };

  useEffect(()=>{
    setFormData((prev)=>({
        ...prev,
        items: items
      }))
  }, [items]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:type === 'checkbox' ? checked : value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/order/international/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          alert('Order created successfully')
        } else {
          alert('Something Went Wrong, please try again')
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Something Went Wrong, please try again');
      });
  }
  return (
    <>
      <div className="w-full p-4 flex flex-col items-center">
        <div className="text-3xl font-medium text-center my-8">Enter Shipping Details</div>
        <form action="" onSubmit={handleSubmit}>
        <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="wid">Pickup Warehouse Name</label>
              <select required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="wid"
                name="wid"
                placeholder="Warehouse Name"
                value={formData.wid}
                onChange={handleChange}
              >
                <option value="">Select Warehouse</option>
                { warehouses.length ?
                  warehouses.map((warehouse, index) => (
                    <option value={warehouse.wid} >{warehouse.warehouseName}</option>
                  ) ) : null
                }
              </select>
            </div>
            
          </div>
         
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="contents">Contents</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="contents"
                name="contents"
                placeholder="Ex. Books"
                value={formData.contents}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="serviceCode">Service</label>
              <select required
                className="w-full border py-2 px-4 rounded-3xl"
                id="serviceCode"
                name="serviceCode"
                value={formData.serviceCode}
                onChange={handleChange}
              >
                <option value="">Select Service</option>
                <option value="PUROLATOR YVR">PUROLATOR</option>
                <option value="V-PURO_DDU">V-PURO DDU</option>
                <option value="MELBOURNE">AUSTRALIA</option>
                <option value="CANADA PAID">CANADA EXPRESS</option>
                <option value="CANADA YYZ">CANADA PAID</option>
                <option value="FG NEW ZEALAND">NEW ZEALAND</option>
                <option value="EUROPE FRA DPD">EUROPE FRA</option>
                <option value="UAE DIRECT">UAE DIRECT</option>
                <option value="USA VIA LHR">USA VIA LHR</option>
                <option value="UK DPD">UK DPD</option>
              </select>
            </div>
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="consigneeName">Consignee Name</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="consigneeName"
                name="consigneeName"
                placeholder="Name"
                value={formData.consigneeName}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="consigneeCompany">Consignee Company</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="consigneeCompany"
                name="consigneeCompany"
                placeholder="Company"
                value={formData.consigneeCompany}
                onChange={handleChange}
              />
            </div>
            
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 max-w-[100px] space-y-2">
              <label htmlFor="countryCode">Country Code</label>
              <select required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="countryCode"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
              >
                <option value="+91">+91</option>
                <option value="+61">+61</option>
                <option value="+64">+64</option>
                <option value="+971">+971</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+49">+49</option>
              </select>
                </div>
            <div className="flex-1 mx-2 mb-2 min-w-[250px] space-y-2">
              <label htmlFor="consigneeContact">Consignee Contact</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="number"
                id="consigneeContact"
                name="consigneeContact"
                placeholder="Enter Customer Contact"
                value={formData.consigneeContact}
                onChange={handleChange}
                />
                </div>
              <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="consigneeEmail">Consignee Email</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="consigneeEmail"
                name="consigneeEmail"
                placeholder="Ex. customer@example.com"
                value={formData.consigneeEmail}
                onChange={handleChange}
              />
            </div>
            
          </div>
          
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="consigneeAddress">Consignee Address</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="consigneeAddress"
                name="consigneeAddress"
                placeholder="Enter Shipping Address"
                value={formData.consigneeAddress}
                onChange={handleChange}
              />
            </div>
            
            
            
          </div>
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="consigneeAddress2">Consignee Address 2</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="consigneeAddress2"
                name="consigneeAddress2"
                placeholder="Shipping Address 2"
                value={formData.consigneeAddress2}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="consigneeAddress3">Consignee Address 3</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="consigneeAddress3"
                name="consigneeAddress3"
                placeholder="Shipping Address 3"
                value={formData.consigneeAddress3}
                onChange={handleChange}
              />
            </div>
          {/* <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="addressType">Shipping Address Type</label>
              <select
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="addressType"
                name="addressType"
                value={formData.addressType}
                onChange={handleChange}
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
              </select>
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="addressType2">Alternate Shipping Address Type</label>
              <select
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="addressType2"
                name="addressType2"
                value={formData.addressType2}
                onChange={handleChange}
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
              </select>
            </div>
            
          </div> */}
          
          <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="consigneeZipCode">Consignee Zip Code</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="consigneeZipCode"
                name="consigneeZipCode"
                placeholder="Zip Code"
                value={formData.consigneeZipCode}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="consigneeCity">Consignee City</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="consigneeCity"
                name="consigneeCity"
                placeholder="Enter City"
                value={formData.consigneeCity}
                onChange={handleChange}
              />
            </div>
            
            
          </div>
          
          <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="consigneeState">Consignee State</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="consigneeState"
                name="consigneeState"
                placeholder="Enter State"
                value={formData.consigneeState}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="consigneeCountry">Consignee Country</label>
              <select required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="consigneeCountry"
                name="consigneeCountry"
                value={formData.consigneeCountry}
                onChange={handleChange}
              >
                <option value="AU">Australia</option>
                <option value="CA">Canada</option>
                <option value="NZ">New Zealand</option>
                <option value="GB">United Kingdom</option>
                <option value="AE">UAE</option>
                <option value="US">USA</option>
                <option value="DE">Germany</option>
              </select>
            </div>
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="shippingType">Shipment Type</label>
              <select required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="shippingType"
                name="shippingType"
                value={formData.shippingType}
                onChange={handleChange}
              >
                <option value="CARGO">CARGO</option>
                <option value="GIFT">GIFT</option>
                <option value="SAMPLE">SAMPLE</option>
              </select>
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="gst">Seller GST</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="gst"
                name="gst"
                placeholder="GSTIN"
                value={formData.gst}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="actual_weight">Actual Weight (in Kg)</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="number"
                id="actual_weight"
                min={0}
                name="actual_weight"
                placeholder="Ex. 100"
                value={formData.actual_weight}
                onChange={handleChange}
              />
            </div>
          </div>
          {dockets.map((docket, index) => (
        <div key={index} className="product-form flex flex-1 space-x-2 flex-wrap items-center">
            <div className="flex-1 mx-2 mb-2 min-w-[150px] space-y-2">
            <label>Box no.</label>
            <input required
              type="number"
              className="flex-1 border py-2 px-4 rounded-3xl"
              name="box_no"
              placeholder="Box Number"
              disabled
              value={docket.box_no}
              onChange={(event) => handleDocket(index, event)}
              style={{ marginLeft: '10px' }}
            />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[150px] space-y-2">
            <label>Docket Weight</label>
            <input required
              type="number"
              className="flex-1 border py-2 px-4 rounded-3xl"
              name="docket_weight"
              min={0}
              placeholder="Docket Weight (in Kg)"
              value={docket.docket_weight}
              onChange={(event) => handleDocket(index, event)}
              style={{ marginLeft: '10px' }}
            />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[150px] space-y-2">
            <label>Length</label>
            <input required
              type="number"
              className="flex-1 border py-2 px-4 rounded-3xl"
              name="length"
              min={0}
              placeholder="Length"
              value={docket.length}
              onChange={(event) => handleDocket(index, event)}
              style={{ marginLeft: '10px' }}
            />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[150px] space-y-2">
            <label>Breadth</label>
            <input required
              type="number"
              className="flex-1 border py-2 px-4 rounded-3xl"
              name="breadth"
              min={0}
              placeholder="Breadth"
              value={docket.breadth}
              onChange={(event) => handleDocket(index, event)}
              style={{ marginLeft: '10px' }}
            />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[150px] space-y-2">
            <label>Height</label>
            <input required
              type="number"
              className="flex-1 border py-2 px-4 rounded-3xl"
              name="height"
              min={0}
              placeholder="Height"
              value={docket.height}
              onChange={(event) => handleDocket(index, event)}
              style={{ marginLeft: '10px' }}
            />
            </div>
            <button type="button" className="mx-2 px-5 py-1 border rounded-3xl bg-red-500 text-white" onClick={() => handleDeleteDocket(index)}>Remove</button>
        </div>
      ))}
      <button type="button" className="m-2 px-5 py-1 border rounded-3xl bg-blue-500 text-white" onClick={handleAddDocket}>Add Docket</button>
          {items.map((item, index) => (
            
        <div key={index} className="product-form flex space-x-2 flex-wrap items-center">
          <div className="flex-1 mx-2 mb-2 min-w-[150px] space-y-2">
              <label htmlFor="hscode">HS Code</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="hscode"
                name="hscode"
                placeholder="HS Code"
                value={item.hscode}
                onChange={(e) => handleItems(index, e)}
              />
            </div>
          <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
              <label htmlFor="box_no">Box no.</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="box_no"
                min={1}
                name="box_no"
                placeholder="Box no"
                value={item.box_no}
                onChange={(e) => handleItems(index, e)}
              />
            </div>
          <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
              <label htmlFor="quantity">Quantity</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="number"
                id="quantity"
                min={0}
                name="quantity"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItems(index, e)}
              />
            </div>
          <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
              <label htmlFor="rate">Rate per item</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="rate"
                name="rate"
                placeholder="Quantity"
                value={item.rate}
                onChange={(e) => handleItems(index, e)}
              />
            </div>
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="description">Description</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="description"
                name="description"
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItems(index, e)}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
              <label htmlFor="unit">Unit</label>
              <select required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              >
                <option value="Pc">Pc</option>
              </select>
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
              <label htmlFor="unit_weight">Unit Weight</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="number"
                id="unit_weight"
                name="unit_weight"
                min={0}
                placeholder="Unit Weight"
                value={item.unit_weight}
                onChange={(e) => handleItems(index, e)}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
              <label htmlFor="igst_amount">IGST</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="number"
                id="igst_amount"
                name="igst_amount"
                min = {0}
                placeholder="IGST Amount"
                value={item.igst_amount}
                onChange={(e) => handleItems(index, e)}
              />
            </div>
          
            <button type="button" className="mx-2 px-5 py-1 border rounded-3xl bg-red-500 text-white" onClick={() => removeProduct(index)}>Remove</button>
        </div>
      ))}
      <button type="button" className="m-2 px-5 py-1 border rounded-3xl bg-blue-500 text-white" onClick={addProduct}>Add More Product</button>
          {/* <div className="w-full flex mb-2 flex-wrap "> */}
            
            
            {/* <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="price">Shipment Cost(As provided)</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="number"
                id="price"
                name="price"
                placeholder="Ex. 1150"
                value={formData.price}
                onChange={handleChange}
              />
            </div> */}
            {/* <div className="flex-1 mx-2 mb-2 flex min-w-[300px] space-x-2">
              
              <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                <label htmlFor="shippingType">Shipping Type</label>
                <select
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="shippingType"
                name="shippingType"
                value={formData.shippingType}
                onChange={handleChange}
              >
                <option value="Surface">Surface</option>
                <option value="Express">Express</option>
              </select>
              </div>
            </div> */}
            
          {/* </div> */}
          <br/>
          <button type='submit' className="mx-2 px-5 py-1 border rounded-3xl bg-blue-500 text-white">Create</button>

        </form>
      </div>
    </>
  )
}

const CreateOrderInternational = () => {
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <FullDetails />
    </div>
  );
};

export default CreateOrderInternational;
