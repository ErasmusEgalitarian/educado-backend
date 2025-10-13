import {
  mdiBellOutline,
  mdiAccount,
  mdiLogoutVariant,
  mdiCertificate,
  mdiAccountCog,
  mdiChatQuestionOutline,
  mdiTranslate,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import useAuthStore from "@/auth/hooks/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuIconItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuIconSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/shared/components/shadcn/dropdown-menu";

import { getUserInfo, userInfo } from "../../features/auth/lib/userInfo";
import { useNotifications } from "../context/NotificationContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const { clearToken } = useAuthStore((state) => state);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { notifications, setNotifications } = useNotifications();
  const [position, setPosition] = useState("portuguese");
  const { t, i18n } = useTranslation();
  // Logout handler
  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("token");
    navigate("/welcome");
  };

  // Fetch user info
  const userInfo: userInfo = getUserInfo();

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
      <nav className="relative flex navbar items-center justify-between py-3 px-6 bg-white shadow-md">
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
                        {t("navbar.noNotifications")}
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
                      {t("actions.clearAll")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Info */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-3 cursor-pointer rounded-md p-2 hover:bg-[#222]/10">
                <div className="flex items-center">
                  <div>
                    <span className="hidden sm:block text-sm font-bold text-grayMedium font-['Montserrat']">
                      {`${userInfo.firstName} ${userInfo.lastName}`}
                    </span>
                    <span className="hidden sm:block text-xs font-normal text-grayMedium font-['Montserrat']">
                      {userInfo.email}
                    </span>
                  </div>
                </div>
                <div
                  className="
                  bg-primary-surface-lighter text-primary-border-lighter 
                  border-1 border-primary-border-lighter rounded-full w-10 h-10 
                  flex items-center justify-center "
                >
                  <span className="text-md text-center font-bold select-none">{`${userInfo.firstName.charAt(0)}${userInfo.lastName.charAt(0)}`}</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-50" align="end">
              <DropdownMenuIconItem
                onClick={() => {
                  navigate("/profile");
                }}
                icon={() => <Icon path={mdiAccountCog} size={1} />}
              >
                {t("navbar.editProfile")}
              </DropdownMenuIconItem>
              <DropdownMenuIconItem
                onClick={() => {
                  navigate("/certificates");
                }}
                icon={() => <Icon path={mdiCertificate} size={1} />}
              >
                {t("navbar.myCertificates")}
              </DropdownMenuIconItem>
              <DropdownMenuIconItem
                onClick={() => {
                  navigate("/feedback");
                }}
                icon={() => <Icon path={mdiChatQuestionOutline} size={1} />}
              >
                {t("navbar.feedback")}
              </DropdownMenuIconItem>

              {userInfo.role === "admin" && (
                <>
                  <DropdownMenuSub>
                    <DropdownMenuIconSubTrigger
                      icon={() => <Icon path={mdiTranslate} size={1} />}
                    >
                      {t("language.switchLanguage")}
                    </DropdownMenuIconSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                          value={i18n.language}
                          onValueChange={(value) => {
                            void i18n.changeLanguage(value);
                            setPosition(value);
                          }}
                        >
                          <DropdownMenuRadioItem value="pt">
                            Português 🇧🇷
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="en">
                            English 🇺🇸
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuIconItem
                    onClick={() => {
                      navigate("/educado-admin/applications");
                    }}
                    icon={() => <Icon path={mdiAccount} size={1} />}
                  >
                    {t("navbar.admin")}
                  </DropdownMenuIconItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuIconItem
                onClick={handleLogout}
                icon={() => <Icon path={mdiLogoutVariant} size={1} />}
                variant="destructive"
              >
                {t("navbar.logout")}
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
