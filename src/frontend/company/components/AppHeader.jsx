import { Menu, Building2, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppHeader = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-300 bg-white/90 px-4 py-3 text-slate-900 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-panel/90 dark:text-slate-100">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-1.5">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">JobPortal</span>
        </Link>
      </div>

      <Link
        to="/dashboard"
        aria-label="Dashboard"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
      >
        <Home size={16} />
      </Link>
    </header>
  );
};

export default AppHeader;
