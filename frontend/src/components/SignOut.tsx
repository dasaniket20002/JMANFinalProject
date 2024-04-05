import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROOT } from "../ts/Consts";
import Container from "./misc/Container";

const SignOut = () => {
  const navigate = useNavigate();
  useEffect(() => {
    sessionStorage.clear();
    navigate(`${ROOT}`);
  }, []);

  return <Container containerHeading="Signing Out..." headerType="l1" />;
};

export default SignOut;
