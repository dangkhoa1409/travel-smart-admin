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
import L from "leaflet";
import userOnMapIcon from "../assets/user_on_map_2.png";
import { useNavigate } from "react-router-dom";
import LocationSidebar from "../components/Sidebar/LocationSidebar";
import { removeVietnameseTones } from "../components/Admin/removeVietnameseTones";
import toast, { Toaster } from "react-hot-toast";
import useToggle from "../hooks/useToggle";

const LocationManagementMap = () => {
  const [clickedPosition, setClickedPosition] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [beginingPosition, setBeginningPosition] = useState(null);
  const [isSettingNewPosition, setIsSettingNewPosition] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [LocationSidebarOpen, setLocationSidebarOpen] = useState(false); // State for LocationSidebar visibility
  const [locationData, setLocationData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isInDB, setIsInDB] = useState(false);
  const [isSearchShowing, setIsSearchShowing] = useState(false);

  const accessToken = JSON.parse(localStorage.getItem("user"));
  const { isToggle: isEditBouding, handleToggle: setEditBouding } = useToggle();
  const [type, setType] = useState("");
  const markerRef = useRef();
  const navigate = useNavigate();
  const [boundingBox, setBoundingBox] = useState(
    locationData ? locationData.boundingBox : null
  );
  const customIcon = new L.Icon({
    iconUrl: userOnMapIcon,
    iconSize: [38, 38],
  });

  // Fetch the location name via reverse geocoding
  const fetchLocationName = async (lat, lon) => {
    //Tim trong database
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
      if (data?.result && data?.result?.address?.country === "Việt Nam") {
        setLocationName(data?.result?.name);
        setLocationData(data?.result);
        setLocationSidebarOpen(true);
        setIsInDB(false);
      } else {
        console.log("Location is not in Vietnam.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  // tim qua ben thu 3
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
      if (data?.result && data?.result?.address?.country === "Việt Nam") {
        setLocationName(data?.result?.name);
        setLocationData(data?.result);
        setLocationSidebarOpen(true);
        setIsInDB(true);
      } else {
        console.log("Location is not in Vietnam.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handleWhenNoInputSearchFound = async (string) => {
    const url = `http://localhost:8888/api/v1/location/locations/search?q=${string}&limit=5&type=FUNCTIONAL`;

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
        data.result.some((location) => location.address.country === "Việt Nam")
      ) {
        setSearchResults(
          data.result.filter(
            (location) => location.address.country === "Việt Nam"
          )
        );
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSearchByInput = useCallback(
    debounce(async (string) => {
      const url = `http://localhost:8888/api/v1/location/locations?q=${string}&limit=5&type=FUNCTIONAL`;

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
          console.log(data);
        } else {
          handleWhenNoInputSearchFound(string);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocationName(value); // Update input value
    handleSearchByInput(value.trim()); // Call the debounced function
    // trim here
    setIsSearchShowing(true);
  };

  const handleLocationSearchClicked = (data) => {
    setClickedPosition(null);
    setIsSearchShowing(false);
    const newLocation = {
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
    };
    setCurrentPosition(newLocation);
    setLocationData(data);
  };

  const moveToBegining = () => {
    const { latitude, longitude } = beginingPosition;
    setCurrentPosition({ lat: latitude, lng: longitude });
    setLocationData(null);
    setClickedPosition(null);
    setLocationSidebarOpen(false);
    setLocationName("");
    setIsSettingNewPosition(false);
  };

  // Automatically move map to the current position only once
  const MoveToCurrentLocation = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position && !isSettingNewPosition) {
        map.flyTo([position.lat, position.lng], 13); // Adjust the zoom level if necessary
      }
    }, [position, isSettingNewPosition]);

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
          setBeginningPosition(position.coords);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  }, []);

  // Reset isSettingNewPosition when location data is set
  useEffect(() => {
    if (locationData) {
      setIsSettingNewPosition(false); // Reset the flag after fetching location data
    }
  }, [locationData]);

  // Marker for clicked position
  const LocationMarker = () => {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setLocationData(null);
        setLocationSidebarOpen(false);
        setClickedPosition({ lat, lng });
        setCurrentPosition(null);
        fetchLocationName(lat, lng);
        setIsSettingNewPosition(true);
      },
    });

    return clickedPosition ? (
      locationData ? (
        <Marker
          position={[clickedPosition.lat, clickedPosition.lng]}
          icon={customIcon}
          ref={markerRef}
        >
          <Popup>
            <div className="flex flex-col items-center">
              <h3>{locationData.name}</h3>
            </div>
          </Popup>
        </Marker>
      ) : (
        <Marker
          position={[clickedPosition.lat, clickedPosition.lng]}
          icon={customIcon}
          ref={markerRef}
        >
          <Popup>
            <div className="flex flex-col items-center">
              <h3>Địa điểm chưa được thêm</h3>
              <button
                className="flex justify-center bg-white py-2 px-4 mt-2 border rounded border-solid border-black hover:bg-black hover:text-white"
                onClick={getLocationReverse}
              >
                Thêm
              </button>
            </div>
          </Popup>
        </Marker>
      )
    ) : null;
  };

  const BoudingBoxMarker = () => {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;

        handleUpdateBouding(type, lng, lat);
      },
    });
    console.log(locationData.boundingbox);

    useEffect(() => {
      setBoundingBox(locationData.boundingbox);
    }, []);
    return boundingBox ? (
      <>
        <Marker
          position={[parseFloat(boundingBox[0]), parseFloat(boundingBox[2])]}
          icon={customIcon}
          ref={markerRef}
        >
          <Popup>
            <div className="flex flex-col items-center">
              <h3>Bounding box</h3>
            </div>
          </Popup>
        </Marker>
        <Marker
          position={[parseFloat(boundingBox[1]), parseFloat(boundingBox[2])]}
          icon={customIcon}
          ref={markerRef}
        >
          <Popup>
            <div className="flex flex-col items-center">
              <h3>Bounding box</h3>
            </div>
          </Popup>
        </Marker>
        <Marker
          position={[parseFloat(boundingBox[1]), parseFloat(boundingBox[3])]}
          icon={customIcon}
          ref={markerRef}
        >
          <Popup>
            <div className="flex flex-col items-center">
              <h3>Bounding box</h3>
            </div>
          </Popup>
        </Marker>
        <Marker
          position={[parseFloat(boundingBox[0]), parseFloat(boundingBox[3])]}
          icon={customIcon}
          ref={markerRef}
        >
          <Popup>
            <div className="flex flex-col items-center">
              <h3>Bounding box</h3>
            </div>
          </Popup>
        </Marker>
      </>
    ) : null;
  };

  // Automatically open the marker popup when the location is set
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [locationName]);

  const handleLocationStatus = (status, type) => {
    if (status === "success") {
      toast.success(`${type} thành công`);
      setLocationSidebarOpen(false);
    } else {
      toast.error(`${type} thất bại`);
    }
  };

  const handleUpdateBouding = (type, lon, lat) => {
    if (!boundingBox) return;
    if (type === "minX") {
      boundingBox[2] = lon;
    } else if (type == "maxX") {
      boundingBox[3] = lon;
    } else if (type == "minY") {
      boundingBox[0] = lat;
    } else if (type == "maxY") {
      boundingBox[1] = lat;
    }
    setBoundingBox([...boundingBox]);
  };

  const handleCancelEdit = () => {
    locationData && setBoundingBox[locationData.boundingBox];
    setEditBouding(false);
  };

  const handleCofirmUpdate = () => {
    setLocationData({ ...locationData, boundingBox });
    setEditBouding(false);
  };

  return (
    <div className="h-screen w-full flex flex-col dark:bg-gray-50 dark:text-gray-800">
      <Toaster />
      <LocationSidebar
        isEditBounding={isEditBouding}
        handleEditBouding={setEditBouding}
        isOpen={LocationSidebarOpen}
        locationData={locationData}
        locationPosition="left"
        setType={setType}
        onEdit={handleCofirmUpdate}
        onCancel={handleCancelEdit}
        onAddSuccess={handleLocationStatus}
        onEditSuccess={handleLocationStatus}
        type={type}
        isInDB={isInDB}
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
                    onClick={() => {
                      setLocationName("");
                      setSearchResults([]);
                    }}
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
                  {isSearchShowing &&
                    searchResults &&
                    searchResults.length > 0 && (
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
                              handleLocationSearchClicked(result);
                            }}
                          >
                            {result.display_name}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
                <div className="flex">
                  <button
                    className="w-9 h-9 p-2 rounded bg-white flex items-center mr-4"
                    onClick={moveToBegining}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                    >
                      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                    </svg>
                  </button>
                  <button
                    className="px-4 py-2 border rounded border-solid border-black hover:bg-black hover:text-white"
                    onClick={() => navigate("/Location")}
                  >
                    Quay lại
                  </button>
                </div>
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

                {isEditBouding ? <BoudingBoxMarker /> : <LocationMarker />}

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
                    <Popup>Bạn đang ở đây</Popup>
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
