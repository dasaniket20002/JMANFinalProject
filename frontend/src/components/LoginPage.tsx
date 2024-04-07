import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DASHBOARD, FORGOT_PASSWORD, LOGIN_ROUTE } from "../ts/Consts";
import axios from "axios";
import InfoDisplay from "./misc/InfoDisplay";
import Container from "./misc/Container";
import ContainerForm from "./misc/ContainerForm";
import Input from "./misc/Input";
import Button from "./misc/Button";
import { AuthenticationContext } from "./AuthenticationProvider";

const LoginPage = () => {
	const navigate = useNavigate();
	const { JWT, setJWT, isAuthenticating } = useContext(AuthenticationContext);

	useEffect(() => {
		if (isAuthenticating) return;
		if (JWT) {
			navigate(`/${DASHBOARD}`);
		}
	}, [JWT, isAuthenticating]);

	const [email, setEmail] = useState<string>("");
	const [pass, setPass] = useState<string>("");

	const [infoDisplayText, infoSetter] = useState<string>("");
	const setInfoDisplayText = (text: string) =>
		infoSetter(`${text}~${Math.random()}`);
	const [isInfoError, setInfoError] = useState<boolean>(true);

	const onLoginButtonClicked = () => {
		axios
			.post(LOGIN_ROUTE, { email, pass })
			.then((res) => {
				if (res.status === 200) {
					setInfoError(false);
					setInfoDisplayText(res.data.msg);

					localStorage.setItem("jwt", res.data.jwt);
					setJWT && setJWT(res.data.jwt);

					navigate(`/${DASHBOARD}`);
				} else {
					setInfoError(true);
					setInfoDisplayText(res.data.err);

					console.log(res.data);
				}
			})
			.catch((err) => {
				console.log(err);

				setInfoError(true);
				setInfoDisplayText(err.code);
			});
	};

	return (
		<Container containerHeading="Login" headerType="l1">
			<ContainerForm
				onSubmit={(e) => {
					e.preventDefault();
					onLoginButtonClicked();
				}}
				containerHeading="Login"
				headerType="l3"
			>
				<Input
					type="email"
					name="email"
					id="email"
					placeholder="Email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					label="Email"
					bulged
				/>
				<Input
					type="password"
					name="pass"
					id="pass"
					placeholder="Password"
					onChange={(e) => setPass(e.target.value)}
					value={pass}
					label="Password"
					bulged
				/>

				<Button type="submit">Login</Button>
				<InfoDisplay
					isError={isInfoError}
					infoText={infoDisplayText}
					className="-mt-12"
				/>
				<Link
					to={FORGOT_PASSWORD}
					className="text-right underline underline-offset-2"
				>
					Forgot Password
				</Link>
			</ContainerForm>
		</Container>
	);
};

export default LoginPage;
