import React from "react";

const Input = ({ type, value, onChange, name, label, placeholder }) => {
  return (
    <div className="w-full">
      <label>{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className="w-full bg-componentColor py-3 px-4 rounded-xl"
      />
    </div>
  );
};

export default Input;
