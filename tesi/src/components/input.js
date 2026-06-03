import React from "react";

export const Input = ({ name, id, placeholder, onChange, type }) => {
  return (
    <div className="flex flex-col gap-2 items-start w-full">
      {name && (
        <label htmlFor={id} className="text-white">
          {name}
        </label>
      )}
      <input
        className="px-2 rounded-lg"
        name={name}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        type={type}
      />
    </div>
  );
};
