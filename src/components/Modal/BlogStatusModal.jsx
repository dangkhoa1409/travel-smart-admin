import React, { useEffect, useState, useRef } from "react";
import useToggle from "../../hooks/useToggle";
import { color } from "../../utils/color";
const BlogStatusModal = ({ blog, handleBlogStatus }) => {
  const [statuses, setStatus] = useState([]);
  const accessToken = JSON.parse(localStorage.getItem("user"));
  const { isToggle: isStatusModal, handleToggle } = useToggle();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const getBlogStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/api/v1/blog/blogs/status",
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
    <p
    ref={dropdownRef}
      onClick={!isStatusModal ? () => handleToggle() : undefined}
      className={` text-sm p-2 rounded-md border relative ${
        color[`${blog.status}`]
      }`}
    >
      {blog?.status}
      {isStatusModal && (
        <div className="absolute left-[-10px] top-100 z-[100] w-[90px] rounded-sm border bg-white">
          {statuses.length > 0 &&
            statuses.map((status) => (
              <span
                onClick={
                  !(status === blog.status)
                    ? () => onClick(blog.id, status)
                    : undefined
                }
                className={` flex justify-between p-2 text-black cursor-pointer hover:text-green-600 hover:bg-green-200`}
              >
                {status}
                {status === blog.status && (
                  <span className="text-blue-600">
                    <i className="fa-solid fa-check"></i>
                  </span>
                )}
              </span>
            ))}
        </div>
      )}
    </p>
  );
};

export default BlogStatusModal;