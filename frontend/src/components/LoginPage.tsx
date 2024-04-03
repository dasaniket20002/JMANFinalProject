import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DASHBOARD, FORGOT_PASSWORD, LOGIN_ROUTE } from "../ts/Consts";
import axios from "axios";
import InfoDisplay from "./misc/InfoDisplay";

const LoginPage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		if (sessionStorage.getItem("jwt")) {
			navigate(`/${DASHBOARD}`);
		}
	}, []);

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

					sessionStorage.setItem("jwt", res.data.jwt);
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
		<div className="px-6 md:ml-72 md:px-16 2xl:px-64 flex flex-col">
			<header className="w-full py-6 font-semibold text-3xl">
				Login
			</header>

			<form
				className="flex flex-col gap-16 py-16"
				onSubmit={(e) => {
					e.preventDefault();
					onLoginButtonClicked();
				}}
			>
				<span className="flex flex-col gap-2">
					<label htmlFor="email">Email</label>
					<input
						className="p-2 -mx-2 rounded outline-none transition shadow-md focus:shadow-lg"
						type="email"
						name="email"
						id="email"
						placeholder="Email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
				</span>
				<span className="flex flex-col gap-2">
					<label htmlFor="pass">Password</label>
					<input
						className="p-2 -mx-2 rounded outline-none transition shadow-md focus:shadow-lg"
						type="password"
						name="pass"
						id="pass"
						placeholder="Password"
						onChange={(e) => setPass(e.target.value)}
						value={pass}
					/>
				</span>

				<button
					className="border border-gray-100 p-2 -mx-2 rounded transition shadow-lg active:shadow-sm"
					type="submit"
				>
					Login
				</button>
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
			</form>
		</div>
	);
};

export default LoginPage;
