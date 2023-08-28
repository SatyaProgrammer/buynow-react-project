import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Stars } from "../../components";
import { useNavigate, Link } from "react-router-dom";

const User_detail = () => {
  const uid = useParams().id;
  const navigate = new useNavigate();

  const [products, setProducts] = useState([]);
  const [infos, setInfos] = useState([]);
  const handleFetch = async () => {
    const product_response = axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/users/${uid}/products`)
      .then((products) => {
        setProducts(products.data.products);
      })
      .catch((error) => {});

    const info_response = axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/users/${uid}`)
      .then((infos) => {
        setInfos(infos.data);
      })
      .catch((error) => {});

    return await Promise.all([product_response, info_response]);
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <>
      <div className="p-4 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <div className="container min-h-screen max-h-full">
          <div className="shadow-md bg-white p-4 flex flex-col gap-4 rounded-md">
            <button onClick={() => navigate(-1)} className="btn w-fit">
              Back
            </button>
            <div className="flex flex-col gap-4 p-4 rounded-md border-2">
              <div className="flex items-center gap-4">
                <div className=" w-32">
                  <img
                    src={infos.image}
                    alt=""
                    className="w-full h-32 rounded-full shadow-md object-cover"
                  />
                </div>
                <div>
                  <div className="text-cldark text-4xl font-semibold">
                    {infos.username}
                  </div>
                  <div className="text-gray-600 text-md font-normal">
                    Tel: {infos.phone}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-2xl text-cldark ">Contact Information</div>
                {infos.contactInfo
                  ? Object.keys(infos.contactInfo).map((keyName, i) => (
                      <div key={i} className="flex gap-2 text-grey3 text-md">
                        {keyName}:{" "}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={infos.contactInfo[keyName]}
                          className="text-blue-500 underline"
                        >
                          {infos.contactInfo[keyName]}
                        </a>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
            <div className="flex flex-col gap-4 p-4 rounded-md border-2">
              <div className="text-2xl text-cldark ">Products</div>
              {products?.map((product) => (
                <div
                  key={product.id}
                  className="p-4 border rounded-md hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <div className=" w-16">
                        <img
                          src={product.images.images[0]}
                          alt="product image"
                          className="w-full h-12 rounded-md shadow-md object-cover"
                        />
                      </div>
                      <div>
                        <div>{product.name}</div>
                        <div>
                          <Stars stars={product.rating} />
                        </div>
                      </div>
                    </div>
                    <Link to={`/admin/user_product/${uid}/${product.pid}`}>
                      <div className="text-md text-blue-500 underline cursor-pointer">
                        View more
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default User_detail;
