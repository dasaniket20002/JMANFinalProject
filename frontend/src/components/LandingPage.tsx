import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DASHBOARD, ROOT } from "../ts/Consts";
import { AuthenticationContext } from "./AuthenticationProvider";

const LandingPage = () => {
	const navigate = useNavigate();

	const { JWT, isAuthenticating } = useContext(AuthenticationContext);

	useEffect(() => {
		if (isAuthenticating) return;
		if (JWT) {
			navigate(`/${DASHBOARD}`);
		}
	}, [JWT, isAuthenticating]);

	return (
		<div className="h-[calc(100vh-2.5rem)] text-5xl flex items-center justify-center">
			<button
				className="border-2 p-4 rounded"
				onClick={(e) => {
					e.preventDefault();
					navigate(`/${ROOT}`);
				}}
			>
				Login
			</button>
		</div>
	);
};

export default LandingPage;
