//Here lies all the constant objects of the site
// constants/index.js
import { FaTachometerAlt, FaWallet, FaHistory, FaUsers,FaFileAlt,FaMoneyBillAlt, FaChevronDown, FaChevronUp, FaBars, FaTimes, FaBox, FaDollyFlatbed, FaClipboardList, FaHouseUser, FaDoorOpen, FaUser } from 'react-icons/fa';
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
import {IndianRupee, TruckElectricIcon, MessageSquareText, Banknote, RefreshCcw, ShieldCheck, Users, BarChart3, File, Key} from "lucide-react"
import Support from '../Pages/Support';
import B2CBulkShipment from "@/Components/BulkShipment/B2CBulkShipment"
import CodRemittanceAdmin from '@/Components/CodRemittance/CodRemittanceAdmin';
import PendingRTO from '@/Components/PendingRTO/PendingRTO';
import MySubmerchants from '@/Components/Submerchant/MySubmerchants';
import SubmerchantRequests from '@/Components/Submerchant/SubmerchantRequests';
import AdminSupport from '@/Pages/AdminSupport';
import AdminAnalytics from '@/Pages/AdminAnalytics';
import MySubmerchantShipments from '@/Components/Submerchant/MySubmerchantShipments';

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

export const DOMESTIC_SHIPMENT_REPORT_STATUS_ENUMS = Object.freeze({
    MANIFESTED: 'MANIFESTED',
    NOT_PICKED: 'NOT PICKED',
    CANCELLED: 'CANCELLED',
    IN_TRANSIT: 'IN TRANSIT',
    OUT_FOR_DELIVERY: 'OUT FOR DELIVERY',
    DELIVERED: 'DELIVERED',
    RTO: 'RTO',
    RTO_DELIVERED: 'RTO DELIVERED'
})

export const TRANSACTION_TYPES = Object.freeze({
    RECHARGE: 'RECHARGE',
    MANUAL_RECHARGE: 'MANUAL RECHARGE',
    EXPENSE: 'EXPENSE',
    REFUND: 'REFUND',
    EXTRA_CHARGE: 'EXTRA CHARGE',
    RTO_CHARGE: 'RTO CHARGE',
    WEIGHT_DISPUTE: 'WEIGHT DISPUTE',
    BALANCE_TRANSFER: 'BALANCE TRANSFER',
    BALANCE_WITHDRAWAL: 'BALANCE WITHDRAWAL',
    SUBMERCHANT_MARGIN: 'SUBMERCHANT MARGIN',
})

export const USER_ROLES = Object.freeze({
    ADMIN: 'ADMIN',
    MERCHANT: 'MERCHANT',
    SUBMERCHANT: 'SUBMERCHANT'
})

export const DOMESTIC_ORDER_STATUS_ENUMS = Object.freeze({
    PENDING: 'PENDING',
    SHIPPED: 'SHIPPED',
    CANCELLED: 'CANCELLED'
})

