import { twMerge } from "tailwind-merge";
import {
	Bulged,
	OptionalChildren,
	OptionalClassname,
	TableCell_type,
} from "../../ts/Types";
import React, { JSXElementConstructor, ReactElement } from "react";

const Table = ({
	children,
	className,
	bulged,
}: OptionalChildren & OptionalClassname & Bulged) => {
	return (
		<div
			className={twMerge(
				"bg-gray-100 shadow-md rounded overflow-auto",
				bulged && "-mx-2",
				className
			)}
		>
			<table className="table-auto w-full">{children}</table>
		</div>
	);
};

export const TableHead = ({
	children,
	className,
}: OptionalChildren & OptionalClassname) => {
	const modifiedChildren = React.Children.map(children, (child, index) => {
		let additionalClass = "";
		if (index === 0) {
			additionalClass = "pl-2";
		} else if (index === React.Children.count(children) - 1) {
			additionalClass = "pr-2";
		}

		return React.cloneElement(
			child as ReactElement<any, string | JSXElementConstructor<any>>,
			{
				className: twMerge(
					(child as JSX.Element).props.className,
					additionalClass
				),
			}
		);
	});
	return (
		<thead>
			<tr className={twMerge(className)}>{modifiedChildren}</tr>
		</thead>
	);
};

export const TableHeader = ({
	children,
	className,
}: OptionalChildren & OptionalClassname) => {
	return (
		<th
			className={twMerge(
				"py-4 text-xl font-semibold bg-gray-300",
				className
			)}
		>
			{children}
		</th>
	);
};

export const TableBody = ({ children }: OptionalChildren) => {
	return <tbody>{children}</tbody>;
};

export const TableRow = ({
	children,
	className,
}: OptionalChildren & OptionalClassname) => {
	return (
		<tr
			className={twMerge(
				"text-center border-b border-gray-200",
				className
			)}
		>
			{children}
		</tr>
	);
};

export const TableCell = ({
	children,
	className,
	rowSpan,
	colSpan,
}: TableCell_type) => {
	return (
		<td
			className={twMerge("p-2", className)}
			rowSpan={rowSpan}
			colSpan={colSpan}
		>
			{children}
		</td>
	);
};

export default Table;
