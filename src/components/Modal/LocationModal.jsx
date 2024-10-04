import React, { useState, useEffect } from "react";

const LocationModal = ({ onClose, data, modalFunction, onSuccess, onFailed }) => {
  const [formData, setFormData] = useState(data);
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState({});
  const [types, setTypes] = useState([]);
  const [type, setType] = useState();
  const accessToken = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Show modal when component mounts
    setVisible(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveLocation = (placeId) => {
    // ...something
  };

  const handleUploadFile = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      if (!file) return;
      const response = await fetch(
        "http://localhost:8888/api/v1/location/locations/image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken.result.accessToken}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data);
      if (data) {
        setImage(data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/api/v1/location/locations/type",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken.result.accessToken}`,
            },
          }
        );

        const data = await response.json();
        console.log(data);
        if (data) {
          setTypes(data.result);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTypes();
  }, []);
  const handleAddLocation = async () => {
    // check image.id = null thì báo lỗi, ngược lại thành công
    const data2 = {
      ...data,
      imageId: image?.id,

      type,
    };
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
      onSuccess()
      setTimeout(() => {
        onClose()
      }, 3000)
      console.log(response);
    } catch (error) {
      onFailed()
      console.log(error);
    }
  };
  const handleChangeType = (type) => {
    setType(type.target.value);
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
            <h2 className="text-center py-2 text-xl">
              {`${modalFunction === "Edit" ? "Sửa" : "Thêm"}`} địa điểm
            </h2>
            <div>
              {!image.id ? (
                <div className="px-4">
                  <h3 className="text-center">Thumbnail không có sẵn</h3>
                  <input
                    type="file"
                    name="thumbnail"
                    id="thumbnail"
                    className="block w-full rounded-md border-0 py-1 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={handleUploadFile}
                  />
                </div>
              ) : (
                <>
                  <div className="flex justify-center">
                    <img width="200" height="200" src={image?.url} alt="" />
                  </div>
                  <label
                    htmlFor="thumbnail"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Thumbnail
                  </label>
                </>
              )}
            </div>
            <div className="px-4">
              <div className="flex items-center w-full gap-4 mt-2">
                <div className="flex-1">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Tên địa điểm
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.name || "Không có"}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Loại địa điểm
                  </label>
                  <input
                    type="text"
                    name="type"
                    id="type"
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.type || "Không có"}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex items-center w-full gap-4 mt-2">
                <div className="flex-1">
                  <label
                    htmlFor="lat"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Lat
                  </label>
                  <input
                    type="text"
                    name="lat"
                    id="lat"
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.lat || "Không có"}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="lon"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Lon
                  </label>
                  <input
                    type="text"
                    name="lon"
                    id="lon"
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.lon || ""}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div>
                  <select onChange={handleChangeType}>
                    {types.length > 0 &&
                      types.map((type) => (
                        <option value={type} defaultValue={type}>
                          {type}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <h3 className="mt-3 text-xl text-center">Địa chỉ</h3>
              <div className="flex items-center w-full gap-4 mt-2">
                <div className="flex-1">
                  <label
                    htmlFor="housenumber"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Số nhà
                  </label>
                  <input
                    type="text"
                    name="housenumber"
                    id="housenumber"
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.address?.housenumber || "Không có"}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Tỉnh
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.address?.state || "Không có"}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex items-center w-full gap-4 mt-2">
                <div className="flex-1">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Quốc gia
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.address?.country || "Không có"}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="countryCode"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Mã quốc gia
                  </label>
                  <input
                    type="text"
                    name="countryCode"
                    id="countryCode"
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.address?.country_code || "Không có"}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              {modalFunction === "Edit" ? (
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0073A8] sm:ml-3 sm:w-auto"
                  onClick={() => handleSaveLocation(data.placeId)}
                >
                  Lưu
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0073A8] sm:ml-3 sm:w-auto"
                  onClick={() => handleAddLocation()}
                >
                  Thêm
                </button>
              )}
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

export default LocationModal;
