import {
  mdiBellOutline,
  mdiAccount,
  mdiLogoutVariant,
  mdiCertificate,
  mdiNotebookOutline,
  mdiAccountCog,
  mdiChatQuestionOutline,
} from "@mdi/js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIconItem,
  DropdownMenuTrigger,
} from "@/shared/components/shadcn/dropdown-menu"

import { Icon } from "@mdi/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuthStore from "@/auth/hooks/useAuthStore";

import { getUserInfo } from "../../features/auth/lib/userInfo";
import { useNotifications } from "../context/NotificationContext";



export const Navbar = () => {
  const navigate = useNavigate();
  const { clearToken } = useAuthStore((state) => state);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { addNotification, notifications, setNotifications } =
    useNotifications();

  // Logout handler
  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("token");
    navigate("/welcome");
  };

  // Fetch user info
  const userInfo: any = getUserInfo();

  let firstName;
  userInfo.firstName
    ? (firstName = userInfo.firstName)
    : (firstName = "Firstname");

  let lastName = "Lastname";
  userInfo.lastName ? (lastName = userInfo.lastName) : (lastName = "Lastname");

  let email = "email";
  userInfo.email ? (email = userInfo.email) : (email = "Email");

  // Notification handlers
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <main>
      <nav className="relative flex navbar items-center justify-between py-3.5 px-6 bg-white shadow-md">
        {/* Navbar Logo */}
        <div className="w-[165.25px] h-6 justify-start items-center gap-[7.52px] flex py-6 px-8">
          <Link
            to="/"
            className="w-[165.25px] h-6 flex items-center gap-[6px] text-xl"
          >
            <img src="/logo.svg" alt="logo" className="w-[24.43px] h-6" />
            <img src="/educado.svg" alt="educado" className="h-6" />
          </Link>
        </div>

        {/* Navbar Links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex gap-6">
            <li>
              <Link
                to="/courses"
                className="flex items-center text-lg font-['Montserrat']"
              >
                <Icon path={mdiNotebookOutline} size={1} color="grayMedium" />
                <span>Cursos</span>
              </Link>
            </li>
            <li>
              <Link
                to="/certificates"
                className="flex items-center text-lg font-['Montserrat']"
              >
                <Icon path={mdiCertificate} size={1} color="grayMedium" />
                <span>Meus certificados</span>
              </Link>
            </li>
            <li>
              {userInfo.role === "admin" && (
                <Link
                  to="/educado-admin/applications"
                  className="flex items-center text-lg font-['Montserrat']"
                >
                  <Icon path={mdiAccount} size={1} color="grayMedium" />
                  <span>Admin</span>
                </Link>
              )}
            </li>
          </ul>
        </div>

        {/* Notification Bell and User Info */}
        <div className="relative flex items-center gap-6 pr-10 z-50">
          {/* Notification Bell */}
          <div className="relative flex items-center gap-6">
            <button
              onClick={toggleDropdown}
              className="relative flex items-center"
            >
              <Icon path={mdiBellOutline} size={1} color="grayMedium" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 inline-block w-4 h-4 bg-red-500 text-white text-xs leading-tight text-center rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isDropdownOpen && (
              <div className="dropdown dropdown-end bg-white absolute w-[245px] top-12 right-0 rounded-lg shadow-md z-50">
                <div className="p-2 max-h-[250px] overflow-y-auto">
                  <ul className="menu flex flex-col items-start w-full">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <li
                          key={notification.id}
                          className="relative p-2 hover:bg-gray-100 w-full flex items-start"
                        >
                          {notification.link ? (
                            <a
                              href={notification.link}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {notification.message}
                            </a>
                          ) : (
                            <span className="text-sm">
                              {notification.message}
                            </span>
                          )}
                          <button
                            onClick={() => {
                              handleDeleteNotification(notification.id);
                            }}
                            className="absolute top-0 right-0 text-red-500 text-sm"
                          >
                            ✕
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500 text-sm">
                        No notifications
                      </li>
                    )}
                  </ul>
                </div>

                {notifications.length > 0 && (
                  <div className="w-full text-right border-t mt-2 p-2">
                    <button
                      onClick={handleClearAll}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-col items-start">
            <span className="hidden sm:block text-sm font-bold text-grayMedium font-['Montserrat']">
              {`${firstName} ${lastName}`}
            </span>
            <span className="hidden sm:block text-xs font-normal text-grayMedium font-['Montserrat']">
              {email}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="
                bg-primary-surface-lighter text-primary-border-lighter 
                border-1 border-primary-border-lighter rounded-full w-10 h-10 
                flex items-center justify-center cursor-pointer"
              >
                <span className="text-md text-center font-bold select-none">{`${firstName.charAt(0)}${lastName.charAt(0)}`}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuIconItem 
                onClick={() => navigate("/profile")} 
                icon={() => <Icon path={mdiAccountCog} size={1} />} 
              >
                Editar perfil
              </DropdownMenuIconItem>
              <DropdownMenuIconItem 
                onClick={() => navigate("/certificates") } 
                icon={() => <Icon path={mdiCertificate} size={1} />}
              >
                Meus certificados
              </DropdownMenuIconItem>
              <DropdownMenuIconItem 
                onClick={() => navigate("/feedback") }
                icon={() => <Icon path={mdiChatQuestionOutline} size={1} />}
              >
                Feedback
              </DropdownMenuIconItem>
              <DropdownMenuIconItem 
                onClick={handleLogout} 
                icon={() => <Icon path={mdiLogoutVariant} size={1} />}
                variant={"destructive"}
              >
                Sair
              </DropdownMenuIconItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* gap between navbar and other pages */}
      <div className="h-0" />
    </main>
  );
};
