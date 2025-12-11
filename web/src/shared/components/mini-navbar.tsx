import { Link } from "react-router-dom";

/**
 * Renders a thin restricted navbar.
 * Used for pages where the user is not logged in.
 * Features only the Educado logo that redirects to the home page.
 * @returns JSX.Element
 */
const MiniNavbar = () => {
  return (
    <nav
      className="flex fixed w-full items-center justify-between bg-secondary box-shadow-md bg-fixed top-0 left-0 right-0 z-10"
      style={{
        background: "var(--secondary, #F1F9FB)",
        boxShadow: "0px 4px 4px 0px rgba(35, 100, 130, 0.25)",
      }}
    >
      <div className="w-[165.25px] h-6 justify-start items-center gap-[7.52px] flex py-6 px-12">
        <div className="navbar-start">
          <Link
            to="/"
            className="w-[165.25px] h-6 justify-start items-center gap-[6px] inline-flex space-x-1 normal-case text-xl"
          >
            <img src="/logo.svg" alt="logo" className="w-[24.43px] h-6" />
            <img src="/educado.svg" alt="educado" className="h-6" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MiniNavbar;
