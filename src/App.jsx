import { Routes, Route } from "react-router-dom";
import Community from "./pages/Community";
import Credits from "./pages/Credits";
import ChatBox from "./pages/ChatBox";
import Sidebar from "./components/Sidebar";
import "./App.css";
import {useState } from "react";
import { assets } from "./assets/assets";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
    {!isMenuOpen && <img
    onClick={()=>setIsMenuOpen(true)}
    src={assets.menu_icon} className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden invert dark:invert-0" alt=""/>}
      <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
        <div className="flex h-screen w-screen">
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/community" element={<Community />} />
            <Route path="/credits" element={<Credits />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
