import { useState } from "react";
import DiaryPage from "../../Components/DiaryPage";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface NewEntryProps {
  APIEndpoint: String;
}

const NewEntry: React.FC<NewEntryProps> = (
  props: NewEntryProps
): React.ReactElement => {
  const currDate = new Date();
  const day = currDate.getDate();
  const month = currDate.getMonth() + 1;
  const year = parseInt(currDate.getFullYear().toString().slice(2, 4));

  const [title, setTitle] = useState("");
  const [date, setDate] = useState({ day: day, month: month, year: year });
  const [entryContent, setEntryContent] = useState([]);

  const navigate = useNavigate();

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
      <div className="new-entry-page__diary-pages">
        <DiaryPage
          first={true}
          index={0}
          entryContent={entryContent}
          setEntryContent={setEntryContent}
          contentDate={date}
          date={date}
          setDate={setDate}
        />
        <DiaryPage
          first={false}
          index={1}
          entryContent={entryContent}
          setEntryContent={setEntryContent}
        />
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

            axios
              .post(`${props.APIEndpoint}/new-entry`, {
                title:
                  title !== ""
                    ? title
                    : `${date.day}/${date.month}/${date.year}`,
                date: {
                  day: date.day.toString().padStart(2, "0"),
                  month: date.month.toString().padStart(2, "0"),
                  year: date.year.toString().padStart(2, "0"),
                },
                pages: entryContent,
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
