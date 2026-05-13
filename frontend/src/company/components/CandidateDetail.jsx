import { useState, useRef, useEffect } from 'react';
import { MapPin, Briefcase, GraduationCap, FileText, Mail, X, Phone, Globe, Copy, Check, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { statusStyles, STATUS_ACTIONS } from './CandidateCard';

// Message / Chat modal
const MessageModal = ({ candidate, onClose }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: 1, from: 'candidate', text: `Hi! I'm ${candidate.name}. I applied for the ${candidate.role} position. Looking forward to hearing from you.`, time: '10:02 AM' },
  ]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { id: Date.now(), from: 'recruiter', text: input.trim(), time: now };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="flex w-full max-w-md flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-[#1d2b4f] dark:bg-[#05070d]" style={{ height: '480px' }}>
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 p-4 dark:border-[#1d2b4f]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {candidate.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">{candidate.name}</p>
            <p className="text-xs text-slate-500 dark:text-gray-400">{candidate.role}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={16} /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 p-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.from === 'recruiter' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${
                msg.from === 'recruiter'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-100 text-slate-800 dark:bg-[#0a1739] dark:text-gray-200 rounded-bl-sm'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`mt-1 text-right text-xs opacity-60`}>{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-slate-200 p-3 dark:border-[#1d2b4f]">
          <div className="flex items-end gap-2">
            <textarea
              rows={2}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Type a message..."
              className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-[#111827] dark:text-white dark:placeholder:text-gray-600"
            />
            <button
              onClick={send}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact details popover
const ContactPopover = ({ candidate, onClose, anchorRef }) => {
  const ref = useRef(null);
  const [copied, setCopied] = useState(null);
  const [style, setStyle] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const popH = 300;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow >= popH ? rect.bottom + 8 : rect.top - popH - 8;
      const left = Math.min(rect.left, window.innerWidth - 296);
      setStyle({ position: 'fixed', top, left, zIndex: 9999 });
    }
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, anchorRef]);

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const details = [
    { key: 'email', icon: Mail,  label: 'Email',    value: candidate.email    || `${candidate.name.split(' ')[0].toLowerCase()}@example.com` },
    { key: 'phone', icon: Phone, label: 'Phone',    value: candidate.phone    || '+1 (555) 000-0000' },
    { key: 'loc',   icon: MapPin, label: 'Location', value: candidate.location },
    { key: 'link',  icon: Globe, label: 'LinkedIn',  value: candidate.linkedin || `linkedin.com/in/${candidate.name.split(' ')[0].toLowerCase()}` },
  ];

  return (
    <>
      <div ref={ref} style={style} className="w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-[#22325a] dark:bg-[#0a1739]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Contact Details</p>
          <button onClick={onClose} className="rounded-lg p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={14} /></button>
        </div>
        <div className="space-y-2.5">
          {details.map(({ key, icon: Icon, label, value }) => (
            <div key={key} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 dark:border-[#1d2b4f]">
              <Icon size={14} className="shrink-0 text-blue-500" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 dark:text-gray-500">{label}</p>
                <p className="truncate text-sm font-medium text-slate-800 dark:text-gray-200">{value}</p>
              </div>
              <button onClick={() => copy(value, key)} className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                {copied === key ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => { onClose(); navigate(`/messages?candidate=${candidate.id}`); }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Send size={13} /> Send Message
        </button>
      </div>
    </>
  );
};

const CandidateDetail = ({ candidate, onClose, onStatusChange }) => {
  const [showContact, setShowContact] = useState(false);
  const [expandedAbout, setExpandedAbout] = useState(false);
  const contactBtnRef = useRef(null);
  const actionsRef    = useRef(null);
  const scrollRef     = useRef(null);

  if (!candidate) return (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-[#fcfdff] p-8 text-center dark:border-[#22325a] dark:bg-[#05070d]">
      <p className="text-sm text-slate-400 dark:text-gray-500">Select a candidate from the list to view their details</p>
    </div>
  );

  const handleContact = () => {
    setShowContact(v => !v);
    onStatusChange?.(candidate.id, 'Contacting');
  };

  return (
    <div ref={scrollRef} className="flex max-h-[calc(100vh-6rem)] flex-col overflow-y-auto rounded-2xl border border-slate-200 bg-[#fcfdff] shadow-sm dark:border-[#22325a] dark:bg-[#05070d]">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-[#22325a]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{candidate.name}</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">{candidate.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[candidate.status] || statusStyles['New']}`}>
            {candidate.status}
          </span>
          {onClose && (
            <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-[#142448] lg:hidden">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="space-y-5 p-5">
        <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-gray-400">
          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-400" />{candidate.location}</span>
          <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-blue-400" />{candidate.experience}</span>
          <span className="flex items-center gap-1.5"><GraduationCap size={14} className="text-blue-400" />{candidate.education}</span>
        </div>

        <div>
          <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">About</h4>
          <p className={`text-sm leading-relaxed text-slate-700 dark:text-gray-300 ${!expandedAbout ? 'line-clamp-2 lg:line-clamp-[unset]' : ''}`}>
            {candidate.summary}
          </p>
          <button onClick={() => setExpandedAbout(v => !v)} className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 lg:hidden">
            {expandedAbout ? 'Show less' : 'More...'}
          </button>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map(skill => (
              <span key={skill} className="rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div ref={actionsRef} className="border-t border-slate-200 pt-4 dark:border-[#22325a]">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">Actions</h4>
          <div className="relative flex flex-wrap gap-2">
            <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-[#22325a] dark:bg-[#0a1739] dark:text-gray-300 dark:hover:bg-[#142448]">
              <FileText size={14} /> Resume
            </button>
            <button
              ref={contactBtnRef}
              onClick={handleContact}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-[#22325a] dark:bg-[#0a1739] dark:text-gray-300 dark:hover:bg-[#142448]"
            >
              <Mail size={14} /> Contact
            </button>
            {showContact && <ContactPopover candidate={candidate} onClose={() => setShowContact(false)} anchorRef={contactBtnRef} />}
            {onStatusChange && STATUS_ACTIONS.filter(a => a.status !== candidate.status).map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.status}
                  onClick={() => onStatusChange(candidate.id, action.status)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium shadow-sm transition-all ${action.className}`}
                >
                  <Icon size={14} /> {action.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
