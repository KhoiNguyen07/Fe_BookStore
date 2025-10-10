import React from "react";
import { Dropdown } from "antd";
const DropdownCustom = ({ children, items }) => {
  return <Dropdown menu={{ items }}>{children}</Dropdown>;
};

export default DropdownCustom;
