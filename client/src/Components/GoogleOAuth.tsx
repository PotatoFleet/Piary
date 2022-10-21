import {
  GoogleLogin,
  GoogleLogout,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";

const clientID =
  "587877110685-cipbu5nn012o2gjti3v0ca17agn1ocha.apps.googleusercontent.com";

export const Login: React.FC = (): React.ReactElement => {
  const Success = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log("SUCCESSFULLY TO LOGIN!");
    console.log(res);
  };

  const Fail = (res: any) => {
    console.log("FAILED TO LOGIN!");
    console.log(res);
  };

  return (
    <GoogleLogin
      clientId={clientID}
      buttonText="Login"
      onSuccess={Success}
      onFailure={Fail}
      isSignedIn={true}
    />
  );
};

export const Logout: React.FC = (): React.ReactElement => {
  const Success = () => {
    console.log("SUCCESSFULLY LOGGED OUT !");
  };

  return (
    <GoogleLogout
      clientId={clientID}
      buttonText="Logout"
      onLogoutSuccess={Success}
    />
  );
};
