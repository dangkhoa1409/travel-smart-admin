import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AddDestinationPayload,
  Day,
  Destination,
  DestinationsState,
  RemoveDestinationPayload,
} from "../../redux/type";
import {
  calculateDistance,
  calculateTravelTime,
} from "../../utils/calculateTotalDistance";

const initialState: DestinationsState = {
  days: [],
  distances: {},
  destext: "",
  selectedCityCoordinates: null,
  selectedDay: null,
};

const destinationsSlice = createSlice({
  name: "destinations",
  initialState,
  reducers: {
    resetDestinations: () => initialState,
    setDays: (state, action: PayloadAction<Day[]>) => {
      state.days = action.payload;
    },
    addDay: (state) => {
      const lastDay = state.days[state.days.length - 1]; // lấy vị trí cuối trang mảng tức là ngày cuối tron mảng
      const newDate = new Date(lastDay?.date || new Date());
      newDate.setDate(newDate.getDate() + 1); // cộng ngày cuối trang mảng thêm 1 ngày

      const newDay: Day = {
        date: newDate.toISOString().split("T")[0], // phân tách chuỗi kí tự T để lấy yyyy-mm-dd
        destinations: [],
      };

      state.days.push(newDay);
    },
    removeDay: (state, action: PayloadAction<string>) => {
      const date = action.payload;
      state.days = state.days.filter(day => day.date !== date);
      delete state.distances[date]; // Optionally remove distances for the day if needed
    },
    addDestination: (state, action: PayloadAction<AddDestinationPayload>) => {
      const { date, destination } = action.payload;
      const day = state.days.find((day) => day.date === date);

      // Nếu không có ngày, thêm mới
      if (day) {
        day.destinations.push(destination);
      } else {
        state.days.push({ date, destinations: [destination] });
      }

      // Cập nhật khoảng cách và thời gian di chuyển
      if (day && day.destinations.length > 1) {
        const previousDest = day.destinations[day.destinations.length - 2];
        const distance = calculateDistance(previousDest, destination);
        const speedKmPerHour = 60; // Tốc độ trung bình 60 km/h
        const travelTime = calculateTravelTime(distance, speedKmPerHour);

        // Cập nhật khoảng cách và thời gian cho điểm mới
        state.distances[date] = {
          ...state.distances[date],
          [day.destinations.length - 1]: {
            distance,
            travelTime,
          },
        };

        // Cập nhật khoảng cách và thời gian cho các điểm trước đó
        for (let i = 0; i < day.destinations.length - 1; i++) {
          const updatedDistance = calculateDistance(
            day.destinations[i],
            day.destinations[i + 1]
          );
          const updatedTravelTime = calculateTravelTime(
            updatedDistance,
            speedKmPerHour
          );

          state.distances[date][i + 1] = {
            distance: updatedDistance,
            travelTime: updatedTravelTime,
          };
        }
      }
    },

    removeDestination: (
      state,
      action: PayloadAction<RemoveDestinationPayload>
    ) => {
      const { date, destination } = action.payload;
      const day = state.days.find((day) => day.date === date);

      if (day) {
        const indexToRemove = day.destinations.findIndex(
          (d) => d.name === destination.name
        );

        if (indexToRemove === -1) {
          console.warn("Destination not found in the list.");
          return;
        }

        // Xóa điểm khỏi danh sách
        day.destinations = day.destinations.filter(
          (d) => d.name !== destination.name
        );

        // Xóa khoảng cách và thời gian cũ
        delete state.distances[date];

        // Tạo lại khoảng cách và thời gian cho tất cả các điểm còn lại
        state.distances[date] = {};

        const speedKmPerHour = 60; // Tốc độ trung bình 60 km/h

        for (let i = 0; i < day.destinations.length - 1; i++) {
          const updatedDistance = calculateDistance(
            day.destinations[i],
            day.destinations[i + 1]
          );
          const travelTime = calculateTravelTime(
            updatedDistance,
            speedKmPerHour
          );

          state.distances[date][i + 1] = {
            distance: updatedDistance,
            travelTime,
          };
        }
      }
    },

    setDestinationText: (state, action: PayloadAction<string>) => {
      state.destext = action.payload;
    },
    setSelectedCityCoordinates: (
      state,
      action: PayloadAction<{ lat: number; lng: number } | null>
    ) => {
      state.selectedCityCoordinates = action.payload;
    },
    setSelectedDay: (state, action: PayloadAction<string | null>) => {
      state.selectedDay = action.payload;
    },
    reorderDestinations: (state, action: PayloadAction<{ date: string, destinations: Destination[] }>) => {
      const { date, destinations } = action.payload;
      const day = state.days.find(day => day.date === date);
      if (day) {
          day.destinations = destinations;
          state.distances[date] = {};
          const speedKmPerHour = 60; 
  
          for (let i = 0; i < day.destinations.length - 1; i++) {
              const updatedDistance = calculateDistance(
                  day.destinations[i],
                  day.destinations[i + 1]
              );
              const travelTime = calculateTravelTime(
                  updatedDistance,
                  speedKmPerHour
              );
  
              state.distances[date][i + 1] = {
                  distance: updatedDistance,
                  travelTime,
              };
          }
      }
  },
  
  },
});



export const {
  resetDestinations,
  setDays,
  addDay,
  removeDay,
  addDestination,
  removeDestination,
  setDestinationText,
  setSelectedCityCoordinates,
  setSelectedDay,
  reorderDestinations
} = destinationsSlice.actions;
export default destinationsSlice.reducer;
