import { useContext, useState, createContext } from "react";
import { ChevronFirst, ChevronLast, LogOut, MoreVertical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
const SidebarContext = createContext();

function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transiton-all object-contain ${
              expanded ? "w-32" : "w-0"
            }`}
            alt="logo"
          ></img>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? (
              <ChevronFirst className="text-black border-black" />
            ) : (
              <ChevronLast className="text-black border-black" />
            )}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className={`flex-1 px-3 transition-all`}>{children}</ul>
          <div className="mb-auto px-3 transition-all">
            <SidebarItem
              icon={<LogOut size={25} className="text-black" />}
              text={"Log Out"}
            ></SidebarItem>
          </div>
        </SidebarContext.Provider>
        <div className="border-t flex p-3 items-center justify-center">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt="user avatar"
            className="size-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transiton-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="mx-auto leading-4">
              <h4 className="text-black font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">JohnDoe@gmail.com</span>
            </div>
            {/* <MoreVertical className="text-red-500" size={20}></MoreVertical> */}
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;

export function SidebarItem({ icon, text, active, alert, link }) {
  const { expanded } = useContext(SidebarContext);

  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("sessionId");
    navigate("/login");
  };

  return (
    <li>
      {link ? (
        <Link
          to={`/${link}`}
          className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md curosr-pointer transition-colors group ${
            active
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800  "
              : "hover:bg-indigo-50 text-gray-600"
          }`}
        >
          {icon}
          <span
            className={`text-black overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0 whitespace-nowrap"
            } `}
          >
            {text}
          </span>
          {alert && (
            <div
              className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
                expanded ? "" : "top-2"
              }`}
            />
          )}
          {!expanded && (
            <div
              className={`whitespace-nowrap absolute left-full rounded-md px-2 py-1 ml-6 
        bg-indigo-100 text-indigo-800 invisible opactiy-2 -translate-x-3 transition-all 
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
            >
              {text}
            </div>
          )}
        </Link>
      ) : (
        <div
          onClick={handleLogOut}
          className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md curosr-pointer transition-colors group hover:cursor-pointer ${
            active
              ? "bg-gradient-to-tr from-red-200 to-red-100 text-red-800  "
              : "hover:bg-red-50 text-gray-600"
          }`}
        >
          {icon}
          <span
            className={`text-black overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0 whitespace-nowrap"
            } `}
          >
            {text}
          </span>
          {!expanded && (
            <div
              className={`whitespace-nowrap absolute left-full rounded-md px-2 py-1 ml-6 
        bg-red-100 text-red-800 invisible opactiy-2 -translate-x-3 transition-all 
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
            >
              {text}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
