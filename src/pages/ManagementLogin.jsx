import React, { useEffect, useState } from "react";
import LoginAdmin from "../components/LoginAdmin/LoginAdmin";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useDispatch } from "react-redux";
import { setCurrentUser } from '../components/Admin/UserSlice';
import toast, { Toaster } from 'react-hot-toast';

const ManagementLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { setOrderPopup } = useUser();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  const fetchUser = async (email, passwr) => {
    try {
      const response = await fetch("http://localhost:8888/api/v1/identity/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: passwr
        })
      });
      const data = await response.json();
      setUser(data); // Save the fetched user data

      if (data?.result?.accessToken) {
        localStorage.setItem("user", JSON.stringify(data)); // Store user in local storage
        setOrderPopup(false);

        toast.success("Đăng nhập thành công");

        setTimeout(() => {
          navigate("/Home"); // Navigate to Admin
        }, 1000);
      } else {
        toast.error("Sai tên tài khoản hoặc mật khẩu");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
    }
  };

  const handleLogin = (data) => {
    fetchUser(data.email, data.password);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="w-full flex h-screen bg-slate-100 z-50">
      <Toaster />
      {/* Left section */}
      <div className="w-3/6 pb-20 h-full flex flex-col justify-center items-center bg-primary">
        <img className="w-[200px] h-[200px] object-contain" src={Logo} alt="" />
        <p className="text-3xl text-white">Du lịch theo cách của bạn</p>
      </div>
      {/* Right section */}
      <div
        className="w-3/6 px-6 pb-12 flex flex-col justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <>
          <h2 className="text-2xl font-bold text-center mb-8">
            Đăng nhập trang quản lý
          </h2>
          <div className="relative w-full h-1/4">
            <div
              className="absolute inset-0 w-full h-full flex transition-transform duration-500 transform"
              style={{
                transform: isLogin ? "translateX(0)" : "translateX(-100%)",
              }}
            >
              <div className="w-full">
                <LoginAdmin onLogin={handleLogin} />
              </div>
            </div>
          </div>
          <button
            onClick={toggleForm}
            className="w-full px-4 py-2 font-bold text-secondary rounded-md focus:outline-none transition-all"
          >
          </button>
        </>
      </div>
    </div>
  );
};

export default ManagementLogin;
