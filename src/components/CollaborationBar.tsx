import React, { useState } from 'react';
import { Collaborator, ChatMessage, ThemeMode } from '../types';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Copy, 
  Check, 
  Circle, 
  Send, 
  X,
  Sparkles,
  UserPlus
} from 'lucide-react';

interface CollaborationBarProps {
  activeRoomId: string | null;
  collaborators: Collaborator[];
  chatMessages: ChatMessage[];
  onJoinRoom: (roomId: string, userName: string) => void;
  onLeaveRoom: () => void;
  onSendMessage: (text: string) => void;
  isOpen: boolean;
  onClose: () => void;
  themeMode?: ThemeMode;
}

export const CollaborationBar: React.FC<CollaborationBarProps> = ({
  activeRoomId,
  collaborators,
  chatMessages,
  onJoinRoom,
  onLeaveRoom,
  onSendMessage,
  isOpen,
  onClose,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';
  const [inputRoomId, setInputRoomId] = useState('');
  const [userName, setUserName] = useState('Developer-' + Math.floor(100 + Math.random() * 900));
  const [chatText, setChatText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleCreateNewRoom = () => {
    const randomRoom = 'APEX-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    onJoinRoom(randomRoom, userName);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRoomId.trim()) return;
    onJoinRoom(inputRoomId.trim().toUpperCase(), userName);
  };

  const handleCopyShareLink = () => {
    if (activeRoomId) {
      navigator.clipboard.writeText(`${window.location.origin}?room=${activeRoomId}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    onSendMessage(chatText.trim());
    setChatText('');
  };

  return (
    <div className={`fixed right-4 top-16 bottom-4 w-80 border rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden text-xs transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
    }`}>
      {/* Header */}
      <div className={`p-3 border-b flex items-center justify-between ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-emerald-500/20 border border-emerald-500/40 rounded-lg flex items-center justify-center text-emerald-500">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Team Collaboration</h3>
            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {activeRoomId ? `Connected to ${activeRoomId}` : 'Offline Mode'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`p-1 rounded ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!activeRoomId ? (
        /* Room Join / Create Screen */
        <div className="p-4 flex-1 flex flex-col justify-center space-y-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/40 rounded-2xl mx-auto flex items-center justify-center text-indigo-500">
              <UserPlus className="w-6 h-6" />
            </div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Join Live Collaboration</h4>
            <p className={`text-[11px] leading-relaxed max-w-[220px] mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Work on the same WYSIWYG project in real-time with team members over WebSockets.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className={`block text-[10px] font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Your Display Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={`w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <form onSubmit={handleJoin} className="space-y-2">
              <label className={`block text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Join Existing Room Code</label>
              <div className="flex space-x-1">
                <input
                  type="text"
                  placeholder="e.g. APEX-7821"
                  value={inputRoomId}
                  onChange={(e) => setInputRoomId(e.target.value)}
                  className={`flex-1 px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-mono uppercase ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
                >
                  Join
                </button>
              </div>
            </form>

            <div className="relative py-2 flex items-center justify-center">
              <span className={`h-px w-full absolute ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              <span className={`px-2 text-[10px] relative ${isDark ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'}`}>OR</span>
            </div>

            <button
              onClick={handleCreateNewRoom}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create New Collaboration Room</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Collaboration View */
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Active Members Bar */}
          <div className={`p-3 border-b space-y-2 ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/80'}`}>
            <div className="flex items-center justify-between text-[11px]">
              <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Active Peers ({collaborators.length})</span>
              <button
                onClick={handleCopyShareLink}
                className="flex items-center space-x-1 text-indigo-500 hover:text-indigo-600 font-medium"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {collaborators.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center space-x-1.5 px-2 py-1 rounded-full border ${
                    isDark ? 'bg-slate-800 border-slate-700/60 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                  }`}
                >
                  <span
                    style={{ backgroundColor: c.color || '#6366f1' }}
                    className="w-2 h-2 rounded-full"
                  />
                  <span className="text-[11px] font-medium">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Chat History */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 font-sans">
            <div className="text-center py-1">
              <span className={`text-[10px] px-2.5 py-1 rounded-full border ${
                isDark ? 'bg-slate-950 text-slate-500 border-slate-800' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                Connected to WebSocket Room #{activeRoomId}
              </span>
            </div>

            {chatMessages.length === 0 ? (
              <p className={`text-center py-6 text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No messages yet. Say hello!</p>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <span
                      style={{ color: msg.senderColor || '#6366f1' }}
                      className="font-bold text-[11px]"
                    >
                      {msg.senderName}
                    </span>
                    <span className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{msg.timestamp}</span>
                  </div>
                  <p className={`p-2 rounded-lg text-xs border leading-relaxed ${
                    isDark ? 'bg-slate-950 text-slate-200 border-slate-800/80' : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}>
                    {msg.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Chat Input Box */}
          <form onSubmit={handleSendChat} className={`p-2 border-t flex space-x-1 ${
            isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
          }`}>
            <input
              type="text"
              placeholder="Type team message..."
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              className={`flex-1 px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Disconnect Footer */}
          <div className={`p-2 border-t text-center ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
            <button
              onClick={onLeaveRoom}
              className="text-[10px] text-red-500 hover:text-red-600 font-semibold"
            >
              Leave Collaboration Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
