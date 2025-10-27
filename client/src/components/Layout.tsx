import { type ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-center items-center h-dvh bg-[#c0f1fa]">
      {children}
    </div>
  );
};
