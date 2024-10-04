import "leaflet/dist/leaflet.css";
import { useState } from "react";
import MapComponent from "../components/Maps/Mapcontainer";
import MapSelector from "../components/Maps/MapSelector";
import { HiMenuAlt3 } from "react-icons/hi";

const MapPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative flex flex-col md:flex-row overflow-y-auto no-scrollbar pt-[72px] h-screen">
      {/* Nút mở menu cho di động */}
      <HiMenuAlt3
        onClick={handleMenuToggle}
        size={40}
        className="fixed bottom-10 right-4 md:hidden z-50 bg-primary text-white rounded-lg shadow-lg cursor-pointer"
      />

      {/* Phần bên trái */}
      <MapSelector
        isMenuOpen={isMenuOpen}
        handleMenuToggle={handleMenuToggle}
      />

      {/* Phần bản đồ */}
      <div className="w-full md:w-2/3 h-full ">
        <MapComponent />
      </div>
    </div>
  );
};

export default MapPage;
