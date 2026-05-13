import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Briefcase, Send, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const contacts = [
  { id: 1,  name: 'Alex Johnson',     role: 'Senior Software Engineer', location: 'San Francisco, CA', experience: '6 years exp.', status: 'New',          avatar: 'A', lastMsg: "Hi! I'm very interested in the role.", time: '10:02 AM', unread: 1 },
  { id: 2,  name: 'Priya Sharma',     role: 'Product Designer',         location: 'Remote',            experience: '4 years exp.', status: 'Interviewing', avatar: 'P', lastMsg: 'Looking forward to the interview!',   time: '9:45 AM',  unread: 0 },
  { id: 3,  name: 'Marcus Lee',       role: 'Marketing Manager',        location: 'New York, NY',      experience: '7 years exp.', status: 'Reviewed',     avatar: 'M', lastMsg: 'Happy to provide more details.',       time: 'Yesterday', unread: 2 },
  { id: 4,  name: 'Sara Williams',    role: 'Data Scientist',           location: 'Austin, TX',        experience: '3 years exp.', status: 'New',          avatar: 'S', lastMsg: 'Thank you for reaching out!',          time: 'Yesterday', unread: 0 },
  { id: 5,  name: 'James Carter',     role: 'DevOps Engineer',          location: 'Seattle, WA',       experience: '5 years exp.', status: 'Selected',     avatar: 'J', lastMsg: 'When can we schedule a call?',         time: 'Mon',       unread: 0 },
  { id: 6,  name: 'Lena Muller',      role: 'Frontend Developer',       location: 'Remote',            experience: '2 years exp.', status: 'Contacting',   avatar: 'L', lastMsg: "I'd love to discuss the position.",    time: 'Mon',       unread: 1 },
  { id: 7,  name: 'Omar Hassan',      role: 'Backend Engineer',         location: 'Chicago, IL',       experience: '5 years exp.', status: 'Shortlisted',  avatar: 'O', lastMsg: 'Available for a technical interview.',  time: 'Sun',       unread: 0 },
  { id: 8,  name: 'Nina Patel',       role: 'HR Specialist',            location: 'Boston, MA',        experience: '4 years exp.', status: 'Rejected',     avatar: 'N', lastMsg: 'Thank you for the opportunity.',       time: 'Sun',       unread: 0 },
];

const initialChats = {
  1: [{ id: 1, from: 'candidate', text: "Hi! I'm very interested in the Senior Software Engineer role.", time: '10:02 AM' }],
  2: [{ id: 1, from: 'recruiter', text: 'Hi Priya, we reviewed your profile and would like to schedule an interview.', time: '9:40 AM' }, { id: 2, from: 'candidate', text: 'Looking forward to the interview!', time: '9:45 AM' }],
  3: [{ id: 1, from: 'recruiter', text: 'Hi Marcus, we are interested in your profile.', time: 'Yesterday' }, { id: 2, from: 'candidate', text: 'Happy to provide more details.', time: 'Yesterday' }, { id: 3, from: 'candidate', text: 'When would be a good time to connect?', time: 'Yesterday' }],
  4: [{ id: 1, from: 'recruiter', text: 'Hello Sara, we came across your profile and think you would be a great fit.', time: 'Yesterday' }, { id: 2, from: 'candidate', text: 'Thank you for reaching out!', time: 'Yesterday' }],
  5: [{ id: 1, from: 'recruiter', text: 'Congratulations James! We would like to move forward with your application.', time: 'Mon' }, { id: 2, from: 'candidate', text: 'When can we schedule a call?', time: 'Mon' }],
  6: [{ id: 1, from: 'recruiter', text: 'Hi Lena, we are interested in your frontend skills.', time: 'Mon' }, { id: 2, from: 'candidate', text: "I'd love to discuss the position.", time: 'Mon' }],
  7: [{ id: 1, from: 'recruiter', text: 'Hi Omar, your backend experience looks impressive.', time: 'Sun' }, { id: 2, from: 'candidate', text: 'Available for a technical interview.', time: 'Sun' }],
  8: [{ id: 1, from: 'recruiter', text: 'Hi Nina, thank you for applying.', time: 'Sun' }, { id: 2, from: 'candidate', text: 'Thank you for the opportunity.', time: 'Sun' }],
};

