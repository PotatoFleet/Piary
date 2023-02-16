import React, { useEffect, useRef } from "react";
import resizeCanvas from "../Util/ResizeCanvas";
import insertTextAtCursor from "../Util/Caret";

const lineHeight = 30;

const drawFirstPageRules: Function = (canvas: HTMLCanvasElement): void => {
  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

  if (ctx === null) return;

  ctx.translate(0.5, 0.5);

  ctx.lineWidth = Math.round(1);
  ctx.font = "Arial 25px";

  for (let i = 2; i < 22; i++) {
    if (i === 2) {
      // draw date template

      let start = 10;

      for (let j = 0; j < 3; j++, start += canvas.height / 15) {
        const y = Math.round(i * lineHeight);

        ctx.beginPath();

        // date underline

        ctx.moveTo(start, y);

        ctx.lineTo(start + canvas.height / 20, y);

        if (j !== 2) {
          // division slash

          ctx.moveTo(start + canvas.height / 20 + 5, y);

          ctx.lineTo(start + canvas.height / 20 + 10, y - 20);
        }

        ctx.stroke();
      }

      continue;
    }

    if (i === 3) continue;

    ctx.beginPath();

    // Indentation
    ctx.moveTo((i === 4 ? canvas.width / 6 : 0) + 10, i * lineHeight);

    ctx.lineTo(canvas.width - 15, i * lineHeight);

    ctx.stroke();
  }
};

const drawRules: Function = (canvas: HTMLCanvasElement): void => {
  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

  if (ctx === null) return;
  ctx.translate(0.5, 0.5);

  ctx.lineWidth = Math.round(canvas.height / 1000);
  ctx.font = "Arial 25px";

  for (let i = 2; i < 22; i++) {
    ctx.beginPath();
    ctx.moveTo(10, i * lineHeight);

    ctx.lineTo(canvas.width - 15, i * lineHeight);

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
    const height = Math.min(700, (document.body.clientHeight * 3) / 4);
    resizeCanvas(
      canvas.current,
      props.width ? props.width : (3 * height) / 4,
      props.height ? props.height : height
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
          } else if (e.key === "Enter") {
            if (
              (e.target as HTMLTextAreaElement).value.split("\n").length ===
              21 - (props.first ? 2 : 0)
            ) {
              e.preventDefault();
            }
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
        disabled={props.mutable === false}
        defaultValue={props.content || ""}
      ></textarea>
      <div className="diary-page__date">
        <input
          className="diary-page__date__slot"
          name="day"
          onChange={(e) => {
            e.target.value = e.target.value
              .replaceAll(/[^0-9.]/g, "")
              .slice(0, 2);
            if (parseInt(e.target.value) > 31) e.target.value = "31";
            if (props.setDate)
              props.setDate({
                ...props.date,
                day: Math.max(1, parseInt(e.target.value)),
              });
          }}
          disabled={props.mutable === false}
          defaultValue={
            props.first
              ? props.contentDate?.day.toString().padStart(2, "0") || "01"
              : ""
          }
        />
        <input
          className="diary-page__date__slot"
          name="month"
          onChange={(e) => {
            e.target.value = e.target.value
              .replaceAll(/[^0-9.]/g, "")
              .slice(0, 2);
            if (parseInt(e.target.value) > 12) e.target.value = "12";
            if (props.setDate)
              props.setDate({
                ...props.date,
                month: Math.max(1, parseInt(e.target.value)),
              });
          }}
          disabled={props.mutable === false}
          defaultValue={
            props.first
              ? props.contentDate?.month.toString().padStart(2, "0") || "01"
              : ""
          }
        />
        <input
          className="diary-page__date__slot"
          name="year"
          onChange={(e) => {
            e.target.value = e.target.value
              .replaceAll(/[^0-9.]/g, "")
              .slice(0, 2);
            if (props.setDate)
              props.setDate({ ...props.date, year: parseInt(e.target.value) });
          }}
          disabled={props.mutable === false}
          defaultValue={
            props.first
              ? props.contentDate?.year.toString().padStart(2, "0") || "00"
              : ""
          }
        />
      </div>
    </div>
  );
};

export default DiaryPage;
