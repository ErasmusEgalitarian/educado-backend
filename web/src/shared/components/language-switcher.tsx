import { useTranslation } from "react-i18next";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/shared/components/shadcn/dropdown-menu";

import { Button } from "./shadcn/button";

// TODO: Style according to design
export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language: string) => {
    void i18n.changeLanguage(language);
  };

  const currentLanguage = i18n.language;
  const getCurrentLanguageLabel = () => {
    return currentLanguage === "pt"
      ? t("language.portuguese")
      : t("language.english");
  };

  const getLanguageSymbol = (language?: string) => {
    return language === "pt" ? "🇧🇷" : "🇺🇸";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {getLanguageSymbol(currentLanguage) + " "}
          {getCurrentLanguageLabel()}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuCheckboxItem
          className={
            currentLanguage === "pt"
              ? "bg-gray-50 text-[#166276] font-medium"
              : "text-gray-700"
          }
          checked={currentLanguage === "pt"}
          onCheckedChange={() => {
            changeLanguage("pt");
          }}
        >
          {getLanguageSymbol("pt")} {t("language.portuguese")}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className={
            currentLanguage === "en"
              ? "bg-gray-50 text-[#166276] font-medium"
              : "text-gray-700"
          }
          checked={currentLanguage === "en"}
          onClick={() => {
            changeLanguage("en");
          }}
        >
          {getLanguageSymbol("en")} {t("language.english")}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
