import { useState } from "react";
import Logo from "../../assets/logo.png";
import { NavLink, Link } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import { LuSunMoon, LuMoon } from "react-icons/lu";
import ResponsiveMenu from "./ResponsiveMenu";
import { useUser } from "../../context/UserContext";
import UserDropdown from "../UserDropdown/UserDropdown";

type TypeLink = {
  name: string;
  link: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const NavbarLinks: TypeLink[] = [
  {
    name: "Trang chủ",
    link: "/",
  },
  {
    name: "Giới thiệu",
    link: "/about",
  },
  {
    name: "Bài viết",
    link: "/blogs",
  },
];

// eslint-disable-next-line react-refresh/only-export-components
export const DropdownLinks = [
  {
    name: "Lịch sự lịch trình",
    link: "/history-travel",
  },
  {
    name: "Gần đây",
    link: "/recently-travel",
  },
];

const Navbar: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { user, handleOrderPopup, darkMode, handleThemeSwitch } = useUser();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <nav className="fixed top-0 right-0 w-full z-50 bg-white dark:text-white backdrop-blur-sm text-black shadow-md dark:bg-gray-800">
        {/* <div className="bg-gradient-to-r from-primary to-secondary text-white ">
          <div className="container sm:block hidden">
            <div className="flex items-center justify-between">
              <p className="text-sm">tôi yêu lạc hồng giảm 20%</p>
              <p>1234567809</p>
            </div>
          </div>
        </div> */}
        <div className="container py-3 sm:py-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4  font-bold text-2xl">
              <Link to={"/"} onClick={() => window.scrollTo(0, 0)}>
                <img src={Logo} alt="" className="h-16" />
              </Link>
            </div>
            <div className="hidden md:block">
              <ul className="flex items-center gap-6 ">
                <li className="py-4">
                  <NavLink to="/" activeClassName="active">
                    Trang chủ
                  </NavLink>
                </li>
                <li className="py-4">
                  <NavLink to="/blogs" activeClassName="active">
                    Bài viết
                  </NavLink>
                </li>
                <li className="py-4">
                  <NavLink to="/best-places" activeClassName="active">
                    Địa điểm HOT
                  </NavLink>
                </li>
                <li className="py-4">
                  <NavLink to="/about" activeClassName="active">
                    Giới thiệu
                  </NavLink>
                </li>
                <li className="group relative cursor-pointer">
                  <NavLink
                    to="/mappage"
                    className="flex h-[72px] items-center gap-[2px]"
                    activeClassName="active"
                  >
                    Lịch trình{" "}
                    <span>
                      <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
                    </span>
                  </NavLink>
                  <div className="absolute -left-9 z-[9999] hidden w-[150px] rounded-md bg-white p-2 text-black group-hover:block shadow-md ">
                    <ul className="space-y-3">
                      {DropdownLinks.map((data) => (
                        <li key={data.name}>
                          <NavLink
                            to={data.link}
                            activeClassName="active"
                            className={
                              "inline-block w-full rounded-md p-2 hover:bg-primary/20"
                            }
                          >
                            {data.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="relative inline-block align-middle select-none transition duration-200 ease-in"
                title="toggleMode"
              >
                {darkMode ? (
                  <LuSunMoon 
                    className="w-6 h-6 text-dark cursor-pointer"
                    onClick={handleThemeSwitch}
                  />
                ) : (
                  <LuMoon 
                    className="w-6 h-6 text-gray-700 cursor-pointer"
                    onClick={handleThemeSwitch}
                  />
                )}
              </div>
              {user ? (
                <UserDropdown />
              ) : (
                <button
                  className="bg-gradient-to-r from-primary to-secondary hover:bg-bg-gradient-to-r hover:from-secondary hover:bg-primary transition-all duration-600 text-white px-3 py-2 rounded-full"
                  onClick={() => {
                    handleOrderPopup();
                  }}
                >
                  Lên lịch trình
                </button>
              )}

              <div className="md:hidden block">
                {showMenu ? (
                  <HiMenuAlt1
                    onClick={toggleMenu}
                    className=" cursor-pointer transition-all"
                    size={30}
                  />
                ) : (
                  <HiMenuAlt3
                    onClick={toggleMenu}
                    className="cursor-pointer transition-all"
                    size={30}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <ResponsiveMenu setShowMenu={setShowMenu} showMenu={showMenu} />
      </nav>
    </>
  );
};

export default Navbar;
