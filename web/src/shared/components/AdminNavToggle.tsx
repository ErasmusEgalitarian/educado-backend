import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";



const AdminNavToggle = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const isOnAdmin = location.pathname.startsWith("/educado-admin");
    const isOnCourses = location.pathname.startsWith("/courses");

    return (
        <div className="inline-flex rounded-full bg-slate-100 px-1 py-1 text-sm md:text-base font-semibold shadow-sm">
            <button
                type="button"
                onClick={() => navigate("/courses")}
                className={
                    "px-20 py-1.5 rounded-full transition " +
                    (isOnCourses
                        ? "bg-teal-600 text-white   "
                        : "text-slate-600 hover:text-slate-800")
                }
            >
                {t("navbar.courses")}
            </button>

            <button
                type="button"
                onClick={() => navigate("/educado-admin")}
                className={
                    "px-20 py-1.5 rounded-full transition " +
                    (isOnAdmin
                        ? "bg-teal-600 text-white"
                        : "text-slate-600 hover:text-slate-800")
                }
            >
                {t("navbar.admin")}
            </button>
        </div>
    );
};
export default AdminNavToggle;