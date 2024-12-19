import React, { useEffect, useState, useRef } from "react";
import useToggle from "../../hooks/useToggle";
import { color } from "../../utils/color";
const LocationStatus = ({ location, handleBlogStatus }) => {
  const [statuses, setStatus] = useState([]);
  const accessToken = JSON.parse(localStorage.getItem("user"));
  const { isToggle: isStatusModal, handleToggle } = useToggle();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const getBlogStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/api/v1/location/locations/status",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken.result.accessToken}`,
            },
          }
        );

        const data = await response.json();
        if (data) {
          setStatus(data.result);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getBlogStatus();
  }, []);
  const onClick = async (id, status) => {
    await handleBlogStatus(id, status);
    handleToggle();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleToggle(); // Close the dropdown
      }
    };

    if (isStatusModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStatusModal]);

  return (
    <div
    ref={dropdownRef}
      onClick={!isStatusModal ? () => handleToggle() : undefined}
      className={` text-sm p-2 rounded-md border relative ${
        color[`${location.status}`]
      }`}
    >
      {location?.status}
      {isStatusModal && (
        <div className="absolute left-[-4px] top-100 z-[100] rounded-sm border bg-white">
          {statuses.length > 0 &&
            statuses.map((status) => (
              <span
                onClick={
                  !(status === location.status)
                    ? () => onClick(location[`place_id`], status)
                    : undefined
                }
                className={` flex justify-between p-2 text-black cursor-pointer hover:text-green-600 hover:bg-green-200`}
              >
                {status}
                {status === location.status && (
                  <span className="text-blue-600">
                    <i className="fa-solid fa-check"></i>
                  </span>
                )}
              </span>
            ))}
        </div>
      )}
    </div>
  );
};

export default LocationStatus;
