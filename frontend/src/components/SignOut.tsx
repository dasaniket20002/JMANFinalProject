import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROOT } from "../ts/Consts";
import Container from "./misc/Container";
import { AuthenticationContext } from "./AuthenticationProvider";

const SignOut = () => {
	const navigate = useNavigate();
	const { setJWT } = useContext(AuthenticationContext);
	useEffect(() => {
		localStorage.clear();
		setJWT && setJWT("");
		navigate(`${ROOT}`);
	}, []);

	return <Container containerHeading="Signing Out..." headerType="l1" />;
};

export default SignOut;
