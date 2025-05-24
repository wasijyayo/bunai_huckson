import Login from "./components/Login"
import Home from "./components/Home"
import AddDate from "./components/addDate"

import Kuizu from "./components/Kuizu";
import Minesweeper from "./components/Minesweeper";
import Rungame from "./components/Rungame"
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}
        />
        <Route path="/Kuizu" element={<Kuizu/>}
        />
        <Route path="/" element={<addDate />}
        />
        <Route path="/login" element={<Login />} />

        <Route path="/Minesweeper" element={< Minesweeper/>} />
        <Route path="/Rungame" element={< Rungame/>} />

      </Routes>
    </>
  )
}
export default App