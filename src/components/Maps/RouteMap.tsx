import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { Day } from "../../redux/type";

import anh1 from "../../assets/user_on_map_2.png";

interface RouteMapProps {
  days: Day[];
}

const customIcon = L.icon({
  iconUrl: anh1,
  iconSize: [35, 35],
  iconAnchor: [12, 41],
});

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

const RouteMap: React.FC<RouteMapProps> = ({ days }) => {
  const map = useMap();
  const [currentPosition, setCurrentPosition] = useState<L.LatLng | null>(null);
  const selectedDay = useSelector(
    (state: RootState) => state.destinations.selectedDay
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition(L.latLng(latitude, longitude));
        },
        (error) => {
          console.error("Error getting current position:", error);
          setCurrentPosition(L.latLng(10.762622, 106.660172));
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCurrentPosition(L.latLng(10.762622, 106.660172));
    }
  }, []);

  useEffect(() => {
    if (currentPosition && selectedDay) {
      const day = days.find((day) => day.date === selectedDay);
      if (!day) return;

      const waypoints = [
        currentPosition,
        ...day.destinations.map((dest) => L.latLng(dest.lat, dest.lng)),
      ];

      if (!L.Routing) {
        console.error("Leaflet Routing Machine is not available");
        return;
      }

      const plan = L.Routing.plan(waypoints, {
        createMarker: (i, waypoint) => {
          if (i === 0) {
            return L.marker(waypoint.latLng, {
              icon: customIcon,
            }).bindPopup("Vị trí của bạn");
          }
          return null;
        },
      });

      const routingControl = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true,
        plan: plan,
        lineOptions: {
          styles: [{ color: "blue", opacity: 0.6, weight: 4 }],
        },
        addWaypoints: false,
        fitSelectedRoutes: false,
        show: false,
      }).addTo(map);

      return () => {
        map.removeControl(routingControl);
      };
    }
  }, [days, map, currentPosition, selectedDay]);

  return null;
};

export default RouteMap;
