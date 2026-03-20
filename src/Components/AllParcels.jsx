import React, { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Box,
  Paper,
  IconButton,
  useMediaQuery, // Added for responsive design
  useTheme,      // Added for responsive design
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import convertToUTCISOString from "../helpers/convertToUTCISOString";
import { v4 as uuidv4 } from 'uuid'; // Added for unique ID generation for invoice upload

const API_URL = import.meta.env.VITE_APP_API_URL
const ManageForm = ({ isManage, setIsManage, shipment, isShipped }) => {
  if (!isManage) return null;
  const [boxes, setBoxes] = useState([
    { box_no: 1, length: 10, breadth: 10, height: 10, weight: 1, weight_unit: 'kg', quantity: 1 }
  ]);
  const [orders, setOrders] = useState([
    { box_no: 1, product_name: '', product_quantity: 1, selling_price: 0, tax_in_percentage: '' }
  ]);
  const [warehouses, setWarehouses] = useState([])
  useEffect(() => {
    const getWarehouses = async () => {
      await fetch(`${API_URL}/warehouse/warehouses/all`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        }
      }).then(response => response.json()).then(result => setWarehouses(result.rows))
    }
    getWarehouses();
    fetch(`${API_URL}/order/domestic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
      body: JSON.stringify({ order: shipment.ord_id }),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          setOrders(result.order)
        } else {
          alert('failed: ' + result.message)
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during fetching Order');
      });
    fetch(`${API_URL}/order/domestic/boxes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
      body: JSON.stringify({ order: shipment.ord_id }),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          setBoxes(result.order)
        } else {
          alert('failed: ' + result.message)
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during fetching Boxes');
      });

  }, [])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      orders: orders
    }))
  }, [orders]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      boxes: boxes
    }))
  }, [boxes]);

  const [formData, setFormData] = useState({
    wid: shipment.wid,
    order: shipment.ord_id,
    payMode: shipment.pay_method,
    name: shipment.customer_name,
    email: shipment.customer_email,
    phone: shipment.customer_mobile,
    address: shipment.shipping_address,
    addressType: shipment.shipping_address_type,
    postcode: shipment.shipping_postcode,
    city: shipment.shipping_city,
    state: shipment.shipping_state,
    country: shipment.shipping_country,
    Baddress: shipment.billing_address,
    BaddressType: shipment.billing_address_type,
    Bpostcode: shipment.billing_postcode,
    Bcity: shipment.billing_city,
    Bstate: shipment.billing_state,
    Bcountry: shipment.billing_country,
    same: 1,
    boxes: boxes,
    orders: orders,
    discount: shipment.total_discount,
    cod: shipment.cod_amount,
    gst: shipment.gst,
    Cgst: shipment.customer_gst,
    shippingType: shipment.shipping_mode,
    pickupDate: shipment.pickup_date,
    pickupTime: shipment.pickup_time,
    ewaybill: shipment.ewaybill,
    invoiceNumber: shipment.invoice_number,
    invoiceDate: shipment.invoice_date,
    invoiceAmount: shipment.invoice_amount,
    invoiceUrl: shipment.invoice_url,
    isB2B: shipment.is_b2b,
    customer_reference_number: shipment?.customer_reference_number
  })
  // useEffect(() => {

  //   const pinToAdd = async () => {
  //     try {
  //       await fetch(`https://api.postalpincode.in/pincode/${formData.postcode}`)
  //         .then(response => response.json())
  //         .then(result => {
  //           const city = result[0].PostOffice[0].District
  //           const state = result[0].PostOffice[0].State
  //           setFormData((prev) => ({
  //             ...prev,
  //             city: city,
  //             state: state
  //           }))
  //         })
  //     } catch (e) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         city: '',
  //         state: ''
  //       }))
  //     }
  //   }
  //   if (formData.postcode.length == 6) pinToAdd()
  // }, [formData.postcode])
  // useEffect(() => {
  //   const pinToAdd = async () => {
  //     try {
  //       await fetch(`https://api.postalpincode.in/pincode/${formData.Bpostcode}`)
  //         .then(response => response.json())
  //         .then(result => {
  //           const city = result[0].PostOffice[0].District
  //           const state = result[0].PostOffice[0].State
  //           setFormData((prev) => ({
  //             ...prev,
  //             Bcity: city,
  //             Bstate: state
  //           }))
  //         })
  //     } catch (e) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         Bcity: '',
  //         Bstate: ''
  //       }))
  //     }
  //   }
  //   if (formData.Bpostcode.length == 6) pinToAdd()
  // }, [formData.Bpostcode])

  const addProduct = () => {
    setOrders([...orders, { box_no: 1, product_name: '', product_quantity: 1, selling_price: 0, tax_in_percentage: '' }]);
  };
  const addBox = () => {
    setBoxes([...boxes, { box_no: boxes.length + 1, length: 10, breadth: 10, height: 10, weight: 1, weight_unit: 'kg', quantity: 1 }]);
  };
  const removeProduct = (index) => {
    const updatedOrders = orders.filter((_, i) => i !== index);
    setOrders(updatedOrders);
    setFormData((prev) => ({
      ...prev,
      orders: orders
    }))
  };
  const removeBox = (index) => {
    const updatedBoxes = boxes.filter((_, i) => i !== index);
    setBoxes(updatedBoxes);
    setFormData((prev) => ({
      ...prev,
      boxes: boxes
    }))
  };
  const handleOrders = (index, event) => {
    if (isShipped)
      return;
    const { name, value } = event.target;
    const updatedOrders = [...orders];
    updatedOrders[index][name] = value;
    setOrders(updatedOrders);
    setFormData((prev) => ({
      ...prev,
      orders: orders
    }))
  };
  const handleBoxes = (index, event) => {
    if (isShipped)
      return;
    const { name, value } = event.target;
    const updatedBoxes = [...boxes];
    updatedBoxes[index][name] = value;
    setBoxes(updatedBoxes);
    setFormData((prev) => ({
      ...prev,
      boxes: boxes
    }))
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const [invoice, setInvoice] = useState(null)
  const handleInvoice = (e) => {
    const { files } = e.target;
    setInvoice(files[0])
  }
  const uploadInvoice = async () => {
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
        setFormData((prev) => ({
          ...prev,
          invoiceUrl: key
        }))
        alert("Invoice uploaded successfully!");
      } else {
        setFormData((prev) => ({
          ...prev,
          invoiceUrl: null
        }))
        alert("Failed to upload invoice!");
      }
    })

  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)

    let boxFlag = 0
    for (let i = 0; i < formData.boxes.length; i++) {
      for (let j = 0; j < formData.orders.length; j++) {
        if (parseInt(formData.orders[j].box_no) == i + 1) {
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
    for (let i = 0; i < formData.orders.length; i++) {
      for (let j = 0; j < formData.boxes.length; j++) {
        if (formData.orders[i].box_no == formData.boxes[j].box_no) {
          itemFlag = 1
        }
      }
      if (itemFlag == 0) {
        alert('Some items have invalid box no.')
        return
      }
      itemFlag = 0
    }

    fetch(`${API_URL}/order/domestic/update`, {
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
          alert('Order failed: ' + result.message)
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during Order');
      });
  }
  return (
    <Dialog 
      open={isManage} 
      onClose={() => setIsManage(false)}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <div>MANAGE SHIPMENT</div>
          <IconButton onClick={() => setIsManage(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <InputLabel>Pickup Warehouse Name</InputLabel>
              <Select
                value={formData.wid}
                onChange={handleChange}
                size="small"
                name="wid"
                label="Pickup Warehouse Name"
              >
                <MenuItem value="">Select Warehouse</MenuItem>
                {warehouses.map((warehouse) => (
                  <MenuItem key={warehouse.wid} value={warehouse.wid}>
                    {warehouse.warehouseName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 300, flex: 1 }}>
              <TextField
                label="Pickup Date"
                type="date"
                name="pickupDate"
                size="small"
                value={formData.pickupDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
            <FormControl sx={{ minWidth: 300, flex: 1 }}>
              <TextField
                label="Pickup Time"
                type="time"
                name="pickupTime"
                size="small"
                value={formData.pickupTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
            <FormControl sx={{ minWidth: 300, flex: 1 }}>
              <TextField
                label="Order Id"
                name="order"
                size="small"
                placeholder="Ex. ORDER123456"
                value={formData.order}
                disabled
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ minWidth: 300, flex: 1 }}>
              <TextField
                label="Customer Reference Number"
                name="customer_reference_number"
                size="small"
                placeholder="Ex. REF123"
                value={formData.customer_reference_number}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ minWidth: 300, flex: 1 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={formData.payMode}
                onChange={handleChange}
                name="payMode"
                size="small"
                label="Payment Method"
              >
                <MenuItem value="COD">COD</MenuItem>
                <MenuItem value="Pre-paid">Prepaid</MenuItem>
                <MenuItem value="topay">To Pay</MenuItem>
              </Select>
            </FormControl>
             <FormControl sx={{ minWidth: 300, flex: 1 }}>
              <TextField
                label="COD Amount"
                name="cod"
                size="small"
                value={formData.cod}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ minWidth: 300, flex: 1 }}>
              <InputLabel>Shipping Type</InputLabel>
              <Select
                value={formData.shippingType}
                onChange={handleChange}
                name="shippingType"
                size="small"
                label="Shipping Type"
              >
                <MenuItem value="Surface">Surface</MenuItem>
                <MenuItem value="Express">Express</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300, flex: 1 }}>
              <TextField
                label="Buyer's Name"
                name="name"
                size="small"
                placeholder="Ex. Aditya Kumar"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300, flex: 2 }}>
              <TextField
                label="Buyer's email"
                name="email"
                placeholder="Ex. customer@example.com"
                size="small"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300, flex: 1 }}>
              <TextField
                label="Buyer's Phone"
                name="phone"
                size="small"
                placeholder="Ex. 1234554321"
                value={formData.phone}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300, flex: 3 }}>
              <TextField
                label="Shipping Address"
                name="address"
                size="small"
                placeholder="Ex. House no. 105, Kankarbagh, Patna, Bihar"
                value={formData.address}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300, flex: 1 }}>
              <InputLabel>Shipping Address Type</InputLabel>
              <Select
                value={formData.addressType}
                onChange={handleChange}
                name="addressType"
                size="small"
                label="Shipping Address Type"
              >
                <MenuItem value="home">Home</MenuItem>
                <MenuItem value="office">Office</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300, flex: 1 }}>
              <TextField
                label="Shipping Postcode"
                name="postcode"
                size="small"
                placeholder="Ex. 813210"
                value={formData.postcode}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300, flex: 1 }}>
              <TextField
                label="Shipping City"
                name="city"
                size="small"
                placeholder="Ex. Bhagalpur"
                value={formData.city}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300, flex: 1 }}>
              <TextField
                label="Shipping State"
                name="state"
                size="small"
                placeholder="Ex. Bihar"
                value={formData.state}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300, flex: 1 }}>
              <TextField
                label="Shipping Country"
                name="country"
                size="small"
                placeholder="Ex. India"
                disabled
                value={formData.country}
                onChange={handleChange}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.same}
                  onChange={handleChange}
                  name="same"
                />
              }
              label="Billing address is same as Shipping address"
            />
          </Box>
          <Box sx={{ display: formData.same ? 'none' : 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Billing Address"
                name="Baddress"
                size="small"
                placeholder="Ex. House no. 105, Kankarbagh, Patna, Bihar"
                value={formData.Baddress}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300, flex: 1 }}>
              <InputLabel>Billing Address Type</InputLabel>
              <Select
                value={formData.BaddressType}
                onChange={handleChange}
                name="BaddressType"
                size="small"
                label="Billing Address Type"
              >
                <MenuItem value="home">Home</MenuItem>
                <MenuItem value="office">Office</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300,  flex: 1 }}>
              <TextField
                label="Billing Postcode"
                name="Bpostcode"
                size="small"
                placeholder="Ex. 813210"
                value={formData.Bpostcode}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300,   flex: 1 }}>
              <TextField
                label="Billing City"
                name="Bcity"
                size="small"
                placeholder="Ex. Bhagalpur"
                value={formData.Bcity}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300,   flex: 1 }}>
              <TextField
                label="Billing State"
                name="Bstate"
                size="small"
                placeholder="Ex. Bihar"
                value={formData.Bstate}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300,   flex: 1 }}>
              <TextField
                label="Billing Country"
                name="Bcountry"
                size="small"
                placeholder="Ex. India"
                value={formData.Bcountry}
                onChange={handleChange}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Boxes</div>
            {boxes.map((box, index) => (
              <Box key={index} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
                <FormControl sx={{ minWidth: 100, flex: 1 }}>
                  <TextField
                    label="Box No"
                    name="box_no"
                    size="small"
                    disabled
                    value={index + 1}
                  />
                </FormControl>
                <FormControl sx={{ minWidth: 100, flex: 1 }}>
                  <TextField
                    label="Length (in cm)"
                    name="length"
                    size="small"
                    value={box.length}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </FormControl>
                <FormControl sx={{ minWidth: 100,  flex: 1 }}>
                  <TextField
                    label="Width (in cm)"
                    name="breadth"
                    size="small"
                    value={box.breadth}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </FormControl>
                <FormControl sx={{ minWidth: 100, flex: 1 }}>
                  <TextField
                    label="Height (in cm)"
                    name="height"
                    size="small"
                    value={box.height}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </FormControl>
                <Box sx={{ flex: 1, display: 'flex' }}>
                  <FormControl sx={{ minWidth: 90, flex: 1 }}>
                  <TextField
                    label="Weight"
                    name="weight"
                    size="small"
                    value={box.weight}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </FormControl>
                <FormControl sx={{ minWidth: 50 }}>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={box.weight_unit}
                    onChange={(e) => handleBoxes(index, e)}
                    name="weight_unit"
                    size="small"
                    label="Weight Unit"
                  >
                    <MenuItem value="g">gm</MenuItem>
                    <MenuItem value="kg">kg</MenuItem>
                  </Select>
                </FormControl>
                </Box>
                <FormControl sx={{ minWidth: 100, flex: 1 }}>
                  <TextField
                    label="Quantity"
                    name="quantity"
                    size="small"
                    type="text"
                    value={box.quantity}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </FormControl>
                {boxes.length > 1 && (
                  <FormControl fullWidth sx={{ minWidth: 150 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeBox(index)}
                      sx={{ width: '100%' }}
                    >
                      Remove
                    </Button>
                  </FormControl>
                )}
              </Box>
            ))}
            <Button
              variant="contained"
              onClick={addBox}
              sx={{ borderRadius: '24px', mt: 2 }}
            >
              Add More Boxes
            </Button>
          </Box>
          <Box sx={{ my: 4 }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Items</div>
            {orders.map((order, index) => (
              <Box key={index} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
                <FormControl sx={{ minWidth: 150, flex: 1 }}>
                  <TextField
                    label="Box No"
                    name="box_no"
                    size="small"
                    value={order.box_no}
                    onChange={(e) => handleOrders(index, e)}
                  />
                </FormControl>
                <FormControl  sx={{ minWidth: 300, flex: 2 }}>
                  <TextField
                    label="Product Name"
                    name="product_name"
                    size="small"
                    value={order.product_name}
                    onChange={(e) => handleOrders(index, e)}
                  />
                </FormControl>
                <FormControl sx={{ minWidth: 75, flex: 1 }}>
                  <TextField
                    label="Quantity"
                    name="product_quantity"
                    size="small"
                    type="number"
                    value={order.product_quantity}
                    onChange={(e) => handleOrders(index, e)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 100, flex: 1 }}>
                  <TextField
                    label="Price"
                    name="selling_price"
                    size="small"
                    value={order.selling_price}
                    onChange={(e) => handleOrders(index, e)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 100, flex: 1 }}>
                  <TextField
                    label="Tax"
                    name="tax_in_percentage"
                    size="small"
                    value={order.tax_in_percentage}
                    onChange={(e) => handleOrders(index, e)}
                  />
                </FormControl>
                {orders.length > 1 && (
                  <FormControl fullWidth sx={{ minWidth: 150 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeProduct(index)}
                      sx={{ width: '100%' }}
                    >
                      Remove
                    </Button>
                  </FormControl>
                )}
              </Box>
            ))}
            <Button
              variant="contained"
              onClick={addProduct}
              sx={{ borderRadius: '24px', mt: 2 }}
            >
              Add More Product
            </Button>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isB2B}
                onChange={handleChange}
                name="isB2B"
              />
            }
            label="Is this is a B2B shipment?"
          />
          {formData.isB2B && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
              <FormControl sx={{ minWidth: 150, flex:1 }}>
                <TextField
                  label="Invoice Number"
                  name="invoiceNumber"
                  size="small"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ minWidth: 150, flex:1 }}>
                <TextField
                  label="Invoice Date"
                  type="date"
                  size="small"
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
              <FormControl sx={{ minWidth: 150, flex:1 }}>
                <TextField
                  label="Invoice Amount"
                  name="invoiceAmount"
                  type="number"
                  size="small"
                  value={formData.invoiceAmount}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl fullWidth sx={{ minWidth: 300, flex: 1 }}>
                <InputLabel shrink htmlFor="invoice-upload">Invoice</InputLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
                  <input
                    accept="application/pdf,image/*"
                    style={{ display: 'none' }}
                    id="invoice-upload"
                    type="file"
                    onChange={handleInvoice}
                  />
                  <label htmlFor="invoice-upload">
                    <Button variant="outlined" component="span" size="small" sx={{ borderRadius: '24px' }}>
                      {invoice ? invoice.name : "Choose File"}
                    </Button>
                  </label>
                  {formData.invoiceUrl && (
                    <Button
                      variant="outlined"
                      color="primary"
                      href={import.meta.env.VITE_APP_BUCKET_URL + formData.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={{ whiteSpace: 'nowrap', borderRadius: '24px' }}
                    >
                      View
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={uploadInvoice}
                    color="primary"
                    size="small"
                    sx={{ whiteSpace: 'nowrap', borderRadius: '24px' }}
                    disabled={!invoice} // Disable update if no file is selected
                  >
                    Upload
                  </Button>
                </Box>
              </FormControl>
              <FormControl fullWidth sx={{ minWidth: 300 }}>
                <TextField
                  label="E-Waybill"
                  name="ewaybill"
                  value={formData.ewaybill}
                  onChange={handleChange}
                />
              </FormControl>
            </Box>
          )}
          <Box sx={{ my: 4 }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Additional Info</div>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
            <FormControl fullWidth sx={{ minWidth: 300, flex:1 }}>
              <TextField
                label="Discount"
                name="discount"
                size="small"
                value={formData.discount}
                onChange={handleChange}
              />
            </FormControl>
           
            
            <FormControl fullWidth sx={{ minWidth: 300, flex:1 }}>
              <TextField
                label="Seller GST"
                name="gst"
                size="small"
                value={formData.gst}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300, flex:1 }}>
              <TextField
                label="Customer GSTIN (FOR B2B)"
                name="Cgst"
                size="small"
                value={formData.Cgst}
                onChange={handleChange}
              />
            </FormControl>
            </Box>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isShipped}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  // Function to add page numbers to the array
  const addPageNumber = (pageNum) => {
    pages.push({
      number: pageNum,
      isCurrent: pageNum === currentPage
    });
  };

  // Add first page
  addPageNumber(1);

  if (totalPages <= 7) {
    // If total pages is 7 or less, show all pages
    for (let i = 2; i < totalPages; i++) {
      addPageNumber(i);
    }
  } else {
    if (currentPage <= 4) {
      // We're near the start
      for (let i = 2; i <= 5; i++) {
        addPageNumber(i);
      }
      pages.push({ number: '...', isCurrent: false });
      addPageNumber(totalPages);
    } else if (currentPage >= totalPages - 3) {
      // We're near the end
      pages.push({ number: '...', isCurrent: false });
      for (let i = totalPages - 4; i < totalPages; i++) {
        addPageNumber(i);
      }
    } else {
      // We're in the middle
      pages.push({ number: '...', isCurrent: false });
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        addPageNumber(i);
      }
      pages.push({ number: '...', isCurrent: false });
      addPageNumber(totalPages);
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 4 }}>
      <Button
        variant="outlined"
        size="small"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        sx={{ borderRadius: '24px', minWidth: { xs: 70, sm: 80 } }}
      >
        Prev
      </Button>

      {pages.map((page, idx) => (
        <Button
          key={idx}
          variant={page.isCurrent ? 'contained' : 'outlined'}
          size="small"
          onClick={() => page.number !== '...' && onPageChange(page.number)}
          disabled={page.number === '...'}
          sx={{
            borderRadius: '24px',
            minWidth: 35,
            padding: '4px 8px', // Adjust padding for smaller size
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          {page.number}
        </Button>
      ))}

      <Button
        variant="outlined"
        size="small"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        sx={{ borderRadius: '24px', minWidth: { xs: 70, sm: 80 } }}
      >
        Next
      </Button>
    </Box>
  );
};

