import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import imageCompression from "browser-image-compression";

const AddUser = ({ userId, closeModal, onUserAdded }) => {
  const [newUserData, setNewUserData] = useState({});
  const [imageBase64, setImageBase64] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      id: (parseInt(userId) + 1).toString(),
      role: "user",
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Configure image compression
        const options = {
          maxSizeMB: 1, // Maximum size in MB
          maxWidthOrHeight: 800, // Maximum width or height in pixels
        };

        // Compress image
        const compressedFile = await imageCompression(file, options);

        // Convert to Base64
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          setImageBase64(reader.result);
        };
      } catch (error) {
        console.error("Error converting file to Base64", error);
        toast.error("Failed to convert image");
      }
    }
  };


  const handleAdd = async (e) => {
    e.preventDefault();

    if (!imageBase64) {
      toast.error("Please select an image");
      return;
    }

    const formData = { ...newUserData, avatar: imageBase64 };

    try {
      const response = await fetch(`http://localhost:3000/user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      toast.success("Thêm thành công");
      setTimeout(() => {
        onUserAdded();
        closeModal();
      }, 1000);
    } catch (error) {
      toast.error("Thêm thất bại");
      console.error("Error:", error.message);
    }
  };
  

  return (
    <div className="container w-full p-2 mx-auto sm:p-4 dark:text-gray-800">
      <Toaster />
      <div className="flex justify-between items-center border-b-2 pb-2 mb-2">
        <h2 className="text-2xl font-semibold leading-tight">
          Thêm người dùng
        </h2>
        <button
          className="px-4 py-2 border rounded border-solid border-black hover:bg-black hover:text-white"
          onClick={closeModal}
        >
          Quay lại
        </button>
      </div>
      <div className="overflow-x-auto">
        <form className="mt-4" onSubmit={handleAdd}>
          <div className="mb-6">
            <label
              htmlFor="avatar"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Avatar
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Ex: https://unsplash.com/photos"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tên
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Ex: Tùng"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="birth"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Ngày sinh
              </label>
              <input
                type="text"
                id="birth"
                name="birth"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Ex: 01/01/2002"
                pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/([0-9]{4})$"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Ex: 0933444555"
                pattern="[0-9]{10}"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Ex: abc@gmail.com"
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="account"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="account"
              name="account"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="•••••••••"
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirm_password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="•••••••••"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Thêm
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
