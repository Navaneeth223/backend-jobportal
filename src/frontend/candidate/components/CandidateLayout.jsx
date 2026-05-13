import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Bell, UserCircle2, Home, Briefcase, ClipboardList, MessageSquare, Search, Building2, ArrowRightLeft } from 'lucide-react';
import CandidateSidebar from './CandidateSidebar';
import { CandidateProvider, useCandidate } from '../context/CandidateContext';

const LayoutContent = ({ theme, onThemeToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { candidateProfile, unreadMessages, notificationCount } = useCandidate();
  const location = useLocation();

  const mobileNavItems = [
    { name: 'Home', icon: Home, path: '/candidate/dashboard' },
    { name: 'Jobs', icon: Briefcase, path: '/candidate/jobs' },
    { name: 'Apps', icon: ClipboardList, path: '/candidate/applications' },
    { name: 'Chat', icon: MessageSquare, path: '/candidate/messages', badge: unreadMessages },
    { name: 'Profile', icon: UserCircle2, path: '/candidate/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-bg transition-colors duration-300">
      <CandidateSidebar 
        isOpen={isMenuOpen} 
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        theme={theme}
        onThemeToggle={onThemeToggle}
        unreadMessages={unreadMessages}
        notificationCount={notificationCount}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Desktop Header */}
        <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur dark:border-slate-800 dark:bg-panel/80 lg:flex">
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search jobs, companies..." 
                  className="w-80 rounded-xl border-none bg-slate-100 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-bg dark:text-white"
                />
             </div>
             <Link
               to="/candidate/jobs"
               className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 hover:shadow-sm dark:border-slate-800 dark:bg-panel dark:text-slate-300 dark:hover:border-blue-900/40 dark:hover:text-blue-400"
             >
               <ArrowRightLeft size={16} />
               <span>Explore roles</span>
             </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/candidate/notifications" className="relative text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              <Bell size={22} />
              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {notificationCount}
                </span>
              )}
            </Link>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <Link to="/candidate/profile" className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{candidateProfile.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Candidate</p>
              </div>
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-blue-500 p-0.5">
                <img 
                  src={candidateProfile.avatar || `https://ui-avatars.com/api/?name=${candidateProfile.name}&background=6366f1&color=fff`} 
                  alt="Avatar" 
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </Link>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-panel lg:hidden">
          <button onClick={() => setIsMenuOpen(true)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-bg">
               <div className="space-y-1">
                 <div className="h-0.5 w-6 bg-slate-600 dark:bg-slate-300" />
                 <div className="h-0.5 w-4 bg-slate-600 dark:bg-slate-300" />
                 <div className="h-0.5 w-6 bg-slate-600 dark:bg-slate-300" />
               </div>
            </div>
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
             <Building2 size={24} className="text-white" />
          </div>
          <Link to="/candidate/profile" className="h-10 w-10 overflow-hidden rounded-full border-2 border-blue-500">
             <img src={`https://ui-avatars.com/api/?name=${candidateProfile.name}`} alt="User" />
          </Link>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8 no-scrollbar">
          <Outlet />
        </main>

        {/* Mobile Bottom Tab Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/90 p-2 backdrop-blur dark:border-slate-800 dark:bg-panel/90 lg:hidden">
          <div className="flex items-center justify-around gap-1">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 transition-all ${isActive(item.path) ? 'text-blue-600' : 'text-slate-500'}`}
                >
                  <div className="relative">
                    <Icon size={20} />
                    {item.badge > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="truncate text-[10px] font-bold">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

const CandidateLayout = ({ theme, onThemeToggle }) => {
  return (
    <CandidateProvider>
      <LayoutContent theme={theme} onThemeToggle={onThemeToggle} />
    </CandidateProvider>
  );
};

export default CandidateLayout;
