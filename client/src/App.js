import Navbar from "./components/Navbar";
import UserProvider from "./context/UserContext";
import "./global.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ShowProvider from "./context/ShowContext";
import User from "./pages/User";
import DetailedView from "./pages/DetailedView";

function App() {
  return (
    <>
      <Router>
        <UserProvider>
          <ShowProvider>
            <Navbar />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/user" element={<User />} />
              <Route exact path="/details/:id" element={<DetailedView />} />
            </Routes>
          </ShowProvider>
        </UserProvider>
      </Router>
    </>
  );
}

export default App;
