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
    </>
  );
};

export default DashboardPage;
