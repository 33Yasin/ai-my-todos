import { useState, useEffect, useRef } from "react";
import { pipeline, env } from "@xenova/transformers";

// Skip local model checks to avoid 404s returning HTML (Vite SPA fallback)
env.allowLocalModels = false;
env.useBrowserCache = true;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! I am your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const pipeRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load the model when the component mounts
    const loadModel = async () => {
      try {
        console.log("Loading model...");
        // Using a smaller model for faster loading: LaMini-Flan-T5-77M
        const pipe = await pipeline(
          "text2text-generation",
          "Xenova/LaMini-Flan-T5-77M",
          {
            progress_callback: (data) => {
              // data.status can be 'initiate', 'download', 'progress', 'done'
              if (data.status === "progress") {
                setLoadingProgress(Math.round(data.progress));
              }
            },
          }
        );
        pipeRef.current = pipe;
        setIsModelLoading(false);
        console.log("Model loaded");
      } catch (error) {
        console.error("Error loading model:", error);
        setIsModelLoading(false);
      }
    };

    loadModel();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleResetChat = () => {
    setMessages([
      {
        role: "bot",
        text: "Hello! I am your AI assistant. How can I help you today?",
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userText = input.trim();

    // Immediately update UI with user message and set generating state
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setIsGenerating(true);

    // Defer the heavy model inference to the next tick to allow UI to render first
    setTimeout(async () => {
      try {
        if (!pipeRef.current) {
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              text: "I'm still loading my brain... please wait a moment!",
            },
          ]);
          setIsGenerating(false);
          return;
        }

        const output = await pipeRef.current(userText, {
          max_new_tokens: 100,
          temperature: 0.7,
          repetition_penalty: 1.2,
        });

        const botResponse = output[0].generated_text;

        setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
      } catch (error) {
        console.error("Generation error:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Sorry, I encountered an error processing your request.",
          },
        ]);
      } finally {
        setIsGenerating(false);
      }
    }, 50);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      <div
        className={`bg-base-100 shadow-2xl rounded-2xl border border-base-300 w-80 sm:w-96 flex flex-col transition-all duration-300 origin-bottom-right pointer-events-auto mb-4 overflow-hidden ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-10 h-0"
        }`}
        style={{ height: isOpen ? "500px" : "0" }}
      >
        {/* Header */}
        <div className="bg-primary text-primary-content p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                <span className="text-xs">AI</span>
              </div>
            </div>
            <span className="font-bold">Assistant</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleResetChat}
              className="btn btn-ghost btn-xs btn-circle text-primary-content"
              title="New Chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-xs btn-circle text-primary-content"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200/50">
          {isModelLoading && messages.length === 1 && (
            <div className="alert alert-info text-xs py-2 shadow-sm flex flex-col items-start gap-1">
              <span>
                Initializing AI model...{" "}
                {loadingProgress > 0 ? `${loadingProgress}%` : ""}
              </span>
              {loadingProgress > 0 && (
                <progress
                  className="progress progress-primary w-full h-1"
                  value={loadingProgress}
                  max="100"
                ></progress>
              )}
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat ${
                msg.role === "user" ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble ${
                  msg.role === "user"
                    ? "chat-bubble-primary"
                    : "chat-bubble-secondary"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-secondary flex gap-1 items-center h-10">
                <span className="loading loading-dots loading-sm"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-base-100 border-t border-base-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                isModelLoading ? "Loading model..." : "Type a message..."
              }
              disabled={isModelLoading || isGenerating}
              className="input input-bordered input-sm flex-1"
            />
            <button
              onClick={handleSend}
              disabled={isModelLoading || isGenerating || !input.trim()}
              className="btn btn-primary btn-sm btn-circle"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary btn-lg btn-circle shadow-lg pointer-events-auto hover:scale-110 transition-transform"
      >
        {isOpen ? (
          <span className="text-xl">✕</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
