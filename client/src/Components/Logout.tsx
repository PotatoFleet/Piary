import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LogoutProps {
  APIEndpoint: String;
}

const Logout: React.FC<LogoutProps> = (
  props: LogoutProps
): React.ReactElement => {
  const navigate = useNavigate();

  axios.post(props.APIEndpoint + "/logout").then(() => {
    navigate("/");
  });

  return <></>;
};

export default Logout;
