import { IconBag, IconDashboard, IconUser, IconGift, IconAddBag } from "./Icons"

export const API = {
    API_URL: "https://fakestoreapi.com"
}

export const API_CALL = {
    ALL_PRODUCT: API.API_URL.concat("/products"),
    SINGLE_PRODUCT: API.API_URL.concat("/products/")
}

const iconColor = '#222'
export const SidebarItems = [
    {
        name: 'dashboard',
        link: '/shop/dashboard',
        icon: <IconDashboard fill = {iconColor}/>
    },
    {
        name: 'product',
        link: '/shop/product',
        icon: <IconBag fill = {iconColor}/>
    },
    {
        name: 'add product',
        link: '/shop/add_product',
        icon: <IconAddBag fill = {iconColor}/>
    },
    {
        name: 'order',
        link: '/shop/order',
        icon: <IconGift fill = {iconColor}/>
    },
    // {
    //     name: 'customer',
    //     link: '/shop/customer',
    //     icon: <IconUser fill = {iconColor}/>
    // },
]

export const ProductTableHeader = [
    'Product',
    'Category',
    'Price',
    'Qauntity',
    'Delivery Option',
    'Action'
]

export const ProductTableData = [
    'title',
    'category',
    'category',
    'price',
    'price',
    'price'
]