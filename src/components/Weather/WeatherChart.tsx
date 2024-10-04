/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchWeatherForecast } from "../../fetchApi/fetchWeatherApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeatherChartProps {
  lat: number;
  lng: number;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ lat, lng }) => {
  const [forecastData, setForecastData] = useState<any[]>([]);

  useEffect(() => {
    const getForecast = async () => {
      const data = await fetchWeatherForecast(lat, lng);
      setForecastData(data.list);
    };

    getForecast();
  }, [lat, lng]);

  const chartData = {
    labels: forecastData.map((entry) =>
      new Date(entry.dt * 1000).toLocaleTimeString("vi-VN", {
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
      })
    ),
    datasets: [
      {
        label: "Nhiệt độ (°C)",
        data: forecastData.map((entry) => Math.round(entry.main.temp)),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Dự báo thời tiết</h3>
      <Line data={chartData} />
    </div>
  );
};

export default WeatherChart;
