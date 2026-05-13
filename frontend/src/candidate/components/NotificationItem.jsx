import React from 'react';
import { Star, MessageSquare, Calendar, XCircle, CheckCircle2 } from 'lucide-react';

const NotificationItem = ({ notification, onRead }) => {
  const iconConfig = {
    shortlisted: { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    message: { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    interview: { icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
    applied: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' }
  };

  const config = iconConfig[notification.type] || iconConfig.applied;
  const Icon = config.icon;

  return (
    <div 
      onClick={() => onRead(notification.id)}
      className={`group flex cursor-pointer items-start gap-4 rounded-xl p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
        <Icon className={config.color} size={20} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className={`text-sm ${!notification.read ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
            {notification.text}
          </p>
          {!notification.read && (
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
          )}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-slate-400">{notification.timestamp}</span>
          <button className="text-xs font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
