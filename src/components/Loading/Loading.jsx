import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const Loading = () => {
  useEffect(() => {
    // disable scroll
    document.body.style.overflow = "hidden";

    return () => {
      // enable lại scroll khi unmount
      document.body.style.overflow = "auto";
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>,
    document.body
  );
};

export default Loading;
