import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface IndexProps {
  APIEndpoint: String;
}

const Index: React.FC<IndexProps> = (props: IndexProps): React.ReactElement => {
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  axios.get(props.APIEndpoint + "/get-user").then((res) => {
    if (!res.data.successful) navigate("/auth");
    else setUsername(res.data.data);
  });

  return (
    <div className={`main-page diary-webpage`}>
      <h1 className="username">
        {username}'s
        <br />  
        Diary
      </h1>
      <div
        className="diary"
        onClick={(e) => {
          navigate("/personal/options");
        }}
      ></div>
    </div>
  );
};

export default Index;
