import { useEffect, useRef } from "react";
import resizeCanvas from "../../Util/ResizeCanvas";
import insertTextAtCursor from "../../Util/Caret";

const drawFirstPageRules: Function = (canvas: HTMLCanvasElement): void => {
  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

  if (ctx === null) return;

  ctx.lineWidth = Math.round(1);
  ctx.font = "Arial 25px";

  for (let i = 2; i < 22; i++) {
    if (i === 2) {
      // draw date template

      let start: number = 10;

      for (let j = 0; j < 3; j++, start += canvas.height / 15) {
        ctx.beginPath();

        // date underline

        ctx.moveTo(start, Math.round(i * (canvas.height / 25)) + 0.5);

        ctx.lineTo(
          start + canvas.height / 20,
          Math.round(i * (canvas.height / 25)) + 0.5
        );

        if (j !== 2) {
          // division slash

          ctx.moveTo(
            start + canvas.height / 20 + 5,
            Math.round(i * (canvas.height / 25)) + 0.5
          );

          ctx.lineTo(
            start + canvas.height / 20 + 10,
            Math.round(i * (canvas.height / 25)) + 0.5 - 20
          );
        }

        ctx.stroke();
      }

      continue;
    }

    if (i === 3) continue;

    ctx.beginPath();

    // Indentation
    ctx.moveTo(
      (i === 4 ? canvas.width / 6 : 0) + 10,
      Math.round(i * (canvas.height / 25)) + 0.5
    );

    ctx.lineTo(canvas.width - 15, Math.round(i * (canvas.height / 25)) + 0.5);

    ctx.stroke();
  }
};

const drawRules: Function = (canvas: HTMLCanvasElement): void => {
  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

  if (ctx === null) return;

  ctx.lineWidth = Math.round(canvas.height / 1000);
  ctx.font = "Arial 25px";

  for (let i = 2; i < 22; i++) {
    ctx.beginPath();
    ctx.moveTo(10, Math.round(i * (canvas.height / 25)) + 0.5);

    ctx.lineTo(canvas.width - 15, Math.round(i * (canvas.height / 25)) + 0.5);

    ctx.stroke();
  }
};

interface EntryDate {
  day: number;
  month: number;
  year: number;
}

interface DiaryPageProps {
  width?: number;
  height?: number;
  first: boolean;
  content?: string;
  mutable?: boolean;
  index?: number;
  contentDate?: EntryDate;
  entryContent?: Array<string>;
  setEntryContent?: Function;
  date?: EntryDate;
  setDate?: Function;
}

const DiaryPage: React.FC<DiaryPageProps> = (props: DiaryPageProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    resizeCanvas(
      canvas.current,
      props.width ? props.width : 450,
      props.height ? props.height : 600
    );
    if (props.first) {
      drawFirstPageRules(canvas.current);
    } else {
      drawRules(canvas.current);
    }
  });

  return (
    <div className="diary-page">
      <canvas ref={canvas} className="diary-page__canvas"></canvas>
      <textarea
        className={`diary-textarea ${props.first ? "diary-textarea--new" : ""}`}
        spellCheck="false"
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            insertTextAtCursor(e.target, " ".repeat(8));
          }
        }}
        onChange={(e) => {
          if (
            props.index === undefined ||
            props.entryContent === undefined ||
            props.setEntryContent === undefined
          )
            return;
          const entryContent = props.entryContent;
          entryContent[props.index] = e.target.value;
          props.setEntryContent(entryContent);
        }}
        disabled={props.mutable === true}
      >
        {props.content || ""}
      </textarea>
      <div className="diary-page__date">
        <textarea
          className="diary-page__date__slot"
          name="day"
          maxLength={2}
          onChange={(e) => {
            if (props.setDate)
              props.setDate({ ...props.date, day: parseInt(e.target.value) });
          }}
          disabled={props.mutable === true}
        >
          {props.contentDate?.day || ""}
        </textarea>
        <textarea
          className="diary-page__date__slot"
          name="month"
          maxLength={2}
          onChange={(e) => {
            if (props.setDate)
              props.setDate({ ...props.date, month: parseInt(e.target.value) });
          }}
          disabled={props.mutable === true}
        >
          {props.contentDate?.month || ""}
        </textarea>
        <textarea
          className="diary-page__date__slot"
          name="year"
          maxLength={2}
          onChange={(e) => {
            if (props.setDate)
              props.setDate({ ...props.date, year: parseInt(e.target.value) });
          }}
          disabled={props.mutable === true}
        >
          {props.contentDate?.year || ""}
        </textarea>
      </div>
    </div>
  );
};

export default DiaryPage;
