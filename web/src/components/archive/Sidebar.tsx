import Tippy from "@tippyjs/react";
import { Link, useLocation } from "react-router-dom";

import "tippy.js/dist/tippy.css"; // optional

// static
import Logo from "../assets/ecs-logo.png";

// icons
import { BookOpenIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export const Sidebar = () => {
  return (
    <div className="flex flex-col flex-shrink-0 items-center w-16 pb-4 overflow-auto border-r border-gray-300">
      {/** Sidebar Icon */}
      <Link
        to="/"
        className="flex items-center justify-center flex-shrink-0 w-full h-16 bg-blue-300"
      >
        <img src={Logo} alt="ecs-logo" className="h-6" />
      </Link>

      {/** Sidebar elements */}
      <SidebarElement
        path="/courses"
        icon={<BookOpenIcon />}
        tooltip="Courses"
      />
      <SidebarElement
        path="/educado_admin/applications"
        icon={<ShieldCheckIcon />}
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
      <Tippy content={tooltip} placement="right">
        <Link
          to={path}
          className="flex items-center justify-center flex-shrink-0 w-10 h-10 mt-4 rounded"
        >
          <span className="w-5 h-5 text-blue-500">{icon}</span>
        </Link>
      </Tippy>
    );
  }

  // not matching the current path
  return (
    <Tippy content={tooltip} placement="right">
      <Link
        to={path}
        className="flex items-center justify-center flex-shrink-0 w-10 h-10 mt-4 rounded hover:bg-gray-300"
      >
        <span className="w-5 h-5">{icon}</span>
      </Link>
    </Tippy>
  );
};