const statusColors = {
  New:          'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400',
  Reviewed:     'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
  Contacting:   'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  Interviewing: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  Shortlisted:  'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
  Selected:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  Rejected:     'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400',
};

const Messages = () => {
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState(null);
  const [chats,    setChats]    = useState(initialChats);
  const [input,    setInput]    = useState('');
  const bottomRef = useRef(null);
  const [searchParams] = useSearchParams();

  // Auto-select candidate from query param
  useEffect(() => {
    const id = searchParams.get('candidate');
    if (id) {
      const found = contacts.find(c => c.id === Number(id));
      if (found) setSelected(found);
    }
  }, [searchParams]);

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  const send = () => {
    if (!input.trim() || !selected) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = { id: Date.now(), from: 'recruiter', text: input.trim(), time: now };
    setChats(prev => ({ ...prev, [selected.id]: [...(prev[selected.id] || []), msg] }));
    setInput('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, selected]);

  const messages = selected ? (chats[selected.id] || []) : [];

  return (
    <div className="mx-auto max-w-6xl py-2 sm:py-6">
      <div className={`mb-4 ${selected ? 'hidden lg:block' : ''}`}>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Messages</h1>
        <p className="text-base text-slate-600 dark:text-slate-400">Communicate with candidates</p>
      </div>

      <div className={`flex overflow-hidden rounded-2xl border border-slate-200 bg-[#fcfdff] shadow-sm dark:border-[#22325a] dark:bg-[#05070d] ${selected ? 'h-[calc(100vh-5rem)]' : 'h-[calc(100vh-12rem)]'}`}>

        {/* Left: Contact list */}
        <div className={`flex flex-col border-r border-slate-200 dark:border-[#22325a] ${selected ? 'hidden lg:flex lg:w-80 xl:w-96' : 'w-full lg:w-80 xl:w-96'}`}>
          {/* Search */}
          <div className="border-b border-slate-200 p-3 dark:border-[#22325a]">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search candidates..."
                className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2 pl-8 pr-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-[#22325a] dark:bg-[#0a1739] dark:text-gray-300 dark:placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full border-b border-slate-100 p-4 text-left transition-colors dark:border-[#1d2b4f] ${
                  selected?.id === c.id
                    ? 'bg-blue-50 dark:bg-blue-500/10'
                    : 'hover:bg-slate-50 dark:hover:bg-[#0a1739]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {c.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{c.name}</p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {c.unread > 0 && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{c.unread}</span>
                        )}
                        <span className="text-xs text-slate-400 dark:text-gray-500">{c.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-slate-500 dark:text-gray-400">{c.role}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[c.status]}`}>{c.status}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400 dark:text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={11} />{c.location}</span>
                      <span className="flex items-center gap-1"><Briefcase size={11} />{c.experience}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-400 dark:text-gray-500">{c.lastMsg}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Chat panel */}
        {selected ? (
          <div className="flex flex-1 flex-col">
            {/* Chat header */}
            <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 p-4 dark:border-[#22325a]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {selected.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selected.name}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400">{selected.role} - {selected.location}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[selected.status]}`}>{selected.status}</span>
              <button onClick={() => setSelected(null)} className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white lg:hidden">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-slate-200 dark:bg-[#040913]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === 'recruiter' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                    msg.from === 'recruiter'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-slate-800 dark:bg-[#0a1739] dark:text-gray-200 rounded-bl-sm border border-slate-100 dark:border-[#1d2b4f]'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`mt-1 text-right text-xs opacity-60`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-slate-200 p-3 dark:border-[#22325a]">
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder={`Message ${selected.name}...`}
                  className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-[#111827] dark:text-white dark:placeholder:text-gray-600"
                />
                <button onClick={send} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#0a1739]">
                <Send size={24} className="text-slate-400 dark:text-gray-500" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Select a candidate to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

