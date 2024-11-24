import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_APP_API_URL
const AddForm = ({ setMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pin: "",
    city: "",
    state: "",
    country: "India",
    username: localStorage.getItem("username"),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validatedFormData = {
      name : formData.name.trim(),
      phone : formData.phone.trim(),
      email : formData.email.trim(),
      address : formData.address.trim(),
      pin : formData.pin.trim(),
      city : formData.city.trim(),
      state : formData.state.trim(),
      country : formData.country.trim()
    }
    if (validatedFormData.phone.length !== 10) {alert("Please enter phone number with 10 digits"); return; }
    if (validatedFormData.pin.length !== 6) {alert("Please enter pincode with 6 digits"); return; }
    fetch(`${API_URL}/warehouse/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': localStorage.getItem("token"),
      },
      body: JSON.stringify(validatedFormData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Creating Warehouse...");
          setMode(0);
        } else {
          alert(result.message);
        }
      })
      .catch((error) => alert(error.message));
  };
  return (
    <>
      <div
        className={`w-full p-4 flex flex-col items-center space-y-6`}
      >
        <div className="w-[728px] h-16 px-4  relative flex">
          <div className="text-2xl font-medium">ADD WAREHOUSE</div>
          <div
            onClick={(e) => {
              e.preventDefault();
              setMode(0);
            }}
            className="px-5 py-1 bg-blue-500 absolute rounded-3xl text-white  right-4"
          >
            X
          </div>
        </div>
        <form
          action=""
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="name">Warehouse Name</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="name"
                name="name"
                maxLength={36}
                placeholder="Warehouse Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="phone">Mobile Number</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="phone"
                name="phone"
                minLength={10}
                maxLength={10}
                placeholder="Ex. 1234567890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="email">Email</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="email"
                name="email"
                placeholder="Ex. merchant123@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
            <label htmlFor="address">Address</label>
            <input required
              className="w-full border py-2 px-4 rounded-3xl"
              type="text"
              maxLength={100}
              id="address"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="pin">Pincode</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="pin"
                name="pin"
                minLength={6}
                maxLength={6}
                placeholder="Enter Pincode"
                value={formData.pin}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="city">City</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="city"
                name="city"
                placeholder="Enter City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
              <label htmlFor="state">State</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="state"
                name="state"
                placeholder="Enter State"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="country">Country</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="country"
                name="country"
                placeholder="Enter Country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* <div className="flex-1 mx-2 mb-2 min-w-[300px] flex justify-center space-x-3">
            <input
                className=" border py-2 px-4 rounded-3xl"
                type="checkbox"
                id="same"
                name="same"
                value={formData.same}
                onChange={handleChange}
              />
              <label htmlFor="same">Return address is same as Pickup address</label>
              
            </div> */}
          <button
            type="submit"
            className="border bg-white mx-2  py-2 px-4 rounded-3xl"
          >
            Create Warehouse
          </button>
        </form>
      </div>
    </>
  );
};

const ManageForm = ({ isManage, setIsManage, name, address, pin, phone, wid }) => {
  const [formData, setFormData] = useState({
    wid: wid,
    name: name,
    phone: phone,
    address: address,
    pin: pin
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const validatedFormData = {
      wid : formData.wid,
      name : formData.name.trim(),
      phone : formData.phone.trim(),
      address : formData.address.trim(),
      pin : formData.pin.trim()
    }
    if (validatedFormData.phone.length !== 10) {alert("Please enter phone number with 10 digits"); return; }
    if (validatedFormData.pin.length !== 6) {alert("Please enter pincode with 6 digits"); return; }
    fetch(`${API_URL}/warehouse/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": localStorage.getItem("token"),
      },
      body: JSON.stringify(validatedFormData),
    })
      .then((response) => response.json())
      .then((result) => alert(result.message))
      .catch((error) => alert(error.message));
  };
  return (
    <>
      <div
        className={`absolute  z-20 bg-white w-full p-4 flex flex-col items-center space-y-6 ${isManage ? "" : "hidden"
          }`}
      >
        <div className="w-[728px] h-16 px-4  relative flex">
          <div className="text-2xl font-medium">MANAGE WAREHOUSE</div>
          <div
            onClick={(e) => {
              e.preventDefault();
              setIsManage(0);
            }}
            className="px-5 py-1 bg-blue-500 absolute rounded-3xl text-white  right-4"
          >
            X
          </div>
        </div>
        <form
          action=""
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="name">Warehouse Name</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="name"
                name="name"
                placeholder="Warehouse Name"
                value={formData.name}
                readOnly
              />
            </div>
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="phone">Mobile Number</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="phone"
                name="phone"
                minLength={10}
                maxLength={10}
                placeholder="Ex. 1234567890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
            <label htmlFor="address">Address</label>
            <input required
              className="w-full border py-2 px-4 rounded-3xl"
              type="text"
              maxLength={100}
              id="address"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="pin">Pincode</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="pin"
                name="pin"
                minLength={6}
                maxLength={6}
                placeholder="XXXXXX"
                value={formData.pin}
                onChange={handleChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className="border bg-white mx-2  py-2 px-4 rounded-3xl"
          >
            Edit Warehouse
          </button>
        </form>
      </div>
    </>
  );
};

