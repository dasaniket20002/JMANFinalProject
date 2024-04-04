import { twMerge } from "tailwind-merge";
import { Input_type } from "../../ts/Types";

const Input = ({
	onChange,
	value,
	type,
	name,
	id,
	placeholder,
	label,
	className,
	bulged,
	textCenter,
	disabled,
}: Input_type) => {
	return (
		<span className={twMerge("flex flex-col gap-2", className)}>
			{label && <label htmlFor={name}>{label}</label>}
			<input
				className={twMerge(
					"p-2 rounded outline-none transition shadow-md focus:shadow-lg border border-transparent focus:border-gray-600",
					bulged && "-mx-2",
					textCenter && "text-center"
				)}
				type={type}
				name={name}
				id={id}
				placeholder={placeholder}
				onChange={onChange}
				value={value}
				disabled={disabled}
			/>
		</span>
	);
};

export default Input;
