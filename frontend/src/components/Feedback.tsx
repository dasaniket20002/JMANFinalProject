import { useEffect, useState } from "react";
import {
  FeedbackQuestion_type,
  jwt_decoded_response,
  Project_type,
} from "../ts/Types";
import Container from "./misc/Container";
import ContainerForm from "./misc/ContainerForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  DECODE_JWT_ROUTE,
  SIGNOUT,
  GET_PERMISSIONS,
  GET_OWN_PROJECTS_ROUTE,
  GET_OWN_FEEDBACK_QUESTIONS_ROUTE,
} from "../ts/Consts";
import Radio from "./misc/Radio";
import Input from "./misc/Input";
import Button from "./misc/Button";

const Feedback = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<jwt_decoded_response>();
  const getUserData = () => {
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

  const [accessTo, setAccessTo] = useState<string[]>([]);
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

  const [projects, setProjects] = useState<Project_type[]>([]);
  const getOwnProjects = () => {
    if (!userData) return;
    axios
      .get(GET_OWN_PROJECTS_ROUTE, {
        headers: {
          auth: `${userData.role} ${sessionStorage.getItem("jwt")}`,
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
          auth: `${userData.role} ${sessionStorage.getItem("jwt")}`,
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

  const [checkedAnswers, setCheckedAnswers] = useState<string[][]>([]);
  const setCheckedAnswersDefaultValue = () => {
    const checkedAnswersDefaultValue = Array.from(
      { length: projects.length },
      () => Array.from({ length: feedbackQuestions.length }, () => "" as string)
    );
    setCheckedAnswers(checkedAnswersDefaultValue);
  };
  const setCheckedAnswerForProject = (
    projectIndex: number,
    feedbackQuestionIndex: number
  ) => {
    return (value: string) => {
      let checkedAnswersM = [...checkedAnswers];
      checkedAnswersM[projectIndex][feedbackQuestionIndex] = value;
      setCheckedAnswers(checkedAnswersM);
    };
  };

  const [textAnswers, setTextAnswers] = useState<string[][]>([]);
  const setTextAnswersDefaultValue = () => {
    const textAnswerDefaultValue = Array.from({ length: projects.length }, () =>
      Array.from({ length: feedbackQuestions.length }, () => "" as string)
    );
    setTextAnswers(textAnswerDefaultValue);
  };
  const setTextAnswerForProject = (
    projectIndex: number,
    feedbackQuestionIndex: number,
    value: string
  ) => {
    let textAnswersM = [...textAnswers];
    textAnswersM[projectIndex][feedbackQuestionIndex] = value;
    setTextAnswers(textAnswersM);
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    getAccessTo();
  }, [userData]);

  useEffect(() => {
    getOwnProjects();
    getOwnFeedbackQuestions();
  }, [accessTo]);

  useEffect(() => {
    setCheckedAnswersDefaultValue();
    setTextAnswersDefaultValue();
  }, [projects, feedbackQuestions]);

  return (
    <>
      <Container containerHeading="Feedback" headerType="l1" />
      <ContainerForm
        containerHeading="Projects and Questions"
        headerType="l2"
        className="py-6"
      >
        {projects.map((project, projectIndex) => (
          <Container
            key={projectIndex}
            containerHeading={
              <section>
                <h2 className="text-xl">Feedback for:</h2>
                <h1 className="text-3xl font-medium">{project.name}</h1>
              </section>
            }
            headerType="l3"
          >
            {feedbackQuestions.map(
              (feedbackQuestion, feedbackQuestionIndex) =>
                project.question_ids.includes(feedbackQuestion._id) && (
                  <section
                    key={feedbackQuestionIndex}
                    className="flex flex-col gap-4"
                  >
                    <span className="text-xl font-medium">
                      {feedbackQuestion.question}
                    </span>
                    <Radio
                      options={["1", "2", "3", "4", "5"]}
                      onChange={setCheckedAnswerForProject(
                        projectIndex,
                        feedbackQuestionIndex
                      )}
                      value={
                        checkedAnswers.length > 0
                          ? checkedAnswers[projectIndex][feedbackQuestionIndex]
                          : undefined
                      }
                      label="Give Rating"
                      className="rounded bg-gray-100 px-2 py-4 shadow-md"
                      bulged
                    />
                    <Input
                      onChange={(e) =>
                        setTextAnswerForProject(
                          projectIndex,
                          feedbackQuestionIndex,
                          e.target.value
                        )
                      }
                      value={
                        textAnswers.length > 0
                          ? textAnswers[projectIndex][feedbackQuestionIndex]
                          : ""
                      }
                      type="text"
                      name={feedbackQuestion._id + project._id}
                      id={feedbackQuestion._id + project._id}
                      placeholder="Feedback..."
                      label="Additional Feedback"
                      bulged
                    />
                  </section>
                )
            )}
          </Container>
        ))}

        <Button type="submit" bulged>
          Submit Feedback
        </Button>
      </ContainerForm>
    </>
  );
};

export default Feedback;
