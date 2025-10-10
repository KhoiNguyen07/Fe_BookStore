import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
const InputCustom = ({
  id,
  label,
  type,
  formik,
  placeholder = "",
  require = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleBlur, handleChange, values, errors, touched } = formik;
  return (
    <>
      <div>
        <label>
          {label} {require && "*"}
        </label>
      </div>
      <div className="border relative">
        <input
          id={id}
          type={type === "password" && showPassword ? "text" : type}
          className="w-full h-10 ps-5"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values[id]}
          errors={errors}
          touched={touched}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => {
            setShowPassword(!showPassword);
          }}
          className="absolute top-3 right-5"
        >
          {type === "password" && (showPassword ? <FiEye /> : <FiEyeOff />)}
        </button>
      </div>
      {errors[id] && touched[id] ? (
        <div className="text-red-500">{errors[id]}</div>
      ) : (
        <div className="h-6"></div>
      )}
    </>
  );
};

export default InputCustom;
