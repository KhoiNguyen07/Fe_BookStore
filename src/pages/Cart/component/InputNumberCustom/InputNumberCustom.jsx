import React from "react";
import { InputNumber } from "antd";
import { cartService } from "~/apis/cartService";

// defaultValue should include { quantity, productCode, customerCode }
const InputNumberCustom = ({
  defaultValue,
  inCart = false,
  setQuantity,
  onUpdated
}) => {
  const onChange = async (value) => {
    if (inCart) {
      const data = {
        customerCode: defaultValue.customerCode,
        productCode: defaultValue.productCode,
        quantity: value
      };

      try {
        await cartService.updateQuantity(data);
        // notify parent to refresh cart
        if (typeof onUpdated === "function") onUpdated();
      } catch (err) {
        // silently fail here; parent may show toast if desired
        console.error("Failed to update quantity", err);
      }
    } else {
      setQuantity && setQuantity(value);
    }
  };

  return (
    <InputNumber
      style={{ borderRadius: 0, width: 60 }}
      min={1}
      max={20}
      defaultValue={defaultValue?.quantity}
      onChange={onChange}
    />
  );
};

export default InputNumberCustom;
