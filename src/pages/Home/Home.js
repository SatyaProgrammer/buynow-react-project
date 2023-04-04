import React, { useEffect } from 'react'
import {useState} from 'react'
import {axios} from "../../axios"
import ProductCard from '../../components/ProductCard'
import {Link} from 'react-router-dom'
import './Home.css'

const Home = () => {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])

    const noProduct = !products || (products && products.length === 0)
    const noCategories = !categories || (categories && categories.length === 0)

    const getProducts = async () => {
        const response = await axios.get("/products").catch((err) => {
            console.log("Error:", err)
        })
        if(response && response.data){
            setProducts(response.data)
        }
    }

    const getCategories = async () => {
        const response = await axios.get("/products/categories").catch((err) => {
            console.log("Error:", err)
        })
        if(response && response.data){
            setCategories(response.data)
        }
    }

    useEffect(() => {
        getProducts()
        getCategories()
    }, [])

    return (
        <>
            {noProduct && noCategories ? 
                <div className='container mx-auto'>
                    Loading
                </div>
            : 
                <div className='container mx-auto'>
                    <div className='flex flex-wrap lg:justify-between md:justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-10 md:pt-0 sm:pt-10 pt-10 my-10 sm:justify-center justify-center'>
                        <div className='max-w-4xl border-indigo-600'>
                            <p className='text-3xl text-white text-center'>Buy and sell your porducts here!</p>
                        </div>
                        <img src='./assets/images/hero.png' alt='' className='w-80'/>
                    </div>

                    <div className='flex flex-wrap gap-3'>   
                        {!noCategories ?                             
                            <Link to='/categories'>
                                <div className='p-2 px-3 bg-indigo-100 rounded-lg'>
                                    All
                                </div>
                            </Link> 
                        : 
                            <></>
                        }
                        {!noCategories && categories.map((category) => (
                            <Link to={'/categories/'.concat(category)} key={category}>
                                <div className='p-2 bg-indigo-100 rounded-lg'>
                                    {category}
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div>
                        <div className='flex flex-wrap lg:justify-between md:justify-center justify-center gap-10 great-card'>     
                            {!noProduct && products.map((product, idx) => (
                                <ProductCard key={idx} {...product} />
                            ))}
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Home