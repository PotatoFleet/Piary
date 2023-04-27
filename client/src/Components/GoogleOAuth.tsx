import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import gicon from "../static/img/googlelogo.png";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { request } from "../Util/Constants";

const clientID =
  "587877110685-cipbu5nn012o2gjti3v0ca17agn1ocha.apps.googleusercontent.com";

interface LoginProps {
  setErrorMessage: Function;
}

export const Login: React.FC<LoginProps> = (
  props: LoginProps
): React.ReactElement => {
  const navigate: NavigateFunction = useNavigate();

  const Success = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if (!("profileObj" in res)) return;
    request
      .post("/login", {
        username: res.profileObj.email,
        password: res.profileObj.googleId,
      })
      .then((response) => {
        if (!response.data.successful) {
          request
            .post("/register", {
              username: res.profileObj.name,
              email: res.profileObj.email,
              password: res.profileObj.googleId,
            })
            .then((response) => {
              if (!response.data.successful)
                props.setErrorMessage(response.data.message);
              else navigate("/");
            });
        } else navigate("/");
      });
  };

  const Fail = (res: any) => {
    console.log(res);
  };

  return (
    <GoogleLogin
      clientId={clientID}
      render={(renderProps) => {
        return (
          <div onClick={renderProps.onClick} className="google-login-btn">
            <img src={gicon} alt="google logo" width="25" />
            Sign in with Google
          </div>
        );
      }}
      buttonText="Login"
      onSuccess={Success}
      onFailure={Fail}
    />
  );
};

// export const Logout: React.FC = (): React.ReactElement => {
//   const Success = () => {
//     console.log("SUCCESSFULLY LOGGED OUT !");
//   };

//   return (
//     <GoogleLogout
//       clientId={clientID}
//       buttonText="Logout"
//       onLogoutSuccess={Success}
//     />
//   );
// };
