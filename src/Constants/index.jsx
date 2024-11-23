//Here lies all the constant objects of the site
// constants/index.js
export const Admincards = [
  {
    id:'1',
    title: 'Total Merchants',
    count: '31'
  },
  {
    id:'2',
    title: 'Total Warehouses',
    count: '51'
  },
  {
    id:'3',
    title: 'Total Shipments',
    count: '178'
  },
  {
    id:'4',
    title: 'Total Delivered',
    count: '25'
  },
  {
    id:'5',
    title: 'Pending pickups',
    count: '62'
  },
  {
    id:'6',
    title: 'Total Revenue',
    count: '7500.80'
  },
  {
    id:'7',
    title: 'Parcel on process',
    count: '9'
  },
  {
    id:'8',
    title: 'Parcel Return',
    count: '0'
  },
  {
    id:'9',
    title: 'NDR Parcel',
    count: '0'
  }
];

export const Merchantcards = [
  {
    id:'1',
    title: 'Total Warehouses',
    count: '1'
  },
  {
    id:'2',
    title: 'Total Delivered',
    count: '2'
  },
  {
    id:'3',
    title: 'Total Shipments',
    count: '27'
  },
  {
    id:'4',
    title: 'Pending Pickups',
    count: '0'
  },
  {
    id:'5',
    title: 'Total Wallet Recharge',
    count: '51080'
  },
  {
    id:'6',
    title: 'Parcel on process',
    count: '0'
  },
  {
    id:'7',
    title: 'Parcel Return',
    count: '0'
  },
  {
    id:'8',
    title: 'NDR Parcel',
    count: '0'
  },
];

export const ADMIN_SIDEBAR_ITEMS = [
  {
    menuId: [1],
    name: 'Dashboard',
    route: '/dashboard',
    isDropdown: false,
    dropdownOptions: [{}],
  },
  
  {
    menuId: [3],
    name: 'Wallet Recharge',
    route: '/dashboard/wallet-recharge',
    isDropdown: false,
    dropdownOptions: [{}],
  },
  
  {
    menuId: [7],
    name: 'Transaction History',
    route: '/dashboard/transactions',
    isDropdown: false,
    dropdownOptions: [{}],
  },
  
  {
    menuId: [9],
    name: 'Merchant Manage',
    route: '/dashboard/merchant-manage',
    isDropdown: true,
    dropdownOptions: [
      { menuId: [9, 0], name: 'Verified Merchants', route: '/admin/merchant/verified' },
      { menuId: [9, 1], name: 'Non-Verified Merchants', route: '/admin/merchant/non-verified' },
      { menuId: [9, 2], name: 'Merchant Transactions', route: '/admin/merchant/transactions' },
      { menuId: [9, 3], name: 'Shipments', route: '/admin/merchant/shipments' },
      { menuId: [9, 4], name: 'Shipment Reports', route: '/admin/merchant/reports' },
    ],
  },
  
  {
    menuId: [12],
    name: 'Submission',
    route: '/dashboard/submission',
    isDropdown: true,
    dropdownOptions: [
      { menuId: [12, 0], name: 'Merchant Verification', route: '/admin/submission/verification' },
      { menuId: [12, 1], name: 'Contact Submission', route: '/admin/submission/contact' },
      { menuId: [12, 2], name: 'KYC Requests', route: '/admin/submission/kyc'},
    ],
  },
  {
    menuId: [13],
    name: 'Manual Recharge',
    route: '/dashboard/manual-recharge',
    isDropdown: false,
    dropdownOptions: [{}],
  },
  {
    menuId: [14],
    name: 'Settings',
    route: '/dashboard/settings',
    isDropdown: true,
    dropdownOptions: [
      { menuId: [14, 0], name: 'Profile', route: '/admin/settings/profile' },
      { menuId: [14, 1], name: 'Change Password', route: '/admin/settings/change-password' },
    ],
  },
];

// Merchant Sidebar Items (Example)
{/** 
export const MERCHANT_SIDEBAR_ITEMS = [
  {
    menuId: [1],
    name: 'Dashboard',
    route: '/merchant/dashboard',
    icon: 'icon-dashboard',
    isDropdown: false,
    dropdownOptions: [{}],
  },
  // Add merchant-specific sidebar items here similarly.
];
*/}

export const MERCHANT_SIDEBAR_ITEMS = [
  { name: 'Dashboard', route: '/merchant/dashboard' },
  {
    name: 'Wallet Recharge',
    route: '/dashboard/wallet-recharge',
    isDropdown: false,
    dropdownOptions: [{}],
  },
  {
    name: 'KYC Update',
    route: '/dashboard/kycUpdate',
    isDropdown: false,
    dropdownOptions: [{}],
  },
  {
    name: 'Create Shipment',
    route: '/dashboard/create-shipment',
    isDropdown: true,
    dropdownOptions: [
      { name: 'Domestic', route: '/admin/merchant/verified' },
      { name: 'International', route: '/admin/merchant/non-verified' },
    ],
  },
  { name: 'Warehouse', route: '/merchant/warehouse' },
  {
    name: 'Parcels',
    route: '/dashboard/parcels',
    isDropdown: true,
    dropdownOptions: [
      { name: 'Domestic', route: '/admin/merchant/verified' },
      { name: 'International', route: '/admin/merchant/non-verified' },
    ],
  },
  {
    name: 'Transaction History',
    route: '/dashboard/transactions',
    isDropdown: false,
    dropdownOptions: [{}],
  },
  {
    name: 'Reports',
    route: '/dashboard/reports',
    isDropdown: true,
    dropdownOptions: [
      { name: 'Domestic', route: '/admin/merchant/verified' },
      { name: 'International', route: '/admin/merchant/non-verified' },
    ],
  },
  {
    name: 'Settings',
    route: '/dashboard/settings',
    isDropdown: true,
    dropdownOptions: [
      {name: 'Profile', route: '/admin/settings/profile' },
      {name: 'Change Password', route: '/admin/settings/change-password' },
    ],
  }
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

  export const API_URL = import.meta.env.VITE_APP_API_URL