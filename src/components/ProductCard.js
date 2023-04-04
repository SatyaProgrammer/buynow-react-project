import React from 'react'
import {Link} from 'react-router-dom'

const ProductCard = (props) => {
    const {id, title, price,image} = props
    let url = '/products/'
    url += id

    return(
        <div className='my-10'>
               <div key={title} className="w-64">
                    <Link to={url}>
                        <div className="h-64">
                            <img className="rounded-t-md w-full h-full object-cover hover:scale-105 duration-300" src={image} alt="product image"/>
                        </div>
                    </Link>
                    <div className="pt-3 ">
                        <p className='text-sm truncate'>{title}</p>
                    </div>

                    <p className='mt-4 mb-2 text-left'>${price}</p>
                    <Link to='/'><p className='py-1 px-2 border border-gray-500 rounded-full hover:bg-indigo-600 hover:text-white hover:border-indigo-600 duration-100 w-fit'>Add to cart</p></Link>
                </div>
        </div>
    )
}

export default ProductCard