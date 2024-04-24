import { useEffect, useState } from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  MessageCircleMore,
  Settings,
  LocateFixedIcon,
  CalendarDays,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

function SidebarLayout({ userInfo, setHouseInfo, handleLogOut }) {
  const [activePage, setActivePage] = useState("/login");

  let location = useLocation();

  useEffect(() => {
    const fetchHouseInfo = async () => {
      try {
        const userId = userInfo.userId;
        const JSONPayload = JSON.stringify({
          userId: userId,
        });
        const response = await fetch(
          "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/getHouse",
          {
            // Adjust URL as necessary
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSONPayload,
          }
        );
        if (response.ok && response.status == 200) {
          const data = await response.json();
          if (data.token) {
            const decoded = jwtDecode(data.token);
            setHouseInfo(decoded.house);
          } else {
            console.error("Invalid Response, no token");
          }
        } else if (response.status === 404) {
          alert("House Fetch failed: User not found");
        } else {
          throw new Error(response.status);
        }
      } catch (error) {
        console.error("House Fetch error", error);
      }
    };

    fetchHouseInfo();
  }, [userInfo]);

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);
  return (
    <div className="w-screen flex flex-row">
      <Sidebar userInfo={userInfo} handleLogOut={handleLogOut}>
        <SidebarItem
          icon={
            <LayoutDashboard
              size={25}
              className="text-eucalyptus-950 dark:text-eucalyptus-400"
            />
          }
          text={"Dashboard"}
          link={"dashboard"}
          active={activePage == "/dashboard"}
        ></SidebarItem>
        <SidebarItem
          icon={
            <ListChecks
              size={25}
              className="text-eucalyptus-950 dark:text-eucalyptus-400"
            />
          }
          text={"Task List"}
          link={"tasklist"}
          active={activePage == "/tasklist"}
        ></SidebarItem>
        <SidebarItem
          icon={
            <CalendarDays
              size={25}
              className="text-eucalyptus-950 dark:text-eucalyptus-400"
            />
          }
          text={"Calendar"}
          link={"calendar"}
          active={activePage == "/calendar"}
        ></SidebarItem>
        <SidebarItem
          icon={
            <LocateFixedIcon
              size={25}
              className="text-eucalyptus-950 dark:text-eucalyptus-400"
            />
          }
          text={"Roommate Location"}
          link={"location"}
          active={activePage == "/location"}
        ></SidebarItem>
        <SidebarItem
          icon={
            <MessageCircleMore
              size={25}
              className="text-eucalyptus-950 dark:text-eucalyptus-400"
            />
          }
          text={"Messages"}
          link={"messages"}
          active={activePage == "/messages"}
        ></SidebarItem>
        <SidebarItem
          icon={
            <Settings
              size={25}
              className="text-eucalyptus-950 dark:text-eucalyptus-400"
            />
          }
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
