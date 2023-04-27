import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./static/css/index.css";
import App from "./Components/App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
