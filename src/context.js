import React, { createContext, useState } from "react";

export const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  const [selectedTime, setSelectedTime] = useState([0,0]);

  return (
    <TimeContext.Provider value={{ selectedTime, setSelectedTime }}>
      {children}
    </TimeContext.Provider>
  );
};
