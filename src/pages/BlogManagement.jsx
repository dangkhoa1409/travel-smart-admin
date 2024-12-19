import React, { useEffect, useState } from "react";
import AdminNav from "../components/Navbar/AdminNav";
import Sidebar from "../components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import BlogStatusModal from "../components/Modal/BlogStatusModal";
import { pagination } from "../utils/pagination";
import { Pagination } from "@mui/material";

const BlogManagement = () => {
  const navigate = useNavigate();
  const [result, setData] = useState(null);
  const accessToken = JSON.parse(localStorage.getItem("user"));
  const [page, setNextPage] = useState(1);
  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await fetch(
          `http://localhost:8888/api/v1/blog/blogs?page=${page}&limit=5`,
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
          setData(data.result);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getBlogs();
  }, [page]);

  const handleChangeStatusBlog = async (id, status) => {
    try {
      const data = {
        status,
      };
      const response = await fetch(
        `http://localhost:8888/api/v1/blog/blogs/status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.result.accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      const reuslt = await response.json();
      if (reuslt) {
        setData({
          ...result,
          data: [
            ...result.data.map((item) => {
              return item.id === id ? { ...item, status } : { ...item };
            }),
          ],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (event, value) => {
    setNextPage(value);
  };
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="h-full w-full flex flex-col p-3 dark:bg-gray-50 dark:text-gray-800 overflow-y-auto">
        <AdminNav></AdminNav>
        <div className="container w-full p-2 mx-auto sm:p-4 dark:text-gray-800">
          <div className="flex justify-between items-center border-b-2 pb-2 mb-3">
            <h2 className="text-2xl font-semibold leading-tight">
              Quản lý bài viết
            </h2>
            <button
              className="px-4 py-2 border rounded border-solid border-black hover:bg-black hover:text-white"
              onClick={() => navigate("/blog/add")}
            >
              Thêm
            </button>
          </div>
          <div className="overflow-x-auto h-[100vh]">
            <table className="min-w-full text-xs">
              <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead className="dark:bg-gray-300">
                <tr className="text-left">
                  <th className="p-2 text-xl border text-center">ID</th>
                  <th className="p-2 text-xl border">Title</th>
                  <th className="p-2 text-xl border">Username</th>
                  <th className="p-2 text-xl border">Tags</th>
                  <th className="p-2 text-xl border text-center">Status</th>
                  <th className="p-2 text-xl border text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {result && Array.isArray(result.data) ? (
                  result.data.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
                    >
                      <td className="p-2 border text-center">
                        <p className="text-sm">{item?.id}</p>
                      </td>
                      <td className="p-2 border">
                        <p className="text-sm">{item?.title}</p>
                      </td>
                      <td className="p-2 border">
                        <p className="text-sm">{item?.userName}</p>
                      </td>
                      <td className="p-2 border">
                        <p className="text-sm">
                          {item?.tags.map((item, index, arr) =>
                            index === arr.length - 1 ? item : `${item}, `
                          )}
                        </p>
                      </td>

                      <td className="p-2 border text-center">
                        <BlogStatusModal
                          blog={item}
                          handleBlogStatus={handleChangeStatusBlog}
                        />
                      </td>
                      <td className="p-2 border text-right">
                        <div className="flex justify-center">
                          <button
                            className="px-3 py-1 border border-solid border-black rounded mr-2 hover:bg-black hover:text-white"
                            onClick={() =>
                              (window.location.href = `/blog/edit/${item.code}`)
                            }
                          >
                            Sửa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <div className="text-2xl mt-4">Failed to load data!</div>
                )}
              </tbody>
            </table>
            {result && (
              <div className="flex justify-center mt-5">
                <Pagination
                  count={result.paging.totalPages}
                  page={page}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
