/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DestinationItem from "./DestinationItem";
import MapDetails from "./MapDetails";
import { Destination, Day } from "../../redux/type";
import { RootState } from "../../redux/store/store";
import {
  addDestination,
  removeDestination,
  setSelectedDay,
  reorderDestinations,
  addDay,
  removeDay,
} from "./destinationsSlice";
import SearchInput from "../SearchInput/SearchInput";

const Handcrafted: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const days = useSelector((state: RootState) => state.destinations.days);
  const dispatch = useDispatch();
  const [newDestinations, setNewDestinations] = useState<{
    [key: string]: string;
  }>({});

  const handleInputChange = (date: string, value: string) => {
    setNewDestinations({ ...newDestinations, [date]: value });
  };

  const handleSelectResult = (date: string, result: any) => {
    const { x: lng, y: lat, label } = result;
    dispatch(addDestination({ date, destination: { name: label, lat, lng } }));
    setNewDestinations({ ...newDestinations, [date]: "" });
  };

  const handleRemoveDestination = (date: string, destination: Destination) => {
    dispatch(removeDestination({ date, destination }));
  };

  const handleGoToMap = (date: string) => {
    dispatch(setSelectedDay(date));
    setSelectedDate(date);
  };

  const handleBackToList = () => {
    setSelectedDate(null);
  };

  const onDragEnd = (result: any, day: Day) => {
    if (!result.destination) return;

    const reorderedDestinations = Array.from(day.destinations);
    const [movedDestination] = reorderedDestinations.splice(
      result.source.index,
      1
    );
    reorderedDestinations.splice(result.destination.index, 0, movedDestination);

    dispatch(
      reorderDestinations({
        date: day.date,
        destinations: reorderedDestinations,
      })
    );
  };

  return (
    <div className="space-y-4">
      {days.map((day: Day) => (
        <div
          key={day.date}
          className="bg-white p-4 dark:bg-slate-600 dark:text-white rounded-md shadow-md"
        >
          {selectedDate === day.date ? (
            <MapDetails date={day.date} onBack={handleBackToList} />
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{new Date(day.date).toLocaleDateString("vi-VN")}</h3>
                <div>
                  <button
                    onClick={() => dispatch(removeDay(day.date))}
                    className="text-red-500 font-semibold"
                  >
                    X
                  </button>
                </div>
              </div>

              <DragDropContext onDragEnd={(result) => onDragEnd(result, day)}>
                <Droppable droppableId={day.date}>
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="list-disc"
                    >
                      {day.destinations.map(
                        (destination: Destination, index: number) => (
                          <Draggable
                            key={destination.name}
                            draggableId={destination.name}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex items-center justify-between p-3 dark:border-gray-700"
                              >
                                <DestinationItem
                                  destination={destination}
                                  onRemove={() =>
                                    handleRemoveDestination(
                                      day.date,
                                      destination
                                    )
                                  }
                                />
                              </li>
                            )}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
              <SearchInput
                date={day.date}
                value={newDestinations[day.date] || ""}
                onChange={(value) => handleInputChange(day.date, value)}
                onSelect={(result) => handleSelectResult(day.date, result)}
              />
              <div className="w-100 flex mt-3 justify-center">
                <button
                  onClick={() => handleGoToMap(day.date)}
                  className="bg-gradient-to-r from-primary to-secondary hover:bg-bg-gradient-to-r w-32 hover:from-secondary hover:bg-primary transition-all duration-600 text-white px-3 py-2 rounded-full"
                >
                  Tiến hành
                </button>
              </div>
            </>
          )}
        </div>
      ))}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => dispatch(addDay())}
          className="bg-primary text-white w-10 h-10 mb-3 text-lg rounded-full flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Handcrafted;
