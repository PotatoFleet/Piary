import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../../Util/Constants";

const ViewMenu: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();

  const [entries, setEntries] = useState([<></>]);

  useEffect(() => {
    request.get("/entries").then((res) => {
      let e = [];
      for (const entry of res.data) {
        e.push(
          <div
            className="entry"
            onClick={() => {
              navigate(`/personal/view/${entry._id}`);
            }}
          >
            {entry.title}
          </div>
        );
      }
      setEntries(e);
    });
  }, []);

  return (
    <div className="view-menu-page full-page">
      <div className="entries">{entries}</div>
    </div>
  );
};

export default ViewMenu;
