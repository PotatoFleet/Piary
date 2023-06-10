import { useEffect, useRef } from "react";

const NotFound: React.FC = (): React.ReactElement => {
  const diaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    diaryRef.current?.style.setProperty("--diary-clr", "#000");
  }, []);

  return (
    <div className="full-page not-found-page">
      <div className="diary" ref={diaryRef}>
        <div className="username">
          404
          <br />
          Page Not
          <br /> Found
        </div>
      </div>
    </div>
  );
};

export default NotFound;
