import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../utils/api";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        "👋 **Hi, I'm FinSight AI.**\n\nAsk me financial questions like:\n\n- How much did I spend last month?\n- Food expenses in November\n- Top 3 categories this year\n- Budget suggestions for ₹50,000"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  const suggestions = [
    "How much did I spend last month?",
    "Food expenses in November",
    "Top 3 categories this year",
    "Income vs expenses in 2025",
    "Suggest a monthly budget"
  ];

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typing]);

  const sendMessage = async (textOverride) => {
    const text = textOverride || input.trim();
    if (!text || loading) return;

    const token = localStorage.getItem("fin_token");
    if (!token) {
      toast.error("Please login first to chat with FinSight AI.");
      return;
    }

    const userMsg = { from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", {
        message: text,
        history: messages
      });

      const reply = res.data.reply || "I could not answer that.";
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Something went wrong talking to FinSight AI." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg hover:bg-purple-700 z-40"
        >
          <FiMessageCircle size={22} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50">

          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <div>
              <div className="text-sm font-semibold text-slate-900">FinSight AI</div>
              <div className="text-xs text-slate-500">Financial assistant</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <FiX />
            </button>
          </div>

          <div className="px-3 pt-2 pb-1 flex gap-2 flex-wrap">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="bg-purple-100 text-purple-700 px-3 py-1 text-xs rounded-full hover:bg-purple-200"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex-1 max-h-72 overflow-y-auto px-3 py-3 space-y-3 text-sm bg-slate-50">
            
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={m.from === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.from === "user"
                      ? "bg-purple-600 text-white px-3 py-2 rounded-xl rounded-br-none max-w-[80%] whitespace-pre-wrap"
                      : "bg-green-100 text-green-900 px-3 py-2 rounded-xl rounded-bl-none border border-green-300 max-w-[80%] prose prose-sm whitespace-pre-wrap"
                  }
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                             {m.text}
                        </ReactMarkdown>

                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-green-100 text-green-900 px-3 py-2 rounded-xl rounded-bl-none border border-green-300 max-w-[80%]">
                  <span className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-300"></div>
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 px-3 py-2 border-t border-slate-200 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your spending..."
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60"
            >
              <FiSend size={16} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
