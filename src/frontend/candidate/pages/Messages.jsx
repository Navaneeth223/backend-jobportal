import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Send, Paperclip, MoreVertical, Phone, Smile, MessageSquare, MapPin, BriefcaseBusiness, ArrowLeft } from 'lucide-react';
import { useCandidate } from '../context/CandidateContext';

const Messages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { messages, sendMessage } = useCandidate();
  const requestedChatId = useMemo(() => {
    const chatId = Number(searchParams.get('chatId'));
    return Number.isNaN(chatId) ? undefined : chatId;
  }, [searchParams]);
  const [selectedChatId, setSelectedChatId] = useState(requestedChatId ?? messages[0]?.id);
  const [inputText, setInputText] = useState('');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const activeChatId =
    requestedChatId && messages.some((chat) => chat.id === requestedChatId)
      ? requestedChatId
      : messages.some((chat) => chat.id === selectedChatId)
      ? selectedChatId
      : messages[0]?.id;

  const selectedChat = messages.find((message) => message.id === activeChatId);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim() && activeChatId) {
      sendMessage(activeChatId, inputText);
      setInputText('');
    }
  };

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    setIsMobileChatOpen(true);
    setSearchParams({ chatId: String(chatId) });
  };

  return (
    <div className="flex h-[calc(100dvh-11rem)] min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-panel lg:h-[calc(100vh-12rem)] lg:flex-row">
      {/* Sidebar - Conversations List */}
      <div className={`flex w-full flex-col border-slate-200 dark:border-slate-800 lg:w-80 lg:border-b-0 lg:border-r ${(isMobileChatOpen || Boolean(requestedChatId)) ? 'hidden lg:flex' : 'flex border-b lg:border-b-0'}`}>
        <div className="p-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h2>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full rounded-xl border-none bg-slate-100 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-bg dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {messages.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`flex w-full items-start gap-4 border-l-4 p-4 transition-all ${
                activeChatId === chat.id 
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10' 
                  : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-lg shadow-blue-500/10">
                {chat.companyInitials}
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <div className="flex items-start justify-between gap-3">
                  <span className={`truncate text-sm font-bold ${chat.unreadCount > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {chat.jobTitle}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    {chat.applicationStage && (
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                        {chat.applicationStage}
                      </span>
                    )}
                    {chat.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[9px] font-bold text-white">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-1 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                  {chat.companyName}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    {chat.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BriefcaseBusiness size={12} />
                    {chat.experience}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedChat ? (
        <div className={`flex flex-1 flex-col bg-[#f8fafc] dark:bg-bg/50 ${(isMobileChatOpen || Boolean(requestedChatId)) ? 'flex' : 'hidden lg:flex'}`}>
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-panel sm:px-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsMobileChatOpen(false);
                  setSearchParams({});
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
                aria-label="Back to conversations"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white">
                {selectedChat.companyInitials}
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-bold text-slate-900 dark:text-white">{selectedChat.jobTitle}</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{selectedChat.companyName}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={11} />
                    {selectedChat.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BriefcaseBusiness size={11} />
                    {selectedChat.experience}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-green-500">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Online
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="hidden rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 sm:inline-flex">
                <Phone size={20} />
              </button>
              <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 no-scrollbar sm:p-6">
             {selectedChat.messages.map((msg) => {
               const isCandidate = msg.sender === 'candidate';
               return (
                 <div key={msg.id} className={`flex ${isCandidate ? 'justify-end' : 'justify-start'}`}>
                   <div className={`group flex max-w-[88%] flex-col gap-1 sm:max-w-[80%] ${isCandidate ? 'items-end' : 'items-start'}`}>
                     <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm transition-all ${
                       isCandidate 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-900 rounded-tl-none dark:bg-panel dark:text-slate-200'
                     }`}>
                       {msg.text}
                     </div>
                     <span className="text-[10px] text-slate-400 transition-opacity group-hover:opacity-100">{msg.time}</span>
                   </div>
                 </div>
               );
             })}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-panel sm:p-4">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 dark:bg-bg sm:gap-3 sm:px-4">
              <button type="button" className="hidden text-slate-400 hover:text-blue-600 sm:inline-flex">
                <Paperclip size={20} />
              </button>
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-transparent py-2 text-sm focus:outline-none dark:text-white"
              />
              <button type="button" className="hidden text-slate-400 hover:text-yellow-500 sm:inline-flex">
                <Smile size={20} />
              </button>
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-90 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="hidden flex-1 flex-col items-center justify-center bg-[#f8fafc] dark:bg-bg/50 lg:flex">
           <div className="mb-4 rounded-full bg-blue-100 p-8 dark:bg-blue-900/10">
              <MessageSquare className="text-blue-600" size={64} />
           </div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select a conversation</h3>
           <p className="text-slate-500">Choose a chat from the left to start messaging</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
