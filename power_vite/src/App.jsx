import Login from "./components/Login"
import Home from "./components/Home"
import Kuizu from "./components/Kuizu";
import AddDate from "./components/addDate"
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
      </Routes>
    </>
  )
}
export default App