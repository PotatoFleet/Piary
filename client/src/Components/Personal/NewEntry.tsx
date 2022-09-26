import { useState } from "react";
import DiaryPage from "./DiaryPage";
import axios from "axios";

interface NewEntryProps {
  APIEndpoint: String;
}

const NewEntry: React.FC<NewEntryProps> = (
  props: NewEntryProps
): React.ReactElement => {
  const [date, setDate] = useState({ day: 1, month: 1, year: 2000 });
  const [entryContent, setEntryContent] = useState([]);

  return (
    <div className="new-entry-page full-page">
      <div className="new-entry-page__diary-pages">
        <DiaryPage
          height={(9 / 10) * document.body.clientHeight}
          first={true}
          index={0}
          entryContent={entryContent}
          setEntryContent={setEntryContent}
          date={date}
          setDate={setDate}
        />
        <DiaryPage
          height={(90 / 100) * document.body.clientHeight}
          first={false}
          index={1}
          entryContent={entryContent}
          setEntryContent={setEntryContent}
        />
      </div>
      <div className="new-entry-page__options">
        <div
          className="btn btn--save btn--green"
          onClick={() => {
            axios
              .post(`${props.APIEndpoint}/new-entry`, {
                date: `${date.year}-${date.month}-${date.day}`,
                pages: entryContent,
              })
              .then((res) => {
                if (!res.data.successful) {
                  alert(res.data.message);
                }
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
