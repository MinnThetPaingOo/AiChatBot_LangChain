
import React from 'react';
import { ModelType } from '../types';

interface SidebarProps {
  currentModel: ModelType;
  setModel: (model: ModelType) => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentModel, setModel, onNewChat }) => {
  return (
    <div className="hidden md:flex flex-col w-64 h-full bg-slate-900 border-r border-slate-800 p-4">
      <div className="flex items-center space-x-2 mb-8 px-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">G</span>
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          Pulse Chat
        </h1>
      </div>

      <button
        onClick={onNewChat}
        className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all duration-200 border border-slate-700 flex items-center justify-center space-x-2 mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <span>New Chat</span>
      </button>

      <div className="flex-1 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block px-2">
            Model Engine
          </label>
          <div className="space-y-1">
            {[
              { id: ModelType.FLASH, name: 'Gemini 3 Flash', desc: 'Fast & Intelligent' },
              { id: ModelType.PRO, name: 'Gemini 3 Pro', desc: 'Complex Reasoning' },
              { id: ModelType.FLASH_LITE, name: 'Flash Lite', desc: 'Lightweight' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-colors duration-150 ${
                  currentModel === m.id 
                    ? 'bg-blue-600/10 border border-blue-500/50 text-blue-400' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="font-medium text-sm">{m.name}</div>
                <div className="text-[10px] opacity-70">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800 px-2 text-xs text-slate-500 italic">
        Powered by Google Gemini
      </div>
    </div>
  );
};

export default Sidebar;
