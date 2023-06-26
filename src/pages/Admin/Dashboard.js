import React, { useEffect, useState } from "react";
import { IconFile, IconEdit, IconDelete } from "../Shop/utils/Icons";
import Cookies from "universal-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");

  const [users, setUsers] = useState([]);
  const handleFetch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );
      if (response) {
        setUsers(response.data.users);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleDelete = (pid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // deleteProduct(pid);
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  return (
    <>
      {}
      <div className="p-4 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <div className="container min-h-screen max-h-full">
          <div className="shadow-md bg-white">
            <div className="p-4 flex items-center sm:justify-between sm:flex-row gap-1 flex-col justify-center">
              <div className="text-2xl font-semibold text-cldark">
                User Management
              </div>
            </div>
            <div className="overflow-x-auto table-scrolling table-wrapper page">
              <table className="w-full">
                <thead className="bg-gray-100 z-50">
                  <tr>
                    <th className="text-cldark text-left font-semibold text-md p-4 border-y name-row whitespace-nowrap">
                      Username
                    </th>
                    <th className="text-cldark text-left font-semibold text-md p-4 border-y name-row whitespace-nowrap">
                      Email
                    </th>
                    <th className="text-cldark text-left font-semibold text-md p-4 border-y name-row whitespace-nowrap">
                      Role
                    </th>
                    <th className="text-cldark text-left font-semibold text-md p-4 border-y name-row whitespace-nowrap">
                      Verify
                    </th>
                    <th className="text-cldark text-left font-semibold text-md p-4 border-y name-row whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {users?.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 ">
                      <td className="text-cldark p-4 border-b whitespace-nowrap overflow-hidden">
                        <div className="flex items-center gap-2 w-48">
                          <div className="w-10">
                            <img
                              src={user.image}
                              alt="product image"
                              className="w-full h-10 rounded-full shadow-md object-cover"
                            />
                          </div>
                          <div className="font-semibold w-32 overflow-hidden">
                            {user.username}
                          </div>
                        </div>
                      </td>
                      <td className="text-cldark p-4 border-b whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="text-cldark p-4 border-b whitespace-nowrap">
                        {user.is_admin ? "Admin" : "User"}
                      </td>
                      <td className="text-cldark p-4 border-b whitespace-nowrap">
                        {user.verified ? "Verified" : "Not verififed"}
                      </td>
                      <td className="text-cldark p-4 border-b whitespace-nowrap">
                        <div className="flex gap-2 items-center">
                          <Link to={`/admin/user/${user.id}`}>
                            <div className="w-5 h-5 hover:scale-110 transition-all duration-300 hover:cursor-pointer">
                              <IconFile fill="hsl(22, 28%, 45%)" />
                            </div>
                          </Link>
                          <div
                            onClick={() => handleDelete(user.id)}
                            className="w-7 h-7 hover:scale-110 transition-all duration-300 hover:cursor-pointer"
                          >
                            <IconDelete fill="hsl(22, 28%, 45%)" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
