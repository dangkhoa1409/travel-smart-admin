import React, { useEffect, useState } from "react";
import AddUser from "../components/Modal/AddUser";
import AdminNav from "../components/Navbar/AdminNav";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar/Sidebar";
import UserModal from "../components/Modal/UserModal"; // Assuming you have this component
import useToggle from "../hooks/useToggle";
import BlockModal from "../components/Modal/BlockModal";
const UserManagement = () => {
  const [userData, setUserData] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Changed to store user object
  const [isUserModalOpen, setIsUserModalOpen] = useState(false); // State for UserModal
  const [modalFunction, setModalFunction] = useState("");
  const [activeModalId, setActiveModalId] = useState(null);
  const accessToken = JSON.parse(localStorage.getItem("user"));

  const fetchUserData = () => {
    fetch("http://localhost:8888/api/v1/identity/users?page=1&limit=10", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.result.accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data?.result?.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleBlockUser = async (item) => {
    try {
      const data = {
        block: !item.block,
      };
      console.log(data);

      const response = await fetch(
        `http://localhost:8888/api/v1/identity/users/block/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.result.accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      const { result: user } = await response.json();
      console.log(user);
      const newData = userData.map((item) => {
        return item.id === user.id ? { ...user } : { ...item };
      });
      setUserData(newData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditClick = (user) => {
    setEditingUser(user); // Set the user data to be edited
    setIsUserModalOpen(true); // Open the UserModal
    setModalFunction("Edit");
  };

  const handleAddClick = () => {
    setIsUserModalOpen(true);
    setModalFunction("Add");
  };

  const onAddStatus = (status) => {
    if (status === "success") {
      toast.success("Thêm thành công");
      setTimeout(() => {
        setIsUserModalOpen(false);
      }, 3000);
    } else {
      toast.error("Thêm thất bại");
    }
  };

  const handleToggleModal = (id) => {
    setActiveModalId(activeModalId === id ? null : id); // Close if it's already open
};


  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="h-full w-full flex flex-col p-3 dark:bg-gray-50 dark:text-gray-800 overflow-y-auto">
        <Toaster />
        <AdminNav />
        <div className="container w-full p-2 mx-auto sm:p-4 dark:text-gray-800">
          <div className="flex justify-between items-center border-b-2 pb-2 mb-3">
            <h2 className="text-2xl font-semibold leading-tight">
              Quản lý người dùng
            </h2>
            {/* <button className="px-4 py-2 border rounded border-solid border-black hover:bg-black hover:text-white"
            onClick={handleAddClick}
            >
              Thêm
            </button> */}
          </div>
          {/* overflow-x-auto */}
          <div className="">
            <table className="min-w-full text-xs">
              <colgroup>
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
                  <th className="p-2 text-xl border">Xác thực</th>
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
                        <BlockModal
                          key={item?.id}
                          isOpen={activeModalId === item?.id}
                          onToggle={() => handleToggleModal(item?.id)}
                          onChangeBlock={() => handleBlockUser(item)}
                          item={item}
                        />
                      </td>
                      <td className="p-2 border">
                        <p
                          className={`text-sm p-2 rounded-md relative border ${
                            item?.enable
                              ? `text-green-600 bg-green-200`
                              : `text-red-600 bg-red-200`
                          }`}
                        >
                          {item?.enable.toString() === "true"
                            ? "Verified"
                            : "Need verified"}
                        </p>
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
        {isUserModalOpen && (
          <UserModal
            onClose={() => setIsUserModalOpen(false)}
            user={editingUser} // Pass the user data to the modal
            onSuccess={onAddStatus}
            onFailed={onAddStatus}
            modalFunction={modalFunction}
            editedUserId={editingUser?.id}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;
