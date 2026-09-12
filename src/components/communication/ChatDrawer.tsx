import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Send,
  Phone,
  Video,
  ShieldCheck,
  CheckCheck,
  Store,
  Sparkles
} from 'lucide-react';

export const ChatDrawer: React.FC = () => {
  const {
    activeChatShopId,
    setActiveChatShopId,
    shops,
    chatMessages,
    sendMessage,
    startCall,
    currentUser
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const shop = shops.find((s) => s.id === activeChatShopId) || shops[0];

  const conversationMessages = chatMessages.filter(
    (m) => m.conversationId === activeChatShopId
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length]);

  if (!activeChatShopId) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  const quickReplies = [
    'Is this in stock right now?',
    'Can I get fast 15-min delivery?',
    'Please pack in eco packaging',
    'Do you accept UPI on delivery?'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[90vh] sm:h-[650px] overflow-hidden">
        {/* Top Header */}
        <div className="p-3.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={shop.logoUrl}
              alt={shop.name}
              className="w-10 h-10 rounded-xl object-cover border border-neutral-700 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white truncate">{shop.name}</h3>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Online (Merchant Counter)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => startCall(shop, 'audio')}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-emerald-400 flex items-center justify-center transition"
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => startCall(shop, 'video')}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-indigo-400 flex items-center justify-center transition"
              title="Video Call"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveChatShopId(null)}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Privacy Bar */}
        <div className="bg-neutral-950 px-3 py-1.5 border-b border-neutral-800/80 flex items-center justify-center gap-1 text-[10px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Private encrypted chat • Phone numbers masked</span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-950/60">
          {conversationMessages.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              Say hello to {shop.ownerName}! Ask about fresh batches or special requests.
            </div>
          ) : (
            conversationMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[9px] text-neutral-500 mb-0.5 px-1 font-medium">
                    {msg.senderName}
                  </span>
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs ${
                      isMe
                        ? 'bg-amber-500 text-neutral-950 font-medium rounded-br-none shadow'
                        : 'bg-neutral-800 text-neutral-100 rounded-bl-none border border-neutral-700/60'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                        isMe ? 'text-neutral-800' : 'text-neutral-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick reply suggestion chips */}
        <div className="px-3 py-2 bg-neutral-900 border-t border-neutral-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((r, i) => (
            <button
              key={i}
              onClick={() => {
                sendMessage(r);
              }}
              className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[10px] whitespace-nowrap transition"
            >
              {r}
            </button>
          ))}
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type a message to shopkeeper..."
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-neutral-950 font-bold flex items-center justify-center transition shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
