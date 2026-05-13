import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import SideBar from './components/SideBar';

function CompanyLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('jobportal-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('jobportal-theme', theme);
  }, [theme]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className="min-h-screen bg-[#eef2f9] lg:flex lg:h-screen lg:overflow-hidden dark:bg-bg">
      <AppHeader onMenuClick={toggleMenu} theme={theme} onThemeToggle={toggleTheme} />
      <SideBar isOpen={isMenuOpen} toggleMenu={closeMenu} theme={theme} onThemeToggle={toggleTheme} />
      {isMenuOpen ? <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={closeMenu} /> : null}
      <main className="min-w-0 flex-1 overflow-y-auto bg-gradient-to-br from-[#eef2f9] via-[#edf2fa] to-[#ede7f7] p-4 sm:p-6 lg:p-8 dark:bg-[radial-gradient(55%_35%_at_52%_100%,rgba(114,45,167,0.38)_0%,rgba(8,16,41,0)_62%),linear-gradient(180deg,#06122f_0%,#090f24_100%)]">
        <Outlet />
      </main>
    </div>
  );
}

export default CompanyLayout;
