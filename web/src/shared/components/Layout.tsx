import "react-toastify/dist/ReactToastify.css";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

// Components
import { Navbar } from "./Navbar";
import AdminNavToggle from "./AdminNavToggle";

// TODO: Deprecate in favour of PageContainer
/**
 * Layout component
 *
 * @param {ReactNode} children The children components
 * @returns HTML Element
 */
const Layout = ({
  children,
}: {
  children: ReactNode[] | ReactNode;
  meta: string | undefined;
}) => {
  return (
    <>
      <div className="flex w-screen h-screen text-gray-700">
        <div className="flex flex-col grow">
          {/** Top Nav bar */}
          <Navbar />

            {/* Courses/Admin toggle just under the navbar */}
            <div className="flex justify-end bg-primary-surface-subtle px-6 py-3">
                <AdminNavToggle />
            </div>


            {/** Content */}
          <main className="bg-primary-surface-subtle">{children}</main>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </>
  );
};

export default Layout;
