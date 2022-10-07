import { Route, Routes } from "react-router-dom";
import Index from "./Personal/Index";
import Options from "./Personal/Options";
import NewEntry from "./Personal/NewEntry";
import ViewMenu from "./Personal/View/ViewMenu";
import ViewEntry from "./Personal/View/ViewEntry";
import HomeIcon from "../Components/HomeIcon";

interface PersonalProps {
  APIEndpoint: String;
}

const Personal: React.FC<PersonalProps> = (
  props: PersonalProps
): React.ReactElement => {
  return (
    <div className="personal-page full-page">
      <Routes>
        <Route path="/" element={<Index APIEndpoint={props.APIEndpoint} />} />
        <Route path="/options" element={<Options />} />
        <Route
          path="/new"
          element={<NewEntry APIEndpoint={props.APIEndpoint} />}
        />
        <Route
          path="/view"
          element={<ViewMenu APIEndpoint={props.APIEndpoint} />}
        />
        <Route
          path="/view/:id"
          element={<ViewEntry APIEndpoint={props.APIEndpoint} />}
        />
      </Routes>
      <HomeIcon />
    </div>
  );
};

export default Personal;
