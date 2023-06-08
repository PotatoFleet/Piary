import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DiaryPage from "../../../Components/DiaryPage";
import { request } from "../../../Util/Constants";
import { ReactComponent as TrashIcon } from "../../../static/img/trash.svg";

const ViewEntry: React.FC = (): React.ReactElement => {
  const params = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [currPage, setCurrPage] = useState(0);
  const [content, setContent] = useState([<></>]);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const diaryPagesRef = useRef<HTMLDivElement>(null);
  const deleteAlertMessage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    request.get("/entry", { params: { entryID: params.id } }).then((res) => {
      if (res.data.length === 0) navigate("/personal/view");
      setTitle(res.data.title);
      request.get("/diary-clr").then((clrRes) => {
        diaryPagesRef.current?.style.setProperty(
          "--diary-clr",
          `rgb(${clrRes.data.color.join(", ")})`
        );
        const pages = [];
        for (let i = 0; i < res.data.pages.length; i++) {
          pages.push(
            <DiaryPage
              content={res.data.pages[i]}
              contentDate={res.data.date}
              mutable={false}
              color={clrRes.data.color}
              first={i === 0}
              index={i}
              key={i}
            />
          );
        }
        if (pages.length === 1) {
          pages.push(
            <DiaryPage
              first={false}
              color={clrRes.data.color}
              index={1}
              key={1}
            />
          );
        }
        setContent(pages);
      });
    });
  }, []);

  return (
    <div className="view-entry-page full-page">
      <div className="entry-title">{title}</div>
      <div className="diary-page-container">
        <div className="diary-pages" ref={diaryPagesRef}>
          <div
            className={`diary-page-btn previous ${
              currPage === 0 ? "disabled" : ""
            }`}
            onClick={(e) => {
              if ((e.target as HTMLDivElement).classList.contains("disabled"))
                return;
              setCurrPage(currPage - 1);
            }}
          ></div>
          {content.slice(currPage, currPage + 2)}
          <div
            className={`diary-page-btn next ${
              currPage >= content.length - 2 ? "disabled" : ""
            }`}
            onClick={(e) => {
              if ((e.target as HTMLDivElement).classList.contains("disabled"))
                return;
              setCurrPage(currPage + 1);
            }}
          ></div>
        </div>
      </div>
      <div className="delete-alert" hidden={!deleteAlert}>
        <div className="delete-alert__message" ref={deleteAlertMessage}>
          Are you sure you want to delete this entry? This action is
          irreversible.
        </div>
        <div
          className="delete-alert__btn"
          onClick={() => {
            console.log(params.id);
            request.post("/delete", { entryID: params.id }).then((res) => {
              if (res.data) {
                navigate("/personal");
              } else {
                if (deleteAlertMessage.current)
                  deleteAlertMessage.current.textContent =
                    "Failed to delete entry. Please try again later.";
              }
            });
          }}
        >
          Delete
        </div>
      </div>
      <div
        className="delete-entry-btn"
        onClick={() => {
          setDeleteAlert(!deleteAlert);
        }}
      >
        <TrashIcon />
      </div>
    </div>
  );
};

export default ViewEntry;
