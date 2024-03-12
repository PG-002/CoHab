import { Link, useNavigate } from "react-router-dom";
import { TodoList } from '../components/TodoList';

const DashboardPage = () => {
  const navigate = useNavigate();

  const LogOut = () => {
    localStorage.removeItem("sessionId");
    navigate("/");
  };
  return (
    <>
      <h1>HELLO WORLD!</h1>
      <TodoList />
      <button onClick={LogOut}>Log Out</button>
    </>
  );
};

export default DashboardPage;
