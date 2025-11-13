import Icon from "@mdi/react";
import { mdiBookOpenBlankVariantOutline, mdiShieldCheckOutline } from "@mdi/js";
import { Link, useLocation } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/shadcn/tooltip";

import Logo from "../../../public/logo.svg";

export const Sidebar = () => {
  return (
    <div className="flex flex-col shrink-0 items-center w-16 pb-4 overflow-auto border-r border-gray-300">
      {/** Sidebar Icon */}
      <Link
        to="/"
        className="flex items-center justify-center shrink-0 w-full h-16 bg-blue-300"
      >
        <img src={Logo} alt="ecs-logo" className="h-6" />
      </Link>

      {/** Sidebar elements */}
      <SidebarElement
        path="/courses"
        icon={
          <Icon
            path={mdiBookOpenBlankVariantOutline}
            size={1}
            color="currentColor"
          />
        }
        tooltip="Courses"
      />
      <SidebarElement
        path="/educado_admin/applications"
        icon={
          <Icon path={mdiShieldCheckOutline} size={1} color="currentColor" />
        }
        tooltip="Admin"
      />
    </div>
  );
};

const SidebarElement = ({
  path,
  icon,
  tooltip,
}: {
  path: string;
  icon: JSX.Element;
  tooltip: string;
}) => {
  // get the current location
  const location = useLocation();

  // matching the current path
  if (location.pathname == path) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={path}
            className="flex items-center justify-center shrink-0 w-10 h-10 mt-4 rounded-sm"
          >
            <span className="w-5 h-5 text-blue-500">{icon}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // not matching the current path
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={path}
          className="flex items-center justify-center shrink-0 w-10 h-10 mt-4 rounded-sm hover:bg-gray-300"
        >
          <span className="w-5 h-5">{icon}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
