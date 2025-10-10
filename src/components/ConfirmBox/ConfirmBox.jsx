// components/ConfirmBox.jsx
import React from "react";

const ConfirmBox = ({ onConfirm, closeToast, message }) => {
  return (
    <div>
      <p>{message}</p>
      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => {
            onConfirm();
            closeToast();
          }}
          style={{ marginRight: 10 }}
        >
          Confirm
        </button>
        <button onClick={closeToast}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmBox;
