import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import moment from "moment";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    createNewChat,
    axios,
    setChats,
    fetchUserChats,
    setToken,
    token,
  } = useAppContext();
  const [search, setSearch] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logged out successfully");
  };

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation();
      const confirm = window.confirm(
        "Are you sure you want to delete this chat?"
      );
      if (!confirm) return;
      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        {
          headers: { Authorization: token },
        }
      );
      if (data.success) {
        setChats((prev) =>
          prev.filter((chat) => (chat._id || chat.id) !== chatId)
        );
        await fetchUserChats();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div
      className={`flex flex-col h-screen min-w-72 p-4 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 
    border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-50 ${
      !isMenuOpen && "max-md:-translate-x-full"
    }`}
    >
      {/* Logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt=""
        className="w-full max-w-40"
      />

      {/* New Chat Button */}
      <button
        onClick={createNewChat}
        className="flex items-center justify-center w-full mt-5 py-2 text-white 
        bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/20"
      >
        <span className="mr-2 text-xl ">+</span> New Chat
      </button>

      {/* Search Conversations */}
      <div className="flex items-center gap-2 p-2.5 mt-3 border border-gray-400 dark:border-white/20 rounded-md">
        <img
          src={assets.search_icon}
          className="w-4 invert dark:invert-0"
          alt=""
        />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search Conversations"
          className="w-full text-xs placeholder:text-gray-400 bg-transparent outline-none"
        />
      </div>

      {/* Recent Chats */}
      <div className="mt-3 flex min-h-0 flex-1 flex-col">
        {chats.length > 0 && (
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-[#B1A6C0]">
            Recent Chats
          </p>
        )}
        <div className="recent-chat-scroll min-h-0 flex-1 overflow-y-auto pr-1 text-sm space-y-2">
          {chats
            .filter((chat) =>
              chat.messages[0]
                ? chat.messages[0]?.content
                    .toLowerCase()
                    .includes(search.toLowerCase())
                : chat.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((chat) => {
              const chatId = chat._id || chat.id;
              const isActive =
                (selectedChat?._id || selectedChat?.id) === chatId;

              return (
                <div
                  onClick={() => {
                    navigate("/");
                    setSelectedChat(chat);
                    setIsMenuOpen(false);
                  }}
                  key={chatId}
                  className={`group flex items-center justify-between gap-2 p-2 px-3 border rounded-md cursor-pointer transition-all ${
                    isActive
                      ? "border-[#80609F]/40 bg-[#80609F]/10 dark:bg-[#57317C]/20"
                      : "border-gray-300 dark:border-[#80609F]/15 hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate w-full">
                      {chat.messages.length > 0
                        ? chat.messages[0].content.slice(0, 32)
                        : chat.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                      {moment(chat.updatedAt).fromNow()}
                    </p>
                  </div>
                  <img
                    onClick={(e) =>
                      toast.promise(deleteChat(e, chatId), {
                        loading: "deleting...",
                      })
                    }
                    src={assets.bin_icon}
                    className="w-4 shrink-0 cursor-pointer invert dark:invert-0 opacity-70 transition-opacity md:opacity-0 md:group-hover:opacity-100"
                    alt=""
                  />
                </div>
              );
            })}
        </div>
      </div>

      <div className="shrink-0 mt-3 space-y-2 border-t border-gray-200 pt-3 dark:border-white/10">
        {/* Community Images */}
        <div
          onClick={() => {
            navigate("/community"), setIsMenuOpen(false);
          }}
          className="flex items-center gap-2 p-2 border border-gray-300
       dark:border-white/15 rounded-md cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-[1.02]"
        >
          <img
            src={assets.gallery_icon}
            className="w-4 invert dark:invert-0 "
            alt=""
          />
          <div className="flex flex-col text-sm">
            <p>Community Images</p>
          </div>
        </div>

        {/* Credit purchases option */}
        <div
          onClick={() => {
            navigate("/credits"), setIsMenuOpen(false);
          }}
          className="flex items-center gap-2 p-2 border border-gray-300
       dark:border-white/15 rounded-md cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-[1.02]"
        >
          <img
            src={assets.diamond_icon}
            className="w-4  dark:invert "
            alt=""
          />
          <div className="min-w-0 flex-1 text-sm">
            <p>Credits : {user?.credits}</p>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div
          className="flex items-center justify-between gap-2 p-2 border border-gray-300
       dark:border-white/15 rounded-md"
        >
          <div className="flex items-center gap-2 text-sm">
            <img
              src={assets.theme_icon}
              className="w-4 invert dark:invert-0"
              alt=""
            />
            <p>Dark Mode</p>
          </div>
          <label className="relative inline-flex cursor-pointer">
            <input
              onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
            />
            <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
          </label>
        </div>

        {/* User Account */}
        <div
          className=" group flex items-center gap-3 p-2 border border-gray-300
       dark:border-white/15 rounded-md cursor-pointer "
        >
          <img src={assets.user_icon} className="w-7 rounded-full " alt="" />
          <p className="flex-1 text-sm dark:text-primary truncate">
            {user ? user.name : "Login your account"}
          </p>
          {user && (
            <img
              onClick={logout}
              src={assets.logout_icon}
              alt=""
              className="h-5 cursor-pointer hidden invert dark:invert-0 group-hover:block"
            />
          )}
        </div>
      </div>

      {/* Close Sidebar */}
      <img
        onClick={() => setIsMenuOpen(false)}
        src={assets.close_icon}
        className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden invert dark:invert-0"
        alt=""
      />
    </div>
  );
};

export default Sidebar;
