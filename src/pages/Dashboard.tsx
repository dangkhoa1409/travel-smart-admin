import React, { useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AdminNav from "../components/Navbar/AdminNav";
import Sidebar from "../components/Sidebar/Sidebar";
import { set } from "lodash";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
type chartData = {
  [key: string]: object;
};
// Example data in the format {"day": total}
const rawData = {};

// Transform rawData into chart.js format
const data = {
  labels: Object.keys(rawData),
  datasets: [
    {
      label: "Total",
      data: Object.values(rawData),
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

const lineData = {
  labels: Object.keys(rawData),
  datasets: [
    {
      label: "Total",
      data: Object.values(rawData),
      fill: false,
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Total per Day",
    },
  },
};
type keyOption = "location" | "trip" | string;
type option = {
  [key in keyOption]: {
    type: reportType;
    data: chartData;
  };
};
const option: option = {
  location: {
    type: "MONTH",
    data: data,
  },
  trip: {
    type: "MONTH",
    data: lineData,
  },
};
type labels = {
  [key in keyOption]: typeChart;
};
type typeChart = "bar" | "line";
const label: labels = {
  location: "bar",
  trip: "line",
};
type statistics = {
  label: string;
  total: number;
};
type reportType = "MONTH" | "YEAR" | "DAY";
const Dashboard = () => {
  const [charts, setCharts] = React.useState<option>(option);
  const accessToken = JSON.parse(localStorage.getItem("user") || "{}");
  const [statistics, setStatistics] = React.useState<statistics[]>([]);
  const [types, setTypes] = React.useState<{
    [key: keyOption]: { type: reportType; year: number; month: number };
  }>({
    location: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      type: "MONTH",
    },
    trip: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      type: "MONTH",
    },
  });
  const changeDrawData = (
    key: keyOption,
    data: { [key: string]: number },
    type: reportType
  ) => {
    setCharts((chart) => {
      console.log(chart);

      return {
        ...chart,
        [key]: {
          ...chart[key],
          type,
          data: {
            labels: Object.keys(data).map((data) =>
              type == "MONTH" ? `Week ${data}` : `Month ${data}`
            ),
            datasets: [
              {
                label: "Total",
                data: Object.values(data),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
        },
      };
    });
  };
  const getReportLocation = async () => {
    try {
      const response = await fetch(
        `http://localhost:8888/api/v1/location/locations/report?type=${types.location.type}&year=${types.location.year}&month=${types.location.month}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.result.accessToken}`,
          },
        }
      );

      const rawData = await response.json();
      console.log(rawData);

      if (rawData) {
        changeDrawData("location", rawData.result.report, types.location.type);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getReportTrip = async () => {
    try {
      const response = await fetch(
        `http://localhost:8888/api/v1/trip/trips/report?type=${types.trip.type}&year=${types.trip.year}&month=${types.trip.month}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.result.accessToken}`,
          },
        }
      );

      const rawData = await response.json();
      console.log(rawData.result.report);

      if (rawData) {
        changeDrawData("trip", rawData.result.report, types.trip.type);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const start = async () => {
      await getReportLocation();
      await getReportTrip();
    };
    start();
  }, [types]);
  useEffect(() => {
    // Fetch total users
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/api/v1/identity/users/statistics",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken.result.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setStatistics((prev) => [...prev, data.result]);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    // Fetch total locations
    const fetchTotalLocations = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/api/v1/location/locations/statistics",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken.result.accessToken}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);

        setStatistics((prev) => [...prev, data.result]);
      } catch (error) {
        console.error("Error fetching total locations:", error);
      }
    };

    // Fetch total trips
    const fetchTotalTrips = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/api/v1/trip/trips/statistics",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken.result.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setStatistics((prev) => [...prev, data.result]);
      } catch (error) {
        console.error("Error fetching total trips:", error);
      }
    };

    fetchTotalUsers();
    fetchTotalLocations();
    fetchTotalTrips();
  }, []);
  const changeOption = (key: keyOption, value: reportType) => {
    if (key === "location") {
      setTypes((prev) => ({
        ...prev,
        location: value == "MONTH" ? { ...prev.location, type: value,year: new Date().getFullYear()} : {
          ...prev.location,
          type: value,  
        },
      }));
    } else {
      setTypes((prev) => ({
        ...prev,
        trip: value == "MONTH" ? { ...prev.location, type: value,year: new Date().getFullYear()} :  {
          ...prev.trip,
          type: value,
        },
      }));
    }
  };
  const onChange = (key: keyOption, num: number) => {
    setTypes((prev) => ({
      ...prev,
      [key]: types[key].type == "MONTH" ?{
        ...prev[key],

        month: num,
      } : {
        ...prev[key],
        year: num,
      },
    }));
  }
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="h-full w-full flex flex-col p-3 dark:bg-gray-50 dark:text-gray-800 overflow-y-auto">
        <AdminNav />
        <div className="container w-full p-2 mx-auto sm:p-4 dark:text-gray-800">
          <div className="flex justify-between items-center border-b-2 pb-2 mb-3">
            <h2 className="text-2xl font-semibold leading-tight">Dashboard</h2>
          </div>
          <div className="flex justify-between mb-4 gap-4">
            {statistics.length > 0 &&
              statistics.map((statistic) => (
                <div className="bg-white p-4 rounded-lg shadow-lg w-1/3 text-center">
                  <h3 className="text-lg font-semibold">
                    Total {statistic.label}
                  </h3>
                  <p className="text-2xl">{statistic.total}</p>
                </div>
              ))}
          </div>
          <div className="overflow-x-auto h-[100vh]">
            <div className="flex justify-between">
              {Object.keys(charts).map((key: keyOption) => (
                <>
                  {Object.keys(charts[key]).length > 0 &&
                    Object.keys(charts[key].data).length > 0 && (
                      <div className="w-1/2 p-2" key={key}>
                        <div className="flex gap-2 px-4 items-center mb-2">
                            <h3 className="text-lg font-semibold capitalize">{key}</h3>
                          <select
                            onChange={(e) => {
                              const value = e.target.value as reportType;
                              changeOption(key, value);
                            }}
                            className="bg-white p-2 rounded-lg shadow-lg"
                          >
                            <option value="MONTH">Month</option>
                            <option value="YEAR">Year</option>
                          </select>
                            <div className="flex gap-2">
                                <input disabled={types[key].type == "MONTH"} type="number" value={types[key].year} onChange={(e) => {
                                    onChange(key, parseInt(e.target.value));
                                }} className="bg-white p-2 rounded-lg shadow-lg" />
                                {types[key].type == "MONTH" && <select className="bg-white p-2 rounded-lg shadow-lg" value={types[key].month} onChange={(e) => { onChange(key, parseInt(e.target.value)) }}>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                        <option className="bg-white p-2 rounded-lg shadow-lg" key={month} value={month}>Month {month}</option>
                                    ))}
                                </select>}
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                          {label[key] === "bar" ? (
                            <Bar data={charts[key].data} options={options} />
                          ) : (
                            <Line data={charts[key].data} options={options} />
                          )}
                          
                        </div>
                      </div>
                    )}
                </>
              ))}
              {/* <div className="w-1/2 p-2">
                                <div className="bg-white p-4 rounded-lg shadow-lg">
                                    <Bar data={data} options={options} />
                                    <p className="text-center mt-2">Bar Chart: Total per Day</p>
                                </div>
                            </div>
                            <div className="w-1/2 p-2">
                                <div className="bg-white p-4 rounded-lg shadow-lg">
                                    <Line data={lineData} options={options} />
                                    <p className="text-center mt-2">Line Chart: Total per Day</p>
                                </div>
                            </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
