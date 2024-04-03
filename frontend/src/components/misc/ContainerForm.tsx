import { twMerge } from "tailwind-merge";
import { ContainerForm_type } from "../../ts/Types";

const ContainerForm = ({
	containerHeading,
	headerType,
	children,
	className,
	onSubmit,
	bulged,
}: ContainerForm_type) => {
	return (
		<div
			className={twMerge(
				(headerType === "l1" || headerType === "l2") &&
					"px-6 md:ml-72 md:px-16 2xl:px-64 flex flex-col",
				className
			)}
		>
			<header
				className={twMerge(
					"w-full",
					headerType === "l1" && "py-6 font-semibold text-3xl",
					headerType === "l2" && "py-6 font-medium text-3xl",
					headerType === "l3" && "py-0 font-normal text-2xl"
				)}
			>
				{containerHeading}
			</header>
			<form
				className={twMerge(
					"flex flex-col gap-16 pt-8",
					headerType === "l1" && "py-16",
					headerType === "l2" && "py-8",
					headerType === "l3" && "pb-16",
					bulged && "-mx-2"
				)}
				onSubmit={onSubmit}
			>
				{children}
			</form>
		</div>
	);
};

export default ContainerForm;
