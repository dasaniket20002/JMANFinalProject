import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROOT } from "../ts/Consts";

const SignOut = () => {
	const navigate = useNavigate();
	useEffect(() => {
		sessionStorage.clear();
		navigate(`${ROOT}`);
	}, [navigate]);

	return (
		<div className="px-6 md:ml-72 md:px-16 2xl:px-64 flex flex-col">
			<header className="py-6 font-medium text-2xl flex items-end">
				Signing Out...
			</header>
		</div>
	);
};

export default SignOut;
