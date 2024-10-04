import React from "react";
import { FaCaretDown, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { DropdownLinks, NavbarLinks } from "./Navbar";
import { useUser } from "../../context/UserContext";

const ResponsiveMenu = ({
  showMenu,
  setShowMenu,
}: {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useUser();
  return (
    <div
      className={`${
        showMenu ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white dark:bg-gray-900 dark:text-white px-8 pb-6 pt-16 text-black transition-all duration-200 md:hidden rounded-r-xl shadow-md`}
    >
      <div className="card">
        <div className="flex items-center justify-start gap-3">
          <FaUserCircle size={50} />
          <div>
            {user && <h1>Hello {user.name}</h1>}
          </div>
        </div>
        <nav className="mt-12">
          <ul className="space-y-5">
            {NavbarLinks.map((data) => (
              <li key={data.name}>
                <Link
                  to={data.link}
                  onClick={() => setShowMenu(false)}
                  className="block text-lg font-medium px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {data.name}
                </Link>
              </li>
            ))}
            <li className="relative group">
              <Link
                to="/mappage"
                className="flex items-center justify-between w-full px-4 py-2 text-lg font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Lịch trình
                <FaCaretDown className="transition-transform duration-200" />
              </Link>
              <div className="absolute left-0 mt-2 w-full max-w-xs rounded-md bg-white dark:bg-gray-800 shadow-lg group-hover:block">
                <ul className="py-2">
                  {DropdownLinks.map((data) => (
                    <li key={data.name}>
                      <Link
                        to={data.link}
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-lg font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {data.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <div className="footer">
        <h1>
          Made with ❤ by{" "}
          <a href="https://github.com/tienanhne/FETravel_135">DinhTienLe</a>{" "}
        </h1>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
