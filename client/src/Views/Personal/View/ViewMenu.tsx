import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import formatDate from "../../../Util/FormatDate";

interface ViewMenuProps {
  APIEndpoint: String;
}

const ViewMenu: React.FC<ViewMenuProps> = (
  props: ViewMenuProps
): React.ReactElement => {
  const navigate = useNavigate();

  const [entries, setEntries] = useState([<></>]);

  useEffect(() => {
    axios.get(`${props.APIEndpoint}/entries`).then((res) => {
      let e = [];
      for (const entry of res.data) {
        console.log(formatDate(entry.date));
        e.push(
          <div
            className="entry"
            onClick={() => {
              navigate(`/personal/view/${entry._id}`);
            }}
          >
            {formatDate(entry.date)}
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
