import { twMerge } from "tailwind-merge";
import { Select_type } from "../../ts/Types";

const Select = ({
  onChange,
  value,
  name,
  id,
  placeholder,
  label,
  className,
  bulged,
  children,
  textCenter,
}: Select_type) => {
  return (
    <span className={twMerge("flex flex-col gap-2", className)}>
      {label && <label htmlFor={name}>{label}</label>}
      <select
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        className={twMerge(
          "p-2 capitalize rounded outline-none transition shadow-md focus:shadow-lg border border-transparent focus:border-gray-600",
          bulged && "-mx-2",
          textCenter && "text-center"
        )}
      >
        <option value="" disabled>
          {placeholder ? placeholder : "Select..."}
        </option>
        {children}
      </select>
    </span>
  );
};

export default Select;
