import React, { useEffect, useState } from "react";

import { InputNumber } from "antd";
import { cartService } from "~/apis/cartService";
const InputNumberCustom = ({ defaultValue, inCart = false, setQuantity }) => {
  // console.log(id);
  const onChange = (value) => {
    if (inCart) {
      const data = {
        cartId: defaultValue.cartId,
        quantity: value
      };

      cartService.updateQuantity(data);
    } else {
      setQuantity(value);
    }
  };
  return (
    <InputNumber
      style={{ borderRadius: 0, width: 60 }}
      min={1}
      max={20}
      defaultValue={defaultValue.quantity}
      onChange={onChange}
    />
  );
};

export default InputNumberCustom;
