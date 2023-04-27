import { useNavigate } from "react-router-dom";
import { request } from "../Util/Constants";

const Index: React.FC = (props): React.ReactElement => {
  const navigate = useNavigate();

  request.get("/logged-in").then((res) => {
    if (res.data.successful) navigate("/personal");
    else navigate("/auth");
  });

  return <></>;
};

export default Index;
