import { useState, useRef, useEffect } from "react";
import { INFO_DISPLAY_TIMEOUT } from "../../ts/Consts";
import { twMerge } from "tailwind-merge";
import { InfoDisplay_type } from "../../ts/Types";

const InfoDisplay = ({ isError, infoText, className }: InfoDisplay_type) => {
	const [infoStartTime, setInfoStartTime] = useState<number>(0);
	const [infoDisplayText, setInfoDisplayText] = useState<string>(
		infoText.split("~")[0]
	);
	const [isInfoDisplayed, setInfoDisplayed] = useState<boolean>(false);
	const [isInfoError, setInfoError] = useState<boolean>(isError);
	const infoIntervalID = useRef<number>(-1);

	useEffect(() => {
		if (infoIntervalID.current !== -1)
			clearInterval(infoIntervalID.current);
		const updateAsync = () => {
			const elapsed = Date.now() - infoStartTime;
			if (elapsed > INFO_DISPLAY_TIMEOUT) {
				clearInterval(infoIntervalID.current);
				infoIntervalID.current = -1;
				setInfoDisplayed(false);
			}
		};
		infoIntervalID.current = setInterval(updateAsync, 100);
	}, [infoStartTime]);

	useEffect(() => {
		setInfoDisplayText(infoText.split("~")[0]);
		setInfoError(isError);
		setInfoDisplayed(true);
		setInfoStartTime(Date.now());
	}, [infoText, isError]);
	return (
		<p
			className={twMerge(
				"text-center font-medium transition my-2",
				isInfoDisplayed ? "opacity-100" : "opacity-0",
				isInfoError ? "text-red-500" : "text-green-500",
				className
			)}
		>
			{infoDisplayText}
		</p>
	);
};

export default InfoDisplay;
