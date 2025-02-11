import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_APP_API_URL
const ComparePrices = ({method, boxes, status, origin, dest, payMode, codAmount, isB2B, invoiceAmount}) => {
  const [prices,setPrices] = useState([])
  useEffect(()=>{
    console.log({method, status, origin, dest, payMode, codAmount})
    const data = async () => {
      await fetch(`${API_URL}/shipment/domestic/price`, {
        method: 'POST',
        headers: { 'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
          body : JSON.stringify({method: method, boxes : boxes, status : status, origin : origin, dest : dest, payMode : payMode, codAmount : codAmount, isB2B : isB2B, invoiceAmount : invoiceAmount, priceCalc : true}),
        
      }).then(response => response.json()).then(result => {console.log(result); setPrices(result.prices)}).catch(error => console.log(error + " " + error.message))
    }  
    data()
  }, []) 
  return (
    <>
      <div className="w-full absolute z-[1] inset-0 overflow-y-scroll px-4 pt-24 pb-4 flex flex-col bg-gray-100 items-center space-y-6">
        <div className="text-center text-3xl font-medium">
          CHOOSE YOUR SERVICE
        </div>
        <div className="w-full p-4 ">
          {
            prices.length ? prices.map((price)=>(
              <div className="w-full h-16 bg-white relative justify-center px-4 flex flex-col border-b" >
          <div className="font-bold">{price.name+" "+price.weight}</div>
          <div>{price.chargableWeight && "Chargable Weight : "+price.chargableWeight+"gm"}</div>
          <div className="absolute right-4">{`₹${Math.round((price.price))}`}</div>
        </div>
            ))
          : null
          }
          
        </div>
      </div>
    </>
  )
}


const Domestic = () => {
  const [boxes, setBoxes] = useState([{weight : 0, length : 0, breadth : 0, height : 0}])
    const [formData, setFormData] = useState({
      method : 'S',
      status: 'Delivered',
      origin : '',
      dest : '',
      payMode : 'COD',
      codAmount : '0',
      invoiceAmount : 0,
      isB2B : false
    })
    const [showCompare, setShowCompare] = useState(false)
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.origin.length !== 6 || formData.origin.length !== 6){
        toast.error("Origin and Destination pincodes should be 6 digits")
        return;
      }
      if (formData.isB2B && formData.invoiceAmount < 1){
        toast.error("Invoice Amount should be atleast 1 for B2B")
        return;
      }
      if (formData.payMode == "COD" && formData.codAmount < 1){
        toast.error("COD Amount should be atleast 1")
        return;
      }
      let boxValidationError = false;
      boxes.map(box => {
        if (!box.weight){
          toast.error("Weight is required")
          boxValidationError = true;
        }
        if (!box.length || !box.breadth || !box.height){
          toast.error("Length, Breadth and Height should be non-zero")
          boxValidationError = true;
        }
        if (box.quantity < 1){
          toast.error("Quantity should be atleast 1")
          boxValidationError = true;
        }
      })
      if (boxValidationError) return;
      setShowCompare(true)
    }
    const handleBoxes = (index, event) => {
      const { name, value } = event.target;
      const updatedBoxes = [...boxes];
      updatedBoxes[index][name] = value;
      setBoxes(updatedBoxes);
    };
    const addBox = () => {
      setBoxes([...boxes, {  length: 0 , breadth : 0 , height : 0  , weight: 0, weight_unit : 'g', quantity: 1 }]);
    };
    const removeBox = (index) => {
      const updatedBoxes = boxes.filter((_, i) => i !== index);
      setBoxes(updatedBoxes);
    };
    return (
      <>
        {showCompare && <ComparePrices {...formData} boxes={boxes} />}
        <form action="" className="max-w-4xl mx-auto p-4 space-y-5" onSubmit={handleSubmit}>
        {/* Row 1: Shipping Method and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700">
              Shipping Method
            </label>
            <select
              id="method"
              name="method"
              value={formData.method}
                  onChange={handleChange}
              className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
            >
              
              <option value="S">Surface</option>
              <option value="E">Express</option>
            </select>
          </div>
  
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
                  onChange={handleChange}
              className="mt-1 block text-sm w-full p-2 border border-gray-300 rounded-md"
            >
              
              <option value="Delivered">Forward</option>
              <option value="RTO">RTO</option>
              <option value="DTO">Reverse</option>
            </select>
          </div>
        </div>
  
        {/* Row 2: Origin Pincode and Destination Pincode */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
              Origin Pincode
            </label>
            <input
              type="text"
              id="origin"
              name="origin"
              placeholder="Ex. 813210"
                  value={formData.origin}
                  onChange={handleChange}
              className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
  
          <div>
            <label htmlFor="dest" className="block text-sm font-medium text-gray-700">
              Destination Pincode
            </label>
            <input
              type="text"
              id="dest"
                  name="dest"
                  placeholder="Ex. 845401"
                  value={formData.dest}
                  onChange={handleChange}
              className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
  
        {/* Row 3: COD Amount and Payment Mode */}
        <div className="grid grid-cols-2  gap-4">
          <div>
            <label htmlFor="codAmount" className="block text-sm font-medium text-gray-700">
              COD Amount
            </label>
            <input
              type="number"
              id="codAmount"
              name="codAmount"
              placeholder="Ex. 157"
              value={formData.codAmount}
              onChange={handleChange}
              className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
  
          <div>
            <label htmlFor="payMode" className="block text-sm font-medium text-gray-700">
              Payment Mode
            </label>
            <select
              name="payMode"
              id="payMode"
              value={formData.payMode}
              onChange={handleChange}
              className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
            >
              
              <option value="COD">COD</option>
              <option value="Pre-paid">Prepaid</option>
              <option value="Pickup">Pickup</option>
            </select>
          </div>
        </div>
  
        {/* Row 4:Shipment Type and Invoice Amount */}
        <div className="grid grid-cols-2  gap-4">
        <div>
            <label htmlFor="shipmentType" className="block text-sm font-medium text-gray-700">
            Shipment Type
            </label>
            <select
              name="isB2B"
              id="shipmentType"
              value={formData.isB2B}
              onChange={handleChange}
              className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
            >
              
              <option value={false}>B2C</option>
              <option value={true}>B2B</option>
            </select>
          </div>
          <div>
            <label htmlFor="invoiceAmount" className="block text-sm font-medium text-gray-700">
            Invoice Amount
            </label>
            <input
              type="text"
              id="invoiceAmount"
              name="invoiceAmount"
              placeholder="Ex. 157"
              value={formData.invoiceAmount}
              onChange={handleChange}
              className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
  
          
        </div>
        
            {boxes.map((box,index)=>(
              <>
                 <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 p-2 rounded-md bg-gray-200">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
              Weight
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              placeholder="Ex. 1500"
              value = {box.weight}
              onChange={(e)=>handleBoxes(index,e)}
              className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="weight_unit" className="block text-sm font-medium text-gray-700">
            W unit
            </label>
            <select
              name="weight_unit"
              id="weight_unit"
              value={box.weight_unit}
              onChange={(e)=>handleBoxes(index,e)}
              className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
            >
              
              <option value={'g'}>g</option>
              <option value={'kg'}>kg</option>
            </select>
          </div>
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700">
              L (in cm)
            </label>
            <input
              type="text"
              id="length"
              name="length"
              placeholder="Ex. 2.5"
              value={box.length}
              onChange={(e)=>handleBoxes(index,e)}
              className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
  
          <div>
            <label htmlFor="breadth" className="block text-sm font-medium text-gray-700">
              B (in cm)
            </label>
            <input
              type="text"
              id="breadth"
              name="breadth"
              placeholder="Ex. 2.5"
              value={box.breadth}
              onChange={(e)=>handleBoxes(index,e)}
              className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
  
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
              H (in cm)
            </label>
            <input
              type="text"
              id="height"
              name="height"
              placeholder="Ex. 2.5"
              value={box.height}
              onChange={(e)=>handleBoxes(index,e)}
              className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Count
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              placeholder="Ex. 2.5"
              min={1}
              value={box.quantity}
              onChange={(e)=>handleBoxes(index,e)}
              className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        
              {boxes.length > 1 && <button type="button" className="absolute w-5 h-5 text-sm flex justify-center items-center top-0 right-0  border rounded-full bg-red-500 text-white" onClick={() => removeBox(index)}>X</button>}
              </div>
              </>
            ))}
            <div className="mx-auto  justify-center items-center flex">
              <button type="button" className="m-2 px-2 md:px-5 py-2 text-sm md:text-base border border-green-600 rounded-3xl bg-white text-green-600" onClick={addBox}>Add More Boxes</button>
              <button type="submit" className="border bg-green-600 text-white mx-2 text-sm md:text-base py-2 md:px-4 px-2 rounded-3xl">
                Submit and Compare
              </button></div>
          </form>
      </>
    )
}




const PriceCalc = () => {
  return (
    <>
      
      <div className="relative">
      
      <div className="w-full p-8 flex flex-col items-center space-y-6">
        <div className="justify-center text-center text-xl md:text-3xl font-medium mb-8 flex">
          Calculate Your Shipping Price
        </div>
        <Domestic />
      </div>
      </div>
    </>
  );
};

export default PriceCalc
