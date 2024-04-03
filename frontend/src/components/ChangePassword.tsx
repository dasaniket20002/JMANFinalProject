import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
	CHANGE_PASSWORD_REQUESTING_EMAIL_ROUTE,
	CHANGE_PASSWORD_ROUTE,
	ROOT,
} from "../ts/Consts";
import InfoDisplay from "./misc/InfoDisplay";
import Button, { LinkMod } from "./misc/Button";
import Container from "./misc/Container";
import ContainerForm from "./misc/ContainerForm";
import Input from "./misc/Input";

const ChangePassword = () => {
	const { search } = useLocation();
	const query = new URLSearchParams(search);
	const q = useRef<string>(query.get("q"));
	const [e, setE] = useState<string>("");

	const [errMessage, setErrMessage] = useState<string>("");
	const [pass, setPass] = useState<string>("");
	const [cnfpass, setCnfPass] = useState<string>("");

	const [infoDisplayText, infoSetter] = useState<string>("");
	const setInfoDisplayText = (text: string) =>
		infoSetter(`${text}~${Math.random()}`);
	const [isInfoError, setInfoError] = useState<boolean>(true);

	useEffect(() => {
		axios
			.get(CHANGE_PASSWORD_REQUESTING_EMAIL_ROUTE, {
				params: { q: q.current },
			})
			.then((res) => {
				if (res.status === 200) {
					setE(res.data.msg);
				} else {
					setErrMessage(res.data.err);
				}
			})
			.catch((err) => {
				setErrMessage(err.code);
				console.log(err);
			});
	}, [q.current]);

	const onChangePasswordClicked = () => {
		setInfoError(false);
		setInfoDisplayText("Please Wait!");
		axios
			.post(
				CHANGE_PASSWORD_ROUTE,
				{ new_pass: pass, cnf_pass: cnfpass },
				{ params: { q: q.current } }
			)
			.then((res) => {
				if (res.status === 200) {
					setInfoError(false);
					setInfoDisplayText(res.data.msg);
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
		<Container containerHeading="Change Password" headerType="l1">
			{errMessage === "" ? (
				<ContainerForm
					containerHeading={
						<section>
							<h2 className="text-xl">Changing Password for:</h2>
							<h1 className="text-3xl font-medium">{e}</h1>
						</section>
					}
					headerType="l3"
					onSubmit={(e) => {
						e.preventDefault();
						onChangePasswordClicked();
					}}
				>
					<Input
						type="password"
						name="pass"
						id="pass"
						placeholder="New Password"
						onChange={(e) => setPass(e.target.value)}
						value={pass}
						label="New Password"
						bulged
					/>
					<Input
						type="password"
						name="cnf-pass"
						id="cnf-pass"
						placeholder="Confirm Password"
						onChange={(e) => setCnfPass(e.target.value)}
						value={cnfpass}
						label="Confirm Password"
						bulged
					/>
					<Button type="submit" bulged>
						Change Password
					</Button>
					<InfoDisplay
						isError={isInfoError}
						infoText={infoDisplayText}
						className="-mt-12"
					/>
				</ContainerForm>
			) : (
				<p className="text-red-500 text-2xl font-medium">
					{errMessage}
				</p>
			)}

			<LinkMod to={ROOT} bulged>
				Cancel
			</LinkMod>
		</Container>
	);
};

export default ChangePassword;
