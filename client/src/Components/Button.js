import React from "react";

export default function Button({
  children,
  className,
  variant,
  onClick,
  fullWidth,
  disabled,
  type,
}) {
  let buttonStyle = `${className} ${fullWidth && "w-full"} `;


  return (
    <button
      className={`${buttonStyle} font-medium py-2 px-4 rounded-lg font-body transition-colors duration-100 focus:outline-none`}
      onClick={() => {
        if (!disabled && !!onClick) onClick();
      }}
      type={type}
    >
      {children}
    </button>
  );
}