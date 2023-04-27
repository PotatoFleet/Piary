import { Routes, Route } from "react-router-dom";
import RequireLogin from "../Util/RequireLogin";
import Auth from "../Views/Auth";
import Index from "../Views/Index";
import Logout from "../Views/Logout";
import Personal from "../Views/Personal";

const App: React.FC = (): React.ReactElement => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<RequireLogin element={<Index />} />} />
        <Route
          path="/personal/*"
          element={<RequireLogin element={<Personal />} />}
        />
        <Route path="/auth" element={<Auth />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
};

export default App;
