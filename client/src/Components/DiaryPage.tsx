import React, { useEffect, useRef, useState } from "react";
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

export interface DiaryPageProps {
  // dimensions
  width?: number;
  height?: number;

  // for whether or not to show date slot
  first: boolean;

  // actual page's text content
  content?: string;

  // new entry (mutable) or view entry (immutable)
  mutable?: boolean;

  // background shade
  color?: number[];

  // key
  key: number;

  // index of diary page in entry
  index: number;

  // date shown when viewing entry
  contentDate?: EntryDate;

  // list of each page's content. gets and sets content at index props.index
  entryContent?: string[];
  setEntryContent?: Function;

  // getting and setting date for new entry
  date?: EntryDate;
  setDate?: Function;

  // the callback if the page is filled
  pageFull?: Function;

  // for focusing on next page's textarea
  diaryTextareas?: React.RefObject<Array<HTMLTextAreaElement>>;
}

const DiaryPage: React.FC<DiaryPageProps> = (props: DiaryPageProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const diaryPageRef = useRef<HTMLDivElement>(null);
  const diaryTextareaRef = useRef<HTMLTextAreaElement>(null);
  let [diaryValue, setDiaryValue] = useState("");

  useEffect(() => {
    if (diaryTextareaRef.current !== null) {
      if (props.diaryTextareas !== undefined) {
        if (props.diaryTextareas.current !== null)
          props.diaryTextareas.current[props.index] = diaryTextareaRef.current;
      }
    }
    if (props.color !== undefined) {
      diaryPageRef.current?.style.setProperty(
        "--diary-clr",
        `rgb(${props.color.join(", ")})`
      );
    }
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
    if (props.content) setDiaryValue(props.content);
    else if (props.entryContent) setDiaryValue(props.entryContent[props.index]);
  }, []);

  return (
    <div className="diary-page" ref={diaryPageRef}>
      <canvas ref={canvas} className="diary-page__canvas"></canvas>
      <textarea
        ref={diaryTextareaRef}
        className={`diary-textarea ${props.first ? "diary-textarea--new" : ""}`}
        spellCheck="false"
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            insertTextAtCursor(e.target, " ".repeat(8));
          } else if (e.key === "Enter") {
            if (
              (e.target as HTMLTextAreaElement).value.split("\n").length ===
              20 - (props.first ? 2 : 0)
            ) {
              e.preventDefault();
              if (props.pageFull) props.pageFull();
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
        defaultValue={diaryValue}
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
