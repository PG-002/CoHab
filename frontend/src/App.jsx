import LoginPage from "./pages/LoginPage";
import "./App.css";
import SignUpPage from "./pages/SignUpPage";

if (localStorage.theme === "dark" || !("theme" in localStorage)) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

if (localStorage.theme === "dark") {
  localStorage.theme = "light";
} else {
  localStorage.theme = "dark";
}

function App() {
  return (
    <>
      <LoginPage />
      {/* <SignUpPage /> */}
    </>
  );
}

export default App;
