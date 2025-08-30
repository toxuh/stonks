import { PropsWithChildren } from "react";

import { Sidebar } from "@/components/sidebar";
import { HeaderBarProvider, Topbar } from "@/components/header-bar";

export default function AppLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <HeaderBarProvider>
          <Topbar />
          <div className="p-6">{children}</div>
        </HeaderBarProvider>
      </div>
    </div>
  );
}

