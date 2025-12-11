import "react-toastify/dist/ReactToastify.css";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

// Components
import { Navbar } from "@/shared/components/navbar";
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
