import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import Markdown from "react-markdown";
import { assets } from "../assets/assets";
import Prism from "prismjs";
import { ChevronDown, ChevronUp } from "lucide-react";

const MAX_LINES = 6;
const COLLAPSED_HEIGHT = 140;

const Message = ({ message }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > COLLAPSED_HEIGHT);
    }
  }, [message.content]);

  return (
    <div>
      {message.role === "user" ? (
        <div className="flex items-start justify-end my-4 gap-2">
          <div className="flex flex-col gap-1 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl">
            <div className="relative">
              <p
                ref={contentRef}
                className="text-sm dark:text-primary whitespace-pre-wrap overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: expanded || !isOverflowing ? "none" : `${COLLAPSED_HEIGHT}px`,
                }}
              >
                {message.content}
              </p>

              {isOverflowing && !expanded && (
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 dark:from-[#3a2154] to-transparent pointer-events-none" />
              )}
            </div>

            {isOverflowing && (
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="self-center flex items-center gap-1 text-xs text-[#80609F] dark:text-[#B1A6C0] hover:text-[#57317C] dark:hover:text-primary transition-colors mt-1"
              >
                {expanded ? (
                  <>
                    Thu gọn <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    Xem thêm <ChevronDown size={14} />
                  </>
                )}
              </button>
            )}

            <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
          <img src={assets.user_icon} alt="" className="w-8 rounded-full" />
        </div>
      ) : (
        <div className="inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md my-4">
          {message.isImage ? (
            <img
              src={message.content}
              alt="Generated"
              className="w-full max-w-md mt-2 rounded-md"
            />
          ) : (
            <div className="text-sm dark:text-primary reset-tw">
              <Markdown>{message.content}</Markdown>
            </div>
          )}
          <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">
            {moment(message.timestamp).fromNow()}
          </span>
        </div>
      )}
    </div>
  );
};

export default Message;