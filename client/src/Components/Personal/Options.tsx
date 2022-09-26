import { NavigateFunction, useNavigate } from "react-router-dom";
import DiaryPage from "./DiaryPage";

interface OptionsProps {}

const Options: React.FC<OptionsProps> = (
  _props: OptionsProps
): React.ReactElement => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div className="options-page full-page">
      <DiaryPage first={true} />
      <DiaryPage first={true} />
      <div className="options-page__options">
        <div className="options-page__options__option options-page__options__new">
          <button
            className="options-page__btn btn btn--green"
            onClick={(e) => {
              navigate("/personal/new");
            }}
          >
            New Entry
          </button>
        </div>
        <div className="options-page__options__option options-page__options__view">
          <button
            className="options-page__btn btn btn--red"
            onClick={(e) => {
              navigate("/personal/view");
            }}
          >
            View Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default Options;
