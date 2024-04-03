import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import LoginPage from "./components/LoginPage";
import {
	CHANGE_PASSWORD,
	DASHBOARD,
	FEEDBACK,
	FORGOT_PASSWORD,
	ROOT,
	SIGNOUT,
	TIMESHEET,
} from "./ts/Consts";
import SignOut from "./components/SignOut";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";
import ChangePassword from "./components/ChangePassword";
import Feedback from "./components/Feedback";
import Timesheet from "./components/Timesheet";
import NotFound from "./components/NotFound";

function App() {
	return (
		<div className="font-montserrat relative min-h-screen bg-gray-200 text-gray-900">
			<BrowserRouter>
				<Routes>
					<Route path={ROOT} element={<Navigation />}>
						<Route path={ROOT} element={<LoginPage />} />
						<Route path={SIGNOUT} element={<SignOut />} />

						<Route path={DASHBOARD} element={<Dashboard />} />

						<Route path={FEEDBACK} element={<Feedback />} />
						<Route path={TIMESHEET} element={<Timesheet />} />

						<Route
							path={FORGOT_PASSWORD}
							element={<ForgotPassword />}
						/>
						<Route
							path={CHANGE_PASSWORD}
							element={<ChangePassword />}
						/>
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
