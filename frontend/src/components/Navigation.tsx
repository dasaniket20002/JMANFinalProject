import { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import {
	DASHBOARD,
	DECODE_JWT_ROUTE,
	FEEDBACK,
	SIGNOUT,
	TIMESHEET,
} from "../ts/Consts";
import axios from "axios";
import { jwt_decoded_response } from "../ts/Types";
import { AuthenticationContext } from "./AuthenticationProvider";

const Navigation = () => {
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	);
};

const NavBar = () => {
	const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
	const { userData } = useContext(AuthenticationContext);

	// const [userData, setUserData] = useState<jwt_decoded_response>();
	// const getUserData = () => {
	// 	axios
	// 		.get(DECODE_JWT_ROUTE, {
	// 			params: { token: sessionStorage.getItem("jwt") },
	// 		})
	// 		.then((res) => {
	// 			if (res.status === 200) {
	// 				setUserData(res.data as jwt_decoded_response);
	// 			}
	// 		});
	// };

	// useEffect(() => {
	// 	getUserData();
	// 	// setInterval(() => {
	// 	// 	getUserData();
	// 	// }, 5000);
	// }, [sessionStorage.getItem("jwt")]);

	return (
		<nav className="md:fixed w-full md:w-72 md:min-h-screen bg-gray-300 text-center md:text-left flex flex-col justify-between">
			<section>
				<h1 className="font-medium text-3xl py-6 px-8">APP NAME</h1>
				{userData ? (
					<section className="relative md:px-8">
						<button
							className="py-2 md:hidden font-medium"
							onClick={() => setMenuOpen(!isMenuOpen)}
						>
							MENU
						</button>
						<ul
							className={twMerge(
								"absolute bg-gray-300 w-full md:w-auto py-2 md:py-16 transition origin-top flex flex-col gap-2 md:gap-16",
								isMenuOpen
									? "scale-y-100 opacity-100"
									: "scale-y-0 opacity-0",
								"md:scale-y-100 md:opacity-100"
							)}
						>
							<li>
								<Link to={DASHBOARD}>Dashboard</Link>
							</li>
							<li>
								<Link to={FEEDBACK}>Feedback</Link>
							</li>
							<li>
								<Link to={TIMESHEET}>Timesheet</Link>
							</li>
							<li>
								<Link to={SIGNOUT}>Sign Out</Link>
							</li>
						</ul>
					</section>
				) : (
					<p className="pb-4 md:py-16 px-8 font-medium">
						Login to continue
					</p>
				)}
			</section>

			{userData && (
				<section className="hidden h-20 md:flex flex-col justify-between items-center">
					<hr className="w-10/12" />
					<p>{userData.email}</p>
					<hr className="w-10/12" />
				</section>
			)}
		</nav>
	);
};

export default Navigation;
