import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "../components/Message";
import toast from "react-hot-toast";

const ChatBox = () => {
  const containerRef = useRef(null);
  const promptRef = useRef(null);

  const { selectedChat, theme, user, axios, token, setUser } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState([]);
  const [mode] = useState("auto");
  const [isPublished, setIsPublished] = useState(false);
  const canSubmit = prompt.trim().length > 0 && !loading;

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const trimmedPrompt = prompt.trim();
      if (!trimmedPrompt) return;
      if (!user) return toast("Login to send message");

      setLoading(true);
      const promptCopy = prompt;
      const promptHistoryCopy = [...promptHistory, { role: "user", content: trimmedPrompt }];
      setPromptHistory(promptHistoryCopy);
      setPrompt("");
      setMessages((prev) => [
        ...prev,
        { role: "user", content: trimmedPrompt, timestamp: Date.now(), isImage: false },
      ]);
      const endpoint = mode === "auto" ? "/api/message/send" : `/api/message/${mode}`;

      const { data } = await axios.post(
        endpoint,
        {
          chatId: selectedChat._id,
          prompt: trimmedPrompt,
          promptHistoryCopy,
          isPublished,
        },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);

        const actualMode = data.mode || mode;
        setUser((prev) => ({
          ...prev,
          credits: prev.credits - (actualMode === "image" ? 2 : 1),
        }));
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handlePromptKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) onSubmit(e);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setPromptHistory(selectedChat.messages.map((msg) => ({ role: msg.role, content: msg.content })));
    }
  }, [selectedChat, setMessages]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (!promptRef.current) return;
    promptRef.current.style.height = "0px";
    promptRef.current.style.height = `${Math.min(promptRef.current.scrollHeight, 180)}px`;
  }, [prompt]);

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* Chat Messages */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div className="h-full flex flex-col justify-center items-center gap-2 text-primary ">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt=""
              className="w-full max-w-56 sm:max-w-[272px]"
            />
            <p className="mt-5 text-4xl sm:text-6xl text center text-gray-400 dark:text-white">
              Ask me anything!
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {/* Three Dots Loading */}
        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
          </div>
        )}
      </div>

      {/* Hiện checkbox publish khi đang ở mode "image" hoặc "auto"
          (vì ở "auto" AI có thể quyết định tạo ảnh mà user không biết trước) */}
      {(mode === "image" || mode === "auto") && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Publish Generated Image to Community</p>
          <input
            onChange={(e) => setIsPublished(e.target.checked)}
            type="checkbox"
            className="cursor-pointer"
            checked={isPublished}
          />
        </label>
      )}

      {/* Prompt Input */}
      <form
        onSubmit={onSubmit}
        className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-2xl w-full max-w-2xl p-3 pl-4 mx-auto flex gap-3 items-end"
      >
        {/* <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="mb-1.5 text-sm pl-3 pr-2 outline-none bg-transparent"
        >
          <option className="dark:bg-purple-900" value="auto">
            Auto
          </option>
          <option className="dark:bg-purple-900" value="text">
            Text
          </option>
          <option className="dark:bg-purple-900" value="image">
            Image
          </option>
        </select> */}
        <textarea
          ref={promptRef}
          onChange={handlePromptChange}
          onKeyDown={handlePromptKeyDown}
          value={prompt}
          placeholder="Type your prompt here..."
          rows={1}
          className="recent-chat-scroll max-h-44 min-h-8 flex-1 resize-none overflow-y-auto bg-transparent py-1.5 text-sm leading-5 outline-none placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className={`shrink-0 rounded-full transition-all ${
            canSubmit ? "cursor-pointer opacity-100 hover:scale-105" : "cursor-not-allowed opacity-40"
          }`}
        >
          <img src={loading ? assets.stop_icon : assets.send_icon} className="w-8 invert-0" alt="" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;