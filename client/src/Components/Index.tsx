import axios from "axios";
import { useNavigate } from "react-router-dom";

interface IndexProps {
  APIEndpoint: String;
}

const Index: React.FC<IndexProps> = (props: IndexProps): React.ReactElement => {
  const navigate = useNavigate();

  axios.get(props.APIEndpoint + "/logged-in").then((res) => {
    if (res.data.successful) navigate("/personal");
    else navigate("/auth");
  });

  return <></>;
};

export default Index;
