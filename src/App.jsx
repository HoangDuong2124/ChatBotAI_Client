import {useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Community from "./pages/Community";
import Credits from "./pages/Credits";
import ChatBox from "./pages/ChatBox";
import Sidebar from "./components/Sidebar";
import Loading from "./pages/Loading";
import "./App.css";
import "./assets/prism.css";

import { assets } from "./assets/assets";
import { useAppContext } from "./context/AppContext";
import Login from "./pages/Login";

function App() {

  const {user} = useAppContext(); 

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {pathname} = useLocation();

  if(pathname === "/loading") return <Loading/>

  return (
    <>
    {!isMenuOpen && <img
    onClick={()=>setIsMenuOpen(true)}
    src={assets.menu_icon} className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden invert dark:invert-0" alt=""/>}
     
      {user ? (
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
      ) :(
           <div className="bg-gradient-to-b from-[#242124] to-[#000000] h-screen w-screen flex items-center justify-center">
            <Login/>
           </div>
      )}
     
    </>
  );
}

export default App;
