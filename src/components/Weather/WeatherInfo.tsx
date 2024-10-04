/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { fetchWeather } from "../../fetchApi/fetchWeatherApi";
import WeatherChart from "./WeatherChart";

interface WeatherInfoProps {
  lat: number;
  lng: number;
}

const weatherTranslations: { [key: string]: string } = {
  "clear sky": "Trời quang",
  "few clouds": "Ít mây",
  "scattered clouds": "Mây rải rác",
  "overcast clouds": "Mây u ám",
  "broken clouds": "Mây đứt đoạn",
  "shower rain": "Mưa rào",
  "light rain": "Mưa nhẹ",
  "light intensity shower rain": "Mưa rào",
  rain: "Mưa",
  thunderstorm: "Bão",
  snow: "Tuyết",
  mist: "Sương mù",
  "moderate rain": "Mưa vừa",
};

const WeatherInfo: React.FC<WeatherInfoProps> = ({ lat, lng }) => {
  const [weather, setWeather] = useState<any>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  const translateWeatherDescription = (description: string) => {
    return weatherTranslations[description] || description;
  };

  useEffect(() => {
    const getWeather = async () => {
      const currentTime = Date.now();
      if (!lastFetchTime || currentTime - lastFetchTime > 10 * 60 * 1000) {
        const data = await fetchWeather(lat, lng);
        setWeather(data);
        setLastFetchTime(currentTime);
      }
    };

    getWeather();
    const interval = setInterval(getWeather, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [lat, lng, lastFetchTime]);

  return (
    weather && (
      <div>
        <div>
          <strong>Thời tiết:</strong>{" "}
          {translateWeatherDescription(weather.weather[0].description)}
        </div>
        <div className="flex items-center">
          <div>
            <strong>Nhiệt độ:</strong> {Math.floor(weather.main.temp)}°C
          </div>
          {weather.weather[0].icon && (
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="w-10 h-10"
            />
          )}
        </div>
        <WeatherChart lat={lat} lng={lng} />
      </div>
    )
  );
};

export default WeatherInfo;
