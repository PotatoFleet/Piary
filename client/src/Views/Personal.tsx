import { Routes, Route } from "react-router-dom";
import Index from "./Personal/Index";
import Options from "./Personal/Options";
import NewEntry from "./Personal/NewEntry";
import ViewMenu from "./Personal/View/ViewMenu";
import ViewEntry from "./Personal/View/ViewEntry";
import HomeIcon from "../Components/HomeIcon";

const Personal: React.FC = (): React.ReactElement => {
  return (
    <div className="personal-page full-page">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/options" element={<Options />} />
        <Route path="/new" element={<NewEntry />} />
        <Route path="/view" element={<ViewMenu />} />
        <Route path="/view/:id" element={<ViewEntry />} />
      </Routes>
      <HomeIcon />
    </div>
  );
};

export default Personal;
