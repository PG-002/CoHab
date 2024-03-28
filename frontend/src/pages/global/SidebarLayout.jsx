import { useEffect, useState } from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  MessageCircleMore,
  Settings,
} from "lucide-react";

function SidebarLayout() {
  const [activePage, setActivePage] = useState("/login");
  let location = useLocation();

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);
  return (
    <div className="w-screen flex flex-row">
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard size={25} className="text-black" />}
          text={"Dashboard"}
          link={"dashboard"}
          alert
          active={activePage == "/dashboard"}
        ></SidebarItem>
        <SidebarItem
          icon={<ListChecks size={25} className="text-black" />}
          text={"Task List"}
          alert
          link={"tasklist"}
          active={activePage == "/tasklist"}
        ></SidebarItem>
        <SidebarItem
          icon={<MessageCircleMore size={25} className="text-black" />}
          text={"Messages"}
          link={"messages"}
          active={activePage == "/messages"}
        ></SidebarItem>
        <SidebarItem
          icon={<Settings size={25} className="text-black" />}
          text={"Settings"}
          link={"settings"}
          active={activePage == "/settings"}
        ></SidebarItem>
      </Sidebar>
      <Outlet />
    </div>
  );
}

export default SidebarLayout;
