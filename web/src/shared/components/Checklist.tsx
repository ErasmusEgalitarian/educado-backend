import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface ChecklistProps {
  tickChange: number;
  highestTick: number;
  id: string;
  setTickChange: (tick: number) => void;
}

const Checklist: React.FC<ChecklistProps> = ({
  tickChange,
  highestTick,
  id,
  setTickChange,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleCheckboxClick = (newTick: number) => {
    if (newTick <= highestTick) {
      setTickChange(newTick);
      navigate(`/courses/manager/${id}/${newTick}`);
    }
  };

  const getLabelClass = (tick: number) => {
    return `pl-2 flex items-center ${tickChange === tick ? "border-l-4 border-primary" : ""} ${highestTick < tick ? "text-gray-400" : ""}`;
  };

  return (
    <div className="w-full h-[20%] items-center justify-left space-y-4 grid grid-flow-row auto-rows-max">
      <div>
        <p className="text-2xl text-grayMedium">{t('courseManager.newCourse')}</p>
      </div>

      <div className="border-y py-8 w-5/6 border-grayMedium text-greyscale-text-body flex flex-col space-y-4">
        <label
          htmlFor="check1"
          className={`${getLabelClass(0)} ${highestTick >= 0 ? "cursor-pointer" : ""}`}
          onClick={() => {
            handleCheckboxClick(0);
          }}
        >
          <input
            className={`mr-2 text-primary rounded-sm ${highestTick >= 0 ? "cursor-pointer" : ""}`}
            type="checkbox"
            id="check1"
            disabled={highestTick < 0}
            checked={highestTick >= 0}
            onChange={() => {}}
            style={{ outline: "none", boxShadow: "none" }}
          />
          {t('courseManager.generalInfo')}
        </label>

        <label
          htmlFor="check2"
          className={`${getLabelClass(1)} ${highestTick >= 1 ? "cursor-pointer" : ""}`}
          onClick={() => {
            handleCheckboxClick(1);
          }}
        >
          <input
            className={`mr-2 text-primary rounded-sm ${highestTick >= 1 ? "cursor-pointer" : ""}`}
            type="checkbox"
            id="check2"
            disabled={highestTick < 1}
            checked={highestTick >= 1}
            onChange={() => {}}
            style={{ outline: "none", boxShadow: "none" }}
          />
          {t('courseManager.createSections')}
        </label>

        <label
          htmlFor="check3"
          className={`${getLabelClass(2)} ${highestTick >= 2 ? "cursor-pointer" : ""}`}
          onClick={() => {
            handleCheckboxClick(2);
          }}
        >
          <input
            className={`mr-2 text-primary rounded-sm ${highestTick >= 2 ? "cursor-pointer" : ""}`}
            type="checkbox"
            id="check3"
            disabled={highestTick < 2}
            checked={highestTick >= 2}
            onChange={() => {}}
            style={{ outline: "none", boxShadow: "none" }}
          />
          {t('courseManager.reviewCourse')}
        </label>
      </div>  
    </div>
  );
};

export default Checklist;
