import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  Sun, 
  Moon, 
  X,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { candidateNavItems } from '../data/candidateNavItems';

const CandidateSidebar = ({ 
  isOpen, 
  toggleMenu, 
  isCollapsed, 
  toggleCollapse, 
  theme, 
  onThemeToggle,
  unreadMessages,
  notificationCount
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(['My Profile', 'Jobs', 'My Applications']);

  const toggleExpand = (name) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const isActive = (path) => location.pathname + location.search === path;
  const isParentActive = (item) => {
    if (item.path) return location.pathname.startsWith(item.path);
    if (item.submenu) {
      return item.submenu.some(sub => location.pathname + location.search === sub.path);
    }
    return false;
  };

  const isDark = theme === 'dark';

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-panel lg:static ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className={`flex items-center justify-between p-6 ${isCollapsed ? 'px-4' : ''}`}>
          <Link to="/portal-select" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
              <Building2 className="text-white" size={24} />
            </div>
            {!isCollapsed && (
              <div className="transition-all duration-300">
                <h1 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">JobPortal</h1>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Candidate</p>
              </div>
            )}
          </Link>
          <button onClick={toggleMenu} className="lg:hidden">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2 no-scrollbar">
          {candidateNavItems.map((item) => {
            const hasSubmenu = !!item.submenu;
            const isExpanded = expandedItems.includes(item.name);
            const parentActive = isParentActive(item);
            const Icon = item.icon;

            return (
              <div key={item.name} className="space-y-1">
                {hasSubmenu ? (
                  <>
                    <button
                      onClick={() => !isCollapsed && toggleExpand(item.name)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all ${
                        parentActive 
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        {!isCollapsed && <span className="font-semibold">{item.name}</span>}
                      </div>
                      {!isCollapsed && (
                        isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                      )}
                    </button>
                    {!isCollapsed && isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-100 dark:border-slate-800">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            className={`block py-2 pl-6 pr-4 text-sm transition-all ${
                              isActive(sub.path)
                                ? 'font-bold text-blue-600 dark:text-blue-400'
                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      {!isCollapsed && <span className="font-semibold">{item.name}</span>}
                    </div>
                    {!isCollapsed && item.badge && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive(item.path) ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>
                        {item.badge === 'unreadMessages' ? unreadMessages : notificationCount}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer with Theme Toggle and Collapse */}
        <div className="mt-auto space-y-2 p-4">
          <button
            onClick={onThemeToggle}
            className={`flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition-all hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 ${isCollapsed ? 'justify-center' : ''}`}
          >
            {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-600" />}
            {!isCollapsed && <span className="font-semibold text-slate-700 dark:text-slate-300">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          
          <button
            onClick={toggleCollapse}
            className={`hidden w-full items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 lg:flex ${isCollapsed ? 'justify-center' : ''}`}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!isCollapsed && <span className="font-semibold text-slate-700 dark:text-slate-300">Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CandidateSidebar;
