import React, { useEffect, useRef } from "react";

const BlockModal = ({ item, onChangeBlock, isOpen, onToggle }) => {
  const modalRef = useRef(null);

  const onClick = async (action) => {
    await onChangeBlock(action);
    onToggle();
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onToggle(); // Close the modal
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <p
      onClick={onToggle}
      className={`text-sm p-2 rounded-md border relative ${
        !item?.block ? `text-green-600 bg-green-200` : `text-red-600 bg-red-200`
      }`}
    >
      {item?.block.toString() === "false" ? "Active" : "Blocked"}
      {isOpen && (
        <div
          ref={modalRef}
          className="absolute left-0 top-100 z-50 rounded-sm w-full border bg-white"
        >
          <span
            onClick={!item?.block ? () => onClick("block") : undefined}
            className={`block flex justify-between p-2 text-black cursor-pointer hover:text-red-600 hover:bg-red-200`}
          >
            Block
            {item?.block && (
              <span className="text-blue-600">
                <i className="fa-solid fa-check"></i>
              </span>
            )}
          </span>
          <span
            onClick={item?.block ? () => onClick("unblock") : undefined}
            className="flex justify-between p-2 text-black cursor-pointer hover:text-green-600 hover:bg-green-200"
          >
            Unblock
            {!item?.block && (
              <span className="text-blue-600">
                <i className="fa-solid fa-check"></i>
              </span>
            )}
          </span>
        </div>
      )}
    </p>
  );
};

export default BlockModal;
