import React, { useState, useEffect } from "react";

const UserModal = ({
  onClose,
  user,
  modalFunction,
  onSuccess,
  onFailed,
  editedUserId,
}) => {
  const [formData, setFormData] = useState(null);
  const [visible, setVisible] = useState(false);

  const accessToken = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  useEffect(() => {
    // Show modal when component mounts
    setVisible(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveUser = (placeId) => {
    // ...something
  };

  useEffect(() => {}, []);

  const handleAddUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:8888/api/v1/location/locations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.result.accessToken}`,
          },
          body: JSON.stringify(data2),
        }
      );
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 3000);
      console.log(response);
    } catch (error) {
      onFailed();
      console.log(error);
    }
  };

  return (
    <div
      className="relative z-30"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`fixed inset-0 w-screen overflow-y-auto transition-transform transform ${
          visible ? "translate-y-0" : "translate-y-[-100%]"
        } duration-300 ease-in-out`}
      >
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <form className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
            <h2 className="text-center py-2 text-xl">Sửa quyền người dùng
            </h2>
            <div className="px-4">
              <div className="flex items-center w-full gap-4 mt-2">
                {/* <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={
                      modalFunction === "Edit" ? user?.email || "Không có" : ""
                    }
                    onChange={handleInputChange}
                  />
                </div> */}
                <div className="flex-1">
                  <label
                    htmlFor="block"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Trạng thái
                  </label>
                  <select
                    name="block"
                    id="block"
                    required
                    className="block w-full rounded-md border-0 py-[0.6rem] px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={
                      modalFunction === "Edit" ? user?.block || "Active" : ""
                    }
                    onChange={handleInputChange}
                  >
                    <option value="false">Active</option>
                    <option value="true">Blocked</option>
                  </select>
                </div>
              </div>
              {/* <div className="flex items-center w-full gap-4 mt-2">
                <div className="flex-1">
                  <label
                    htmlFor="verify"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Xác thực
                  </label>
                  <select
                    name="verify"
                    id="verify"
                    required
                    className="block w-full rounded-md border-0 py-[0.6rem] px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={
                      modalFunction === "Edit" ? user?.enable || "Không có" : ""
                    }
                    onChange={handleInputChange}
                  >
                    <option value="true">Verified</option>
                    <option value="false">Unverified</option>
                  </select>
                </div>
              </div> */}
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0073A8] sm:ml-3 sm:w-auto"
                onClick={() => handleSaveUser(editedUserId)}
              >
                Lưu
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={onClose}
              >
                Quay lại
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
