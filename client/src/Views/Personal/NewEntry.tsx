import { useEffect, useState } from "react";
import DiaryPage from "../../Components/DiaryPage";
import { useNavigate } from "react-router-dom";
import { request } from "../../Util/Constants";

const lastNonEmpty = (arr: string[]): number => {
  let i = arr.length - 1;
  while (i >= 0) {
    if (arr[i] !== "") {
      return i + 1;
    }
    i--;
  }
  return arr.length;
};

const NewEntry: React.FC = (): React.ReactElement => {
  const currDate = new Date();
  const day = currDate.getDate();
  const month = currDate.getMonth() + 1;
  const year = parseInt(currDate.getFullYear().toString().slice(2, 4));

  const [title, setTitle] = useState("");
  const [date, setDate] = useState({ day: day, month: month, year: year });
  const [entryContent, setEntryContent] = useState([]);
  const [diaryPages, setDiaryPages] = useState<React.ReactElement[]>([]);
  const [currPage, setCurrPage] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setDiaryPages([
      <DiaryPage
        key={0}
        first={true}
        index={0}
        entryContent={entryContent}
        setEntryContent={setEntryContent}
        contentDate={date}
        date={date}
        setDate={setDate}
      />,
      <DiaryPage
        first={false}
        key={1}
        index={1}
        entryContent={entryContent}
        setEntryContent={setEntryContent}
      />,
    ]);
  }, []);

  return (
    <div className="new-entry-page full-page">
      <div className="new-entry-page__title-container">
        <input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          type="text"
          placeholder="Title..."
          className="title-input"
        />
      </div>
      <div className="diary-page-container">
        <div
          className={`diary-page-btn previous ${
            currPage === 0 ? "hidden-opaque" : ""
          }`}
          onClick={() => {
            setCurrPage(currPage - 1);
          }}
        >
          Previous
        </div>
        <div className="new-entry-page__diary-pages">
          {diaryPages.slice(currPage, currPage + 2)}
        </div>
        <div
          className="diary-page-btn next"
          onClick={() => {
            if (currPage === diaryPages.length - 2) {
              setDiaryPages((curr) => [
                ...curr,
                <DiaryPage
                  first={false}
                  key={diaryPages.length}
                  index={diaryPages.length}
                  entryContent={entryContent}
                  setEntryContent={setEntryContent}
                />,
              ]);
            }
            setCurrPage(currPage + 1);
          }}
        >
          Next
        </div>
      </div>
      <div className="new-entry-page__options">
        <div
          className="btn btn--save"
          onClick={() => {
            if (
              entryContent.filter((el: string) => el.length !== 0).length === 0
            ) {
              alert("CAN'T SAVE EMPTY ENTRY");
              return;
            }

            request
              .post("/new-entry", {
                title:
                  title !== ""
                    ? title
                    : `${date.day}/${date.month}/${date.year}`,
                date: {
                  day: date.day.toString().padStart(2, "0"),
                  month: date.month.toString().padStart(2, "0"),
                  year: date.year.toString().padStart(2, "0"),
                },
                pages: entryContent.slice(0, lastNonEmpty(entryContent)),
              })
              .then((res) => {
                if (!res.data.successful) {
                  alert(res.data.message);
                }
              })
              .then(() => {
                navigate("/personal");
              });
          }}
        >
          Save
        </div>
      </div>
    </div>
  );
};

export default NewEntry;
