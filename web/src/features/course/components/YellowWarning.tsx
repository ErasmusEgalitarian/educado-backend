// Icon from: https://materialdesignicons.com/

import { mdiAlertCircle } from "@mdi/js";
import { Icon } from "@mdi/react";

interface Inputs {
  text: string;
}

// YellowWarning component
export const YellowWarning = ({ text }: Inputs) => {
  return (
    <div className="w-full bg-guide-yellow h-10 rounded-sm flex flex-col-2 space-x-2 items-center mb-5 ">
      <Icon
        path={mdiAlertCircle}
        size={1}
        className="text-warning-orange ml-2 items-center "
      />
      <div className="text-sm font-bold ml-2 items-center">Fique atento! </div>
      <div className="text-sm items-center"> {text} </div>
    </div>
  );
};
