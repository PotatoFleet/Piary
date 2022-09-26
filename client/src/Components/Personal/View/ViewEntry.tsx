import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DiaryPage from "../DiaryPage";

interface ViewEntryProps {
  APIEndpoint: String;
}

const ViewEntry: React.FC<ViewEntryProps> = (
  props: ViewEntryProps
): React.ReactElement => {
  const params = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState([<></>]);

  useEffect(() => {
    axios
      .get(`${props.APIEndpoint}/entry`, { params: { entryID: params.id } })
      .then((res) => {
        if (res.data.length === 0) navigate("/personal/view");
        const pages = [];
        for (let i = 0; i < res.data.length; i++) {
          pages.push(
            <DiaryPage
              content={res.data[i]}
              mutable={false}
              first={i === 0}
              key={i}
            />
          );
        }
        setContent(pages);
      });
  }, []);

  return <div className="view-entry-page full-page">{content}</div>;
};

export default ViewEntry;