// Removed custom Modal component as MUI Dialog is used for ManageForm

const Card = ({ shipment, onManageClick }) => {
  const isShipped = Boolean(shipment.awb);

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 2,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: 4,
          cursor: 'pointer', // Indicate clickable
        },
      }}
      onClick={() => onManageClick(shipment)} // Trigger manage on card click
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr', // Stacks on very small screens
            sm: 'repeat(2, 1fr)', // 2 columns on small screens
            md: 'repeat(4, 1fr)', // 4 columns on medium screens
            lg: 'repeat(12, 1fr)' // 12 columns on large screens for alignment
          },
          gap: { xs: 1, sm: 2, md: 3 },
          p: 2,
          alignItems: 'center',
        }}
      >
        {/* Order Info */}
        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 1', lg: 'span 3' } }}>
          <div className="text-base font-bold text-blue-700 mb-1">{shipment.ord_id}</div>
          {shipment.customer_reference_number && (
            <div className="text-xs text-gray-600 mb-1">Ref: {shipment.customer_reference_number}</div>
          )}
          <div className="text-xs text-gray-500">
            {shipment.date ? new Date(shipment.date).toLocaleString() : 'N/A'}
          </div>
        </Box>

        {/* Customer Info */}
        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 1', lg: 'span 3' } }}>
          <div className="text-sm font-medium text-gray-800">{shipment.fullName}</div>
          <div className="text-xs text-gray-600 truncate">{shipment.email}</div>
        </Box>

        {/* Shipping Info */}
        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 3', lg: 'span 4' } }}>
          {isShipped ? (
            <div className="space-y-1">
              {shipment.service_name && (
                <div className="text-xs text-gray-600">
                  <span className="font-semibold">Service:</span> {shipment.service_name}
                </div>
              )}
              {shipment.awb && (
                <div className="text-xs text-gray-600">
                  <span className="font-semibold">AWB:</span> {shipment.awb}
                </div>
              )}
              {shipment.shipping_vendor_reference_id && (
                <div className="text-xs text-gray-600">
                  <span className="font-semibold">LRN:</span> {shipment.shipping_vendor_reference_id}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-500">No shipping details yet</div>
          )}
        </Box>

        {/* Status */}
        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 1', lg: 'span 1' }, display: 'flex', alignItems: 'center' }}>
          <span className={`px-2 py-1 text-xs rounded-full ${
            isShipped ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isShipped ? 'Shipped' : 'Pending'}
          </span>
        </Box>

        {/* Action Button */}
        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1', md: 'span 1', lg: 'span 1' }, display: 'flex', justifyContent: { xs: 'flex-start', lg: 'flex-end' }, alignItems: 'center' }}>
          <Button
            variant="contained"
            size="small"
            onClick={(e) => { e.stopPropagation(); onManageClick(shipment); }} // Stop propagation to prevent card click from firing twice
            sx={{ borderRadius: '24px' }}
          >
            {isShipped ? "View" : "Manage"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

const Listing = ({ step, setStep }) => {
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [filteredShipments, setFilteredShipments] = useState([]); // This state was unused, removed.
  const [filters, setFilters] = useState({
    email: "",
    orderId: "",
    name: "",
    startDate: "",
    endDate: ""
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [abortController, setAbortController] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isManageOpen, setIsManageOpen] = useState(false);

  // Debounce filter changes
  useEffect(() => {
    const timerId = setTimeout(() => {
      setPage(1); // Reset to first page when filters change
      setDebouncedFilters(filters);
    }, 500); // 500ms delay

    return () => clearTimeout(timerId);
  }, [filters]);

  // Fetch data with filters
  useEffect(() => {
    const fetchData = async () => {
      if (abortController) {
        abortController.abort();
      }
      const newController = new AbortController();
      setAbortController(newController);

      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page,
          ...(debouncedFilters.name && { merchant_name: debouncedFilters.name }),
          ...(debouncedFilters.email && { merchant_email: debouncedFilters.email }),
          ...(debouncedFilters.orderId && { orderId: debouncedFilters.orderId }),
          ...(debouncedFilters.startDate && { startDate: convertToUTCISOString(debouncedFilters.startDate) }),
          ...(debouncedFilters.endDate && { endDate: convertToUTCISOString(`${debouncedFilters.endDate}T23:59:59.999Z`) })
        });

        const response = await fetch(`${API_URL}/order/domestic/all?${queryParams}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
          signal: newController.signal
        });
        
        const result = await response.json();
        if (result.success) {
          setShipments(result.orders);
          setTotalPages(result.totalPages);
        } else {
          alert("Failed to fetch parcels");
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error:', error);
          alert('An error occurred during Order fetch');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedFilters, page]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const columns = [
    {
      field: 'ord_id',
      headerName: 'Order ID',
      width: 150,
      renderCell: (params) => (
        <span className="font-semibold text-blue-700">{params.value}</span>
      ),
    },
    {
      field: 'customer_reference_number',
      headerName: 'Customer Ref No.',
      width: 150,
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 180,
      renderCell: (params) =>
        params.row.date ? new Date(params.row.date).toLocaleString() : '',
    },
    { field: 'fullName', headerName: 'Customer Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'shipping',
      headerName: 'Shipping Details',
      width: 250,
      renderCell: (params) => {
        const isShipped = Boolean(params.row.awb);
        return (
          <Box sx={{ whiteSpace: 'normal', lineHeight: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', py: 1 }}>
            {isShipped ? (
              <>
                {params.row.service_name && <div>{params.row.service_name}</div>}
                {params.row.awb && <div className="text-sm">AWB: <span className="font-medium">{params.row.awb}</span></div>}
                {params.row.shipping_vendor_reference_id && <div className="text-sm">LRN: <span className="font-medium">{params.row.shipping_vendor_reference_id}</span></div>}
              </>
            ) : (
              <div className="text-xs text-gray-500">No shipping details yet</div>
            )}
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const isShipped = Boolean(params.row.awb);
        return (
          <Box
            sx={{
              bgcolor: isShipped ? 'success.light' : 'warning.light', // Use theme colors
              color: isShipped ? 'success.dark' : 'warning.dark',
              px: 2,
              py: 0.5,
              borderRadius: 8,
              fontSize: '0.875rem',
              display: 'inline-flex', // Ensure the box wraps content tightly
              alignItems: 'center',
            }}
          >
            {isShipped ? 'Shipped' : 'Pending'}
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const isShipped = Boolean(params.row.awb);
        return (
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setSelectedShipment(params.row);
              setIsManageOpen(true);
            }}
            sx={{ borderRadius: '24px' }}
          >
            {isShipped ? 'View' : 'Manage'}
          </Button>
        );
      },
    },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Use md breakpoint for tablet/mobile

  const handleManageClick = (shipment) => {
    setSelectedShipment(shipment);
    setIsManageOpen(true);
  };

  return (
    <div className={`w-full p-4 flex flex-col items-center space-y-6 ${step == 0 ? "" : "hidden"}`}>
      <Paper sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
        <Box sx={{ mb: 3 }}>
          <h2 className="text-2xl font-medium">Shipments</h2>
        </Box>

        {/* Filters */}
        <Paper elevation={1} sx={{ mb: 3, p: 3, borderRadius: 2 }}>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Filter Shipments</h3>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(auto-fill, minmax(200px, 1fr))',
              },
              gap: 2,
            }}
          >
            {[
              { label: 'Merchant Name', name: 'name' },
              { label: 'Merchant Email', name: 'email' },
              { label: 'Order ID', name: 'orderId' },
              { label: 'Start Date', name: 'startDate', type: 'date' },
              { label: 'End Date', name: 'endDate', type: 'date' },
            ].map(({ label, name, type }) => (
              <TextField
                key={name}
                label={label}
                name={name}
                type={type || 'text'}
                value={filters[name]}
                onChange={handleChange}
                size="small"
                variant="outlined"
                InputLabelProps={{
                  shrink: type === 'date' || filters[name],
                }}
              />
            ))}
          </Box>
        </Paper>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            Loading Shipments...
          </Box>
        ) : isMobile ? (
          // Mobile view: list of Cards
          <Box sx={{ mt: 3 }}>
            {shipments.length > 0 ? (
              shipments.map((shipment) => (
                <Card key={shipment.ord_id} shipment={shipment} onManageClick={handleManageClick} />
              ))
            ) : (
              <Box sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
                No shipments found matching your criteria.
              </Box>
            )}
          </Box>
        ) : (
          // Desktop view: DataGrid
          <Box sx={{ height: 600, width: '100%', mt: 3 }}>
            <DataGrid
              rows={shipments}
              columns={columns}
              loading={isLoading}
              hideFooter={true} // Pagination is handled separately
              disableSelectionOnClick
              getRowId={(row) => row.ord_id}
              rowHeight={80}
              // Added some DataGrid specific styling for a smoother look
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #e0e0e0',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#f9f9f9',
                },
                borderRadius: 2,
              }}
            />
          </Box>
        )}

        {/* Custom Pagination - applied to both views */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </Paper>

      {selectedShipment && (
        <ManageForm
          isManage={isManageOpen}
          setIsManage={setIsManageOpen}
          shipment={selectedShipment}
          isShipped={Boolean(selectedShipment.awb)}
        />
      )}
    </div>
  );
};

const UpdateOrder = () => {
  const [step, setStep] = useState(0)
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      {step == 0 && <Listing step={step} setStep={setStep} />}
    </div>
  );
};

export default UpdateOrder;
