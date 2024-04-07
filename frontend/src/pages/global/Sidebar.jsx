import { useContext, useState, createContext } from "react";
import { ChevronFirst, ChevronLast, LogOut, MoreVertical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
const SidebarContext = createContext();

function Sidebar({ userInfo, children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white dark:bg-neutral-900 border-r shadow-sm dark:border-neutral-800">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/285.svg"
            className={`overflow-hidden transiton-all object-contain ${
              expanded ? "w-32" : "w-0"
            }`}
            alt="logo"
          ></img>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-eucalyptus-50 hover:bg-eucalyptus-100 dark:bg-eucalyptus-950 dark:hover:bg-eucalyptus-800"
          >
            {expanded ? (
              <ChevronFirst className="text-eucalyptus-950 border-black dark:text-eucalyptus-50" />
            ) : (
              <ChevronLast className="text-eucalyptus-950 border-black dark:text-eucalyptus-50" />
            )}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className={`flex-1 px-3 transition-all `}>{children}</ul>
          <div className="mb-auto px-3 transition-all">
            <SidebarItem
              icon={
                <LogOut
                  size={25}
                  className="text-eucalyptus-950 dark:text-eucalyptus-400"
                />
              }
              text={"Log Out"}
            ></SidebarItem>
          </div>
        </SidebarContext.Provider>
        <div className="border-t dark:border-neutral-800 flex p-3 items-center justify-center">
          <img
            src={`https://ui-avatars.com/api/?name=${`${userInfo.firstName} + ${userInfo.lastName}`}&background=bbf7d0&color=052e16&bold=true`}
            alt="user avatar"
            className="size-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transiton-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="mx-auto leading-4">
              <h4 className="text-eucalyptus-950 font-semibold dark:text-eucalyptus-50 ">
                {userInfo.firstName} {userInfo.lastName}
              </h4>
              <span className="text-xs text-gray-600 dark:text-eucalyptus-500  ">
                {userInfo.email}
              </span>
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
    localStorage.removeItem("userInfo");
    localStorage.removeItem("eventsInfo");
    localStorage.removeItem("houseInfo");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <li className="list-none">
      {link ? (
        <Link
          to={`/${link}`}
          className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md curosr-pointer transition-colors group ${
            active
              ? "bg-gradient-to-tr from-eucalyptus-200 to-eucalyptus-100 text-eucalyptus-950 dark:text-eucalyptus-50 dark:bg-gradient-to-tr dark:from-eucalyptus-950 dark:to-eucalyptus-950"
              : "hover:bg-eucalyptus-50 dark:hover:bg-eucalyptus-950 text-eucalyptus-950"
          }`}
        >
          {icon}
          <span
            className={`text-eucalyptus-950 dark:text-eucalyptus-50 overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0 whitespace-nowrap"
            } `}
          >
            {text}
          </span>
          {/* {alert && (
            <div
              className={`absolute right-2 w-2 h-2 rounded bg-green-400 ${
                expanded ? "" : "top-2"
              }`}
            />
          )} */}
          {!expanded && (
            <div
              className={`whitespace-nowrap absolute left-full rounded-md px-2 py-1 ml-6 
        bg-eucalyptus-100 dark:bg-eucalyptus-950 text-eucalyptus-950 dark:text-eucalyptus-50 invisible opactiy-2 -translate-x-3 transition-all 
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
              : "hover:bg-red-50 dark:hover:bg-red-800 text-eucalyptus-950"
          }`}
        >
          {icon}
          <span
            className={`text-eucalyptus-950 dark:text-eucalyptus-50 overflow-hidden transition-all ${
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
