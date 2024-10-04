import React, { useState, useRef, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import "leaflet/dist/leaflet.css";
import "./style.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import userOnMapIcon from "../assets/user_on_map_2.png";
import AdminNav from "../components/Navbar/AdminNav";
import { useNavigate } from "react-router-dom";
import LocationSidebar from "../components/Sidebar/LocationSidebar"; // Import LocationSidebar
import { removeVietnameseTones } from "../components/Admin/removeVietnameseTones";
import toast, { Toaster } from 'react-hot-toast';

const LocationManagementMap = () => {
  const [clickedPosition, setClickedPosition] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [hasMoved, setHasMoved] = useState(false);
  const [LocationSidebarOpen, setLocationSidebarOpen] = useState(false); // State for LocationSidebar visibility
  const [locationData, setLocationData] = useState(null); // State for LocationSidebar data
  const [searchResults, setSearchResults] = useState([]);

  const accessToken = JSON.parse(localStorage.getItem("user"));

  const mapRef = useRef();
  const markerRef = useRef();
  const navigate = useNavigate();

  const customIcon = new L.Icon({
    iconUrl: userOnMapIcon,
    iconSize: [38, 38],
  });
  // Fetch the location name via reverse geocoding
  const fetchLocationName = async (lat, lon) => {
    console.log(lat);
    console.log(lon);
    const url = `http://localhost:8888/api/v1/location/locations/lookup?lon=${lon}&lat=${lat}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.result.accessToken}`,
        },
      });
      
      const data = await response.json();
      console.log(data);
      if (data.result && data.result.address.country === "Việt Nam") {
        setLocationName(data.result.name);
        setLocationData(data.result);
        setLocationSidebarOpen(true);
      } else {
        console.log("Location is not in Vietnam.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handleSearchByInput = useCallback(
    debounce(async (string) => {
      const [front, back] = removeVietnameseTones(string).split(" ");
      const url = `http://localhost:8888/api/v1/location/locations/search?q=${
        back ? `${front}%20${back}` : `${front}`
      }&limit=5`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.result.accessToken}`,
          },
        });
        const data = await response.json();
        if (
          data.result &&
          data.result.some(
            (location) => location.address.country === "Việt Nam"
          )
        ) {
          setSearchResults(
            data.result.filter(
              (location) => location.address.country === "Việt Nam"
            )
          );
        } else {
          console.log("No locations found in Vietnam.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocationName(value); // Update input value
    handleSearchByInput(value); // Call the debounced function
  };

  // Automatically move map to the current position only once
  const MoveToCurrentLocation = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position && !hasMoved) {
        map.flyTo([position.lat, position.lng], 13); // Adjust the zoom level if necessary
        setHasMoved(true); // Set flag to true so the map doesn't move again
      }
    }, [position, map, hasMoved]);

    return null;
  };

  // Get current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          fetchLocationName(latitude, longitude);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  }, []);

  const getLocationReverse = async () => {
    const url = `http://localhost:8888/api/v1/location/locations/search/reverse?lon=${clickedPosition.lng}&lat=${clickedPosition.lat}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.result.accessToken}`,
        },
      });
      
      const data = await response.json();
      console.log(data.result);
      if (data.result && data.result.address.country === "Việt Nam") {
        setLocationName(data.result.name);
        setLocationData(data.result);
        setLocationSidebarOpen(true);
      } else {
        console.log("Location is not in Vietnam.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  }

  // Marker for clicked position
  const LocationMarker = () => {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setLocationSidebarOpen(false);
        setClickedPosition({ lat, lng });
        fetchLocationName(lat, lng);
      },
    });

    return clickedPosition ? (
      <Marker
        position={[clickedPosition.lat, clickedPosition.lng]}
        icon={customIcon}
        ref={markerRef}
      >
        <Popup>
          <div className="flex flex-col items-center">
          <h3>Địa điểm chưa được thêm</h3>
          <button className="flex justify-center bg-white py-2 px-4 mt-2 border rounded border-solid border-black hover:bg-black hover:text-white" onClick={getLocationReverse}>Thêm</button>
          </div>
        </Popup>
      </Marker>
    ) : null;
  };

  // Automatically open the marker popup when the location is set
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [locationName]);

  const handleLocationStatus = (status) => {
    if(status === "success") {
      toast.success("Thêm thành công")
    } else {
      toast.error("Thêm thất bại")
    }
  }

  return (
    <div className="h-screen w-full flex flex-col dark:bg-gray-50 dark:text-gray-800">
      {/* <AdminNav></AdminNav> */}
      <Toaster/>
      <LocationSidebar
        isOpen={LocationSidebarOpen}
        locationData={locationData}
        locationPosition="left"
        onSuccess={handleLocationStatus}
      />
      <div className={`w-full h-screen mx-auto dark:text-gray-800`}>
        <div className="overflow-x-auto">
          <div className="w-full overflow-hidden">
            <div className="relative h-screen w-full">
              <div className="absolute z-20 w-full mt-2 flex justify-between items-center px-3">
                <div className="flex w-[26rem] rounded-full h-10 justify-between items-center bg-white px-4">
                  <input
                    type="text"
                    id="locationName"
                    value={locationName}
                    onChange={handleInputChange}
                    className="w-full border-none outline-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Nhập tên địa điểm để tìm kiếm"
                  />
                  <button>
                    {LocationSidebarOpen === false ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="18"
                        width="18"
                        viewBox="0 0 512 512"
                        onClick={() => handleSearchByInput()}
                      >
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                    ) : (
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          width="24"
                          viewBox="0 0 512 512"
                          className="mr-6"
                          onClick={() => handleSearchByInput()}
                        >
                          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="18"
                          width="18"
                          viewBox="0 0 384 512"
                          onClick={() => {
                            setLocationSidebarOpen(false);
                            setLocationName("");
                          }}
                        >
                          <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                        </svg>
                      </div>
                    )}
                  </button>
                  {searchResults && searchResults.length > 0 && (
                    <ul className="absolute w-[26.5rem] top-[98%] left-[0.5rem] bg-white mt-2 rounded-lg z-10">
                      {searchResults.map((result, index) => (
                        <li
                          key={index}
                          className="cursor-pointer hover:bg-gray-200 rounded-lg px-4 py-2 border-b"
                          onClick={() => {
                            setLocationSidebarOpen(true); // Open the sidebar
                            setLocationName(result.display_name); // Update input field
                            setLocationData(result);
                            setSearchResults([]); // Clear search results
                          }}
                        >
                          {result.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  className="px-4 py-2 border rounded border-solid border-black hover:bg-black hover:text-white"
                  onClick={() => navigate("/Location")}
                >
                  Quay lại
                </button>
              </div>
              <MapContainer
                center={
                  currentPosition
                    ? [currentPosition.lat, currentPosition.lng]
                    : [10.7821, 106.6753]
                }
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationMarker />

                {/* Move map to current position when available */}
                {currentPosition && (
                  <MoveToCurrentLocation position={currentPosition} />
                )}

                {/* Show current position marker */}
                {currentPosition && (
                  <Marker
                    position={[currentPosition.lat, currentPosition.lng]}
                    icon={customIcon}
                  >
                    <Popup>You are here: {locationName}</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationManagementMap;
