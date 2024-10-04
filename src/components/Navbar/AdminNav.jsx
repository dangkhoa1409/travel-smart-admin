import React from 'react'
import { useNavigate } from "react-router-dom";

const AdminNav = () => {
    const navigate = useNavigate();

    const handleLoggout = () => {
        navigate("/Login");
        localStorage.removeItem("user")
    }

  return (
    <div className="flex justify-end">
        <p className="text-base">Xin chào Admin</p>
        <a className="text-base text-cyan-300 mx-2 pl-2 border-l-2 border-slate-300" href="" onClick={handleLoggout}>Đăng xuất</a>
    </div>
  )
}

export default AdminNav