import React from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { useCandidate } from '../context/CandidateContext';
import NotificationItem from '../components/NotificationItem';

const Notifications = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useCandidate();
  
  // Real logic: In a real app we'd filter by actual dates. For now, we'll keep the mock categories.
  const today = notifications.filter(n => n.timestamp.includes('Today') || n.timestamp.includes('minutes ago'));
  const older = notifications.filter(n => !today.includes(n));

  const Section = ({ title, items }) => (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">{title}</h3>
      <div className="space-y-3">
        {items.map(item => (
          <NotificationItem 
            key={item.id} 
            notification={item} 
            onRead={markNotificationAsRead} 
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Stay updated with your application status and messages.</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={markAllNotificationsAsRead}
            disabled={notifications.every(n => n.read)}
            className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-900/10"
           >
              <CheckCheck size={18} /> Mark all as read
           </button>
           <button className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:border-red-200 hover:text-red-500 transition-all dark:border-slate-800">
              <Trash2 size={18} />
           </button>
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-10">
          {today.length > 0 && <Section title="New" items={today} />}
          {older.length > 0 && <Section title="Older" items={older} />}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
           <div className="mb-6 rounded-full bg-slate-100 p-8 dark:bg-slate-800">
              <Bell size={64} className="text-slate-300" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white">All caught up!</h3>
           <p className="mt-2 text-slate-500">You don't have any new notifications at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
