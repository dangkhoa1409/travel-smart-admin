import React, { useEffect, useState } from "react";
import AddUser from "../components/Modal/AddUser";
import AdminNav from "../components/Navbar/AdminNav";
import { toast, Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar/Sidebar";
import LocationSidebar from "../components/Sidebar/LocationSidebar";
import { useNavigate } from "react-router-dom";

const LocationManagement = () => {
  const [locationData, setLocationData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const accessToken = JSON.parse(localStorage.getItem("user"))

  const fetchLocationData = () => {
    fetch("http://localhost:8888/api/v1/location/locations/news?limit=10", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken.result.accessToken}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLocationData(data?.result);
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
      });
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  const handleRowClick = (location, index) => {
    setSelectedLocation(location, index); // Set selected location
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setEditedUserData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
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

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <div className="h-full w-full flex flex-col p-3 dark:bg-gray-50 dark:text-gray-800">
        <Toaster />
        <AdminNav />
        <div
          className={`container w-full p-2 mx-auto sm:p-4`}
        >
          <div className="flex justify-between items-center border-b-2 pb-2 mb-3">
            <h2 className="text-2xl font-semibold leading-tight">Quản lý địa điểm</h2>
            <button
              className="px-4 py-2 border rounded border-solid border-black hover:bg-black hover:text-white"
              onClick={() => navigate("/Map")}
            >
              Bản đồ
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm">
              <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead className="dark:bg-gray-300">
                <tr className="text-left">
                  <th className="p-2 text-xl border">PlaceId</th>
                  <th className="p-2 text-xl border">Name</th>
                  <th className="p-2 text-xl border">DisplayName</th>
                  <th className="p-2 text-xl border">Category</th>
                  <th className="p-2 text-xl border">Lat</th>
                  <th className="p-2 text-xl border">Lon</th>
                  <th className="p-2 text-xl border">Country</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(locationData) ? (
                  locationData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleRowClick(item)}
                    >
                      <td className="p-2 border text-sm text-center">{item?.place_id}</td>
                      <td className="p-2 border text-sm">{item?.name}</td>
                      <td className="p-2 border text-sm">{item?.display_name}</td>
                      <td className="p-2 border text-sm text-center">{item?.category}</td>
                      <td className="p-2 border text-sm">{item?.lat}</td>
                      <td className="p-2 border text-sm">{item?.lon}</td>
                      <td className="p-2 border text-sm text-center">{item?.address?.country}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-2xl mt-4 text-center">Failed to load data!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedLocation && (
          <LocationSidebar
            isOpen={sidebarOpen}
            locationData={selectedLocation}
            locationPosition="right"
            onClose={() => setSelectedLocation(null)}
          />
        )}

      </div>
    </div>
  );
};

export default LocationManagement;
