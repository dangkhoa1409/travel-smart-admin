import React, { useState, useEffect } from "react";
import AdminNav from "../Navbar/AdminNav";

const Account = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [editedUserData, setEditedUserData] = useState({});
  const [imgUrl, setImgUrl] = useState("")

  const userLogged = JSON.parse(localStorage.getItem("user"));

  const loadBase64Image = (base64Str) => {
    // Extract MIME type and base64 string
    const [header, base64Data] = base64Str.split(",");
    const mimeType = header.match(/:(.*?);/)[1];

    // Decode Base64 string to binary data
    const binaryString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob from the ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: mimeType });

    // Create an Object URL for the Blob
    const objectURL = URL.createObjectURL(blob);

    setImgUrl(objectURL)
  }

  useEffect(() => {
    loadBase64Image(userLogged?.avatar)
  }, [])

  const handleEditAccount = () => {
    if (!isEditable) {
      setEditedUserData(userLogged);
    }
    setIsEditable(!isEditable);
  };

  const fetchCurrentUserData = () => {
    fetch(`http://localhost:3000/user/${userLogged.id}`)
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  useEffect(() => {
    fetchCurrentUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    for (let key in editedUserData) {
      if (editedUserData[key].trim() === "") {
        alert("Các trường không được để trống");
        return;
      }
    }

    fetch(`http://localhost:3000/user/${userLogged.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedUserData),
    })
      .then((response) => response.json())
      .then((updatedData) => {
        alert("Sửa thành công");
        setIsEditable(false);
        localStorage.setItem("user", JSON.stringify(updatedData));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="h-full w-full flex flex-col p-3 space-y-2 dark:bg-gray-50 dark:text-gray-800">
      <AdminNav />
      {userLogged ? (
        <div className="container w-full p-2 mx-auto sm:p-4 dark:text-gray-800">
          <div className="flex justify-between items-center border-b-2 pb-2 mb-3">
            <h2 className="text-2xl font-semibold leading-tight">
              Thông tin tài khoản
            </h2>
            {isEditable ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 border rounded border-solid border-black hover:bg-black hover:text-white"
              >
                Lưu
              </button>
            ) : (
              <button
                onClick={handleEditAccount}
                className="px-4 py-2 border rounded border-solid border-black hover:bg-black hover:text-white"
              >
                Sửa
              </button>
            )}
          </div>
          <div className="w-3/6 mb-4">
            <label
              htmlFor="avatar"
              className="block mb-2 text-xl font-medium text-gray-900 dark:text-white"
            >
              Avatar
            </label>
            {isEditable ? (
              <input
                type="text"
                id="avatar"
                name="avatar"
                className="input-editable bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleInputChange}
                value={editedUserData?.avatar}
                required
              />
            ) : (
              <img
                width="200"
                height="auto"
                src={imgUrl}
                alt="avatar"
              />
            )}
          </div>
          <div className="flex mx-[-1rem] mb-4">
            <div className="w-3/6 px-4">
              <label
                htmlFor="birth"
                className="block mb-2 text-xl font-medium text-gray-900 dark:text-white"
              >
                Ngày sinh
              </label>
              {isEditable ? (
                <input
                  type="text"
                  id="birth"
                  name="birth"
                  className="input-editable bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleInputChange}
                  value={editedUserData?.birth}
                  pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/([0-9]{4})$"
                  required
                />
              ) : (
                <p className="text-sm text-gray-600">{userLogged?.birth}</p>
              )}
            </div>
            <div className="w-3/6 px-4">
              <label
                htmlFor="phone"
                className="block mb-2 text-xl font-medium text-gray-900 dark:text-white"
              >
                Số điện thoại
              </label>
              {isEditable ? (
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="input-editable bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleInputChange}
                  value={editedUserData?.phone}
                  pattern="[0-9]{10}"
                  required
                />
              ) : (
                <p className="text-sm text-gray-600">{userLogged?.phone}</p>
              )}
            </div>
          </div>
          <div className="flex mx-[-1rem] mb-4">
            <div className="w-3/6 px-4">
              <label
                htmlFor="gmail"
                className="block mb-2 text-xl font-medium text-gray-900 dark:text-white"
              >
                Gmail
              </label>
              {isEditable ? (
                <input
                  type="email"
                  id="gmail"
                  name="gmail"
                  className="input-editable bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleInputChange}
                  value={editedUserData?.email}
                  required
                />
              ) : (
                <p className="text-sm text-gray-600">{userLogged?.email}</p>
              )}
            </div>
            <div className="w-3/6 px-4">
              <label
                htmlFor="account"
                className="block mb-2 text-xl font-medium text-gray-900 dark:text-white"
              >
                Tài khoản
              </label>
              {isEditable ? (
                <input
                  type="text"
                  id="account"
                  name="account"
                  className="input-editable bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleInputChange}
                  value={editedUserData?.account}
                  required
                />
              ) : (
                <p className="text-sm text-gray-600">{userLogged?.account}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Account;
