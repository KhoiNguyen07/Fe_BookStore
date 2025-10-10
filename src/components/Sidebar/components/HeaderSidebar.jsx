import React from "react";

const HeaderSidebar = ({ titleSidebar: { icon, title } }) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-3">
      <div className="text-3xl">{icon}</div>
      <h2 className="cursor-default titleSidebar text-xl uppercase">{title}</h2>
    </div>
  );
};

export default HeaderSidebar;
