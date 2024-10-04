import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa"; 
import { useUser } from "../../context/UserContext"; 


const UserDropdown: React.FC = () => {
  const { user, logout } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 focus:outline-none"
        onClick={toggleDropdown}
      >
        <FaUserCircle className="text-3xl text-primary" />
        <span className="text-sm dark:text-white text-primary">{user?.name}</span>
      </button>
      {dropdownOpen && (
        <div className="absolute dark:text-primary right-[-10px] mt-2 w-40 bg-white rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => console.log("Edit Profile")}
            >
              Edit Profile
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={logout}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
