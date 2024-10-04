import axios from "axios";

const API_KEY = "677bb5e89a8c0e450ebca93fc6296070";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const fetchWeather = async (lat: number, lon: number) => {
  const response = await axios.get(BASE_URL, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: "metric", 
    },
  });
  return response.data;
};

const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

export const fetchWeatherForecast = async (lat: number, lon: number) => {
  const response = await axios.get(FORECAST_URL, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: "metric",
    },
  });
  return response.data;
};



