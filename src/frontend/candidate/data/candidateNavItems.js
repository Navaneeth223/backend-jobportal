import { 
  LayoutDashboard, 
  UserCircle2, 
  Briefcase, 
  ClipboardList, 
  MessageSquare, 
  Bell, 
  Settings 
} from 'lucide-react';

export const candidateNavItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    path: '/candidate/dashboard'
  },
  {
    name: 'My Profile',
    icon: UserCircle2,
    submenu: [
      { name: 'Personal Info', path: '/candidate/profile?tab=personal' },
      { name: 'Qualifications', path: '/candidate/profile?tab=qualifications' },
      { name: 'Skills', path: '/candidate/profile?tab=skills' },
      { name: 'CV & Documents', path: '/candidate/profile?tab=cv' }
    ]
  },
  {
    name: 'Jobs',
    icon: Briefcase,
    submenu: [
      { name: 'Browse Jobs', path: '/candidate/jobs' },
      { name: 'Recommended', path: '/candidate/jobs?filter=recommended' },
      { name: 'Saved Jobs', path: '/candidate/jobs?filter=saved' }
    ]
  },
  {
    name: 'My Applications',
    icon: ClipboardList,
    submenu: [
      { name: 'Applied', path: '/candidate/applications?tab=applied' },
      { name: 'Shortlisted', path: '/candidate/applications?tab=shortlisted' },
      { name: 'Selected', path: '/candidate/applications?tab=selected' },
      { name: 'Interview Scheduled', path: '/candidate/applications?tab=interview' }
    ]
  },
  {
    name: 'Messages',
    icon: MessageSquare,
    path: '/candidate/messages',
    badge: 'unreadMessages'
  },
  {
    name: 'Notifications',
    icon: Bell,
    path: '/candidate/notifications',
    badge: 'notificationCount'
  },
  {
    name: 'Settings',
    icon: Settings,
    path: '/candidate/settings'
  }
];
