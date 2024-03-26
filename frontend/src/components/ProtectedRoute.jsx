import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  LayoutDashboard,
  Home,
  LogOut,
  MapPin,
  MessageCircle,
  Calendar,
  Settings,
  ListChecks,
} from "lucide-react";

const isAuthenticated = () => {
  const sessionId =
    sessionStorage.getItem("sessionId") || localStorage.getItem("sessionId");
  // You might also want to validate that the session ID is still valid on the server-side
  return sessionId !== null; // Returns true if there is a sessionId
};

// This is your ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  const handleNavigate = (e) => {};

  const Logout = () => {
    localStorage.removeItem("sessionId");
    navigate("/");
  };

  return (
    <div className="flex w-screen">
      <Sidebar
        collapsed={collapsed}
        className="h-screen bg-white border-r shadow-sm"
      >
        <Menu
          menuItemStyles={{
            root: {
              fontSize: "13px",
              fontWeight: 400,
            },
            label: {
              color: "black",
            },
            icon: {
              color: "black",
            },
          }}
        >
          <MenuItem
            icon={<LayoutDashboard></LayoutDashboard>}
            component={<Link to="/dashboard"></Link>}
          >
            {" "}
            Dashboard{" "}
          </MenuItem>
          <MenuItem
            icon={<Calendar></Calendar>}
            component={<Link to="/dashboard/calendar"></Link>}
          >
            {" "}
            Calendar{" "}
          </MenuItem>
          <MenuItem
            icon={<ListChecks></ListChecks>}
            component={<Link to="/dashboard/taskList"></Link>}
          >
            {" "}
            Tasklist{" "}
          </MenuItem>
          <MenuItem
            icon={<MessageCircle></MessageCircle>}
            component={<Link to="/dashboard/messages"></Link>}
          >
            {" "}
            Chat{" "}
          </MenuItem>
          <MenuItem
            icon={<MapPin></MapPin>}
            component={<Link to="/dashboard/taskList"></Link>}
          >
            {" "}
            Roommate Finder{" "}
          </MenuItem>
          <MenuItem
            icon={<Settings></Settings>}
            component={<Link to="/dashboard/settings"></Link>}
          >
            {" "}
            Settings{" "}
          </MenuItem>
          <MenuItem icon={<LogOut></LogOut>} onClick={Logout}>
            {" "}
            Log Out{" "}
          </MenuItem>
        </Menu>
      </Sidebar>
      {children}
    </div>
  ); // If authenticated, render the children components
};

export default ProtectedRoute;
