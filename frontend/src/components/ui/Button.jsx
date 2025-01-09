// client/src/components/ui/Button.jsx
import React from "react";

function Button({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  className,
}) {
  let buttonClasses =
    "rounded font-medium focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ";

  if (variant === "primary") {
    buttonClasses +=
      "bg-primary text-white hover:bg-indigo-600 focus:ring-primary";
  } else if (variant === "secondary") {
    buttonClasses +=
      "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400";
  } else if (variant === "white") {
    buttonClasses +=
      "bg-white text-gray-700 hover:bg-gray-100 focus:ring-gray-300 border border-gray-200";
  }

  if (size === "small") {
    buttonClasses += " px-2 py-1 text-sm";
  } else if (size === "medium") {
    buttonClasses += " px-4 py-2 text-base";
  } else if (size === "large") {
    buttonClasses += " px-6 py-3 text-lg";
  }

  buttonClasses += ` ${className}`;

  return (
    <button onClick={onClick} className={buttonClasses} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
