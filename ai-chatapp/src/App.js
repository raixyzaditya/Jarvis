import Chat from "./component/Chat";
import Home from "./component/Home";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./component/Login";
import Signup from "./component/Signup"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
