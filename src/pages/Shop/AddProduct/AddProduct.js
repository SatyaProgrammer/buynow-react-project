import React from "react";
import { useReducer, useEffect, useRef } from "react";
import { addProductReducer, INITIAL_STATE, ACTION_TYPES } from "./AddProductReducer";

const price_regex = /^[0-9\b]+$/

const AddProduct = () => {
    const [state, dispatch] = useReducer(addProductReducer, INITIAL_STATE)
    const nameRef = useRef()
    const priceRef = useRef('')

    const handleAddCustom = () => {
        dispatch({type:ACTION_TYPES.ADD_CUSTOMIZATION, payload: {title: '', custom1: ''}})
    }

    const handleChangeCustom = (onChangeValue, i) => {
        let inputData = state.customization
        inputData[i]['title'] = onChangeValue.target.value
        dispatch({type:ACTION_TYPES.SET_CUSTOMIZATION, payload: [inputData]})
    }

    const handleAddSubCustom = (i) => {
        let inputData = state.customization
        let objectSize = Object.keys(state.customization[i]).length
        inputData[i]["custom" + objectSize] = ''
        dispatch({type:ACTION_TYPES.SET_CUSTOMIZATION, payload: [inputData]})
    }

    const handleChangeSubCustom = (onChangeValue, i, k) => {
        let inputData = state.customization
        inputData[i]["custom" + (k+1)] = onChangeValue.target.value
        dispatch({type:ACTION_TYPES.SET_CUSTOMIZATION, payload: [inputData]})
    }

    if(state.customization && state.customization.length > 0){
        // console.log(state.customization)
    }

    useEffect(() => {
        nameRef.current.focus()
        dispatch({type:ACTION_TYPES.ADD_CUSTOMIZATION, payload: {title: '', custom1: ''}})
    },[])

    useEffect(() => {
        priceRef.current = state.price
        if(price_regex.test(state.price)){
            dispatch({type: ACTION_TYPES.SET_PRICE, payload:state.price})
        }else{
            dispatch({type: ACTION_TYPES.SET_PRICE, payload:priceRef.current})
        }
    }, [state.price])


    // console.log(state.name)
    // console.log(state.description)
    // console.log(state.brand)
    // console.log(state.price)

    return(
        <>
        <div className="p-4 md:ml-64 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
            <p className="text-cldark text-4xl font-bold my-4 text-medium">Add Product</p>
            <form>
                <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 shadow-lg rounded-md flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-semibold text-cldark">Product Name</div>
                            <input
                                type="text"
                                placeholder="Product name"
                                ref={nameRef}
                                onChange={(e) => dispatch({type: ACTION_TYPES.SET_NAME, payload: e.target.value})}
                                name="name"
                                value={state.name}
                                className="border border-gray-300 w-full p-3 rounded-lg text-cldark"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-semibold text-cldark">Product Description</div>
                            <textarea
                                type="text"
                                placeholder="Product description"
                                onChange={(e) => dispatch({type: ACTION_TYPES.SET_DESCRIPTION, payload: e.target.value})}
                                name="description"
                                value={state.description}
                                rows="5" 
                                className="w-full border border-gray-300 rounded-lg p-3 text-cldark"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-4 shadow-lg rounded-md flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-semibold text-cldark">Brand</div>
                            <input
                                type="text"
                                placeholder="Product brand"
                                onChange={(e) => dispatch({type: ACTION_TYPES.SET_BRAND, payload: e.target.value})}
                                name="brand"
                                value={state.brand}
                                className="border border-gray-300 w-full p-3 rounded-lg text-cldark"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-semibold text-cldark">Price</div>
                            <input
                                type="text"
                                ref={priceRef}
                                placeholder="Product price"
                                onChange={(e) => dispatch({type: ACTION_TYPES.SET_PRICE, payload: e.target.value})}
                                name="price"
                                value={state.price}
                                className="border border-gray-300 w-full p-3 rounded-lg text-cldark"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-semibold text-cldark">
                                Customization
                            </div>
                            {console.log(JSON.stringify(state.customization))}
                            {state.customization?.map((custom,i) => (
                                <div key={i} className="grid grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            onChange={(e) => handleChangeCustom(e,i)}
                                            name="customTitle"
                                            className="border border-gray-300 w-full p-3 rounded-lg text-cldark"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {Object.entries(state.customization[i]).filter(([key, _]) => key !== "title").map((t,k) => (
                                            <div key={k}>
                                                <div className="flex items-center gap-2">
                                                    {t.custom1}
                                                    <input
                                                        type="text"
                                                        placeholder="Custom list"
                                                        onChange={(e) => handleChangeSubCustom(e, i, k)}
                                                        name="subCustom"
                                                        className="border border-gray-300 w-full p-3 rounded-lg text-cldark"
                                                    />   
                                                    <div className="w-8 h-8 border" onClick={() => handleAddSubCustom(i)}></div>  
                                                </div>
                                            </div>
                                        ))}    
                                    </div>

                                </div>
                            ))}

                            <div>
                                <div onClick={handleAddCustom}>Add</div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        </>
    )
}

export default AddProduct