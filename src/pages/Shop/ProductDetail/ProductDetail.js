import React from "react";

const Dashboard = () => {
  return (
    <>
      <div className="p-4 md:ml-64 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <p className="text-cldark text-4xl font-bold my-4">Product Detail</p>
        
        <div className="bg-white h-80 shadow-md p-4">
            <button className="btn">Back</button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
