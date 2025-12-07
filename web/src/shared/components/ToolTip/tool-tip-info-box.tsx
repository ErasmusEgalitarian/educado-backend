// Icon from: https://materialdesignicons.com/

import { mdiWindowClose } from "@mdi/js";
import { Icon } from "@mdi/react";

interface Inputs {
  alignLeftTop: boolean;
  textContent: string;
  myIndex: number;
  maxIndex: number;
  callBack: (value: number) => void;
}

// ToolTip component
export const ToolTipInfoBox = ({
  alignLeftTop,
  textContent,
  myIndex,
  maxIndex,
  callBack,
}: Inputs) => {
  return (
    <div
      className={`group relative ${alignLeftTop ? "-translate-x-full -translate-y-full" : ""}`}
    >
      <div
        id="tooltipBox"
        className={`${alignLeftTop ? "-translate-x-full -translate-y-full -ml-3 -mt-2" : ""}z-10 flex-col w-70 group-hover:visible absolute  text-white p-2 rounded-md duration-300 text-left bg-primary`}
      >
        <div className="flex-col-2">
          <div className="flex flex-row-reverse w-70">
            <div
              id="tooltipClose"
              className="std-button underline shadow-none hover:bg-transparent hover:text-white-400 bg-transparent text-right"
              onClick={() => {
                callBack(maxIndex + 1);
              }}
            >
              <Icon
                path={mdiWindowClose}
                size={1}
                className="text-white " // Add cursor-pointer for hover effect
              />
            </div>

            <p>{textContent}</p>
          </div>
        </div>

        {myIndex === maxIndex - 1 && myIndex === 0 ? (
          <div className="flex-col w-1/2 space-x-48">
            <div>
              {myIndex + 1}/{maxIndex}
            </div>
            <label
              id="tooltipFinish"
              className="std-button shadow-none hover:bg-transparent hover:text-white-400 cursor-pointer underline"
              onClick={() => {
                callBack(myIndex + 1);
              }}
            >
              Feshar
            </label>
           </div>
        ) : // If it is the last page, show the "Voltar/Back" "Feshar/Finish" button
        myIndex === maxIndex - 1 ? (
          <div className="flex w-1/3 space-x-40">
            <label
              id="tooltipBack"
              className="std-button underline shadow-none hover:bg-transparent hover:text-white-400 bg-transparent cursor-pointer"
              onClick={() => {
                callBack(myIndex - 1);
              }}
            >
              Voltar{" "}
            </label>
            <div>
              {myIndex + 1}/{maxIndex}
            </div>
            <label
              id="tooltipFinish"
              className="std-button underline shadow-none hover:bg-transparent hover:text-white-400 bg-transparent cursor-pointer"
              onClick={() => {
                callBack(myIndex + 1);
              }}
            >
              Feshar
            </label>
          </div>
        ) : // If it is the first page, show the "Próximo/Next" button
        myIndex === 0 ? (
          <div className="flex w-1/2 space-x-40">
            <p>
              {myIndex + 1}/{maxIndex}
            </p>
            <label
              id="tooltipNext"
              className="std-button shadow-none hover:bg-transparent hover:text-white-400 cursor-pointer underline"
              onClick={() => {
                callBack(myIndex + 1);
              }}
            >
              Próximo
            </label>
          </div>
        ) : (
          // If it is any other page, show the "Voltar/Back" "Próximo/Next" button
          <div className="flex w-1/2 space-x-10">
            <div className="flex w-1/3 space-x-48">
              <label
                id="tooltipBack"
                className="std-button shadow-none hover:bg-transparent hover:text-white-400 underline hover:bg-transparent cursor-pointer"
                onClick={() => {
                  callBack(myIndex - 1);
                }}
              >
                Voltar{" "}
              </label>
              <div>
                {myIndex + 1}/{maxIndex}
              </div>
              <label
                id="tooltipNext"
                className="std-button shadow-none hover:bg-transparent hover:text-white-400 underline hover:bg-transparent cursor-pointer"
                onClick={() => {
                  callBack(myIndex + 1);
                }}
              >
                Próximo
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
