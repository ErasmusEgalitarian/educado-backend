import { ReactNode } from "react";

interface Inputs {
  title: string;
  children: ReactNode;
}

export const PhonePreview = ({ title, children }: Inputs) => {
  return (
    <div className="flex flex-col h-[633px] w-[380px] bg-primary rounded-lg">
      <div className="w-full h-16 flex justify-center items-center text-white font-bold text-xl py-6">
        <p>{title}</p>
      </div>
      <div className="h-full flex justify-center items-start shadow-lg">
        <div className="mockup-phone">
          <div className="camera" />
          <div className="display">
            <div className="artboard artboard-demo w-[270px] h-[516px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
