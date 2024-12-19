import React, { useState } from "react";
import LocationModal from "../Modal/LocationModal";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const LocationSidebar = ({
  isOpen,
  locationData,
  locationPosition,
  onClose,
  onAddSuccess,
  onEditSuccess,
  handleEditBouding,
  isEditBounding,
  setType,
  onEdit,
  onCancel,
  type,
  isInDB,
}) => {
  const [openModal, setOpenModal] = useState("");
  const navigate = useNavigate();

  const handleEditClick = () => {
    if (locationData) {
      navigate(`/locations/edit/${locationData.place_id}`); // Ensure locationData has an 'id' field
    }
  };

  return (
    <div
      className={`fixed top-0 ${
        locationPosition === "left"
          ? "left-[-5rem] bg-gray-100"
          : "right-[-28rem] bg-white"
      } bottom-0 z-10 h-full w-[27.5rem] shadow-xl transition-transform transform ${
        locationPosition === "left"
          ? isOpen
            ? "translate-x-[5rem]"
            : "-translate-x-full"
          : isOpen
          ? "translate-x-[-27rem]"
          : "-translate-x-full"
      }
      }`}
    >
      <div className={`p-4 ${locationPosition === "left" ? "mt-12" : ""}`}>
        <div className="flex justify-between items-center mb-4">
          {locationData?.thumbnail ? (
            <img
              width="250"
              height="250"
              src={locationData?.thumbnail?.url}
              alt="Thumbnail"
              className="rounded block object-contain mx-auto"
            />
          ) : (
            <p className="block text-center">Thumbnail không có sẵn</p>
          )}
          {locationPosition === "left" ? (
            <>
              {isInDB ? (
                <button
                  className="absolute right-[-4.5rem] w-[4rem] flex justify-center top-[5.5rem] bg-white px-4 py-2 border rounded border-solid border-black hover:bg-black hover:text-white"
                  onClick={() => setOpenModal("Add")}
                  disabled={!locationData} // Disable if no locationData
                >
                  Thêm
                </button>
              ) : (
                <button
                  className="absolute right-[-4.5rem] w-[4rem] flex justify-center top-[3rem] bg-white px-4 py-2 border rounded border-solid border-black hover:bg-black hover:text-white"
                  onClick={() => setOpenModal("Edit")}
                  disabled={!locationData} // Disable if no locationData
                >
                  Sửa
                </button>
              )}
            </>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18"
              width="18"
              viewBox="0 0 384 512"
              onClick={onClose}
            >
              <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
            </svg>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-4">
          {locationData?.name || "Địa điểm chưa đặt tên"}
        </h2>
        <p className="mt-2">
          {locationData ? `Rating: ${locationData.starRate}` : ""}
        </p>
        <p className="mt-2">{locationData ? `Lat: ${locationData.lat}` : ""}</p>
        <p className="mt-2">{locationData ? `Lon: ${locationData.lon}` : ""}</p>
        <p className="mt-2">
          {locationData ? `Address: ${locationData.display_name}` : ""}
        </p>
        <div className={`flex items-center w-full gap-4 mt-2 `}>
          <div className="flex-1">
            <div className="flex justify-between">
              <label
                htmlFor=""
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Bouding box
              </label>
              {locationPosition === "right" ? "" : (
              <button
                onClick={handleEditBouding}
                className="p-2 rounded-md bg-red-300 text-white"
              >
                Edit
              </button>
              )}
            </div>
            <div className="py-2 gap-2 flex flex-col ">
              <div className="flex items-center">
                <label
                  htmlFor=""
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Min lat
                </label>
                <span className="ml-2 p-2 border rounded-md">
                  {locationData ? locationData.boundingbox[0] : 0}
                </span>
                {isEditBounding && (
                  <div className="flex justify-end flex-1">
                    <span
                      className={`${type === "minY" && "text-blue-600"}`}
                      onClick={() => setType("minY")}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <label
                  htmlFor=""
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Max lat
                </label>
                <span className="ml-2 p-2 border rounded-md">
                  {locationData ? locationData.boundingbox[1] : 0}
                </span>
                {isEditBounding && (
                  <div className="flex justify-end flex-1">
                    <span
                      className={`${type === "maxY" && "text-blue-600"}`}
                      onClick={() => setType("maxY")}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <label
                  htmlFor=""
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Min lon
                </label>
                <span className="ml-2 p-2 border rounded-md">
                  {locationData ? locationData.boundingbox[2] : 0}
                </span>
                {isEditBounding && (
                  <div className="flex justify-end flex-1">
                    <span
                      className={`${type === "minX" && "text-blue-600"}`}
                      onClick={() => setType("minX")}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <label
                  htmlFor=""
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Max lon
                </label>
                <span className="ml-2 p-2 border rounded-md">
                  {locationData ? locationData.boundingbox[3] : 0}
                </span>
                {isEditBounding && (
                  <div className="flex justify-end flex-1">
                    <span
                      className={`${type === "maxX" && "text-blue-600"}`}
                      onClick={() => setType("maxX")}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </span>
                  </div>
                )}
              </div>
            </div>
            {isEditBounding && (
              <div className="flex gap-2 items-center justify-end">
                <button
                  className="border-none border rounded-md p-2 bg-gray-300"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  className="border-none bg-blue-500 p-2 text-white rounded-md "
                  onClick={onEdit}
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
        {locationPosition === "right" ? (
          <div className="absolute bottom-5 right-5">
            <button
              className="border-none border rounded-md p-2 bg-green-500 text-white px-6"
              onClick={() => setOpenModal("Edit")}
            >
              Sửa
            </button>
          </div>
        ) : (
          ""
        )}
      </div>

      {/* Modal for adding location */}
      {openModal && (
        <LocationModal
          onClose={() => setOpenModal(false)}
          data={locationData}
          modalFunction={openModal}
          onAddSuccess={(param) => onAddSuccess(param, "Thêm")}
          onEditSuccess={(param) => {
            onEditSuccess(param, "Sửa");
          }}
          position={locationPosition}
        />
      )}
    </div>
  );
};

export default LocationSidebar;