const WarehouseServiceCard = ({ name, id, isCreated }) => {
  return (
    <>
      <div className="text-center bg-gray-600 rounded-lg py-3 px-3 font-bold text-white">
        {name}<br />{isCreated ? <p className="text-green-400">Warehouse Online</p> : <p className="text-red-500">Failed to Create Warehouse</p>}
      </div>
    </>
  )
}

const WarehouseServiceList = ({ wid, setCheckWarehouse }) => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allSuccess, setAllSuccess] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryWarehouseCreation = async () => {
    setIsRetrying(true);
    const retryRequest = await fetch(`${API_URL}/warehouse/create/retry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": localStorage.getItem("token"),
      },
      body: JSON.stringify({ wid })
    })
    const retryResponse = await retryRequest.json();
    if (retryResponse.success) {
      setAllSuccess(retryResponse.all_created);
      setServices(retryResponse.response)
    }
    setIsRetrying(false)
  }
  useEffect(() => {
    const getServices = async () => {
      const checkWarehouse = await fetch(`${API_URL}/warehouse/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": localStorage.getItem("token"),
        },
        body: JSON.stringify({ wid }),
      })
        .then((response) => response.json())
        .catch((error) => console.error(error));
      setServices(checkWarehouse.response);
      setAllSuccess(checkWarehouse.all_created)
      setIsLoading(false);
    };
    getServices();
  }, [wid]);
  return (
    <>
      <div className="w-full relative pt-6">
        <div
          className="absolute top-3 right-3 w-9 h-6 bg-slate-600 text-white flex justify-center items-center rounded-lg"
          onClick={() => setCheckWarehouse(false)}
        >
          X
        </div>
        {!allSuccess ? <div className="flex items-center bg-yellow-500 px-3 justify-center">
          <div>Warehouse failed to create on some services</div>
          <div onClick={isRetrying ? () => { } : () => { retryWarehouseCreation() }} className="p-3 bg-yellow-500 font-bold">{isRetrying ? "Creating..." : "Retry"}</div>
        </div> : ""}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {(services && services.length) ? services.map((service, index) => (
            <WarehouseServiceCard key={index} name={service.service_name} id={service.service_id} isCreated={service.warehouse_created} />
          )) : isLoading ? "Loading..." : "Something went wrong while fetching services"}
        </div>
      </div>
    </>
  )
}

const Card = ({ name, address, pin, phone, wid, justCreated }) => {
  const [isManage, setIsManage] = useState(false);
  const [checkWarehouse, setCheckWarehouse] = useState(justCreated ? true : false);
  useEffect(() => {
    const seenJustCreated = async () => {
      await fetch(`${API_URL}/warehouse/new/seen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": localStorage.getItem("token"),
        },
        body: JSON.stringify({ wid }),
      })
        .then((response) => response.json())
        .catch((error) => console.error(error))
    }
    if (justCreated) {
      seenJustCreated();
    }
  }, [])
  return (
    <>
      <ManageForm isManage={isManage} setIsManage={setIsManage} name={name} address={address} pin={pin} phone={phone} wid={wid} />
      <div className="w-full h-16 bg-white relative items-center px-8 flex border-b">
        <div>{name}</div>
        <div className="absolute right-8">
          {/* <div className="cursor-pointer" onClick={() => setIsManage(true)}>Manage</div> */}
          <div className="cursor-pointer" onClick={() => setCheckWarehouse(true)}>Check</div>
        </div>
      </div>
      {checkWarehouse ? <WarehouseServiceList wid={wid} setCheckWarehouse={setCheckWarehouse} /> : null}
    </>
  );
};

const Listing = ({ setMode }) => {
  const [warehouses, setWarehouses] = useState([]);
  useEffect(() => {
    const getWarehouses = async () => {
      const response = await fetch(`${API_URL}/warehouse/warehouses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .catch((error) => console.error(error));
      const rows = response.rows;
      setWarehouses(rows);
    };
    getWarehouses();
  }, []);
  return (
    <>
      <div
        className={`w-full p-4 flex flex-col items-center space-y-6`}
      >
        <div className="w-full h-16 px-4  relative flex">
          <div className="text-2xl font-medium">WAREHOUSES</div>
          <div
            onClick={(e) => {
              e.preventDefault();
              setMode(1);
            }}
            className="px-5 py-1 bg-blue-500 absolute rounded-3xl text-white  right-4"
          >
            Add
          </div>
        </div>
        <div className="w-full">
          {warehouses.map((warehouse, index) => (
            <Card name={warehouse.warehouseName} address={warehouse.address} phone={warehouse.phone} pin={warehouse.pin} wid={warehouse.wid} justCreated={warehouse.just_created} />
          ))}
        </div>
      </div>
    </>
  );
};

const Warehouse = () => {
  const [mode, setMode] = useState(0);
  return (
    <>
      <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
        {mode == 0 ? <Listing setMode={setMode} /> : <AddForm setMode={setMode} />}
      </div>
    </>
  );
};

export default Warehouse;
