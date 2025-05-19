import Login from "./components/Login"
import Home from "./components/Home"
import AddDate from "./components/addDate"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}
        />
        <Route path="/" element={<addDate />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}
export default App