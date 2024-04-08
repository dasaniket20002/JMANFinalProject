import { twMerge } from "tailwind-merge";
import { Input_type } from "../../ts/Types";

const Radio = ({
  onChange,
  value,
  name,
  id,
  label,
  className,
  bulged,
  textCenter,
  disabled,
  options,
}: Omit<Input_type, "type" | "onChange" | "placeholder"> & {
  options: string[];
  onChange?: (value: string) => void;
}) => {
  return (
    <span
      className={twMerge(
        "flex flex-col gap-2",
        textCenter && "text-center",
        bulged && "-mx-2",
        className
      )}
    >
      {label && <span>{label}</span>}
      <div className="flex justify-between">
        {options.map((option, index) => (
          <span key={index} className="flex gap-4 items-center justify-center">
            <label
              htmlFor={label && name && label + name}
              className="font-medium"
            >
              {option}
            </label>
            <input
              type="radio"
              name={label && name && label + name}
              id={label && id && label + id}
              onChange={() => onChange && onChange(option)}
              checked={value ? option === value : false}
              disabled={disabled}
              className="scale-125"
            />
          </span>
        ))}
      </div>
    </span>
  );
};

export default Radio;
