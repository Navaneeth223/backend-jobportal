import { Home, Building2, Briefcase, FileText, Users, Sun, Moon, X, UserCircle, MessageSquare, LayoutGrid } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SideBar = ({ isOpen, toggleMenu, theme, onThemeToggle }) => {
  const navItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { name: 'Create Company', icon: <Building2 size={20} />, path: '/create-company' },
    { name: 'Jobs', icon: <Briefcase size={20} />, path: '/jobs', count: 3 },
    { name: 'Applications', icon: <FileText size={20} />, path: '/applications', count: 3 },
    { name: 'Candidates', icon: <Users size={20} />, path: '/candidates', count: 8 },
    { name: 'Messages', icon: <MessageSquare size={20} />, path: '/messages' },
    { name: 'Profiles', icon: <UserCircle size={20} />, path: '/profiles?tab=company' },
  ];

  const location = useLocation();
  const isDark = theme === 'dark';

  const isActivePath = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    const [pathname, search] = path.split('?');
    if (search) {
      return location.pathname === pathname && location.search === `?${search}`;
    }
    return location.pathname === pathname || location.pathname.startsWith(pathname + '/');
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-300 bg-white transition-transform duration-300 ease-in-out dark:border-[#0b183b] dark:bg-[#071331] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:h-screen lg:translate-x-0 lg:shrink-0`}
    >
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2">
            <Building2 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">JobPortal</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Company & Careers</p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleMenu}
          className="text-slate-500 dark:text-slate-400 lg:hidden"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>
      <div className="px-6">
        <hr className="border-slate-200 dark:border-slate-800" />
      </div>

      <nav className="mt-4 space-y-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={toggleMenu}
            className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
              isActivePath(item.path)
                ? 'bg-blue-100 text-blue-700 dark:bg-[#1a2f6b] dark:text-[#3ea0ff]'
                : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white dark:hover:bg-[#142448]/80 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </div>
            {item.count ? (
              <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-bold text-slate-700 dark:bg-[#344a77] dark:text-[#c2d3f5]">
                {item.count}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-slate-300 p-4 dark:border-[#16274d]">
        <button
          type="button"
          className="mb-2 flex w-full items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 text-slate-600 transition-colors hover:bg-slate-100 dark:border-[#2a3b66] dark:bg-[#0a1739] dark:text-slate-100 dark:hover:bg-[#142448]"
        >
          <LayoutGrid size={20} />
          <span className="font-medium">Main Menu</span>
        </button>
        <button
          type="button"
          onClick={onThemeToggle}
          className="flex w-full items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 text-slate-600 transition-colors hover:bg-slate-100 dark:border-[#2a3b66] dark:bg-[#0a1739] dark:text-slate-100 dark:hover:bg-[#142448]"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
