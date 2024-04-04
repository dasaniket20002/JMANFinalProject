import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
	DEFAULT_PASSWORD,
	DECODE_JWT_ROUTE,
	SIGNOUT,
	FORGOT_PASSWORD_ROUTE,
	REGISTER_ROUTE,
	GET_ALL_USERS_ROUTE,
	ROLES,
	GET_PERMISSIONS,
	GET_ALL_PROJECTS_ROUTE,
	GET_ALL_FEEDBACK_QUESTIONS_ROUTE,
	ADD_PROJECT_ROUTE,
	ADD_FEEDBACK_QUESTION_ROUTE,
	ASSIGN_USER_TO_PROJECT_ROUTE,
} from "../ts/Consts";
import {
	AdditionalControls_type,
	DashboardAdditionalControls_subtype,
	FeedbackQuestion_type,
	Project_type,
	User_type,
	jwt_decoded_response,
} from "../ts/Types";
import InfoDisplay from "./misc/InfoDisplay";
import Container from "./misc/Container";
import Button from "./misc/Button";
import ContainerForm from "./misc/ContainerForm";
import Input from "./misc/Input";
import Select from "./misc/Select";
import Table, {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./misc/Table";

// FFS REFACTOR THIS BS BEFORE SUBMISSION

const Dashboard = () => {
	const navigate = useNavigate();
	const [userData, setUserData] = useState<jwt_decoded_response>();
	const [accessTo, setAccessTo] = useState<string[]>([]);

	const [changePasswordInfoText, changePassInfoSetter] = useState<string>("");
	const setChangePasswordInfoText = (text: string) =>
		changePassInfoSetter(`${text}~${Math.random()}`);
	const [isChangePasswordInfoError, setChangePasswordInfoError] =
		useState<boolean>(true);
	const changePasswordButtonRef = useRef<HTMLButtonElement>(null);

	const decodeJWT = () => {
		axios
			.get(DECODE_JWT_ROUTE, {
				params: { token: sessionStorage.getItem("jwt") },
			})
			.then((res) => {
				if (res.status === 200) {
					setUserData(res.data as jwt_decoded_response);
				} else {
					navigate(`/${SIGNOUT}`);
				}
			})
			.catch(() => {
				navigate(`/${SIGNOUT}`);
			});
	};

	const getAccessTo = () => {
		if (!userData) return;
		axios
			.get(GET_PERMISSIONS, {
				headers: {
					auth: `${userData.role} ${sessionStorage.getItem("jwt")}`,
				},
			})
			.then((res) => {
				if (res.status === 200) setAccessTo(res.data.access_to);
			});
	};

	const onChangePasswordClicked = () => {
		setChangePasswordInfoText("Loading...");
		setChangePasswordInfoError(false);
		if (changePasswordButtonRef.current)
			changePasswordButtonRef.current.disabled = true;
		axios
			.post(FORGOT_PASSWORD_ROUTE, { email: userData?.email })
			.then((res) => {
				if (res.status === 200) {
					setChangePasswordInfoText(res.data.msg);
					setChangePasswordInfoError(false);
				} else {
					setChangePasswordInfoText(res.data.err);
					setChangePasswordInfoError(true);
				}
				if (changePasswordButtonRef.current)
					changePasswordButtonRef.current.disabled = false;
			})
			.catch((err) => {
				setChangePasswordInfoText(err.code);
				setChangePasswordInfoError(true);
				if (changePasswordButtonRef.current)
					changePasswordButtonRef.current.disabled = false;
			});
	};

	useEffect(() => {
		decodeJWT();
	}, []);

	useEffect(() => {
		getAccessTo();
	}, [userData]);

	return (
		<>
			<Container containerHeading="Dashboard" headerType="l1">
				<Container
					containerHeading={
						<section>
							<h2 className="text-xl">Welcome!</h2>
							<h1 className="text-3xl font-medium">
								{userData?.name}
							</h1>
						</section>
					}
					headerType="l3"
				>
					<Button
						ref={changePasswordButtonRef}
						onClick={(e) => {
							e.preventDefault();
							onChangePasswordClicked();
						}}
						bulged
					>
						Change Password
					</Button>
					<InfoDisplay
						isError={isChangePasswordInfoError}
						infoText={changePasswordInfoText}
						className="-my-6"
					/>
				</Container>
			</Container>
			{userData &&
				accessTo &&
				accessTo.some((access) =>
					[
						"REGISTER_USER",
						"SEE_USERS",
						"CREATE_PROJECTS",
						"ASSIGN_USER_TO_PROJECTS",
						"SEE_PROJECTS",
						"CREATE_QUESTIONS",
						"SEE_QUESTIONS",
						"USER_ACCESS_CONTROL",
					].includes(access)
				) && (
					<AdditionalControls
						userData={userData}
						accessTo={accessTo}
					/>
				)}
		</>
	);
};

const AdditionalControls = ({
	userData,
	accessTo,
}: AdditionalControls_type) => {
	const [users, setUsers] = useState<User_type[]>();
	const [projects, setProjects] = useState<Project_type[]>([]);
	const [feedbackQuestions, setFeedbackQuestions] = useState<
		FeedbackQuestion_type[]
	>([]);

	const getAllUsers = () => {
		axios
			.get(GET_ALL_USERS_ROUTE, {
				headers: {
					auth: `${userData.role} ${sessionStorage.getItem("jwt")}`,
				},
			})
			.then((res) => {
				if (res.status === 200) {
					setUsers(res.data.users as User_type[]);
				} else {
					console.log(res.data.err);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getAllProjects = () => {
		axios
			.get(GET_ALL_PROJECTS_ROUTE, {
				headers: {
					auth: `${userData.role} ${sessionStorage.getItem("jwt")}`,
				},
			})
			.then((res) => {
				if (res.status === 200) {
					setProjects(res.data.projects as Project_type[]);
				} else {
					console.log(res.data.err);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getAllFeedbackQuestions = () => {
		axios
			.get(GET_ALL_FEEDBACK_QUESTIONS_ROUTE, {
				headers: {
					auth: `${userData.role} ${sessionStorage.getItem("jwt")}`,
				},
			})
			.then((res) => {
				if (res.status === 200) {
					setFeedbackQuestions(
						res.data.feedbackQuestions as FeedbackQuestion_type[]
					);
				} else {
					console.log(res.data.err);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getAllUsers();
		getAllProjects();
		getAllFeedbackQuestions();
	}, [userData]);

	return (
		<Container containerHeading="Additional Controls" headerType="l2">
			{accessTo.includes("REGISTER_USER") && (
				<CreateUserModule
					userData={userData}
					getAllUsers={getAllUsers}
				/>
			)}
			{accessTo.includes("SEE_USERS") && (
				<ShowAllUsersModule users={users} />
			)}
			{accessTo.includes("CREATE_PROJECTS") && (
				<AddProjectModule
					userData={userData}
					getAllProjects={getAllProjects}
					getAllFeedbackQuestions={getAllFeedbackQuestions}
				/>
			)}
			{accessTo.includes("ASSIGN_USER_TO_PROJECTS") && (
				<AssignProjectsModule
					userData={userData}
					users={users}
					projects={projects}
					getAllProjects={getAllProjects}
					getAllUsers={getAllUsers}
				/>
			)}
			{accessTo.includes("SEE_PROJECTS") &&
				accessTo.includes("SEE_USERS") && (
					<ShowAllProjectsAndUsers
						users={users}
						projects={projects}
					/>
				)}
			{accessTo.includes("CREATE_QUESTIONS") && (
				<AddFeedbackQuestionsModule
					userData={userData}
					projects={projects}
					getAllProjects={getAllProjects}
					getAllFeedbackQuestions={getAllFeedbackQuestions}
				/>
			)}
			{accessTo?.includes("SEE_QUESTIONS") &&
				accessTo?.includes("SEE_PROJECTS") && (
					<ShowAllProjectsAndFeedbackQuestionsModule
						projects={projects}
						feedbackQuestions={feedbackQuestions}
					/>
				)}
			{accessTo?.includes("USER_ACCESS_CONTROL") && <UserAccessControl />}
		</Container>
	);
};

const CreateUserModule = ({
	userData,
	getAllUsers,
}: DashboardAdditionalControls_subtype) => {
	const [newUserName, setNewUserName] = useState<string>("");
	const [newUserEmail, setNewUserEmail] = useState<string>("");
	const [newUserPass, setNewUserPass] = useState<string>(DEFAULT_PASSWORD);
	const [newUserRole, setNewUserRole] = useState<string>("");

	const [addUserInfoText, addUserInfoSetter] = useState<string>("");
	const setAddUserInfoText = (text: string) =>
		addUserInfoSetter(`${text}~${Math.random()}`);
	const [isAddUserInfoError, setAddUserInfoError] = useState<boolean>(true);

	const onAddUserClicked = () => {
		axios
			.post(
				REGISTER_ROUTE,
				{
					name: newUserName,
					email: newUserEmail,
					pass: newUserPass,
					created_by: userData?.email,
					role: newUserRole,
				},
				{
					headers: {
						auth: `${userData?.role} ${sessionStorage.getItem(
							"jwt"
						)}`,
					},
				}
			)
			.then((res) => {
				if (res.status === 200) {
					setAddUserInfoText(res.data.msg);
					setAddUserInfoError(false);
				} else {
					setAddUserInfoText(res.data.err);
					setAddUserInfoError(true);
				}

				getAllUsers && getAllUsers();
			})
			.catch((err) => {
				setAddUserInfoText(err.code);
				setAddUserInfoError(true);
			});
	};

	return (
		<ContainerForm
			containerHeading="Create User"
			headerType="l3"
			onSubmit={(e) => {
				e.preventDefault();
				onAddUserClicked();
			}}
		>
			<Input
				type="text"
				name="name"
				id="name"
				placeholder="Name"
				onChange={(e) => setNewUserName(e.target.value)}
				value={newUserName}
				label="Name"
				bulged
			/>
			<Input
				type="email"
				name="email"
				id="email"
				placeholder="Email"
				onChange={(e) => setNewUserEmail(e.target.value)}
				value={newUserEmail}
				label="Email"
				bulged
			/>
			<Input
				type="password"
				name="pass"
				id="pass"
				placeholder="Password"
				onChange={(e) => setNewUserPass(e.target.value)}
				value={newUserPass}
				label="Password"
				bulged
			/>
			<Select
				name="role"
				id="role"
				value={newUserRole}
				onChange={(e) => setNewUserRole(e.target.value)}
				label="Role"
				bulged
			>
				{ROLES.map((role, index) => (
					<option key={index} value={role} className="capitalize">
						{role}
					</option>
				))}
			</Select>
			<Button type="submit" bulged>
				Create
			</Button>
			<InfoDisplay
				isError={isAddUserInfoError}
				infoText={addUserInfoText}
				className="-mt-12"
			/>
		</ContainerForm>
	);
};

const ShowAllUsersModule = ({ users }: DashboardAdditionalControls_subtype) => {
	const [search, setSearch] = useState<string>("");

	return (
		<Container containerHeading="All Users" headerType="l3" bulged>
			<Input
				type="search"
				id="search"
				placeholder="Search..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<Table className="h-96">
				<TableHead>
					<TableHeader>Name</TableHeader>
					<TableHeader>Email</TableHeader>
					<TableHeader>Role</TableHeader>
				</TableHead>
				<TableBody>
					{users?.map(
						(user, index) =>
							(user.name.includes(search) ||
								user.email.includes(search) ||
								user.role.includes(search)) && (
								<TableRow key={index}>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.role}</TableCell>
								</TableRow>
							)
					)}
				</TableBody>
			</Table>
		</Container>
	);
};

const AddProjectModule = ({
	userData,
	getAllProjects,
	getAllFeedbackQuestions,
}: DashboardAdditionalControls_subtype) => {
	const [projectToAdd, setProjectToAdd] = useState<string>("");

	const [projectInfoText, projectInfoSetter] = useState<string>("");
	const setProjectInfoText = (text: string) =>
		projectInfoSetter(`${text}~${Math.random()}`);
	const [isProjectInfoError, setProjectInfoError] = useState<boolean>(true);

	const onAddProjectClicked = () => {
		axios
			.post(
				ADD_PROJECT_ROUTE,
				{
					project_name: projectToAdd,
				},
				{
					headers: {
						auth: `${userData?.role} ${sessionStorage.getItem(
							"jwt"
						)}`,
					},
				}
			)
			.then((res) => {
				if (res.status === 200) {
					setProjectInfoText(res.data.msg);
					setProjectInfoError(false);
				} else {
					setProjectInfoText(res.data.err);
					setProjectInfoError(true);
				}

				getAllProjects && getAllProjects();
				getAllFeedbackQuestions && getAllFeedbackQuestions();
			})
			.catch((err) => {
				setProjectInfoText(err.code);
				setProjectInfoError(true);
			});
	};

	return (
		<ContainerForm
			containerHeading="Add Project"
			headerType="l3"
			onSubmit={(e) => {
				e.preventDefault();
				onAddProjectClicked();
			}}
		>
			<Input
				type="text"
				name="project"
				id="project"
				placeholder="Project Name"
				onChange={(e) => setProjectToAdd(e.target.value)}
				value={projectToAdd}
				label="Project Name"
				bulged
			/>
			<Button bulged type="submit">
				Add Project
			</Button>
			<InfoDisplay
				isError={isProjectInfoError}
				infoText={projectInfoText}
				className="-mt-12"
			/>
		</ContainerForm>
	);
};

const AssignProjectsModule = ({
	userData,
	users,
	projects,
	getAllProjects,
	getAllUsers,
}: DashboardAdditionalControls_subtype) => {
	const [
		projectSelectedForAssignmentToUser,
		setProjectSelectedForAssignmentToUser,
	] = useState<string>("");
	const [userToAssign, setuserToAssign] = useState<string>("");

	const [assignInfoText, assignInfoSetter] = useState<string>("");
	const setAssignInfoText = (text: string) =>
		assignInfoSetter(`${text}~${Math.random()}`);
	const [isAssignInfoError, setAssignInfoError] = useState<boolean>(true);

	const onAssignToProjectClicked = () => {
		axios
			.post(
				ASSIGN_USER_TO_PROJECT_ROUTE,
				{
					project_name: projectSelectedForAssignmentToUser,
					user_email: userToAssign,
				},
				{
					headers: {
						auth: `${userData?.role} ${sessionStorage.getItem(
							"jwt"
						)}`,
					},
				}
			)
			.then((res) => {
				if (res.status === 200) {
					setAssignInfoText(res.data.msg);
					setAssignInfoError(false);
				} else {
					setAssignInfoText(res.data.err);
					setAssignInfoError(true);
				}

				getAllProjects && getAllProjects();
				getAllUsers && getAllUsers();
			})
			.catch((err) => {
				setAssignInfoText(err.code);
				setAssignInfoError(true);
			});
	};

	return (
		<ContainerForm
			containerHeading="Assign Projects"
			headerType="l3"
			onSubmit={(e) => {
				e.preventDefault();
				onAssignToProjectClicked();
			}}
		>
			<Select
				name="project"
				id="project"
				value={projectSelectedForAssignmentToUser}
				onChange={(e) =>
					setProjectSelectedForAssignmentToUser(e.target.value)
				}
				label="Project"
				bulged
			>
				{projects?.map((project, index) => (
					<option
						key={index}
						value={project.name}
						className="capitalize"
					>
						{project.name}
					</option>
				))}
			</Select>
			{/* <Input
				type="email"
				name="user"
				id="user"
				placeholder="User Email"
				onChange={(e) => setuserToAssign(e.target.value)}
				value={userToAssign}
				label="Email"
				bulged
			/> */}
			<Select
				id="user"
				placeholder="Select..."
				onChange={(e) => setuserToAssign(e.target.value)}
				value={userToAssign}
				label="Email"
				bulged
			>
				{users?.map((user, index) => (
					<option
						className="normal-case"
						key={index}
						value={user.email}
					>
						{user.email}
					</option>
				))}
			</Select>
			<Button bulged type="submit">
				Assign User To Project
			</Button>
			<InfoDisplay
				isError={isAssignInfoError}
				infoText={assignInfoText}
				className="-mt-12"
			/>
		</ContainerForm>
	);
};

const ShowAllProjectsAndUsers = ({
	users,
	projects,
}: DashboardAdditionalControls_subtype) => {
	const [searchForAllProjects, setSearchForAllProjects] =
		useState<string>("");

	return (
		<Container containerHeading="All Projects" headerType="l3" bulged>
			<Input
				type="search"
				id="search"
				placeholder="Search..."
				value={searchForAllProjects}
				onChange={(e) => setSearchForAllProjects(e.target.value)}
			/>

			<Table className="h-96">
				<TableHead>
					<TableHeader>Project</TableHeader>
					<TableHeader>Users</TableHeader>
				</TableHead>
				<TableBody>
					{users &&
						projects?.map(
							(project) =>
								project.name.includes(searchForAllProjects) &&
								users
									.filter((user) =>
										project.users.includes(user.email)
									)
									.map((user) => user.email)
									.map((it, i, arr) => (
										<TableRow key={i}>
											{i === 0 && (
												<TableCell rowSpan={arr.length}>
													{project.name}
												</TableCell>
											)}
											<TableCell>{it}</TableCell>
										</TableRow>
									))
						)}
				</TableBody>
			</Table>
		</Container>
	);
};

const AddFeedbackQuestionsModule = ({
	userData,
	projects,
	getAllProjects,
	getAllFeedbackQuestions,
}: DashboardAdditionalControls_subtype) => {
	const [
		projectSelectedForFeedbackQuestion,
		setProjectSelectedForFeedbackQuestion,
	] = useState<string>("");
	const [feedbackQuestion, setFeedbackQuestion] = useState<string>("");

	const [feedbackInfoText, feedbackInfoSetter] = useState<string>("");
	const setFeedbackInfoText = (text: string) =>
		feedbackInfoSetter(`${text}~${Math.random()}`);
	const [isFeedbackInfoError, setFeedbackInfoError] = useState<boolean>(true);

	const onAddFeedbackQuestionClicked = () => {
		axios
			.post(
				ADD_FEEDBACK_QUESTION_ROUTE,
				{
					project_name: projectSelectedForFeedbackQuestion,
					question: feedbackQuestion,
				},
				{
					headers: {
						auth: `${userData?.role} ${sessionStorage.getItem(
							"jwt"
						)}`,
					},
				}
			)
			.then((res) => {
				if (res.status === 200) {
					setFeedbackInfoText(res.data.msg);
					setFeedbackInfoError(false);
				} else {
					setFeedbackInfoText(res.data.err);
					setFeedbackInfoError(true);
				}

				getAllProjects && getAllProjects();
				getAllFeedbackQuestions && getAllFeedbackQuestions();
			})
			.catch((err) => {
				setFeedbackInfoText(err.code);
				setFeedbackInfoError(true);
			});
	};

	return (
		<ContainerForm
			containerHeading="Add Feedback Question"
			headerType="l3"
			onSubmit={(e) => {
				e.preventDefault();
				onAddFeedbackQuestionClicked();
			}}
		>
			<Select
				name="project"
				id="project"
				value={projectSelectedForFeedbackQuestion}
				onChange={(e) =>
					setProjectSelectedForFeedbackQuestion(e.target.value)
				}
				label="Project"
				bulged
			>
				{projects?.map((project, index) => (
					<option
						key={index}
						value={project.name}
						className="capitalize"
					>
						{project.name}
					</option>
				))}
			</Select>
			<Input
				type="text"
				name="question"
				id="question"
				placeholder="Question"
				onChange={(e) => setFeedbackQuestion(e.target.value)}
				value={feedbackQuestion}
				label="Question"
				bulged
			/>
			<Button bulged type="submit">
				Add Feedback Question
			</Button>
			<InfoDisplay
				isError={isFeedbackInfoError}
				infoText={feedbackInfoText}
				className="-mt-12"
			/>
		</ContainerForm>
	);
};

const ShowAllProjectsAndFeedbackQuestionsModule = ({
	projects,
	feedbackQuestions,
}: DashboardAdditionalControls_subtype) => {
	const [searchForAllFeedbackQuestions, setSearchForAllFeedbackQuestions] =
		useState<string>("");
	return (
		<Container
			containerHeading="All Feedback Questions"
			headerType="l3"
			bulged
		>
			<Input
				type="search"
				id="search"
				placeholder="Search..."
				value={searchForAllFeedbackQuestions}
				onChange={(e) =>
					setSearchForAllFeedbackQuestions(e.target.value)
				}
			/>

			<Table className="h-96">
				<TableHead>
					<TableHeader>Project</TableHeader>
					<TableHeader>Questions</TableHeader>
				</TableHead>
				<TableBody>
					{feedbackQuestions &&
						projects?.map(
							(project) =>
								project.name.includes(
									searchForAllFeedbackQuestions
								) &&
								feedbackQuestions
									.filter((item) =>
										project.question_ids.includes(item._id)
									)
									.map((item) => item.question)
									.map((it, i, arr) => (
										<TableRow key={i}>
											{i === 0 && (
												<TableCell rowSpan={arr.length}>
													{project.name}
												</TableCell>
											)}
											<TableCell>{it}</TableCell>
										</TableRow>
									))
						)}
				</TableBody>
			</Table>
		</Container>
	);
};

const UserAccessControl = () => {
	return (
		<Container containerHeading="Access Control" headerType="l3">
			{ROLES.map((role, index) => (
				<span key={index} className="capitalize">
					{role}
				</span>
			))}
		</Container>
	);
};

export default Dashboard;