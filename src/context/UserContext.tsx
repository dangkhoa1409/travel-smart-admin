/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { resetDestinations } from "../components/Maps/destinationsSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  name: string;
  password: string;
}
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  orderPopup: boolean;
  setOrderPopup: React.Dispatch<React.SetStateAction<boolean>>;
  handleOrderPopup: () => void;
  darkMode: boolean;
  handleThemeSwitch: () => void;
  logout: () => void
}
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orderPopup, setOrderPopup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleThemeSwitch = () => {
    setDarkMode((prevMode : any) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    dispatch(resetDestinations()); 
    navigate("/")
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        orderPopup,
        setOrderPopup,
        handleOrderPopup,
        darkMode,
        handleThemeSwitch,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};