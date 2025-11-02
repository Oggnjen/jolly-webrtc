import { type ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
  return <div className='h-dvh bg-[#c0f1fa] py-4 px-2'>{children}</div>;
};
