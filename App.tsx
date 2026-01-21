
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Role, Message, ModelType } from './types';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import { chatWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelType, setModelType] = useState<ModelType>(ModelType.FLASH);
  const [systemInstruction, setSystemInstruction] = useState("You are Pulse, a professional AI developed using React and Gemini. Provide insightful, detailed, and polite responses.");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: Role.USER,
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botMessageId = uuidv4();
    const initialBotMessage: Message = {
      id: botMessageId,
      role: Role.MODEL,
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, initialBotMessage]);

    try {
      let accumulatedResponse = "";
      await chatWithGemini(
        modelType,
        [...messages, userMessage],
        systemInstruction,
        (chunk) => {
          accumulatedResponse += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMessageId 
                ? { ...msg, content: accumulatedResponse } 
                : msg
            )
          );
        }
      );
    } catch (error) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, content: "Sorry, I encountered an error while processing your request. Please check your API key configuration." } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar - Desktop Only */}
      <Sidebar 
        currentModel={modelType} 
        setModel={setModelType} 
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="md:hidden w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">G</div>
            <div>
              <h2 className="font-semibold text-slate-100">{modelType.split('-')[1].toUpperCase()} Engine</h2>
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Live Context</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
             <button 
                onClick={() => setSystemInstruction(prompt("Enter System Instructions:", systemInstruction) || systemInstruction)}
                className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                title="System Instructions"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
             </button>
          </div>
        </header>

        {/* Message Container */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
              <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl font-bold text-slate-200 mb-2">How can I help you today?</h3>
                <p className="text-slate-400">Select a model engine on the left and start a conversation. I can write code, explain concepts, or just chat.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
                {["Explain quantum computing", "Write a React hook", "Meal prep ideas", "Travel plan for Tokyo"].map(prompt => (
                  <button 
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left text-sm text-slate-400 hover:border-blue-500 hover:text-slate-200 transition-all"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
          {isLoading && messages[messages.length-1]?.role === Role.USER && (
            <div className="flex justify-start mb-6">
              <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-2xl rounded-tl-none animate-pulse">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-8 border-t border-slate-800 bg-slate-950/80 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto relative flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything..."
                className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl px-4 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none min-h-[56px] max-h-48 overflow-y-auto"
                rows={1}
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
              <div className="absolute right-3 bottom-3 flex space-x-2">
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`p-2 rounded-xl transition-all ${
                    input.trim() && !isLoading 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-medium">
            Gemini can make mistakes. Verify important info.
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