export const menuItems = [
  {
      icon : FaTachometerAlt,
      name : "Dashboard",
      isDropdown : false,
      url : '', // Empty URL for the root dashboard route
      component : DashHome,
      dropDownOptions : [{}]
  },
  {
      icon : FaWallet,
      name : "Wallet Recharge",
      isDropdown : false,
      url : 'wallet-recharge',
      roles: [USER_ROLES.ADMIN, USER_ROLES.MERCHANT, USER_ROLES.SUBMERCHANT],
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
      
      icon : IndianRupee,
      name : "Bulk Shipment",
      isDropdown : true,
      url : 'bulk-shipment',
      merchantOnly : true,
      roles: [USER_ROLES.MERCHANT, USER_ROLES.SUBMERCHANT],
      // component: Pricing,
      dropDownOptions : [
          {
              icon : IndianRupee,
              name : "B2C Bulk",
              isDropdown : false,
              url : 'bulk-shipment/b2c',
              component: B2CBulkShipment,
              dropDownOptions : [{}]
          },
      ]
  },
  {
      icon : FaBox,
      name : "Create Shipment",
      isDropdown : true,
      merchantOnly : true,
      url : 'order/create',
      roles: [USER_ROLES.MERCHANT, USER_ROLES.SUBMERCHANT],
      dropDownOptions : [{
          icon : FaBox,
          name : "Domestic",
          isDropdown : false,
          url : 'order/domestic/create',
          component : CreateOrder,
          dropDownOptions : [{}]
      },{
          icon : FaBox,
          name : "International (Coming Soon)",
          isDropdown : false,
          url : null,
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
      roles: [USER_ROLES.ADMIN, USER_ROLES.MERCHANT, USER_ROLES.SUBMERCHANT],
      dropDownOptions : [{}]
  },
  {
      icon : FaDollyFlatbed,
      name : "Shipments",
      isDropdown : true,
      merchantOnly : true,
      url : 'shipments',
      roles: [USER_ROLES.MERCHANT, USER_ROLES.SUBMERCHANT],
      dropDownOptions : [{
          icon : FaDollyFlatbed,
          name : "Domestic",
          isDropdown : false,
          url : 'shipments/domestic',
          component : UpdateOrder,
          dropDownOptions : [{}]
      },
      {
          icon : FaDollyFlatbed,
          name : "International ",
          isDropdown : false,
          url : 'shipments/international',
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
      roles: [USER_ROLES.MERCHANT, USER_ROLES.SUBMERCHANT],
      dropDownOptions : [{}]
  },
  {
        
      icon : Users,
      name : "Merchant Transactions",
      isDropdown : false,
      admin : true,
      url : 'manage/merchant/transactions',
      roles: [USER_ROLES.ADMIN],
      component : AllTransactions,
      dropDownOptions : [{}]
  },
  {
      icon : FaBox,
      name : "Weight Disputes",
      isDropdown : false,
      url : 'weight-disputes',
      component : WeightDisputes,
       roles: [USER_ROLES.ADMIN, USER_ROLES.MERCHANT, USER_ROLES.SUBMERCHANT],
      dropDownOptions : [{}]
  },
  {
        
      icon : Banknote,
      name : "COD Remittance",
      isDropdown : false,
      admin : true,
      url : 'cod-remittance-manage',
      component : CodRemittanceAdmin,
      roles: [USER_ROLES.ADMIN],
      dropDownOptions : [{}]
  },
  {
      icon : RefreshCcw,
      name : "Cancellations/Refunds",
      isDropdown : true,
      admin : true,
      roles: [USER_ROLES.ADMIN],
      // url : 'cancellations-refunds',
      // component : DashboardMain,
      dropDownOptions : [
          {
              icon : FaBox,
              name : "Pending Cancellations",
              isDropdown : false,
              url : 'pending-cancellations',
              component : PendingCancellations,
              dropDownOptions : [{}]
          },
          {
              icon : FaBox,
              name : "Pending Refunds",
              isDropdown : false,
              url : 'pending-refunds',
              component : PendingRefunds,
              dropDownOptions : [{}]
          }
      ]
  },
  {
      icon : Banknote,
      name : "Pending RTO",
      isDropdown : false,
      admin: true,
      url : 'pending-rto',
      roles: [USER_ROLES.ADMIN],
      component : PendingRTO,
      dropDownOptions : [{}]
  },
  {
      icon : FaClipboardList,
      name : "Reports",
      isDropdown : true,
      merchantOnly : true,
      url : 'shipment/reports',
      roles: [USER_ROLES.MERCHANT, USER_ROLES.SUBMERCHANT],
      dropDownOptions : [{
          icon : BarChart3,
          name : "Domestic Reports",
          isDropdown : false,
          url : 'shipment/domestic/reports',
          component : NDR,
          dropDownOptions : [{}]
      },{
          icon : BarChart3,
          name : "International Reports (Coming Soon)",
          isDropdown : false,
          url : null,
          component : InternationalReports,
          dropDownOptions : [{}]
      },]
  },
  {
      icon : ShieldCheck,
      name : "My Submerchants",
      isDropdown : false,
      url : 'my-submerchants',
      roles: [USER_ROLES.MERCHANT],
      component : MySubmerchants,
      dropDownOptions : []
  },
  {
      icon : ShieldCheck,
      name : "Submerchant Shipments",
      isDropdown : false,
      url : 'my-submerchants-shipments',
      roles: [USER_ROLES.MERCHANT],
      component : MySubmerchantShipments,
      dropDownOptions : []
  },
  {
      icon : ShieldCheck,
      name: "Submerchant Verification Requests",
      isDropdown: false,
      url: 'submerchant-verification-requests',
      roles: [USER_ROLES.MERCHANT],
      component: VerificationRequests,
      dropDownOptions: []
  },
  {
      icon : ShieldCheck,
      name: "Submerchant Requests",
      isDropdown: false,
      url: 'submerchant-requests',
      roles: [USER_ROLES.MERCHANT, USER_ROLES.SUBMERCHANT],
      component: SubmerchantRequests,
      dropDownOptions: []
  },
  {
      icon : FaUsers,
      name : "Merchant Manage",
      isDropdown : true,
      admin : true,
      url : 'manage/merchant',
      roles: [USER_ROLES.ADMIN],
      dropDownOptions : [{
          icon : FaUsers,
          name : "Verified Merchants",
          isDropdown : false,
          url : 'manage/merchant/verified',
          component : MerchantManage,
          dropDownOptions : [{}]
      },
      {
          icon : FaUsers,
          name : "Non-Verified Merchants",
          isDropdown : false,
          url : 'manage/merchant/non-verified',
          component : NonVerifiedMerchantManage,
          dropDownOptions : [{}]
      },
      {
          icon : File,
          name : "Merchant Transactions",
          isDropdown : false,
          url : 'manage/merchant/transactions',
          component : AllTransactions,
          dropDownOptions : [{}]
      },
      {
          icon : FaBox,
          name : "Shipments",
          isDropdown : true,
          url : 'manage/merchant/shipments', // Base URL for the dropdown
          dropDownOptions : [{
              icon : FaBox,
              name : "Domestic",
              isDropdown : false,
              url : 'manage/merchant/shipments/domestic',
              component : AllParcels,
              dropDownOptions : [{}]
          },{
              icon : FaBox,
              name : "International (Coming Soon)",
              isDropdown : false,
              url : null,
              component : AllInternationalParcels,
              dropDownOptions : [{}]
          },]
      },
      {
          icon : FaClipboardList, // Reusing FaClipboardList for Shipment Reports, changed from "/logo.webp"
          name : "Shipment Reports",
          isDropdown : true,
          url : 'manage/merchant/shipment-reports', // Added a base URL for this dropdown
          dropDownOptions : [{
              icon : FaClipboardList,
              name : "Domestic Reports",
              isDropdown : false,
              url : 'manage/merchant/shipments/domestic/reports',
              component : AllShipmentReports,
              dropDownOptions : [{}]
          },{
              icon : FaClipboardList,
              name : "International Reports (Coming Soon)",
              isDropdown : false,
              url : null,
              component : InternationalReports,
              dropDownOptions : [{}]
          },]
      }]
  },
  {
      icon : FaFileAlt,
      name : "Submission",
      isDropdown : true,
      admin : true,
      url : 'submissions',
      roles : [USER_ROLES.ADMIN],
      dropDownOptions : [{
          icon : FaFileAlt,
          name : "Merchant Verification",
          isDropdown : false,
          admin : true,
          url : 'submissions/merchant-verification',
          component : VerificationRequests,
          dropDownOptions : [{}]
      },
      // {
      //     icon : "/logo.webp",
      //     name : "Update Profile Requests",
      //     isDropdown : false,
      //     admin : true,
      //     url : 'submissions/merchant-update-profile-requests',
      //     component : UpdateProfileRequestSubmissions,
      //     dropDownOptions : [{}]
      // },
      {
          icon : FaFileAlt,
          name : "Contact Submission",
          isDropdown : false,
          admin : true,
          url : 'submissions/contact-submission',
          component : ContactSubmissions,
          dropDownOptions : [{}]
      },
  ]
  },
  {
      icon: TruckElectricIcon, // Using a distinct icon for Admin Management
      name: "Support Management",
      isDropdown: false,
      admin: true,               
      url: 'admin/support',      // Navigates to /dashboard/admin/support
      roles: [USER_ROLES.ADMIN], // Only admins can access this
      component: AdminSupport,    
      dropDownOptions: [{}]
  },
  {
      icon: BarChart3, 
      name: "Support Analytics",
      isDropdown: false,
      admin: true,               
      url: 'admin/analytics',      // Navigates to /dashboard/admin/analytics
      roles: [USER_ROLES.ADMIN], // Only admins can access this
      component: AdminAnalytics,    
      dropDownOptions: [{}]
  },
  {
      icon : FaWallet,
      name : "Manual Recharge",
      isDropdown : false,
      admin : true,
      url : 'manual-recharge',
      roles: [USER_ROLES.ADMIN],
      component : ManualRecharge,
      dropDownOptions : [{}]
  },
  {
      icon : MessageSquareText, // Use an appropriate icon
      name : "My Support Tickets",
      isDropdown : false,
      merchantOnly : true, // Assuming standard users/merchants can see their own tickets
      url : 'support',      // Navigates to /dashboard/support
      component : Support, 
      roles: [USER_ROLES.MERCHANT, USER_ROLES.SUBMERCHANT], // Only merchants and submerchants can access
      dropDownOptions : [{}]
  },
  {
      icon : MdSettings,
      name : "Settings",
      isDropdown : true,
      url : 'settings',
      roles: [USER_ROLES.ADMIN, USER_ROLES.MERCHANT, USER_ROLES.SUBMERCHANT],
      dropDownOptions : [
          {
              icon : FaUser,
              name : "Profile",
              isDropdown : false,
              url : 'settings/profile',
              component : Profile,
              dropDownOptions : [{}]
          },
          // {
          //     icon : "/logo.webp",
          //     name : "Profile Update",
          //     isDropdown : false,
          //     url : 'settings/profile-update-request',
          //     component : UpdateProfileRequest,
          //     merchantOnly : true,
          //     dropDownOptions : [{}]
          // },
          {
              icon : Key,
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
  {
    title: "Trusted Reliability",
    description:
      "Count on us for consistent, dependable logistics solutions built on years of proven performance.",
    image: "images/service1.jpg",
  },
  {
    title: "Secure Handling",
    description:
      "Every shipment is managed with utmost care and advanced safety protocols to ensure complete protection.",
    image: "images/service2.JPG",
  },
  {
    title: "On-Time Every Time",
    description:
      "We value your time — our optimized network ensures fast, accurate, and punctual deliveries, always.",
    image: "images/service3.JPG",
  },
  {
    title: "Round-the-Clock Assistance",
    description:
      "Our dedicated support team is available 24/7 to resolve queries and provide real-time shipment updates.",
    image: "images/service4.JPG",
  },
];


 export const services = [
  {
    id: 1,
    title: "International Shipping",
    description:
      "Seamless global delivery with real-time tracking and guaranteed on-time arrivals across continents.",
    icon: "🌍",
  },
  {
    id: 2,
    title: "Smart Warehousing",
    description:
      "Modern, secure, and temperature-controlled storage solutions designed for efficiency and safety.",
    icon: "🏢",
  },
  {
    id: 3,
    title: "Air & Sea Cargo",
    description:
      "Flexible cargo transport options via air and sea, ensuring speed, safety, and cost-effectiveness.",
    icon: "🚢",
  },
  {
    id: 4,
    title: "Supply Chain Management",
    description:
      "End-to-end logistics planning and freight coordination that optimizes routes and reduces delivery time.",
    icon: "📦",
  },
];


  export const counts =[
    {
        id:1,
        title:"Trusted Clients",
        num: 10,
        sym:"K+",
        speed: 3
    },
    {
        id:2,
        title:"Orders Delivered",
        num: 20,
        sym:"K+",
        speed: 3
    },
    {
        id:3,
        title:"Sellers",
        num: 25,
        sym:"+",
        speed: 3
    },
  ];