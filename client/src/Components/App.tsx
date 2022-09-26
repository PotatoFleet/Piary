import axios from "axios";
import { Routes, Route } from "react-router-dom";
import RequireLogin from "../Util/RequireLogin";
import Auth from "./Auth";
import Index from "./Index";
import Logout from "./Logout";
import Personal from "./Personal";

axios.defaults.withCredentials = true;

const API_ENDPOINT: String | undefined = process.env.REACT_APP_API_ENDPOINT;

const App: React.FC = (): React.ReactElement => {
  if (API_ENDPOINT === undefined) {
    return <h1>Offline Mode</h1>;
  }

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <RequireLogin
              APIEndpoint={API_ENDPOINT}
              element={<Index APIEndpoint={API_ENDPOINT} />}
            />
          }
        />
        <Route
          path="/personal/*"
          element={
            <RequireLogin
              APIEndpoint={API_ENDPOINT}
              element={<Personal APIEndpoint={API_ENDPOINT} />}
            />
          }
        />
        <Route path="/auth" element={<Auth APIEndpoint={API_ENDPOINT} />} />
        <Route path="/logout" element={<Logout APIEndpoint={API_ENDPOINT} />} />
      </Routes>
    </div>
  );
};

export default App;
