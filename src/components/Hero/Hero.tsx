/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useDispatch } from "react-redux";
import {
  setDays,
  setDestinationText,
  setSelectedCityCoordinates,
} from "../Maps/destinationsSlice";
import { useNavigate } from "react-router-dom";
import { CityType } from "../../redux/type";



const Hero = () => {
  const [departureDate, setDepartureDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [numberOfDays, setNumberOfDays] = useState<number | null>(null);
  const { user, handleOrderPopup } = useUser();
  const [suggestions, setSuggestions] = useState<CityType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [destext, setDesText] = useState("");
  const dispatch = useDispatch();
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const handleDesText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesText(e.target.value);
    setShowSuggestions(true);
    dispatch(setDestinationText(e.target.value));
  };

  useEffect(() => {
    if (departureDate && returnDate) {
      const startDate = new Date(departureDate);
      const endDate = new Date(returnDate);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setNumberOfDays(diffDays + 1);

      const daysArray = [];
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        daysArray.push({
          date: new Date(d).toISOString().split("T")[0],
          destinations: [],
        });
      }

      dispatch(setDays(daysArray));
    }
  }, [departureDate, returnDate, dispatch]);

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length === 0) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        "https://esgoo.net/api-tinhthanh/1/0.htm");
      const data = await response.json();
      const filteredData = data.data.filter((city: CityType) =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredData);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(destext);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [destext]);

  const handleSuggestionClick = (city: CityType) => {
    setDesText(city.name);
    setShowSuggestions(false);
    dispatch(setDestinationText(city.name));
    dispatch(
      setSelectedCityCoordinates({
        lat: Number(city.latitude),
        lng: Number(city.longitude),
      })
    );
  };

  const handleSearchClick = () => {
    if (user) {
      console.log({ departureDate, returnDate, numberOfDays, destext });
      navigate("/mappage");
      return;
    }
    handleOrderPopup();
  };

  return (
    <div className="bg-black/20 h-full">
      <div className="h-full flex justify-center items-center p-4 bg-primary/10">
        <div className="container grid grid-cols-1 gap-4">
          <div className="text-white">
            <p
              data-aos="fade-up"
              data-aos-delay="300"
              className="font-bold text-3xl"
            >
              Địa điểm bạn muốn tới?
            </p>
          </div>
          <div
            data-aos="fade-up"
            data-aos-delay="600"
            className="space-y-4 bg-white rounded-md p-4 relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3">
              <div>
                <label htmlFor="destination" className="opacity-70">
                  Tìm địa điểm của bạn
                </label>
                <input
                  type="text"
                  name="destination"
                  value={destext}
                  autoComplete="off"
                  onChange={handleDesText}
                  id="destination"
                  placeholder="Đồng Nai"
                  className="w-full bg-gray-100 my-2 rounded-full p-2"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 max-h-48 md:w-[300px] sm:w-[130px] overflow-auto shadow-lg">
                    {suggestions.map((city) => (
                      <li
                        key={city.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick(city)}
                      >
                        {city.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label htmlFor="departure" className="opacity-70">
                  Ngày đi
                </label>
                <input
                  type="date"
                  name="departure"
                  id="departure"
                  className="w-full bg-gray-100 my-2 rounded-full p-2"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={today}
                />
              </div>
              <div>
                <label
                  htmlFor="return"
                  className="flex items-center justify-between opacity-70"
                >
                  Ngày về{" "}
                  {numberOfDays !== null && (
                    <p className="font-bold">{numberOfDays} ngày</p>
                  )}
                </label>
                <input
                  type="date"
                  name="return"
                  id="return"
                  className="w-full bg-gray-100 my-2 rounded-full p-2"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || today}
                />
              </div>
            </div>
            <button
              onClick={handleSearchClick}
              className="bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 px-4 py-2 rounded-full duration-200 absolute -bottom-5 left-1/2 -translate-x-1/2"
            >
              Tìm kiếm ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
