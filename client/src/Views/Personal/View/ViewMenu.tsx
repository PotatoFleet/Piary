import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../../Util/Constants";
import formatDate from "../../../Util/FormatDate";

type DateEntries = { [key: string]: { title: string; id: string }[] };

const ViewMenu: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();

  const [entries, setEntries] = useState<DateEntries>({});

  useEffect(() => {
    request.get("/entries").then((res) => {
      const dateEntries: DateEntries = {};
      for (const entry of res.data) {
        const date: string = formatDate(entry.date);
        if (!(date in dateEntries)) dateEntries[date] = [];
        dateEntries[date].push({
          title: entry.title,
          id: entry._id,
        });
      }
      setEntries(dateEntries);
    });
  }, []);

  return (
    <div className="view-menu-page full-page">
      <div className="entries-container">
        {Object.keys(entries).map((date: string, idx: number) => (
          <div key={idx} className="entry-container">
            <div className="entry-date">{date}</div>
            <div className="entry-names-container">
              {entries[date].map((val: any, index: number) => (
                <div
                  key={index}
                  className="entry-name"
                  onClick={() => {
                    navigate(`/personal/view/${val.id}`);
                  }}
                >
                  {val.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewMenu;
