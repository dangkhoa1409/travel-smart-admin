import React from 'react';

const CategoryItem = ({isSelected, children,onClick,className,selectTag}) => {
    
    
    return (
        <div onClick={onClick}  className={`${className} px-3 py-1 bg-[#f2f2f2] rounded-lg cursor-pointer ${isSelected ? 'bg-primary text-white' : ''}`}  >
            {children}
        </div>
    );
};

export default CategoryItem;