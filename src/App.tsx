import { Route, Routes } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { lazy, Suspense, useEffect } from "react";
import { UserProvider } from "./context/UserContext";
import "./index.css";
import LoadingTriangle from "./components/Loading/LoadingTriangle";
import BlogAdd from './pages/BlogAdd';
import BlogEdit from "./pages/BlogEdit";
const ManagementLogin = lazy(() => import("./pages/ManagementLogin"));
const LocationManagementMap = lazy(
  () => import("./pages/LocationManagementMap")
);
const LocationManagement = lazy(() => import("./pages/LocationManagement"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const BlogManagement = lazy(() => import("./pages/BlogManagement"));
const RoleManagement = lazy(() => import("./pages/RoleManagement"))
const PermissionManagement = lazy(() => import("./pages/PermissionManagement"))

function App() {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 900,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <Suspense fallback={<LoadingTriangle />}>
        <UserProvider>
          <Routes>
            <Route index element={<ManagementLogin />} />
            <Route path="Home" element={<UserManagement />} />
            <Route path="Location" element={<LocationManagement />} />
            <Route path="Map" element={<LocationManagementMap />} />
            <Route path="Blog" element={<BlogManagement />} />
            <Route path="Blog/Add" element={<BlogAdd/>} />
            <Route path="Blog/Edit/:code" element={<BlogEdit/>} />
            <Route path="Role" element={<RoleManagement />} />
            <Route path="Permission" element={<PermissionManagement />} />
          </Routes>
        </UserProvider>
      </Suspense>
    </>
  );
}

export default App;
