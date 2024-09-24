//Here lies all the constant objects of the site
// constants/index.js
export const ADMIN_SIDEBAR_ITEMS = [
  { name: 'Dashboard', route: '/admin/dashboard' },
  { name: 'Manage Users', route: '/admin/users' },
  { name: 'Total Merchants', route: '/admin/merchants' },
  { name: 'Total Warehouses', route: '/admin/warehouses' },
  { name: 'Total Shipments', route: '/admin/shipments' },
  { name: 'Total Delivered', route: '/admin/delivered' },
  { name: 'Pending Pickups', route: '/admin/pickups' },
  { name: 'Parcel Return', route: '/admin/return' },
  { name: 'NDR Parcel', route: '/admin/ndr' },
  // add more items if needed
];

export const MERCHANT_SIDEBAR_ITEMS = [
  { name: 'Dashboard', route: '/merchant/dashboard' },
  { name: 'My Shipments', route: '/merchant/shipments' },
  { name: 'Add Shipment', route: '/merchant/add-shipment' },
  { name: 'My Profile', route: '/merchant/profile' },
  { name: 'Reports', route: '/merchant/reports' },
  // add more items if needed
];

export const testimonials = [
    {
      name: "Amit",
      feedback: "First Track Express has been an absolute pleasure to work with. Professional, reliable, and timely!",
      avatar: "images/male.png",
    },
    {
      name: "Sneha",
      feedback: "Their global shipping services have helped expand my business. Truly world-class.",
      avatar: "images/female.webp",
    },
  ];

  export const whyChooseUs = [
    { title: "Reliable Service", description: "Our reputation speaks for itself.", image:"images/service1.jpg" },
    { title: "Secure Transportation", description: "Ensuring safety of all deliveries." , image:"images/service2.JPG"},
    { title: "Timely Delivery", description: "We pride ourselves on promptness.", image:"images/service3.JPG" },
    { title: "24/7 Support", description: "Customer support around the clock.", image:"images/service4.JPG" },
  ];

  export const services = [
    {
      id: 1,
      title: "Global Shipping",
      description: "We ensure timely and secure delivery across the world.",
      icon: "🚚",
    },
    {
      id: 2,
      title: "Warehousing",
      description: "Safe and affordable warehousing solutions for your business.",
      icon: "🏬",
    },
    {
      id: 3,
      title: "Cargo Services",
      description: "Fast and reliable cargo transportation services.",
      icon: "✈️",
    },
    {
      id: 4,
      title: "Freight Management",
      description: "Optimize your logistics with our expert freight management services.",
      icon: "⚓",
    },
  ];

  export const counts =[
    {
        id:1,
        title:"Trusted Clients",
        num: "10",
        sym:"K+",
    },
    {
        id:2,
        title:"Orders Delivered",
        num: "20",
        sym:"K+",
    },
    {
        id:3,
        title:"Sellers",
        num: "25",
        sym:"+",
    },
  ];