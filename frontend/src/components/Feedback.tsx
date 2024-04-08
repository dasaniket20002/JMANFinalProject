import { useContext, useEffect, useRef, useState } from "react";
import {
  FeedbackQuestion_type,
  Project_type,
  ProjectFeedbackAnswer_type,
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
    projectFeedbackAnswersM[projectIndex].textAnswers[feedbackQuestionIndex] =
      value;
    setProjectFeedbackAnswers(projectFeedbackAnswersM);
  };

  const recieveOwnFeedbackFromBackend = (
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
                          if (feedbackQuestion === feedbackQuestionFetched) {
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
    recieveOwnFeedbackFromBackend(defaultProjectFeedbackAnswer);
  };

  const [infoText, infoSetter] = useState<string>("");
  const setInfoText = (text: string) => infoSetter(`${text}~${Math.random()}`);
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
        containerHeading="Projects and Questions"
        headerType="l2"
        className="py-6"
        onSubmit={(e) => {
          e.preventDefault();
          onFeedbackFormSubmit();
        }}
      >
        {projectFeedbackAnswers.map((project, projectIndex) => (
          <Container
            key={projectIndex}
            containerHeading={
              <section>
                <h2 className="text-xl">Feedback for:</h2>
                <h1 className="text-3xl font-medium">{project.projectName}</h1>
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
                      projectFeedbackAnswers[projectIndex] &&
                      projectFeedbackAnswers[projectIndex].checkedAnswers[
                        feedbackQuestionIndex
                      ]
                        ? projectFeedbackAnswers[projectIndex].checkedAnswers[
                            feedbackQuestionIndex
                          ]
                        : ""
                    }
                    name={
                      (feedbackQuestion && project
                        ? feedbackQuestion + project.projectName
                        : "") + "Radio"
                    }
                    id={
                      (feedbackQuestion && project
                        ? feedbackQuestion + project.projectName
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
                      projectFeedbackAnswers[projectIndex] &&
                      projectFeedbackAnswers[projectIndex].textAnswers[
                        feedbackQuestionIndex
                      ]
                        ? projectFeedbackAnswers[projectIndex].textAnswers[
                            feedbackQuestionIndex
                          ]
                        : ""
                    }
                    name={
                      (feedbackQuestion && project
                        ? feedbackQuestion + project.projectName
                        : "") + "Input"
                    }
                    id={
                      (feedbackQuestion && project
                        ? feedbackQuestion + project.projectName
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
    </>
  );
};

export default Feedback;

{
  /*
<section key={idx} className="flex flex-col gap-4">
                    <span className="text-xl font-medium">
                      {feedbackQuestion.question}
                    </span>
                    <Radio
                      options={["1", "2", "3", "4", "5"]}
                      onChange={() => {}}
                      value={""}
                      name={
                        (feedbackQuestion && project
                          ? feedbackQuestion._id + project._id
                          : "") + "Radio"
                      }
                      id={
                        (feedbackQuestion && project
                          ? feedbackQuestion._id + project._id
                          : "") + "Radio"
                      }
                      label="Give Rating"
                      className="rounded bg-gray-100 px-2 py-4 shadow-md"
                      bulged
                    />
                    <Input
                      onChange={() => {}}
                      value={""}
                      name={
                        (feedbackQuestion && project
                          ? feedbackQuestion._id + project._id
                          : "") + "Input"
                      }
                      id={
                        (feedbackQuestion && project
                          ? feedbackQuestion._id + project._id
                          : "") + "Input"
                      }
                      type="text"
                      placeholder="Feedback..."
                      label="Additional Feedback"
                      bulged
                    />
                  </section>
*/
}
