import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import osmProvider from "../../osm-provider";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import RouteMap from "./RouteMap";
import IMG4 from "../../assets/places/place4.jpg";
import WeatherInfo from "../Weather/WeatherInfo";

const markerColors = [
  "red",
  "blue",
  "green",
  "purple",
  "orange",
  "yellow",
  "pink",
  "cyan",
];

const createNumberedIcon = (number: number, color: string) => {
  return new L.DivIcon({
    html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">${number}</div>`,
    iconSize: [30, 30],
    className: "numbered-icon",
  });
};

const MapComponent: React.FC = () => {
  const days = useSelector((state: RootState) => state.destinations.days);
  const coordinates = useSelector(
    (state: RootState) => state.destinations.selectedCityCoordinates
  );

  const position = coordinates
    ? [coordinates.lat, coordinates.lng]
    : [21.0285, 105.8542];

  return (
    <MapContainer center={position} zoom={11} className="w-full h-full">
      <TileLayer
        url={osmProvider.maptiler.url}
        attribution={osmProvider.maptiler.attribution}
      />
      {days.map((day, dayIndex) =>
        day.destinations.map((destination, index) => {
          return (
            <Marker
              key={destination.name}
              position={[destination.lat, destination.lng]}
              icon={createNumberedIcon(
                index + 1,
                markerColors[dayIndex % markerColors.length]
              )}
            >
              <Popup>
                <div className="space-y-2">
                  <h2 className="font-bold text-lg">{destination.name}</h2>

                  <p>
                    <strong>Thể loại:</strong> Khám phá
                  </p>

                  <img
                    src={IMG4}
                    alt={destination.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <p>
                    <strong>Tọa độ:</strong> {destination.lat},{" "}
                    {destination.lng}
                  </p>
                  <WeatherInfo lat={destination.lat} lng={destination.lng} />

                  <div className="flex items-center">
                    <strong>Đánh giá:</strong>
                    <div className="flex items-center ml-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={i < 3 ? "#FFD700" : "#E5E7EB"}
                          className="w-5 h-5"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600 ">({3})</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })
      )}
      <RouteMap days={days} />
    </MapContainer>
  );
};

export default MapComponent;
