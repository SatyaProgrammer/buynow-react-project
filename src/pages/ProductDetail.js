import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {axios} from "../axios"
import ProductCard from '../components/ProductCard'

const ProductDetail = () => {
    const [product, setProduct] = useState([])
    const {id} = useParams()
    let url = '/products/'
    url += id

    const noProduct = !product || (product && product.length === 0)

    const getProduct = async () => {
        const response = await axios.get(url).catch((err) => {
            console.log("Error:", err)
        })
        if(response && response.data){
            setProduct(response.data)
        }
    }

    useEffect(() => {
        getProduct()
    }, [])

    return(
        <div className='container mx-auto'>
            {!noProduct ? 
                <ProductCard {...product}/>
            :
                "Loading"
            }
        </div>
    )
}

export default ProductDetail