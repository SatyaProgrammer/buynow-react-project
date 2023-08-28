import {
  IconBag,
  IconDashboard,
  IconUser,
  IconGift,
  IconAddBag,
} from "./Icons";

export const API = {
  API_URL: "https://fakestoreapi.com",
};

export const API_CALL = {
  ALL_PRODUCT: API.API_URL.concat("/products"),
  SINGLE_PRODUCT: API.API_URL.concat("/products/"),
};

const iconColor = "#222";
export const SidebarItems = [
  {
    name: "dashboard",
    link: "/sell/dashboard",
    icon: <IconDashboard fill={iconColor} />,
  },
  {
    name: "product",
    link: "/sell/product",
    icon: <IconBag fill={iconColor} />,
  },
  {
    name: "add product",
    link: "/sell/add_product",
    icon: <IconAddBag fill={iconColor} />,
  },
  {
    name: "order",
    link: "/sell/order",
    icon: <IconGift fill={iconColor} />,
  },
  {
    name: "Profile",
    link: "/profile",
    icon: <IconUser fill={iconColor} />,
  },
  // {
  //     name: 'customer',
  //     link: '/sell/customer',
  //     icon: <IconUser fill = {iconColor}/>
  // },
];

export const ProductTableHeader = [
  "Product",
  "Category",
  "Price",
  "Qauntity",
  "Delivery Option",
  "Action",
];

export const ProductTableData = [
  "title",
  "category",
  "category",
  "price",
  "price",
  "price",
];

export const orderStatus = [
  {
    status: "pending",
    css: "capitalize text-center inline-flex items-center p-1 px-2 rounded-full bg-yellow-100 border-2 border-yellow-200 text-yellow-700 font-semibold hover:opacity-70",
  },
  {
    status: "delivering",
    css: "capitalize text-center inline-flex items-center p-1 px-2 rounded-full bg-orange-100 border-2 border-orange-200 text-orange-700 font-semibold hover:opacity-70",
  },
  {
    status: "completed",
    css: "capitalize text-center inline-flex items-center p-1 px-2 rounded-full bg-green-100 border-2 border-green-200 text-green-700 font-semibold hover:opacity-70",
  },
  {
    status: "failed",
    css: "capitalize text-center inline-flex items-center p-1 px-2 rounded-full bg-red-100 border-2 border-red-200 text-red-700 font-semibold hover:opacity-70",
  },
];
