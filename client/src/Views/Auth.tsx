import { useState, useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Login } from "../Components/GoogleOAuth";
import { gapi } from "gapi-script";
import axios from "axios";

const clientID =
  "587877110685-cipbu5nn012o2gjti3v0ca17agn1ocha.apps.googleusercontent.com";

interface AuthProps {
  APIEndpoint: String;
}

const Auth: React.FC<AuthProps> = (props: AuthProps): React.ReactElement => {
  const [authType, setAuthType] = useState("Login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate: NavigateFunction = useNavigate();

  axios.get(`${props.APIEndpoint}/logged-in`).then((res) => {
    if (res.data.successful) {
      navigate("/personal");
    }
  });

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({
        clientId: clientID,
        scope: "",
      });
    });
  });

  return (
    <div className="auth-page full-page">
      <Login
        setErrorMessage={setErrorMessage}
        APIEndpoint={props.APIEndpoint}
      />
      {/* <Logout /> */}
      <div
        className={`${
          errorMessage.length === 0 ? "hidden-message" : ""
        } auth-error`}
      >
        {errorMessage}
      </div>
      <form
        method="post"
        id="auth-form"
        className="auth-form"
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          if (authType === "Register") {
            if (password !== confirmPassword) {
              setErrorMessage("Password do not match");
              return;
            }
            axios
              .post(`${props.APIEndpoint}/register`, {
                username: username,
                email: email,
                password: password,
              })
              .then((res) => {
                if (!res.data.successful) {
                  setErrorMessage(res.data.message);
                  return;
                }
                navigate("/");
              });
          } else {
            axios
              .post(`${props.APIEndpoint}/login`, {
                username: username,
                password: password,
              })
              .then((res) => {
                if (!res.data.successful) {
                  setErrorMessage(res.data.message);
                  return;
                }
                navigate("/");
              });
          }
        }}
      >
        <h1 className="auth-form__heading">
          {authType === "Login" ? "Login" : "Register"}
        </h1>
        <div
          className={`${
            authType === "Login" ? "login" : "register"
          } auth-type-toggle`}
          onClick={(e) =>
            setAuthType(authType === "Login" ? "Register" : "Login")
          }
        >
          <div
            className={`${
              authType === "Login" ? "active" : ""
            } auth-type-toggle__login`}
          >
            Login
          </div>
          <div
            className={`${
              authType === "Register" ? "active" : ""
            } auth-type-toggle__register`}
          >
            Register
          </div>
        </div>
        <div className="auth-form__main">
          <input
            type="text"
            name="username"
            placeholder={
              authType === "Login" ? "Username or Email" : "Username"
            }
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className={authType === "Login" ? "hidden-input" : ""}
            type="text"
            name="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required={authType === "Login" ? false : true}
            tabIndex={authType === "Login" ? -1 : 0}
          />
          <input
            className={authType === "Login" ? "translate-input" : ""}
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className={authType === "Login" ? "hidden-input" : ""}
            name="confirm-password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={authType === "Login" ? false : true}
            tabIndex={authType === "Login" ? -1 : 0}
          />
          <button type="submit" className="auth-form__submit" id="login-btn">
            {authType}
          </button>
        </div>
      </form>
      <div className="background">{/*TODO: Bubble background*/}</div>
    </div>
  );
};

export default Auth;
