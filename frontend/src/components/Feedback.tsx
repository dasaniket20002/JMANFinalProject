import { useContext, useEffect, useRef, useState } from "react";
import {
	FeedbackQuestion_type,
	Project_type,
	ProjectFeedbackAnswer_type,
	User_type,
} from "../ts/Types";
import Container from "./misc/Container";
import ContainerForm from "./misc/ContainerForm";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
	SIGNOUT,
	GET_OWN_PROJECTS_ROUTE,
	GET_OWN_FEEDBACK_QUESTIONS_ROUTE,
	FEEDBACK_UPLOAD_ROUTE,
	FEEDBACK_GET_OWN_ROUTE,
	GET_ALL_USERS_ROUTE,
	FEEDBACK_GET_USER_ROUTE,
} from "../ts/Consts";
import Radio from "./misc/Radio";
import Input from "./misc/Input";
import Button from "./misc/Button";
import InfoDisplay from "./misc/InfoDisplay";
import { AuthenticationContext } from "./AuthenticationProvider";
import {
	getDateStr,
	getFirstDayOfWeek,
	getlastDayOfWeek,
} from "../ts/DateControls";
import Select from "./misc/Select";

const Feedback = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const dateStart =
		location.state && location.state.dateStart
			? location.state.dateStart
			: getDateStr(getFirstDayOfWeek());
	const dateEnd =
		location.state && location.state.dateEnd
			? location.state.dateEnd
			: getDateStr(getlastDayOfWeek());

	const { userData, accessTo, JWT, isAuthenticating } = useContext(
		AuthenticationContext
	);

	useEffect(() => {
		if (isAuthenticating) return;
		if (!JWT) {
			navigate(`/${SIGNOUT}`);
		}
	}, [JWT, isAuthenticating]);

	const [projects, setProjects] = useState<Project_type[]>([]);
	const getOwnProjects = () => {
		if (!userData) return;
		axios
			.get(GET_OWN_PROJECTS_ROUTE, {
				headers: {
					auth: `${userData?.role} ${JWT}`,
				},
			})
			.then((res) => {
				if (res.status === 200) {
					setProjects(res.data.projects);
				} else {
					console.log(res.data.err);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const [feedbackQuestions, setFeedbackQuestions] = useState<
		FeedbackQuestion_type[]
	>([]);
	const getOwnFeedbackQuestions = () => {
		if (!userData) return;
		axios
			.get(GET_OWN_FEEDBACK_QUESTIONS_ROUTE, {
				headers: {
					auth: `${userData?.role} ${JWT}`,
				},
			})
			.then((res) => {
				if (res.status === 200) {
					setFeedbackQuestions(res.data.feedbackQuestions);
				} else {
					console.log(res.data.err);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const [projectFeedbackAnswers, setProjectFeedbackAnswers] = useState<
		ProjectFeedbackAnswer_type[]
	>([]);

	const setCheckedAnswerForProject = (
		projectIndex: number,
		feedbackQuestionIndex: number
	) => {
		return (value: string) => {
			var projectFeedbackAnswersM = [...projectFeedbackAnswers];
			projectFeedbackAnswersM[projectIndex].checkedAnswers[
				feedbackQuestionIndex
			] = value;
			setProjectFeedbackAnswers(projectFeedbackAnswersM);
		};
	};
	const setTextAnswerForProject = (
		projectIndex: number,
		feedbackQuestionIndex: number,
		value: string
	) => {
		var projectFeedbackAnswersM = [...projectFeedbackAnswers];
		projectFeedbackAnswersM[projectIndex].textAnswers[
			feedbackQuestionIndex
		] = value;
		setProjectFeedbackAnswers(projectFeedbackAnswersM);
	};

	const recieveOwnFeedbackFromDB = (
		projectFeedbackAnswersM: ProjectFeedbackAnswer_type[]
	) => {
		axios
			.post(
				FEEDBACK_GET_OWN_ROUTE,
				{ dateStart, dateEnd },
				{
					headers: {
						auth: `${userData?.role} ${JWT}`,
					},
				}
			)
			.then((res) => {
				if (res.status === 200) {
					const projectFeedbackAnswersFetched = res.data.feedback
						.projectFeedbackAnswers as ProjectFeedbackAnswer_type[];

					projectFeedbackAnswersM.forEach((projectFeedbackAnswer) => {
						projectFeedbackAnswersFetched.forEach(
							(projectFeedbackAnswerFetched) => {
								if (
									projectFeedbackAnswer.projectName ===
									projectFeedbackAnswerFetched.projectName
								) {
									projectFeedbackAnswer.feedbackQuestions.forEach(
										(feedbackQuestion) => {
											projectFeedbackAnswerFetched.feedbackQuestions.forEach(
												(feedbackQuestionFetched) => {
													if (
														feedbackQuestion ===
														feedbackQuestionFetched
													) {
														projectFeedbackAnswer.checkedAnswers =
															projectFeedbackAnswerFetched.checkedAnswers;
														projectFeedbackAnswer.textAnswers =
															projectFeedbackAnswerFetched.textAnswers;
													}
												}
											);
										}
									);
								}
							}
						);
					});
				}
				setProjectFeedbackAnswers(projectFeedbackAnswersM);
			})
			.catch((_) => {});
	};

	const getDefaultProjectFeedbackAnswers = () => {
		var defaultProjectFeedbackAnswer = projects.map((project) => ({
			projectName: project.name,
			feedbackQuestions: feedbackQuestions
				.filter((feedbackQuestion) =>
					project.question_ids.includes(feedbackQuestion._id)
				)
				.map((feedbackQuestion) => feedbackQuestion.question),
			checkedAnswers: Array.from(
				{ length: project.question_ids.length },
				() => "" as string
			),
			textAnswers: Array.from(
				{ length: project.question_ids.length },
				() => "" as string
			),
		}));
		recieveOwnFeedbackFromDB(defaultProjectFeedbackAnswer);
	};

	const [infoText, infoSetter] = useState<string>("");
	const setInfoText = (text: string) =>
		infoSetter(`${text}~${Math.random()}`);
	const [isInfoError, setInfoError] = useState<boolean>(true);
	const feedbackUploadButtonRef = useRef<HTMLButtonElement>(null);

	const onFeedbackFormSubmit = () => {
		setInfoText("Loading...");
		setInfoError(false);
		if (feedbackUploadButtonRef.current)
			feedbackUploadButtonRef.current.disabled = true;

		axios
			.post(
				FEEDBACK_UPLOAD_ROUTE,
				{
					dateStart,
					dateEnd,
					projectFeedbackAnswers,
				},
				{
					headers: {
						auth: `${userData?.role} ${JWT}`,
					},
				}
			)
			.then((res) => {
				if (res.status === 200) {
					setInfoText(res.data.msg);
					setInfoError(false);
				} else {
					setInfoText(res.data.err);
					setInfoError(true);
				}
				if (feedbackUploadButtonRef.current)
					feedbackUploadButtonRef.current.disabled = false;
			})
			.catch((err) => {
				console.log(err);
				setInfoText(err.code);
				setInfoError(true);
				if (feedbackUploadButtonRef.current)
					feedbackUploadButtonRef.current.disabled = false;
			});
	};

	const [search, setSearch] = useState<string>("");

	useEffect(() => {
		getOwnProjects();
		getOwnFeedbackQuestions();
	}, [accessTo]);

	useEffect(() => {
		getDefaultProjectFeedbackAnswers();
	}, [projects, feedbackQuestions]);

	return (
		<>
			<Container containerHeading="Feedback" headerType="l1" />
			<ContainerForm
				containerHeading={
					<>
						<section className="font-medium text-3xl">
							Projects and Questions
						</section>
						<section className="font-normal text-xl pt-5">{`${dateStart} - ${dateEnd}`}</section>
					</>
				}
				headerType="l2"
				className="py-6"
				onSubmit={(e) => {
					e.preventDefault();
					onFeedbackFormSubmit();
				}}
			>
				<Input
					type="search"
					id="search"
					placeholder="Search..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					label="Search Projects"
					bulged
				/>
				{projectFeedbackAnswers
					.filter((project) =>
						project.projectName.toLowerCase().includes(search)
					)
					.map((project, projectIndex) => (
						<Container
							key={projectIndex}
							containerHeading={
								<section>
									<h2 className="text-xl">Feedback for:</h2>
									<h1 className="text-3xl font-medium">
										{project.projectName}
									</h1>
								</section>
							}
							headerType="l3"
						>
							{project.feedbackQuestions.map(
								(feedbackQuestion, feedbackQuestionIndex) => (
									<section
										key={feedbackQuestionIndex}
										className="flex flex-col gap-4"
									>
										<span className="text-xl font-medium">
											{feedbackQuestion}
										</span>
										<Radio
											options={["1", "2", "3", "4", "5"]}
											onChange={setCheckedAnswerForProject(
												projectIndex,
												feedbackQuestionIndex
											)}
											value={
												projectFeedbackAnswers[
													projectIndex
												] &&
												projectFeedbackAnswers[
													projectIndex
												].checkedAnswers[
													feedbackQuestionIndex
												]
													? projectFeedbackAnswers[
															projectIndex
													  ].checkedAnswers[
															feedbackQuestionIndex
													  ]
													: ""
											}
											name={
												(feedbackQuestion && project
													? feedbackQuestion +
													  project.projectName
													: "") + "Radio"
											}
											id={
												(feedbackQuestion && project
													? feedbackQuestion +
													  project.projectName
													: "") + "Radio"
											}
											label="Give Rating"
											className="rounded bg-gray-100 px-2 py-4 shadow-md"
											bulged
										/>
										<Input
											onChange={(e) => {
												setTextAnswerForProject(
													projectIndex,
													feedbackQuestionIndex,
													e.target.value
												);
											}}
											value={
												projectFeedbackAnswers[
													projectIndex
												] &&
												projectFeedbackAnswers[
													projectIndex
												].textAnswers[
													feedbackQuestionIndex
												]
													? projectFeedbackAnswers[
															projectIndex
													  ].textAnswers[
															feedbackQuestionIndex
													  ]
													: ""
											}
											name={
												(feedbackQuestion && project
													? feedbackQuestion +
													  project.projectName
													: "") + "Input"
											}
											id={
												(feedbackQuestion && project
													? feedbackQuestion +
													  project.projectName
													: "") + "Input"
											}
											type="text"
											placeholder="Feedback..."
											label="Additional Feedback"
											bulged
										/>
									</section>
								)
							)}
						</Container>
					))}

				<Button type="submit" bulged ref={feedbackUploadButtonRef}>
					Submit Feedback
				</Button>
				<InfoDisplay
					isError={isInfoError}
					infoText={infoText}
					className="-my-6"
				/>
			</ContainerForm>

			{userData &&
				accessTo &&
				accessTo.some((access) =>
					["SEE_USERS", "FEEDBACK_ALL"].includes(access)
				) && <AdditionalControls />}
		</>
	);
};

const AdditionalControls = () => {
	const { userData, JWT, accessTo } = useContext(AuthenticationContext);

	const [users, setUsers] = useState<User_type[]>([]);
	const getAllUsers = () => {
		axios
			.get(GET_ALL_USERS_ROUTE, {
				headers: {
					auth: `${userData?.role} ${JWT}`,
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

	const [projects, setProjects] = useState<Project_type[]>([]);
	const getOwnProjects = () => {
		if (!userData) return;
		axios
			.get(GET_OWN_PROJECTS_ROUTE, {
				headers: {
					auth: `${userData?.role} ${JWT}`,
				},
			})
			.then((res) => {
				if (res.status === 200) {
					setProjects(res.data.projects);
				} else {
					console.log(res.data.err);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const [feedbackQuestions, setFeedbackQuestions] = useState<
		FeedbackQuestion_type[]
	>([]);
	const getOwnFeedbackQuestions = () => {
		if (!userData) return;
		axios
			.get(GET_OWN_FEEDBACK_QUESTIONS_ROUTE, {
				headers: {
					auth: `${userData?.role} ${JWT}`,
				},
			})
			.then((res) => {
				if (res.status === 200) {
					setFeedbackQuestions(res.data.feedbackQuestions);
				} else {
					console.log(res.data.err);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const [dateStart, setDateStart] = useState(getFirstDayOfWeek());
	const [dateEnd, setDateEnd] = useState(getlastDayOfWeek());

	const increaseDatesHandle = () => {
		let dateStartM = dateStart;
		setDateStart(dateStartM.add(7, "day"));
		let dateEndM = dateEnd;
		setDateEnd(dateEndM.add(7, "day"));
	};
	const decreaseDatesHandle = () => {
		let dateStartM = dateStart;
		setDateStart(dateStartM.subtract(7, "day"));
		let dateEndM = dateEnd;
		setDateEnd(dateEndM.subtract(7, "day"));
	};

	const [projectFeedbackAnswers, setProjectFeedbackAnswers] = useState<
		ProjectFeedbackAnswer_type[]
	>([]);

	const recieveUserFeedbackFromDB = (
		projectFeedbackAnswersM: ProjectFeedbackAnswer_type[]
	) => {
		axios
			.post(
				FEEDBACK_GET_USER_ROUTE,
				{
					dateStart: getDateStr(dateStart),
					dateEnd: getDateStr(dateEnd),
					email: selectedUser,
				},
				{
					headers: {
						auth: `${userData?.role} ${JWT}`,
					},
				}
			)
			.then((res) => {
				if (res.status === 200) {
					const projectFeedbackAnswersFetched = res.data.feedback
						.projectFeedbackAnswers as ProjectFeedbackAnswer_type[];

					projectFeedbackAnswersM.forEach((projectFeedbackAnswer) => {
						projectFeedbackAnswersFetched.forEach(
							(projectFeedbackAnswerFetched) => {
								if (
									projectFeedbackAnswer.projectName ===
									projectFeedbackAnswerFetched.projectName
								) {
									projectFeedbackAnswer.feedbackQuestions.forEach(
										(feedbackQuestion) => {
											projectFeedbackAnswerFetched.feedbackQuestions.forEach(
												(feedbackQuestionFetched) => {
													if (
														feedbackQuestion ===
														feedbackQuestionFetched
													) {
														projectFeedbackAnswer.checkedAnswers =
															projectFeedbackAnswerFetched.checkedAnswers;
														projectFeedbackAnswer.textAnswers =
															projectFeedbackAnswerFetched.textAnswers;
													}
												}
											);
										}
									);
								}
							}
						);
					});
					setProjectFeedbackAnswers(projectFeedbackAnswersM);
				} else {
					setProjectFeedbackAnswers([]);
				}
			})
			.catch((_) => {});
	};

	const onUserSelected = () => {
		var defaultProjectFeedbackAnswer = projects.map((project) => ({
			projectName: project.name,
			feedbackQuestions: feedbackQuestions
				.filter((feedbackQuestion) =>
					project.question_ids.includes(feedbackQuestion._id)
				)
				.map((feedbackQuestion) => feedbackQuestion.question),
			checkedAnswers: Array.from(
				{ length: project.question_ids.length },
				() => "" as string
			),
			textAnswers: Array.from(
				{ length: project.question_ids.length },
				() => "" as string
			),
		}));
		recieveUserFeedbackFromDB(defaultProjectFeedbackAnswer);
	};

	const [selectedUser, setSelectedUser] = useState<string>("");
	const [search, setSearch] = useState<string>("");

	useEffect(() => {
		getAllUsers();
		getOwnProjects();
		getOwnFeedbackQuestions();
	}, [accessTo]);

	useEffect(() => {
		onUserSelected();
	}, [selectedUser, dateStart, dateEnd]);

	return (
		<Container containerHeading="Additional Controls" headerType="l2">
			<Container containerHeading="Users' Feedbacks" headerType="l3">
				<Select
					id="userSelect"
					onChange={(e) => setSelectedUser(e.target.value)}
					value={selectedUser}
					label="Select User"
					bulged
					normalCase
				>
					{users.map((user, index) => (
						<option key={index} value={user.email}>
							{user.email}
						</option>
					))}
				</Select>

				{projectFeedbackAnswers.length > 0 ? (
					<>
						<section className="w-full flex justify-between mx-2">
							<p className="-mx-2">Select Dates: </p>
							<span className="flex items-center">
								<Button
									className="px-4 py-1 mr-8 shadow-md"
									onClick={(e) => {
										e.preventDefault();
										increaseDatesHandle();
									}}
								>
									{"<"}
								</Button>
								<p className="text-center outline-none rounded focus:border focus:border-gray-800">
									{getDateStr(dateStart)} -{" "}
									{getDateStr(dateEnd)}
								</p>
								<Button
									className="px-4 py-1 ml-8 shadow-md"
									onClick={(e) => {
										e.preventDefault();
										decreaseDatesHandle();
									}}
								>
									{">"}
								</Button>
							</span>
						</section>

						<Input
							type="search"
							id="search"
							placeholder="Search..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							label="Search Projects"
							bulged
						/>

						{projectFeedbackAnswers
							.filter((project) =>
								project.projectName
									.toLowerCase()
									.includes(search)
							)
							.map((project, projectIndex) => (
								<Container
									key={projectIndex}
									containerHeading={
										<section>
											<h2 className="text-xl">
												Feedback for:
											</h2>
											<h1 className="text-3xl font-medium">
												{project.projectName}
											</h1>
										</section>
									}
									headerType="l3"
								>
									{project.feedbackQuestions.map(
										(
											feedbackQuestion,
											feedbackQuestionIndex
										) => (
											<section
												key={feedbackQuestionIndex}
												className="flex flex-col gap-4"
											>
												<span className="text-xl font-medium">
													{feedbackQuestion}
												</span>
												<Radio
													options={[
														"1",
														"2",
														"3",
														"4",
														"5",
													]}
													value={
														projectFeedbackAnswers[
															projectIndex
														] &&
														projectFeedbackAnswers[
															projectIndex
														].checkedAnswers[
															feedbackQuestionIndex
														]
															? projectFeedbackAnswers[
																	projectIndex
															  ].checkedAnswers[
																	feedbackQuestionIndex
															  ]
															: ""
													}
													name={
														(feedbackQuestion &&
														project
															? feedbackQuestion +
															  project.projectName
															: "") + "Radio"
													}
													id={
														(feedbackQuestion &&
														project
															? feedbackQuestion +
															  project.projectName
															: "") + "Radio"
													}
													label="Give Rating"
													className="rounded bg-gray-100 px-2 py-4 shadow-md"
													bulged
													disabled
												/>
												<Input
													value={
														projectFeedbackAnswers[
															projectIndex
														] &&
														projectFeedbackAnswers[
															projectIndex
														].textAnswers[
															feedbackQuestionIndex
														]
															? projectFeedbackAnswers[
																	projectIndex
															  ].textAnswers[
																	feedbackQuestionIndex
															  ]
															: ""
													}
													name={
														(feedbackQuestion &&
														project
															? feedbackQuestion +
															  project.projectName
															: "") + "Input"
													}
													id={
														(feedbackQuestion &&
														project
															? feedbackQuestion +
															  project.projectName
															: "") + "Input"
													}
													type="text"
													placeholder="Feedback..."
													label="Additional Feedback"
													bulged
													disabled
												/>
											</section>
										)
									)}
								</Container>
							))}
					</>
				) : (
					<p className="text-red-500 text-2xl font-medium">
						{selectedUser === "" ? (
							<>Select User to Display</>
						) : (
							<>User has no Feedbacks</>
						)}
					</p>
				)}
			</Container>
		</Container>
	);
};

export default Feedback;
