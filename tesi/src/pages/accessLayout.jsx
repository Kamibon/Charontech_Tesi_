import React from "react";
import { Input } from "../components/input";

export const AccessLayout = ({ fields, button }) => {
  return (
    <div className="signup flex">
      <div id="image" className="w-0 sm:w-[70%]" />
      <div className="flex flex-col gap-1 w-full items-center sm:w-[30%]">
        <h1>Carontech</h1>

        <h3>Powered by ChatGPT</h3>
        <form className="flex flex-col gap-2">
          {fields.map((field) => (
            <Input key={field.id} {...field} />
          ))}
        </form>
        {button}
      </div>
    </div>
  );
};
