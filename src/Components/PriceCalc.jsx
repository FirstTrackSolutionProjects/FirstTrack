import { useState, useEffect } from "react";
// Assuming 'toast' is imported from a library like react-hot-toast or similar.
// For example: import toast from 'react-hot-toast'; 

const API_URL = import.meta.env.VITE_APP_API_URL;

const ComparePrices = ({ method, boxes, status, origin, dest, payMode, codAmount, isB2B, invoiceAmount, onClose }) => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/shipment/domestic/price`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ method, boxes, status, origin, dest, payMode, codAmount, isB2B, invoiceAmount, priceCalc: true }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setPrices(result.prices || []);
      } catch (e) {
        console.error("Failed to fetch prices:", e);
        setError("Failed to load prices. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, [method, boxes, status, origin, dest, payMode, codAmount, isB2B, invoiceAmount]); // Depend on all props to refetch if they change

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col relative transform scale-95 animate-scale-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">
            CHOOSE YOUR SERVICE
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-light leading-none transition-colors duration-200"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {loading && (
            <div className="flex justify-center items-center h-full min-h-[100px] text-gray-600">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading prices...
            </div>
          )}
          {error && (
            <div className="text-red-600 text-center p-4 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          {!loading && !error && prices.length === 0 && (
            <div className="text-center text-gray-600 p-4 bg-gray-50 rounded-md">
              No prices found for the selected criteria.
            </div>
          )}
          {!loading && !error && prices.length > 0 && prices.map((price, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex justify-between items-center border border-gray-200"
            >
              <div>
                <div className="font-semibold text-lg text-gray-800">
                  {price.name}
                  {price.weight && <span className="text-sm font-normal text-gray-600 ml-2">({price.weight})</span>}
                </div>
                {price.chargableWeight && (
                  <div className="text-sm text-gray-500 mt-1">
                    Chargable Weight: {price.chargableWeight} gm
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-green-600">
                ₹{Math.round(price.price)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const Domestic = () => {
  const [boxes, setBoxes] = useState([{ weight: 0, length: 0, breadth: 0, height: 0, weight_unit: 'g', quantity: 1 }]);
  const [formData, setFormData] = useState({
    method: 'S',
    status: 'Delivered',
    origin: '',
    dest: '',
    payMode: 'COD',
    codAmount: 0, // Changed to number
    invoiceAmount: 0,
    isB2B: false
  });
  const [showCompare, setShowCompare] = useState(false);

  // Helper for toast messages (replace with your actual toast implementation)
  const toast = {
    error: (message) => console.error("Error:", message),
    success: (message) => console.log("Success:", message)
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'isB2B' // Special handling for isB2B select which returns string
            ? value === 'true'
            : type === 'number'
              ? value === '' ? '' : parseFloat(value) // Allow empty string for numeric inputs
              : value,
    }));
  };

  const handleBoxes = (index, event) => {
    const { name, value, type } = event.target;
    const updatedBoxes = [...boxes];
    updatedBoxes[index][name] =
      type === 'number'
        ? value === ''
          ? '' // Allow empty string for numeric inputs
          : (name === 'quantity' ? parseInt(value, 10) : parseFloat(value))
        : value;
    setBoxes(updatedBoxes);
  };

  const addBox = () => {
    setBoxes([...boxes, { length: 0, breadth: 0, height: 0, weight: 0, weight_unit: 'g', quantity: 1 }]);
  };

  const removeBox = (index) => {
    const updatedBoxes = boxes.filter((_, i) => i !== index);
    setBoxes(updatedBoxes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    if (!/^\d{6}$/.test(formData.origin) || !/^\d{6}$/.test(formData.dest)) {
      toast.error("Origin and Destination pincodes must be 6 digits.");
      isValid = false;
    }
    if (formData.isB2B && formData.invoiceAmount < 1) {
      toast.error("Invoice Amount must be at least 1 for B2B shipments.");
      isValid = false;
    }
    if (formData.payMode === "COD" && formData.codAmount < 1) {
      toast.error("COD Amount must be at least 1 for COD shipments.");
      isValid = false;
    }

    boxes.forEach((box, index) => {
      if (!box.weight || isNaN(parseFloat(box.weight)) || parseFloat(box.weight) <= 0) {
        toast.error(`Box ${index + 1}: Weight is required and must be greater than 0.`);
        isValid = false;
      }
      if (!box.length || !box.breadth || !box.height ||
        isNaN(parseFloat(box.length)) || parseFloat(box.length) <= 0 ||
        isNaN(parseFloat(box.breadth)) || parseFloat(box.breadth) <= 0 ||
        isNaN(parseFloat(box.height)) || parseFloat(box.height) <= 0) {
        toast.error(`Box ${index + 1}: Length, Breadth, and Height are required and must be greater than 0.`);
        isValid = false;
      }
      if (!box.quantity || isNaN(parseInt(box.quantity)) || parseInt(box.quantity) < 1) {
        toast.error(`Box ${index + 1}: Quantity is required and must be at least 1.`);
        isValid = false;
      }
    });

    if (isValid) {
      setShowCompare(true);
    }
  };

  return (
    <>
      {showCompare && (
        <ComparePrices
          {...formData}
          boxes={boxes}
          onClose={() => setShowCompare(false)}
        />
      )}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 md:p-8 bg-white shadow-xl rounded-2xl space-y-8 animate-fade-in-up">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 border-b pb-4 mb-6">Shipment Details</h3>

        {/* Section: Basic Shipment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="method" className="block text-sm font-semibold text-gray-700 mb-1">
              Shipping Method
            </label>
            <select
              id="method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="S">Surface</option>
              <option value="E">Express</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="Delivered">Forward</option>
              <option value="RTO">RTO</option>
              <option value="DTO">Reverse</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="origin" className="block text-sm font-semibold text-gray-700 mb-1">
              Origin Pincode
            </label>
            <input
              type="text"
              id="origin"
              name="origin"
              placeholder="Ex. 813210"
              value={formData.origin}
              onChange={handleChange}
              maxLength={6}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dest" className="block text-sm font-semibold text-gray-700 mb-1">
              Destination Pincode
            </label>
            <input
              type="text"
              id="dest"
              name="dest"
              placeholder="Ex. 845401"
              value={formData.dest}
              onChange={handleChange}
              maxLength={6}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Section: Payment & Type */}
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 border-b pb-4 mb-6 pt-4">Payment & Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="payMode" className="block text-sm font-semibold text-gray-700 mb-1">
              Payment Mode
            </label>
            <select
              name="payMode"
              id="payMode"
              value={formData.payMode}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="COD">COD</option>
              <option value="Pre-paid">Prepaid</option>
              <option value="Pickup">Pickup</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="codAmount" className="block text-sm font-semibold text-gray-700 mb-1">
              COD Amount
            </label>
            <input
              type="number"
              id="codAmount"
              name="codAmount"
              placeholder="Ex. 157"
              value={formData.codAmount}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={formData.payMode !== "COD"}
            />
          </div>

          <div className="form-group">
            <label htmlFor="shipmentType" className="block text-sm font-semibold text-gray-700 mb-1">
              Shipment Type
            </label>
            <select
              name="isB2B"
              id="shipmentType"
              value={formData.isB2B} // This will be boolean due to handleChange logic
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value={false}>B2C</option>
              <option value={true}>B2B</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="invoiceAmount" className="block text-sm font-semibold text-gray-700 mb-1">
              Invoice Amount
            </label>
            <input
              type="number" // Changed to number
              id="invoiceAmount"
              name="invoiceAmount"
              placeholder="Ex. 157"
              value={formData.invoiceAmount}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Section: Package Details */}
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 border-b pb-4 mb-6 pt-4">Package Details</h3>
        <div className="space-y-6">
          {boxes.map((box, index) => (
            <div key={index} className="relative p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-inner space-y-4">
              {boxes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBox(index)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white text-lg font-bold hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label={`Remove box ${index + 1}`}
                >
                  &times;
                </button>
              )}
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Box {index + 1}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-group">
                  <label htmlFor={`weight-${index}`} className="block text-sm font-semibold text-gray-700 mb-1">
                    Weight
                  </label>
                  <input
                    type="number"
                    id={`weight-${index}`}
                    name="weight"
                    placeholder="Ex. 1500"
                    value={box.weight}
                    onChange={(e) => handleBoxes(index, e)}
                    min="0"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`weight_unit-${index}`} className="block text-sm font-semibold text-gray-700 mb-1">
                    Weight Unit
                  </label>
                  <select
                    name="weight_unit"
                    id={`weight_unit-${index}`}
                    value={box.weight_unit}
                    onChange={(e) => handleBoxes(index, e)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value={'g'}>g</option>
                    <option value={'kg'}>kg</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor={`length-${index}`} className="block text-sm font-semibold text-gray-700 mb-1">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    id={`length-${index}`}
                    name="length"
                    placeholder="Ex. 2.5"
                    value={box.length}
                    onChange={(e) => handleBoxes(index, e)}
                    min="0"
                    step="0.1"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`breadth-${index}`} className="block text-sm font-semibold text-gray-700 mb-1">
                    Breadth (cm)
                  </label>
                  <input
                    type="number"
                    id={`breadth-${index}`}
                    name="breadth"
                    placeholder="Ex. 2.5"
                    value={box.breadth}
                    onChange={(e) => handleBoxes(index, e)}
                    min="0"
                    step="0.1"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`height-${index}`} className="block text-sm font-semibold text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id={`height-${index}`}
                    name="height"
                    placeholder="Ex. 2.5"
                    value={box.height}
                    onChange={(e) => handleBoxes(index, e)}
                    min="0"
                    step="0.1"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`quantity-${index}`} className="block text-sm font-semibold text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id={`quantity-${index}`}
                    name="quantity"
                    placeholder="Ex. 1"
                    min="1"
                    value={box.quantity}
                    onChange={(e) => handleBoxes(index, e)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <button
            type="button"
            onClick={addBox}
            className="flex items-center px-6 py-3 border-2 border-green-600 text-green-600 rounded-full font-semibold hover:bg-green-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add More Boxes
          </button>
          <button
            type="submit"
            className="flex items-center px-8 py-3 bg-green-600 text-white rounded-full font-semibold shadow-lg hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Submit and Compare
          </button>
        </div>
      </form>
    </>
  );
};


const PriceCalc = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center space-y-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 leading-tight">
          Calculate Your <span className="text-green-600">Shipping Price</span>
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl">
          Enter your shipment details and compare prices from various carriers to find the best option for your logistics needs.
        </p>
        <Domestic />
      </div>
    </div>
  );
};

export default PriceCalc;
