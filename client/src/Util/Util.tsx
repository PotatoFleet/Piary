import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { request } from "./Constants";

const resizeCanvas: Function = (
  canvas: HTMLCanvasElement,
  width: number = document.body.clientWidth / 2,
  height: number = document.body.clientHeight
): void => {
  canvas.width = width;
  canvas.height = height;
};

interface RequireLoginProps {
  element: React.ReactElement;
}

const RequireLogin: React.FC<RequireLoginProps> = (
  props: RequireLoginProps
): React.ReactElement => {
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    request.get("/logged-in").then((res) => {
      if (!res.data.successful) {
        navigate("/auth");
      }
    });
  });

  return <>{props.element}</>;
};

const formatDate = (date: any): string => {
  return Object.keys(date)
    .filter((x) => ["day", "month", "year"].includes(x))
    .map((x) => date[x].toString().padStart(2, "0"))
    .join("-");
};

const insertTextAtCursor: Function = (
  textarea: HTMLTextAreaElement,
  str: string
): void => {
  let start: number = textarea.selectionStart;
  let end: number = textarea.selectionEnd;
  let text: string = textarea.value;

  // inserts str in between start and end
  textarea.value = text.slice(0, start) + str + text.slice(end, text.length);

  // sets cursor position to where it should be after adding in str
  textarea.selectionEnd = str.length + start;
};

export { resizeCanvas, RequireLogin, formatDate, insertTextAtCursor };
