import React, { createContext, useState } from "react";

export const ToastifyContext = createContext();
import { ToastContainer, toast } from "react-toastify";

const ToastifyProvider = ({ children }) => {
  const value = {
    toast
  };

  return (
    <ToastifyContext.Provider value={value}>
      {children}
      <ToastContainer position="top-left" />
    </ToastifyContext.Provider>
  );
};

export default ToastifyProvider;
