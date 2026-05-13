import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import CompanyLayout from './company/CompanyLayout.jsx';
import CompanyDashboard from './company/pages/Dashboard.jsx';
import CompanyCreatePage from './company/pages/CreateCompany.jsx';
import CompanyJobs from './company/pages/Jobs.jsx';
import CompanyApplications from './company/pages/Applications.jsx';
import CompanyCandidates from './company/pages/Candidates.jsx';
import CompanyJobForm from './company/pages/JobForm.jsx';
import CompanyProfiles from './company/pages/Profile.jsx';
import CompanyMessages from './company/pages/Messages.jsx';

// Candidate Panel Imports
import PortalSelect from './pages/PortalSelect.jsx';
import CandidateLayout from './candidate/components/CandidateLayout.jsx';
import CandidateDashboard from './candidate/pages/CandidateDashboard.jsx';
import CandidateOnboarding from './candidate/pages/CandidateOnboarding.jsx';
import CandidateProfile from './candidate/pages/CandidateProfile.jsx';
import BrowseJobs from './candidate/pages/BrowseJobs.jsx';
import MyApplications from './candidate/pages/MyApplications.jsx';
import Messages from './candidate/pages/Messages.jsx';
import Notifications from './candidate/pages/Notifications.jsx';
import CandidateSettings from './candidate/pages/CandidateSettings.jsx';

import './index.css';

// Shared Theme Wrapper for Routes that don't use App.jsx
const ThemeWrapper = ({ children, forceTheme }) => {
  const [theme, setTheme] = useState(() => {
    if (forceTheme) return forceTheme;
    const savedTheme = localStorage.getItem('jobportal-theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const effectiveTheme = forceTheme || theme;
    document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');

    if (!forceTheme) {
      localStorage.setItem('jobportal-theme', theme);
    }
  }, [forceTheme, theme]);

  return React.cloneElement(children, { theme, onThemeToggle: toggleTheme });
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <ThemeWrapper forceTheme="light"><PortalSelect /></ThemeWrapper>,
  },
  {
    path: '/',
    element: <CompanyLayout />,
    children: [
      { path: '/dashboard', element: <CompanyDashboard /> },
      { path: '/create-company', element: <CompanyCreatePage /> },
      { path: '/jobs', element: <CompanyJobs /> },
      { path: '/post-job', element: <CompanyJobForm /> },
      { path: '/candidates', element: <CompanyCandidates /> },
      { path: '/applications', element: <CompanyApplications /> },
      { path: '/profiles', element: <CompanyProfiles /> },
      { path: '/messages', element: <CompanyMessages /> },
    ],
  },
  {
    path: '/candidate',
    element: <ThemeWrapper><CandidateLayout /></ThemeWrapper>,
    children: [
      { path: '', element: <Navigate to="/candidate/dashboard" replace /> },
      { path: 'dashboard', element: <CandidateDashboard /> },
      { path: 'onboarding', element: <CandidateOnboarding /> },
      { path: 'profile', element: <CandidateProfile /> },
      { path: 'jobs', element: <BrowseJobs /> },
      { path: 'applications', element: <MyApplications /> },
      { path: 'messages', element: <Messages /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'settings', element: <CandidateSettings /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

