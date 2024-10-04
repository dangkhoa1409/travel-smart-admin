import React from "react";
import AdminNav from "../components/Navbar/AdminNav";
import Sidebar from "../components/Sidebar/Sidebar";

const BlogManagement = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="h-full w-full flex flex-col p-3 dark:bg-gray-50 dark:text-gray-800">
        <AdminNav></AdminNav>
        <div className="container w-full p-2 mx-auto sm:p-4 dark:text-gray-800">
          <div className="flex justify-between items-center border-b-2 pb-2 mb-3">
            <h2 className="text-2xl font-semibold leading-tight">
              Quản lý bài viết
            </h2>
            <button
              className="px-4 py-2 border rounded border-solid border-black hover:bg-black hover:text-white"
              onClick={() => navigate("/")}
            >
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
