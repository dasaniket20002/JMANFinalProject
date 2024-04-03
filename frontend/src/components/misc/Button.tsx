import { twMerge } from "tailwind-merge";
import { Button_type, Link_type } from "../../ts/Types";
import { Link } from "react-router-dom";
import { forwardRef } from "react";

const Button = forwardRef<HTMLButtonElement, Button_type>(
  ({ onClick, type, bulged, disabled, children, className }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={twMerge(
          "py-2 border border-gray-100 rounded transition shadow-lg active:shadow-sm disabled:shadow-sm disabled:text-gray-600",
          bulged && "-mx-2",
          className
        )}
      >
        {children}
      </button>
    );
  }
);

export const LinkMod = ({ to, className, children, bulged }: Link_type) => {
  return (
    <Link
      to={to}
      className={twMerge(
        "py-2 text-center border border-gray-100 rounded transition shadow-lg active:shadow-sm disabled:shadow-sm disabled:text-gray-600",
        bulged && "-mx-2",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default Button;
