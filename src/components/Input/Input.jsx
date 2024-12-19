import React from 'react';
import { useController } from "react-hook-form";
const Input = ({type,control,isCustom,className,defaultValue,...props}) => {
    const {field} = useController({control,name: props.name,defaultValue: defaultValue || ""})
    return (
        <input  className={`transition-all border border-stone-400 rounded-lg w-full px-2 py-3 outline-none ${isCustom && `bg-gray-300` } focus:bg-transparent focus:border-primary ${className}`} id={props.name} type={type} {...field} {...props} />
    );
};

export default Input;