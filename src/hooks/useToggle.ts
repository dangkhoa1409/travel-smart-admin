import React, { useState } from 'react';

const useToggle = () => {
    const [isToggle, setToggle] = useState(false);
    const handleToggle = () => setToggle(!isToggle);
    return {
        isToggle,
        handleToggle
    }
};

export default useToggle;