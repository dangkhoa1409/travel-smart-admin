import React, { useState } from "react";
import Handcrafted from "./Handcrafted";
import { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";

const MapSelector = ({
  isMenuOpen,
  handleMenuToggle,
}: {
  isMenuOpen: boolean;
  handleMenuToggle: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const destext = useSelector((state: RootState) => state.destinations.destext);

  return (
    <>
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:block absolute md:static w-full md:w-1/3 p-4 dark:bg-slate-800 dark:text-white bg-gray-100 overflow-y-auto no-scrollbar  z-40 md:z-auto`}
      >
        <h2 className="text-xl font-semibold mb-4">
          Lựa chọn của bạn cho chuyến đi:{" "}
          <label className="text-primary">{destext}</label>
        </h2>
        <button
          onClick={() => setShowOptions((showOptions) => !showOptions)}
          className="mb-4 px-2 py-3  w-full bg-secondary text-white rounded"
        >
          Lịch trình tự tạo
        </button>
        {showOptions && <Handcrafted />}

        <hr></hr>
        <button className="mb-4 px-2 mt-4 py-3 w-full bg-button text-white rounded">
          Lịch trình có sẵn
        </button>

        <button
          className="md:hidden bg-red-500 text-white p-2 rounded shadow-lg hover:bg-red-700 transition mt-4"
          onClick={handleMenuToggle}
        >
          Close
        </button>
      </div>
    </>
  );
};

export default MapSelector;
