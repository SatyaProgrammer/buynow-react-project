import React, { useEffect, useReducer, useState } from 'react'
import CategoriesSideBar from "../components/CategoriesSidebar";
import {axios} from "../axios"
import ProductCard from '../components/ProductCard';
import './Home/Home.css'
import { useParams } from 'react-router-dom'

const Categories = () => {
    const [categoryProducts, setCategoryProducts] = useState([])
    const {id} = useParams()
    let url
    if(!id || id == 'all'){
        url = "/products"
    }
    else{
        url = "/products/category/"
        url += id
    }

    const noProduct = !categoryProducts || (categoryProducts && categoryProducts.length === 0)

    const getCategoryProduct = async () => {
        console.log("hmm",url)
        const response = await axios.get(url).catch((err) => {
            console.log("Error:", err)
        })
        
        if(response && response.data){
            setCategoryProducts(response.data)
        }
    }

    useEffect(() => {
        getCategoryProduct()
    }, [id])

    // console.log("URL:",categoryProducts)

    return (
        <div>            
            <CategoriesSideBar />
            <div className="px-10 sm:ml-64 flex flex-wrap gap-10 justify-center great-card">
                {!noProduct && categoryProducts.map((product, idx) => (
                    <ProductCard key={idx} {...product} />
                ))}
            </div>
        </div>
    )
}

export default Categories