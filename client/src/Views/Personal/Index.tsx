import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../Util/Constants";
import { ReactComponent as ColorPicker } from "../../static/img/colorpicker.svg";
import Colors from "../../static/img/colors.jpg";

// cpc -> colorPickerCanvas
const initColorPicker = (cpc: HTMLCanvasElement) => {
  const canvasContext = cpc.getContext("2d");

  if (!canvasContext) return;

  const image = new Image(360, 232);
  image.onload = () =>
    canvasContext.drawImage(image, 0, 0, image.width, image.height);
  image.src = Colors;
};

const Index: React.FC = (): React.ReactElement => {
  const colorPickerCanvas = useRef<HTMLCanvasElement>(null);
  const diaryContainer = useRef<HTMLDivElement>(null);
  const saveBtn = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState();
  const [diaryClr, setDiaryClr] = useState([111, 196, 248]);
  const [colorPickerActive, setColorPickerActive] = useState(false);

  const navigate = useNavigate();

  request.get("/get-user").then((res) => {
    if (!res.data.successful) navigate("/auth");
    else setUsername(res.data.data);
  });

  const updateDiaryClr = (
    el: React.RefObject<any> | null = null,
    clr: Array<number> = diaryClr
  ) => {
    (el ?? diaryContainer).current?.style.setProperty(
      "--diary-clr",
      `rgb(${clr.join(", ")})`
    );
  };

  useEffect(() => {
    request.get("/diary-clr").then((res) => {
      updateDiaryClr(diaryContainer, res.data.color);
      setDiaryClr(res.data.color);
    });
    if (colorPickerCanvas.current !== null) {
      initColorPicker(colorPickerCanvas.current);
    }
  }, []);

  useEffect(() => {
    updateDiaryClr(saveBtn);
  }, [diaryClr]);

  return (
    <div className="main-page diary-webpage">
      <div className="diary-container" ref={diaryContainer}>
        <div className="diary-options">
          <div className="diary-option" tabIndex={1}>
            <canvas
              id="color-picker-canvas"
              width="360"
              height="232"
              // className={!colorPickerActive ? "transform-hidden" : ""}
              ref={colorPickerCanvas}
              onClick={(e) => {
                if (colorPickerCanvas.current === null) return;
                const ctx = colorPickerCanvas.current.getContext("2d");
                if (ctx === null) return;
                const rect = colorPickerCanvas.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const color = ctx.getImageData(x, y, 1, 1).data;
                const r = color[0];
                const g = color[1];
                const b = color[2];
                setDiaryClr([r, g, b]);
                updateDiaryClr(saveBtn);
              }}
            ></canvas>
            <div
              ref={saveBtn}
              className={`diary-option__save-btn`}
              onClick={() => {
                updateDiaryClr();
                request.post("/diary-clr", {
                  color: diaryClr,
                });
              }}
            >
              Save
            </div>
            <ColorPicker
              onClick={() => {
                setColorPickerActive(!colorPickerActive);
              }}
            />
            {/* <img src={colorpicker} alt="" /> */}
          </div>
        </div>
        <div
          className="diary"
          onClick={(e) => {
            navigate("/personal/options");
          }}
        >
          <div className="username">{username}</div>
        </div>
      </div>
    </div>
  );
};

export default Index;
