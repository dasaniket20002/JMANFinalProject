import { useRef, useState } from "react";
import InfoDisplay from "./misc/InfoDisplay";
import axios from "axios";
import { FORGOT_PASSWORD_ROUTE, ROOT } from "../ts/Consts";
import { Link } from "react-router-dom";
import Button from "./misc/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");

  const [infoDisplayText, infoSetter] = useState<string>("");
  const setInfoDisplayText = (text: string) =>
    infoSetter(`${text}~${Math.random()}`);
  const [isInfoError, setInfoError] = useState<boolean>(true);

  const sendLinkButtonRef = useRef<HTMLButtonElement>(null);

  const onSendLinkClicked = () => {
    setInfoDisplayText("Loading...");
    setInfoError(false);
    if (sendLinkButtonRef.current) sendLinkButtonRef.current.disabled = true;
    axios
      .post(FORGOT_PASSWORD_ROUTE, { email: email })
      .then((res) => {
        if (res.status === 200) {
          setInfoError(false);
          setInfoDisplayText(res.data.msg);
        } else {
          setInfoError(true);
          setInfoDisplayText(res.data.err);

          console.log(res.data);
        }

        if (sendLinkButtonRef.current)
          sendLinkButtonRef.current.disabled = false;
      })
      .catch((err) => {
        console.log(err);

        setInfoError(true);
        setInfoDisplayText(err.code);

        if (sendLinkButtonRef.current)
          sendLinkButtonRef.current.disabled = false;
      });
  };

  return (
    <div className="px-6 md:ml-72 md:px-16 2xl:px-64 flex flex-col">
      <header className="w-full py-6 font-semibold text-3xl">
        Forgot Password
      </header>

      <form
        className="flex flex-col gap-16 py-16"
        onSubmit={(e) => {
          e.preventDefault();
          onSendLinkClicked();
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

        <Button ref={sendLinkButtonRef} type="submit" bulged>
          Send Link
        </Button>
        <InfoDisplay
          isError={isInfoError}
          infoText={infoDisplayText}
          className="-mt-12"
        />
      </form>

      <Link
        to={ROOT}
        className="border border-gray-100 p-2 -mx-2 text-center rounded transition shadow-lg active:shadow-sm"
      >
        Cancel
      </Link>
    </div>
  );
};

export default ForgotPassword;