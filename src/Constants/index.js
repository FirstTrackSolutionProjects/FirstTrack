//Here lies all the constant objects of the site
// constants/index.js
import { FaTachometerAlt, FaWallet, FaHistory, FaUsers,FaFileAlt,FaMoneyBillAlt, FaChevronDown, FaChevronUp, FaBars, FaTimes, FaBox, FaDollyFlatbed, FaClipboardList, FaHouseUser, FaDoorOpen } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import VerificationRequests from "../Components/VerificationRequests"
import DashHome from '../Components/DashHome';
import MerchantManage from '../Components/MerchantManage';
import AllInternationalParcels from '../Components/AllInternationalParcels';
import AllParcels from '../Components/AllParcels';
import AllShipmentReports from '../Components/AllShipmentReports';
import AllTransactions from '../Components/AllTransactions';
import ContactSubmissions from '../Components/ContactSubmissions';
import CreateOrder from '../Components/CreateOrder';
import ChangePassword from '../Components/ChangePassword';
import CreateOrderInternational from '../Components/CreateOrderInternational';
import InternationalReports from '../Components/InternationalReports';
import ManualRecharge from '../Components/ManualRecharge';
import NDR from '../Components/NDR';
import NonVerifiedMerchantManage from '../Components/NonVerifiedMerchantManage';
import Profile from '../Components/Profile';
import TransactionHistory from '../Components/TransactionHistory';
import UpdateOrder from '../Components/UpdateOrder';
import UpdateOrderInternational from '../Components/UpdateOrderInternational';
import Warehouse from '../Components/Warehouse';
import UpdateProfileRequest from '../Components/UpdateProfileRequest';
import UpdateProfileRequestSubmissions from '../Components/UpdateProfileRequestSubmissions';
import WeightDisputes from '../Components/WeightDisputes';
import PendingCancellations from '../Components/PendingCancellations/PendingCancellations';
import PendingRefunds from '../Components/PendingRefunds/PendingRefunds';

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

