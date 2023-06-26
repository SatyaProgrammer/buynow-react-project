import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const User_detail = () => {
  const uid = useParams().id;

  const [products, setProducts] = useState([]);
  const [infos, setInfos] = useState([]);
  const handleFetch = async () => {
    const product_response = axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/users/${uid}/products`)
      .then((products) => {
        setProducts(products.data.products);
      })
      .catch((error) => {
        console.log(error);
      });

    const info_response = axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/users/${uid}`)
      .then((infos) => {
        setInfos(infos.data);
      })
      .catch((error) => {
        console.log(error);
      });

    return await Promise.all([product_response, info_response]);
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <>
      {console.log(infos)}
      {console.log(products)}
      <div className="p-4 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <div className="container min-h-screen max-h-full">
          <div className="shadow-md bg-white p-4">
            <div>
              <div className="flex items-center gap-4">
                <div className=" w-32">
                  <img
                    src={infos.image}
                    alt="product image"
                    className="w-full h-32 rounded-full shadow-md object-cover"
                  />
                </div>
                <div className="text-cldark text-4xl font-semibold">{infos.username}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default User_detail;
