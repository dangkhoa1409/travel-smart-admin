import React from 'react';
import { useController } from 'react-hook-form';

const InputRadio = ({isselected, control,value,label,...props}) => {
    const {field} = useController({control, name:props.name, defaultValue: ""})
    return (
        <div className='flex items-center gap-2'>
            <input checked={isselected} id={value} type='radio' {...field} {...props} value={value}></input>
            <label htmlFor={value}>{label}</label>
        </div>
            
    );
};

export default InputRadio;