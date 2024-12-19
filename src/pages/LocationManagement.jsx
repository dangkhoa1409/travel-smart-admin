import React, { useEffect, useState } from "react";
import AddUser from "../components/Modal/AddUser";
import AdminNav from "../components/Navbar/AdminNav";
import { toast, Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar/Sidebar";
import LocationSidebar from "../components/Sidebar/LocationSidebar";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import LocationStatusModel from "../components/Modal/LocationStatusModel";

const LocationManagement = () => {
  const [locationData, setLocationData] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const [page, setNextPage] = useState(1);
  const [activeModalId, setActiveModalId] = useState(null);
   const handleToggleModal = (id) => {
    setActiveModalId(activeModalId === id ? null : id); // Close if it's already open
};
  const accessToken = JSON.parse(localStorage.getItem("user"))

  const handleLocationStatus = (status) => {
    if (status === "success") {
      toast.success("Sửa thành công");
      setSelectedLocation(null)
      fetchLocationData()
    } else {
      toast.error("Sửa thất bại");
    }
  };

  const fetchLocationData = () => {
    fetch(`http://localhost:8888/api/v1/location/locations/all?page=${page}&limit=7`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken.result.accessToken}`
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        const sortedData = result.result.data.sort((a, b) => {
          const placeIdA = String(a.place_id || "").toLowerCase(); 
          const placeIdB = String(b.place_id || "").toLowerCase();
          return placeIdA.localeCompare(placeIdB);
        });
        setLocationData({paging: result.result.paging,data: sortedData});
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
      });
  };

  useEffect(() => {
    fetchLocationData();
  }, [page]);

  const handleRowClick = (location, index) => {
    setSelectedLocation(location, index); // Set selected location
  };

  const handleChange = (event, value) => {
    console.log(value);
    setNextPage(value);
  };
  const handleChangeStatusBlog = async (id, status) => {
    try {
      const data = {
        status,
      };
      const response = await fetch(
        `http://localhost:8888/api/v1/location/locations/status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.result.accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result) {
        console.log(id);
        
        setLocationData({
          ...locationData,
          data: [
            ...locationData.data.map((item) => {
              return item[`place_id`] === id ? { ...item, status } : { ...item };
            }),
          ],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full flex flex-col p-3 dark:bg-gray-50 dark:text-gray-800 overflow-y-auto">
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
          <div className="">
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
                  <th className="p-2 text-xl border">Status</th>
                </tr>
              </thead>
              <tbody>
                {locationData &&  Array.isArray(locationData.data) ? (
                  locationData.data.map((item, index) => (
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
                      <td className="p-2 border" onClick={(e) => e.stopPropagation()}>
                       <div className="relative">
                        <LocationStatusModel location={item} handleBlogStatus={handleChangeStatusBlog}/>
                       </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-2xl mt-4 text-center">Failed to load data!</td>
                  </tr>
                )}
              </tbody>
            </table>
            {locationData && (
              <div className="flex justify-center mt-5">
                <Pagination
                  count={locationData?.paging?.totalPages}
                  page={page}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        </div>

        {selectedLocation && (
          <LocationSidebar
            isOpen={sidebarOpen}
            locationData={selectedLocation}
            locationPosition="right"
            onClose={() => setSelectedLocation(null)}
            onEditSuccess={handleLocationStatus}
          />
        )}

      </div>
    </div>
  );
};

export default LocationManagement;
