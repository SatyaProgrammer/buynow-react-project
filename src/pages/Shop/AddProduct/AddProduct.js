import React from "react";

const AddProduct = () => {

    const handleChange = (e) => {

    }

    return(
        <>
        <div className="p-4 md:ml-64 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
            <p className="text-cldark text-4xl font-bold my-4 text-medium">Add Product</p>
            <form>
                <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 shadow-lg rounded-md flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-semibold text-cldark">Product Title</div>
                            <input
                                type="text"
                                placeholder="Product name"
                                onChange={handleChange}
                                name="name"
                                className="border border-gray-300 w-full p-3 rounded-lg text-cldark"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-semibold text-cldark">Product Description</div>
                            <textarea
                                type="text"
                                placeholder="Product description"
                                onChange={handleChange}
                                name="description"
                                rows="5" 
                                className="w-full border border-gray-300 rounded-lg p-3 text-cldark"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-4 shadow-lg rounded-md flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-semibold text-cldark">Product Title</div>
                            <input
                                type="text"
                                placeholder="Product name"
                                onChange={handleChange}
                                name="name"
                                className="border border-gray-300 w-full p-3 rounded-lg text-cldark"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-semibold text-cldark">Product Description</div>
                            <textarea
                                type="text"
                                placeholder="Product description"
                                onChange={handleChange}
                                name="description"
                                rows="5" 
                                className="w-full border border-gray-300 rounded-lg p-3 text-cldark"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
        </>
    )
}

export default AddProduct