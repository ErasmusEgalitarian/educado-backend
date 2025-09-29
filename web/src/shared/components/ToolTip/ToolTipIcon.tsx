// Icon from: https://materialdesignicons.com/

import { mdiInformationSlabCircleOutline } from "@mdi/js";
import { Icon } from "@mdi/react";

import { ToolTipInfoBox } from "./ToolTipInfoBox";

interface Inputs {
  index: number;
  toolTipIndex: number;
  text: string;
  tooltipAmount: number;
  callBack: Function;
  alignLeftTop: boolean; // New optional prop
}

// ToolTip component
export const ToolTipIcon = ({
  index,
  toolTipIndex,
  text,
  tooltipAmount,
  callBack,
  alignLeftTop,
}: Inputs) => {
  return (
    <div
      id={`tooltipIcon${index}`}
      className="flex flex-row space-y-2 text-left"
      onMouseOver={() => callBack(index)}
    >
      <Icon
        path={mdiInformationSlabCircleOutline}
        size={1}
        className="text-primary cursor-pointer" // Adds cursor pointer for hover effect
      />
      {toolTipIndex === index ? (
        <ToolTipInfoBox
          alignLeftTop={alignLeftTop}
          callBack={callBack}
          textContent={text}
          myIndex={index}
          maxIndex={tooltipAmount}
        />
      ) : (
        <div />
      )}
    </div>
  );
};
