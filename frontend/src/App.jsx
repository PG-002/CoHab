import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <LoginPage />
      <h1> YO</h1>
    </>
  );
}

export default App;
