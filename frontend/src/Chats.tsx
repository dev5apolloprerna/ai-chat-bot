import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Plus, Menu, X } from "lucide-react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import Markdown from "react-markdown";

/* ---------------- VISITOR + COMPANY ---------------- */

const getVisitorId = () => {
  let id = localStorage.getItem("visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitor_id", id);
  }
  return id;
};

const visitor_id = getVisitorId();

/* ---------------- TYPES ---------------- */

type Role = "user" | "ai";

type Message = {
  role: Role;
  text: string;
};

/* ---------------- COMPONENT ---------------- */

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [title, setTitle] = useState<string | null>(null);
  const [chatTitles, setChatTitles] = useState<string[]>([]);
  const [activeTitle, setActiveTitle] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  /* ---------------- GET COMPANY ID ---------------- */

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const companyId = params.get("company");

    if (!companyId) {
      console.error("No company ID provided in URL");
      return;
    }

    localStorage.setItem("company_id", companyId);
  }, []);

  /* ---------------- SOCKET ---------------- */

  useEffect(() => {
    const company_id = localStorage.getItem("company_id");

    const socket = io(import.meta.env.VITE_BACK_URL, {
      auth: {
        visitor_id,
        company_id,
      },
    });

    socketRef.current = socket;

    socket.on("bot_message", (data) => {
      setTyping(false);

      if (!title && data.title) {
        setTitle(data.title);
        setActiveTitle(data.title);
        setChatTitles((prev) =>
          prev.includes(data.title) ? prev : [data.title, ...prev]
        );
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.message },
      ]);
    });

    socket.on("bot_typing", () => setTyping(true));

    return () => {
      socket.disconnect();
    };
  }, []);

  /* ---------------- LOAD LATEST CHAT ---------------- */

  useEffect(() => {
    async function loadLatestChat() {
      const company_id = localStorage.getItem("company_id");

      const res = await axios.post(
        `${import.meta.env.VITE_BACK_URL}/latest-chat`,
        { visitor_id, company_id }
      );

      setActiveTitle(res.data.title);
      setTitle(res.data.title);
    }

    loadLatestChat();
  }, []);

  /* ---------------- LOAD TITLES ---------------- */

  useEffect(() => {
    async function loadTitles() {
      const company_id = localStorage.getItem("company_id");

      const res = await axios.post(
        `${import.meta.env.VITE_BACK_URL}/chat-titles`,
        { visitor_id, company_id }
      );

      setChatTitles(res.data.titles || []);
    }

    loadTitles();
  }, []);

  /* ---------------- LOAD MESSAGES ---------------- */

  useEffect(() => {
    async function loadMessages() {
      if (!activeTitle) return;

      const company_id = localStorage.getItem("company_id");

      const res = await axios.post(
        `${import.meta.env.VITE_BACK_URL}/chat/chats`,
        {
          visitor_id,
          company_id,
          title: activeTitle,
        }
      );

      setMessages(res.data.data || []);
    }

    loadMessages();
  }, [activeTitle]);

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ---------------- SEND ---------------- */

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);

    socketRef.current?.emit("user_message", {
      message: input,
      title,
    });

    setInput("");
  };

  /* ---------------- NEW CHAT ---------------- */

  const newChat = () => {
    setTitle(null);
    setActiveTitle(null);
    setMessages([]);
    setSidebarOpen(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-100">

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-800 p-2 rounded-lg shadow-md text-white"
      >
        <Menu size={20} />
      </button>

      {/* SIDEBAR - Dark/Navy color like screenshot */}
      <div className={`
        fixed lg:relative z-40 h-full w-80 bg-[#1a1f2e] flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">
            SALEXO <span className="text-gray-400 text-sm font-normal">CHAT</span>
          </h1>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={newChat}
            className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg transition"
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat Titles */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            CHAT TITLES
          </h3>
          <div className="space-y-1">
            {chatTitles.map((t, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveTitle(t);
                  setTitle(t);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  activeTitle === t
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
            {chatTitles.length === 0 && (
              <p className="text-gray-400 text-sm px-2 py-4">No chats yet</p>
            )}
          </div>
        </div>

        {/* Footer - Company Info */}
        
      </div>

      {/* MAIN CHAT AREA - White background */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTitle ?? "New Chat"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">Customer support AI live chat</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Bot size={32} className="text-gray-400" />
                </div>
                <h3 className="text-gray-700 text-lg font-medium mb-2">Welcome to SALEXO AI</h3>
                <p className="text-gray-400 text-sm">Start a conversation by typing a message below</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-gray-800 text-white"
                      : "bg-white border border-gray-200 text-gray-700 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs opacity-70 mb-1.5">
                    {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                    <span>{msg.role === "user" ? "You" : "AI"}</span>
                  </div>
                  <div className="prose prose-sm max-w-none">
                  <Markdown>
                    {msg.text}
                  </Markdown>
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Bot size={14} />
                    <span>AI is typing</span>
                    <span className="flex gap-0.5 ml-1">
                      <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 text-gray-800 px-5 py-3 rounded-xl outline-none focus:ring-2 focus:ring-gray-300 transition placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              className="bg-gray-800 hover:bg-gray-700 px-5 rounded-xl text-white transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar close overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
      `}</style>
    </div>
  );
}