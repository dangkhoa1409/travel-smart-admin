import React from "react";
import BlogsComp from "../components/Blogs/BlogsComp";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Blogs: React.FC = () => {
  const navigate = useNavigate();
  const { user, handleOrderPopup } = useUser();

  const handleWriteBlogClick = () => {
    if (user) {
      navigate("/WriteBlog");
      return;
    }
    handleOrderPopup();
  };

  return (
    <div className="pt-14 bg-gray-100">
      <BlogsComp />
      <div className="flex justify-center items-center dark:bg-gray-900">
        <button
          onClick={handleWriteBlogClick}
          className="bg-gradient-to-r from-primary mb-4 to-secondary hover:bg-gradient-to-r hover:from-secondary hover:to-primary transition-all duration-300 text-white px-6 py-2 rounded-full text-lg font-semibold shadow-md"
        >
          Tạo bài viết
        </button>
      </div>
    </div>
  );
};

export default Blogs;
