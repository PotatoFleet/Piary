import { useEffect, useRef, useState } from "react";
import DiaryPage, { DiaryPageProps } from "../../Components/DiaryPage";
import { useNavigate } from "react-router-dom";
import { isMobile, request } from "../../Util/Constants";

const lastNonEmpty = (arr: string[]): number => {
  let i = arr.length - 1;
  while (i >= 0) {
    if (arr[i] !== "") return i + 1;
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
  const [newFocus, setNewFocus] = useState(false);
  const [entryContent, setEntryContent] = useState([]);
  const [diaryPages, setDiaryPages] = useState<DiaryPageProps[]>([]);
  const diaryTextareas = useRef<HTMLTextAreaElement[]>([]);

  const [currPage, setCurrPage] = useState(0);

  const diaryPagesRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const pagesShown = isMobile ? 1 : 2;

  const addDiaryPage = () => {
    setDiaryPages([
      ...diaryPages,
      {
        first: false,
        key: diaryPages.length,
        index: diaryPages.length,
        entryContent: entryContent,
        setEntryContent: setEntryContent,
        diaryTextareas: diaryTextareas,
      },
    ]);
  };

  const focusNext = (idx: number) => {
    const nextIndex = idx + 1;
    if (nextIndex === diaryTextareas.current.length) {
      setNewFocus(true);
      addDiaryPage();
      diaryTextareas.current.push(document.createElement("textarea"));
    }
    diaryTextareas.current[nextIndex]?.focus();
    if (idx === currPage + 1) setCurrPage(currPage + 1);
  };

  useEffect(() => {
    if (newFocus) {
      const newIndex = currPage + 1;
      diaryTextareas.current[newIndex]?.focus();
      setNewFocus(false);
    }
  }, [diaryTextareas, currPage, newFocus]);

  useEffect(() => {
    request.get("/diary-clr").then((res) => {
      diaryPagesRef.current?.style.setProperty(
        "--diary-clr",
        `rgb(${res.data.color.join(", ")})`
      );
      setDiaryPages([
        {
          first: true,
          key: 0,
          index: 0,
          entryContent: entryContent,
          setEntryContent: setEntryContent,
          contentDate: date,
          date: date,
          color: res.data.color,
          setDate: setDate,
          diaryTextareas: diaryTextareas,
        },
        {
          first: false,
          key: 1,
          index: 1,
          color: res.data.color,
          entryContent: entryContent,
          setEntryContent: setEntryContent,
          diaryTextareas: diaryTextareas,
        },
      ]);
    });
  }, []);

  return (
    <div className="new-entry-page full-page">
      <div className="title-container">
        <input
          onChange={(e) => {
            setTitle(e.target.value);

            const maxLength = 10; // Set your desired character limit
            const baseFontSize = 30; // Set your desired base font size
            const scaleFactor = 0.99; // Adjust the scale factor as needed

            if (e.target.value.length > maxLength) {
              const fontSize =
                baseFontSize *
                Math.pow(scaleFactor, e.target.value.length - maxLength);
              e.target.style.fontSize = fontSize + "px";
            } else {
              e.target.style.fontSize = baseFontSize + "px";
            }
          }}
          type="text"
          placeholder="Title..."
          maxLength={40}
          className="title-input"
        />
      </div>
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
          {diaryPages
            .map((data, idx) => (
              <DiaryPage
                first={data.first}
                key={idx}
                index={data.index}
                entryContent={data.entryContent}
                setEntryContent={data.setEntryContent}
                contentDate={data.date}
                date={data.date}
                color={data.color}
                setDate={data.setDate}
                diaryTextareas={data.diaryTextareas}
                pageFull={() => focusNext(idx)}
              />
            ))
            .slice(currPage, currPage + pagesShown)}
          <div
            className="diary-page-btn next"
            onClick={() => {
              if (currPage === diaryPages.length - pagesShown) addDiaryPage();
              setCurrPage(currPage + 1);
            }}
          ></div>
        </div>
      </div>
      <div className="new-entry-page__options">
        <div
          className="btn btn--save btn--long"
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
