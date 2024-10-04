import React, { useEffect, useState } from "react";
import AddUser from "../components/Modal/AddUser";
import AdminNav from "../components/Navbar/AdminNav";
import { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar/Sidebar";

const UserManagement = () => {
  const [userData, setUserData] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToAdd, setIdToAdd] = useState("");

  const accessToken = JSON.parse(localStorage.getItem("user"))

  const fetchUserData = () => {
    fetch("http://localhost:8888/api/v1/identity/users?page=1&limit=10", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken.result.accessToken}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data?.result?.data);
        // setIdToAdd(data[data.length - 1]?.id || 0);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // const handleEditClick = (user) => {
  //   setEditingUserId(user.id);
  //   setEditedUserData({ ...user });
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setEditedUserData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  // const handleSave = () => {
  //   const { name, phone, birth, email, account, role } = editedUserData;
  //   if (!name || !phone || !birth || !email || !account || !role) {
  //     toast.error("Tất cả các trường không được để trống");
  //     return;
  //   }

  //   fetch(`http://localhost:3000/user/${editingUserId}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(editedUserData),
  //   })
  //     .then((response) => response.json())
  //     .then(() => {
  //       toast.success("Lưu thành công");
  //       setEditingUserId(null);
  //       fetchUserData();
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };

  // const handleDelete = (item) => {
  //   toast(
  //     (t) => (
  //       <span>
  //         Bạn có chắc chắn xoá người dùng này?
  //         <div className="flex justify-center mt-2">
  //           <button
  //             className="px-3 py-1 border border-solid border-black rounded mr-2 hover:bg-black hover:text-white"
  //             onClick={() => {
  //               deleteConfirmed(item);
  //               toast.dismiss(t.id);
  //             }}
  //           >
  //             Xoá
  //           </button>
  //           <button
  //             className="px-3 py-1 border border-solid border-black rounded hover:bg-black hover:text-white"
  //             onClick={() => toast.dismiss(t.id)}
  //           >
  //             Huỷ
  //           </button>
  //         </div>
  //       </span>
  //     ),
  //     {
  //       duration: 5000,
  //       position: "middle-center",
  //     }
  //   );
  // };

  // const deleteConfirmed = (item) => {
  //   fetch(`http://localhost:3000/user/${item.id}`, {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then(() => {
  //       toast.success("Xoá thành công");
  //       fetchUserData(); // Fetch lại data sau khi xoá
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };

  // const showAddModal = () => {
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  // const handleUserAdded = () => {
  //   fetchUserData(); // Fetch lại data sau khi thêm
  // };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <div className="h-full w-full flex flex-col p-3 dark:bg-gray-50 dark:text-gray-800">
        <Toaster />
        <AdminNav></AdminNav>
        <div
          className={`${
            isModalOpen ? "hidden" : "block"
          } container w-full p-2 mx-auto sm:p-4 dark:text-gray-800`}
        >
          <div className="flex justify-between items-center border-b-2 pb-2 mb-3">
            <h2 className="text-2xl font-semibold leading-tight">
              Quản lý người dùng
            </h2>
            <button
              className="px-4 py-2 border rounded border-solid border-black hover:bg-black hover:text-white"
              // onClick={showAddModal}
            >
              Thêm
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead className="dark:bg-gray-300">
                <tr className="text-left">
                  <th className="p-2 text-xl border">ID</th>
                  <th className="p-2 text-xl border">Email</th>
                  <th className="p-2 text-xl border">Trạng thái</th>
                  <th className="p-2 text-xl border">Verify</th>
                  <th className="p-2 text-xl border text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(userData) ? (
                  userData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
                    >
                      <td className="p-2 border">
                        <p className="text-sm">{item?.id}</p>
                      </td>
                      <td className="p-2 border">
                          <p className="text-sm">{item?.email}</p>
                      </td>
                      <td className="p-2 border">
                          <p className="text-sm">{item?.block.toString() === "false" ? "Active" : "Blocked"}</p>
                      </td>
                      <td className="p-2 border">
                          <p className="text-sm">{item?.enable.toString() === "true" ? "Verified" : "Unverified"}</p>
                      </td>
                      <td className="p-2 border text-right">
                        <div className="flex justify-center">
                          {editingUserId === item?.id ? (
                            <button
                              className="px-3 py-1 border border-solid border-black rounded mr-2 hover:bg-black hover:text-white"
                              onClick={handleSave}
                            >
                              Lưu
                            </button>
                          ) : (
                            <>
                              <button
                                className="px-3 py-1 border border-solid border-black rounded mr-2 hover:bg-black hover:text-white"
                                onClick={() => handleEditClick(item)}
                              >
                                Sửa
                              </button>
                              <button
                                className="px-3 py-1 border border-solid border-black rounded mr-2 hover:bg-black hover:text-white"
                                onClick={() => handleDelete(item)}
                              >
                                Xoá
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <div className="text-2xl mt-4">Failed to load data!</div>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {isModalOpen && (
          <AddUser
            userId={idToAdd}
            closeModal={closeModal}
            onUserAdded={handleUserAdded}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;
