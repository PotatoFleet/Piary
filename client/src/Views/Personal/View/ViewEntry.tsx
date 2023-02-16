import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DiaryPage from "../../../Components/DiaryPage";

interface ViewEntryProps {
  APIEndpoint: String;
}

const ViewEntry: React.FC<ViewEntryProps> = (
  props: ViewEntryProps
): React.ReactElement => {
  const params = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState([<></>]);

  useEffect(() => {
    axios
      .get(`${props.APIEndpoint}/entry`, { params: { entryID: params.id } })
      .then((res) => {
        if (res.data.length === 0) navigate("/personal/view");
        setTitle(res.data.title);
        const pages = [];
        for (let i = 0; i < res.data.pages.length; i++) {
          pages.push(
            <DiaryPage
              content={res.data.pages[i]}
              contentDate={res.data.date}
              mutable={false}
              first={i === 0}
              key={i}
            />
          );
        }
        setContent(pages);
      });
  }, []);

  return (
    <div className="view-entry-page full-page">
      <div className="entry-title">{title}</div>
      <div className="view-entry-page__diary-pages">{content}</div>
    </div>
  );
};

export default ViewEntry;
