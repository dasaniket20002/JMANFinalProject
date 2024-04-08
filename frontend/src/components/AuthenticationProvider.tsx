import { createContext, useEffect, useState } from "react";
import { OptionalChildren, jwt_decoded_response } from "../ts/Types";
import axios from "axios";
import { DECODE_JWT_ROUTE, GET_PERMISSIONS } from "../ts/Consts";

export const AuthenticationContext = createContext<{
	userData: jwt_decoded_response | undefined;
	accessTo: string[];
	JWT: string;
	setJWT: React.Dispatch<React.SetStateAction<string>> | undefined;
	isAuthenticating: boolean;
}>({
	userData: undefined,
	accessTo: [],
	JWT: "",
	setJWT: undefined,
	isAuthenticating: false,
});

const AuthenticationProvider = ({ children }: OptionalChildren) => {
	const [userData, setUserData] = useState<jwt_decoded_response>();
	const [accessTo, setAccessTo] = useState<string[]>([]);
	const [JWT, setJWT] = useState<string>(
		localStorage.getItem("jwt") as string
	);

	const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

	const getUserData = () => {
		axios
			.get(DECODE_JWT_ROUTE, {
				params: { token: JWT },
			})
			.then((res) => {
				if (res.status === 200) {
					setUserData(res.data as jwt_decoded_response);
				} else {
					setUserData(undefined);
				}
			})
			.catch((_) => {
				setUserData(undefined);
			});
	};

	const getAccessTo = () => {
		if (!userData) return;
		axios
			.get(GET_PERMISSIONS, {
				params: {
					role: userData.role,
				},
			})
			.then((res) => {
				if (res.status === 200) {
					setAccessTo(res.data.access_to);
				} else {
					setAccessTo([]);
				}
			})
			.catch((_) => setAccessTo([]));
	};

	useEffect(() => {
		setIsAuthenticating(true);
	}, [setJWT]);

	useEffect(() => {
		getUserData();
	}, [JWT]);

	useEffect(() => {
		getAccessTo();
		setIsAuthenticating(false);
	}, [userData]);

	return (
		<AuthenticationContext.Provider
			value={{ userData, accessTo, JWT, setJWT, isAuthenticating }}
		>
			{children}
		</AuthenticationContext.Provider>
	);
};

export default AuthenticationProvider;
