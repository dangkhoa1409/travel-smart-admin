import React, { useEffect, useState } from "react";
import AdminNav from "../components/Navbar/AdminNav";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar/Sidebar";

const PermissionManagement = () => {
  const [permissionData, setPermissionData] = useState([]);

  const accessToken = JSON.parse(localStorage.getItem("user"));

  const FetchPermissionData = () => {
    fetch("http://localhost:8888/api/v1/identity/permissions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.result.accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data?.result);
        setPermissionData(data?.result);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  useEffect(() => {
    FetchPermissionData();
  }, []);

  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto p-3 dark:bg-gray-50 dark:text-gray-800">
        <Toaster />
        <AdminNav />
        <div className="container w-full p-2 mx-auto sm:p-4 dark:text-gray-800">
          <div className="flex justify-between items-center border-b-2 pb-2 mb-3">
            <h2 className="text-2xl font-semibold leading-tight">
              Quản lý quyền
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <colgroup>
                <col />
                <col />
                <col />
              </colgroup>
              <thead className="dark:bg-gray-300">
                <tr className="text-left">
                  <th className="p-2 text-xl border">STT</th>
                  <th className="p-2 text-xl border">Tên quyền</th>
                  <th className="p-2 text-xl border">Mô tả</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(permissionData) ? (
                  permissionData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
                    >
                      <td className="p-2 border">
                        <p className="text-sm">{index + 1}</p>
                      </td>
                      <td className="p-2 border">
                        <p className="text-sm">{item?.name}</p>
                      </td>
                      <td className="p-2 border">
                        <p className="text-sm">{item?.description}</p>
                      </td>
                      {/* <td className="p-2 border text-right">
                        <div className="flex justify-center">
                          <button
                            className="px-3 py-1 border border-solid border-black rounded mr-2 hover:bg-black hover:text-white"
                            onClick={() => handleEditClick(item)}
                          >
                            Sửa
                          </button>
                          <button
                            className="px-3 py-1 border border-solid border-black rounded mr-2 hover:bg-black hover:text-white"
                            // Add delete functionality here
                          >
                            Xoá
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <div className="text-2xl mt-4">Failed to load data!</div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionManagement;
