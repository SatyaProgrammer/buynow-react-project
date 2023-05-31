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
