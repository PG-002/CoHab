import { Link, useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const LogOut = () => {
    localStorage.removeItem("sessionId");
    navigate("/");
  };
  return (
    <>
      <h1>HELLO WORLD!</h1>
      <button onClick={LogOut}>Log Out</button>
      <button><Link to="/task" className="text-white dark:text-white hover:underline">Task page</Link></button>
      <button><Link to="/chat" className="text-white dark:text-white hover:underline">GroupChat</Link></button>
    </>
  );
};

export default DashboardPage;
