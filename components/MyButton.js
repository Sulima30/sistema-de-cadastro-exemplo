import React from "react";

export function MyButton({ name, onClick, className }) {
  return (
    <button type="submit" className={`${className}`} onClick={onClick}>
      {name}
    </button>
  );
};