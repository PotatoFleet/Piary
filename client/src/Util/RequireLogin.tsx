import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { request } from "./Constants";

interface RequireLoginProps {
  element: React.ReactElement;
}

const RequireLogin: React.FC<RequireLoginProps> = (
  props: RequireLoginProps
): React.ReactElement => {
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    request.get("/logged-in").then((res) => {
      if (!res.data.successful) {
        navigate("/auth");
      }
    });
  });

  return <>{props.element}</>;
};

export default RequireLogin;
