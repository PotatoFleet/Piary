import axios from "axios";
import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface RequireLoginProps {
  APIEndpoint: String;
  element: React.ReactElement;
}

const RequireLogin: React.FC<RequireLoginProps> = (
  props: RequireLoginProps
): React.ReactElement => {
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    axios.get(`${props.APIEndpoint}/logged-in`).then((res) => {
      if (!res.data.successful) {
        navigate("/auth");
      }
    });
  });

  return <>{props.element}</>;
};

export default RequireLogin;