export const menuItems = [
  {
      icon : FaTachometerAlt,
      name : "Dashboard",
      isDropdown : false,
      url : '',
      component : DashHome,
      dropDownOptions : [{}]
  },
  {
      icon : FaWallet,
      name : "Wallet Recharge",
      isDropdown : false,
      url : 'wallet-recharge',
      dropDownOptions : [{}]
  },
  // {
  //     icon : FaWallet,
  //     name : "KYC Update",
  //     isDropdown : false,
  //     merchantOnly : true,
  //     url : 'kyc-update',
  //     component : "",
  //     dropDownOptions : [{}]
  // },
  {
      icon : FaBox,
      name : "Create Shipment",
      isDropdown : true,
      merchantOnly : true,
      url : 'order/create',
      dropDownOptions : [{
          icon : "/logo.webp",
          name : "Domestic",
          isDropdown : false,
          url : 'order/domestic/create',
          component : CreateOrder,
          dropDownOptions : [{}]
      },{
          icon : "/logo.webp",
          name : "International",
          isDropdown : false,
          url : 'order/international/create',
          component : CreateOrderInternational,
          dropDownOptions : [{}]
      },]
  },
  {
      icon : FaHouseUser,
      name : "Warehouse",
      isDropdown : false,
      merchantOnly : true,
      url : 'warehouse',
      component : Warehouse,
      dropDownOptions : [{}]
  },
  {
      icon : FaDollyFlatbed,
      name : "Parcels",
      isDropdown : true,
      merchantOnly : true,
      url : 'parcels',
      dropDownOptions : [{
          icon : "/logo.webp",
          name : "Domestic",
          isDropdown : false,
          url : 'parcels/domestic',
          component : UpdateOrder,
          dropDownOptions : [{}]
      },
      {
          icon : "/logo.webp",
          name : "International",
          isDropdown : false,
          url : 'parcels/international',
          component : UpdateOrderInternational,
          dropDownOptions : [{}]
      },]
  },
  {
      icon : FaHistory,
      name : "Transaction History",
      isDropdown : false,
      url : 'transaction-history',
      component : TransactionHistory,
      dropDownOptions : [{}]
  },
  {
      icon : "/logo.webp",
      name : "Weight Disputes",
      isDropdown : false,
      url : 'weight-disputes',
      component : WeightDisputes,
      dropDownOptions : [{}]
  },
  {
      icon : "/logo.webp",
      name : "Cancellations/Refunds",
      isDropdown : true,
      admin : true,
      // url : 'cancellations-refunds',
      // component : DashboardMain,
      dropDownOptions : [
          {
              icon : "/logo.webp",
              name : "Pending Cancellations",
              isDropdown : false,
              url : 'pending-cancellations',
              component : PendingCancellations,
              dropDownOptions : [{}]
          },
          {
              icon : "/logo.webp",
              name : "Pending Refunds",
              isDropdown : false,
              url : 'pending-refunds',
              component : PendingRefunds,
              dropDownOptions : [{}]
          }
      ]
  },
  {
      icon : FaClipboardList,
      name : "Reports",
      isDropdown : true,
      merchantOnly : true,
      url : 'shipment/reports',
      dropDownOptions : [{
          icon : "/logo.webp",
          name : "Domestic Reports",
          isDropdown : false,
          url : 'shipment/domestic/reports',
          component : NDR,
          dropDownOptions : [{}]
      },{
          icon : "/logo.webp",
          name : "International Reports",
          isDropdown : false,
          url : 'shipment/international/reports',
          component : InternationalReports,
          dropDownOptions : [{}]
      },]
  },
  {
      icon : FaUsers,
      name : "Merchant Manage",
      isDropdown : true,
      admin : true,
      url : 'manage/merchant',
      dropDownOptions : [{
          icon : "/logo.webp",
          name : "Verified Merchants",
          isDropdown : false,
          url : 'manage/merchant/verified',
          component : MerchantManage,
          dropDownOptions : [{}]
      },
      {
          icon : "/logo.webp",
          name : "Non-Verified Merchants",
          isDropdown : false,
          url : 'manage/merchant/non-verified',
          component : NonVerifiedMerchantManage,
          dropDownOptions : [{}]
      },
      {
          icon : "/logo.webp",
          name : "Merchant Transactions",
          isDropdown : false,
          url : 'manage/merchant/transactions',
          component : AllTransactions,
          dropDownOptions : [{}]
      },
      {
          icon : "/logo.webp",
          name : "Shipments",
          isDropdown : true,
          url : 'manage/merchant/shipments',
          dropDownOptions : [{
              icon : "/logo.webp",
              name : "Domestic",
              isDropdown : false,
              url : 'manage/merchant/shipments/domestic',
              component : AllParcels,
              dropDownOptions : [{}]
          },{
              icon : "/logo.webp",
              name : "International",
              isDropdown : false,
              url : 'manage/merchant/shipments/international',
              component : AllInternationalParcels,
              dropDownOptions : [{}]
          },]
      },
      {
          icon : FaClipboardList,
          name : "Shipment Reports",
          isDropdown : true,
          dropDownOptions : [{
              icon : "/logo.webp",
              name : "Domestic Reports",
              isDropdown : false,
              url : 'manage/merchant/shipments/domestic/reports',
              component : AllShipmentReports,
              dropDownOptions : [{}]
          },{
              icon : "/logo.webp",
              name : "International Reports",
              isDropdown : false,
              url : 'manage/merchant/shipments/international/reports',
              component : InternationalReports,
              dropDownOptions : [{}]
          },]
      }]
  },
  // {
  //     icon : "/logo.webp",
  //     name : "Users",
  //     admin : true,
  //     isDropdown : true,
  //     menuID : [10],
  //     dropDownOptions : [{
  //         icon : "/logo.webp",
  //         name : "Accounts",
  //         isDropdown : false,
  //         menuID : [10,0],
  //         dropDownOptions : [{}]
  //     },{
  //         icon : "/logo.webp",
  //         name : "Admin",
  //         isDropdown : false,
  //         menuID : [10,1],
  //         dropDownOptions : [{}]
  //     },]
  // },
  {
      icon : FaFileAlt,
      name : "Submission",
      isDropdown : true,
      admin : true,
      url : 'submissions',
      dropDownOptions : [{
          icon : "/logo.webp",
          name : "Merchant Verification",
          isDropdown : false,
          admin : true,
          url : 'submissions/merchant-verification',
          component : VerificationRequests,
          dropDownOptions : [{}]
      },
      {
          icon : "/logo.webp",
          name : "Update Profile Requests",
          isDropdown : false,
          admin : true,
          url : 'submissions/merchant-update-profile-requests',
          component : UpdateProfileRequestSubmissions,
          dropDownOptions : [{}]
      },
      {
          icon : "/logo.webp",
          name : "Contact Submission",
          isDropdown : false,
          admin : true,
          url : 'submissions/contact-submission',
          component : ContactSubmissions,
          dropDownOptions : [{}]
      },
      // {
      //     icon : "/logo.webp",
      //     name : "KYC Requests",
      //     isDropdown : false,
      //     admin : true,
      //     url : 'submissions/kyc-requests',
      //     component : "",
      //     dropDownOptions : [{}]
      // }
  ]
  },
  {
      icon : FaWallet,
      name : "Manual Recharge",
      isDropdown : false,
      admin : true,
      url : 'manual-recharge',
      component : ManualRecharge,
      dropDownOptions : [{}]
  },
  {
      icon : MdSettings,
      name : "Settings",
      isDropdown : true,
      url : 'settings',
      dropDownOptions : [
          {
              icon : "/logo.webp",
              name : "Profile",
              isDropdown : false,
              url : 'settings/profile',
              component : Profile,
              dropDownOptions : [{}]
          },
          {
              icon : "/logo.webp",
              name : "Profile Update",
              isDropdown : false,
              url : 'settings/profile-update-request',
              component : UpdateProfileRequest,
              merchantOnly : true,
              dropDownOptions : [{}]
          },
          {
              icon : "/logo.webp",
              name : "Change Password",
              isDropdown : false,
              url : 'settings/change-password',
              component : ChangePassword,
              dropDownOptions : [{}]
          },
      ]
  },
  {
      icon : FaDoorOpen,
      name : "Logout",
      isDropdown : false,
      url : 'logout',
      dropDownOptions : [{}]
  },
]

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