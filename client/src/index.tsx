import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./Components/App";

Number.prototype.pad = function (num: number, places: number): string {
  const zeroes = places - this.toString().length + 1;
  return Array(zeroes).join(num.toString()) + this;
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
