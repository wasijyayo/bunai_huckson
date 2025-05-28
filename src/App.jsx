import Login from "./components/Login";
import Home from "./components/Home";
import AddDate from "./components/addDate";
import Kuizu from "./components/Kuizu";
import Minesweeper from "./components/Minesweeper";
import Glaf from "./components/Glaf";
import Run from "./components/Run";
//import Gimini from "./components/Gimini"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Kuizu" element={<Kuizu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Minesweeper" element={<Minesweeper />} />
        <Route path="/Run" element={<Run />} />
        <Route path="/Glaf" element={<Glaf />} />
      </Routes>
    </>
  );
}
export default App;
