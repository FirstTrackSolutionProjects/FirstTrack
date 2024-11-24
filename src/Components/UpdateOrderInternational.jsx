import React, { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_APP_API_URL
const ManageForm = ({ shipment}) => {
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
  useEffect(() => {
    const getDockets = async () => {
      await fetch(`${API_URL}/order/international/dockets`,{
        method : 'POST',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ iid : shipment.iid })
      })
     .then(response => response.json()).then(result => {setDockets(result.dockets); console.log(result.dockets)})
    }
    const getItems = async () => {
      await fetch(`${API_URL}/order/international/items`,{
        method : 'POST',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ iid : shipment.iid })
      })
     .then(response => response.json()).then(result => setItems(result.dockets))
    }
    getDockets()
    getItems()
  },[]);
  const [formData, setFormData] = useState({
    iid : shipment.iid,
    wid : shipment.wid,
    contents : shipment.contents,
    serviceCode: shipment.service_code,
    consigneeName : shipment.consignee_name,
    consigneeCompany : shipment.consignee_company_name,
    countryCode : shipment.consignee_country_code,
    consigneeContact : shipment.consignee_contact_no,
    consigneeEmail : shipment.consignee_email,
    consigneeAddress : shipment.consignee_address_1,
    consigneeAddress2 : shipment.consignee_address_2,
    consigneeAddress3: shipment.consignee_address_3,
    consigneeCity : shipment.consignee_city,
    consigneeState : shipment.consignee_state,
    consigneeCountry : shipment.consignee_country,
    consigneeZipCode : shipment.consignee_zip_code,
    dockets : dockets,
    items : items,
    actual_weight : shipment.actual_weight,
    gst : shipment.gst,
    shippingType : shipment.shippingType,
    price : 0
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
  useEffect(() => {
    setFormData((prev)=>({
      ...prev,
      dockets: dockets
    }))
  },[dockets])
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
    console.log(formData)
    let docketFlag = 0
    for (let i = 0; i < formData.dockets.length; i++) {
      for (let j = 0; j < formData.items.length; j++) {
        if (parseInt(formData.items[j].box_no) == i+1){
          docketFlag = 1
        }
      }
      if (docketFlag == 0){
        alert('Please make sure every docket has some items')
        return
      }
      docketFlag = 0
    }

    let itemFlag = 0
    for (let i = 0; i < formData.items.length; i++) {
      for (let j = 0; j < formData.dockets.length; j++) {
        if (formData.items[i].box_no == formData.dockets[j].box_no){
          itemFlag = 1
        }
      }
      if (itemFlag == 0){
        alert('Some items have invalid box no.')
        return
      }
      itemFlag = 0
    }

    fetch(`${API_URL}/order/international/update`, {
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
          alert('Order Updated successfully')
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
        <div className="text-3xl font-medium text-center my-8">Update Shipping Details</div>
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
              </select>
                </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
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
                min = {0}
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
              min = {1}
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
              min = {0}
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
              min = {0}
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
              min = {0}
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
                min={1}
                id="quantity"
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
                min={0}
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
                min={0}
                id="unit_weight"
                name="unit_weight"
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
                min={0}
                name="igst_amount"
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
          <button type='submit' className="mx-2 px-5 py-1 border rounded-3xl bg-blue-500 text-white">Update</button>

        </form>
      </div>
    </>
    );
  };

// const ShipCard = ({price, shipment, dockets, docketsPrices ,setIsShipped, setIsShip}) => {
//   const [isLoading, setIsLoading] = useState(false)
//   const ship = async (serviceId,categoryId) => {
//     setIsLoading(true)
//     const price = docketsPrices.map((docketPrice,index)=> (
//         docketPrice.filter((a => a.categoryId == categoryId && a.serviceId == serviceId))
//     ))
//     const getBalance = await fetch('/.netlify/functions/getBalance', {
//       method: 'POST',
//       headers : {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'Authorization': localStorage.getItem('token'),
//       }
//     })
//     const balanceData = await getBalance.json();
//     const balance = balanceData.balance;
//     if ((parseFloat(balance) < parseFloat(price.price))){
//       if (shipment.pay_method !== "topay"){
//         alert('Insufficient balance')
//         setIsLoading(false)
//         return;
//       }
//     }
//     console.log(dockets)
//     for (let i = 0; i < dockets.length; i++) {
//         if (!dockets[i].awb) {
//             try {
//                 const res = await fetch('/.netlify/functions/createDomesticInternational', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Accept': 'application/json',
//                         'Authorization': localStorage.getItem('token'),
//                     },
//                     body: JSON.stringify({
//                         did: dockets[i].did,
//                         price: price[i][0].price,
//                         serviceId: serviceId,
//                         categoryId: categoryId
//                     })
//                 });

//                 const result = await res.json();

//                 if (!result.success) {
//                     console.log(result.message)
//                     console.log(result.message.packages)
//                     alert("Some Dockets were unable to ship, please click on ship to retry to ship the remaining Dockets");
//                     setIsLoading(false)
//                     return; // End the function (and thus the loop) on failure
//                 }
//             } catch (error) {
//                 console.error('Error occurred:', error);
//                 setIsLoading(false)
//                 // Handle the error as needed
//                 return; // End the function (and thus the loop) on error
//             }
//         }
//     }
//     await fetch('/.netlify/functions/createInternational',{
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'Authorization': localStorage.getItem('token'),
//         },
//         body: JSON.stringify({
//             iid: shipment.iid
//         })
//     }).then(response => response.json()).then(result => {
//       if (result.success){
//         alert('Shipment created successfully')
//         setIsLoading(false)
//         setIsShipped(true)
//         setIsShip(false)
//       }
//       else {
//         alert('Failed to created shipment, try again')
//         console.log(result.response)
//         console.log(result.request)
//         setIsLoading(false)
//       }
//     });
    
    
//   }
//   return (
//     <>
//        <div className="w-full h-16 bg-white relative items-center px-4 flex border-b" >
//           <div>{price.name+" "+price.weight}</div>
//           <div className="absolute flex space-x-2 right-4">{`₹${Math.round((price.price))}`} <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={isLoading?()=>{}:()=>ship(price.serviceId,price.categoryId)}>{isLoading?"Shipping...":"Ship"}</div></div>
//         </div>
//     </>
//   )
// }

// const ShipList = ({ shipment, setIsShip, setIsShipped }) => {
//     const [prices, setPrices] = useState([]);
//     const [dockets, setDockets] = useState([]);
//     const[docketsPrices, setDocketsPrices] = useState([]);
//     useEffect(() => {
//       const fetchDocketsAndPrices = async () => {
//         try {
//           const getDockets = await fetch('/.netlify/functions/getDockets', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json',
//               'Authorization': localStorage.getItem('token'),
//             },
//             body: JSON.stringify({ iid: shipment.iid }),
//           });
//           const docketsData = await getDockets.json();
//           setDockets(docketsData.dockets);
  
//           if (docketsData.dockets) {
//             const pricePromises = docketsData.dockets.map(async (docket) => {
                
//               if (!docket.awb){
//                 const response = await fetch('/.netlify/functions/price', {
//                     method: 'POST',
//                     headers: {
//                       'Accept': 'application/json',
//                       'Content-Type': 'application/json',
//                       'Authorization': localStorage.getItem('token'),
//                     },
//                     body: JSON.stringify({
//                       method: shipment.shippingType === "Surface" ? "S" : "E",
//                       status: "Delivered",
//                       origin: shipment.pin,
//                       dest: "110037",
//                       weight: docket.docket_weight,
//                       payMode: "Pre-paid",
//                       codAmount: 0,
//                       length: docket.length,
//                       breadth: docket.breadth,
//                       height: docket.height,
//                     }),
//                   });
//                   const result = await response.json();
//                   return result.prices;
//               }
              
//             });
  
//             const pricesList = await Promise.all(pricePromises);
//             setDocketsPrices(pricesList);
//             console.log(docketsPrices)
//             // Sum the prices while maintaining the structure
//             const summedPrices = pricesList[0].map((item, index) => {
//               const total = pricesList.reduce((acc, subarray) => {
//                 return acc + subarray[index].price;
//               }, 0);
//               return {
//                 ...item,
//                 price: total,
//               };
//             });
  
//             setPrices(summedPrices);
//           }
//         } catch (err) {
//           alert(err);
//         }
//       };
  
//       fetchDocketsAndPrices();
//     }, []);
  
//     return (
//       <>
//         <div className="absolute inset-0 z-20 overflow-y-scroll px-4 pt-24 pb-4 flex flex-col bg-gray-100 items-center space-y-6">
//           <div className="absolute top-3 right-3" onClick={() => setIsShip(false)}>
//             X
//           </div>
//           <div className="text-center text-3xl font-medium">
//             CHOOSE YOUR DOMESTIC SERVICE (THIS WILL DELIVER YOUR SHIPMENT TO THE INTERNATIONAL SHIPMENT HUB)
//           </div>
//           <div className="w-full p-4">
//             {prices && prices.length ? (
//               prices.map((price, index) => (
//                 <ShipCard
//                   setIsShipped={setIsShipped}
//                   setIsShip={setIsShip}
//                   key={index}
//                   shipment={shipment}
//                   dockets={dockets}
//                   docketsPrices={docketsPrices}
//                   price={price}
//                 />
//               ))
//             ) : null}
//           </div>
//         </div>
//       </>
//     );
//   };
  

const Card = ({ shipment }) => {
    const [isManage, setIsManage] = useState(false);
    // const [isShip, setIsShip] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isShipped, setIsShipped] = useState(shipment.awb?true:false);
    const handleShip = async () => {
      setIsLoading(true)
      await fetch(`${API_URL}/shipment/international/create`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({
            iid: shipment.iid
        })
    }).then(response => response.json()).then(async result => {
      if (result.success){
        // await fetch(`${API_URL}/internationalOrderMail`, {
        //   method: 'POST',
        //   headers: {
        //       'Content-Type': 'application/json',
        //       'Accept': 'application/json',
        //       'Authorization': localStorage.getItem('token')
        //   }
        // })
        alert('Shipment created successfully')
        setIsLoading(false)
        setIsShipped(true)
        console.log(result.response)
        console.log(result.request)
      }
      else {
        alert(`Failed to created shipment, try again\nReason : ${result.response.errors[0]}`)
        console.log(result.response)
        console.log(result.request)
        setIsLoading(false)
      }
    });
    }
    return (
      <>
        {/* {isShip && <ShipList setIsShip={setIsShip} shipment={shipment} setIsShipped={setIsShipped}/>} */}
        
        <div className="w-full py-2 bg-white relative items-center px-4 sm:px-8 flex border-b">
          <div className="text-sm">
          <div className="font-bold">{shipment.iid}</div>
          <div >{shipment.consignee_name}</div>
            <div> {shipment.awb?`AWB : ${shipment.awb}`:null}</div>
            <div>{shipment.created_at ? shipment.created_at.toString().split('T')[0] + ' ' + shipment.created_at.toString().split('T')[1].split('.')[0] : null}</div>
          </div>
          <div className="absolute right-4 sm:right-8 flex space-x-2">
          <div className="px-3 py-1 bg-blue-500 rounded-3xl text-white cursor-pointer" onClick={()=>setIsManage(!isManage)}>{!isManage?isShipped?"View":"Manage":"X"}</div>
          {isShipped ? <a className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" target="_blank" href={`https://online.flightgo.in/docket/print_pdf_tc_pdf/pdf_two_025?docket=${shipment.docket_id}&mode=tcpdf1`}>Label</a> : null}
          {!isShipped && <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={isLoading?()=>{}:()=>handleShip()}>{isLoading?"Shipping...":"Ship"}</div>}
          </div>
        </div>
        {isManage && <ManageForm isManage={isManage} setIsManage={setIsManage} shipment={shipment} isShipped={isShipped}/>}
      </>
    );
  };
  const PickupRequest = ({setPickup}) => {
    const [warehouses, setWarehouses] = useState([]);
    useEffect(() => {
      const getWarehouses = async () => {
        const response = await fetch(`${API_URL}/warehouse/warehouses`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          }
        });
        const result = await response.json();
        setWarehouses(result.rows);
      };
      getWarehouses();
    }, []);
    const [formData, setFormData] = useState({
      wid : "",
      pickDate : "",
      pickTime : "",
      packages : ""
    })
    const handleSubmit = async (e) => {
      e.preventDefault();
      await fetch(`${API_URL}/shipment/domestic/pickup/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      }).then(response => response.json()).then(result => {
        if (result.schedule.incoming_center_name){
          alert("Pickup request sent successfully")
        }
        else if (result.schedule.prepaid){
          alert("Pickup request failed due to low balance of owner")
        }
        else if (result.schedule.pr_exist){
          alert("This time slot is already booked")
        }
        else {
          alert("Please enter a valid date and time in future")
        }
      })
    }
    const handleChange =  (e) => {
      const {name, value} = e.target;
      setFormData({...formData, [name]: value });
    }
    return (
      <>
        <div className="fixed z-50 bg-[rgba(0,0,0,0.5)] inset-0 flex justify-center items-center">
          <div className="relative p-8 bg-white">
              <div className="absolute right-3 top-3" onClick={()=>setPickup(false)}>
                x
              </div>
              <form action="" onSubmit={handleSubmit}>
              <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
            <label htmlFor="wid">Pickup Warehouse Name</label>
              <select
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
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="pickDate">Pickup Date</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="pickDate"
                name="pickDate"
                placeholder="YYYY-MM-DD"
                value={formData.pickDate}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="pickTime">Pickup Time</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="pickTime"
                name="pickTime"
                placeholder="HH:MM:SS (In 24 Hour Format)"
                value={formData.pickTime}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="packages">No of packages</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="number"
                id="packages"
                name="packages"
                placeholder=""
                value={formData.packages}
                onChange={handleChange}
              />
            </div>
            <button className="px-5 py-1 mx-2 bg-blue-500  rounded-3xl text-white cursor-pointer" type="submit">Submit</button>
              </form>
          </div>
        </div>
      </>
    )
  }

const Listing = ({ step, setStep }) => {
    const [shipments, setShipments] = useState([])
    const [pickup, setPickup] = useState(false);
    useEffect(() => {

        fetch(`${API_URL}/order/international/all`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token'),
            },
          })
            .then(response => response.json())
            .then(result => {
              if (result.success) {
                result.order.sort((a, b) => new Date(a.iid) - new Date(b.iid)).reverse()
                const finalShipments = []
                const unShippedShipments = result.order.filter(shipment => !shipment.awb)
                const shippedShipments = result.order.filter(shipment => shipment.awb)
                finalShipments.push(...unShippedShipments,...shippedShipments)
                setShipments(finalShipments);
              } else {
                
              }
            })
            .catch(error => {
              console.error('Error:', error);
              alert('An error occurred during Order');
            });
    },[]);
    return (
      <>
        <div
          className={`w-full p-4 flex flex-col items-center space-y-6 ${
            step == 0 ? "" : "hidden"
          }`}
        >
          {pickup ? <PickupRequest setPickup={setPickup}/> : null}
          <div className="w-full h-16 px-4  relative flex">
            <div className="text-2xl font-medium">SHIPMENTS </div>
            {/* <div
              onClick={()=>setPickup(true)}
              className="px-5 py-1 bg-blue-500 absolute rounded-3xl text-white  right-4"
            >
              Pickup Request
            </div> */}
          </div>
          <div className="w-full">
            {shipments.map((shipment, index) => (
              <Card key={index} shipment={shipment} />
            ))}
          </div>
        </div>
      </>
    );
  };

const UpdateOrderInternational = () => {
  const [step, setStep] = useState(0)
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      {step==0 && <Listing step={step} setStep={setStep} />}
      {/* <FullDetails /> */}
    </div>
  );
};

export default UpdateOrderInternational;
