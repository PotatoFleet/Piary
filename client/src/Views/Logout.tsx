import { useNavigate } from "react-router-dom";
import { request } from "../Util/Constants";

const Logout: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();

  request.post("/logout").then(() => {
    navigate("/");
  });

  return <></>;
};

export default Logout;
