import React from 'react';
import { Shield, Bell, Lock, Smartphone, LogOut, ChevronRight, Globe, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CandidateSettings = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Account & Security',
      items: [
        { icon: Smartphone, label: 'Primary Phone Number', value: '+91 98765 43210' },
        { icon: Lock, label: 'Change Password', value: 'Last changed 2 months ago' },
        { icon: Shield, label: 'Two-Step Verification', value: 'Enabled', active: true },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { icon: Bell, label: 'Job Alert Emails', value: 'Sent weekly' },
        { icon: Bell, label: 'Push Notifications', value: 'All allowed' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Globe, label: 'Language', value: 'English (US)' },
        { icon: Palette, label: 'Appearance', value: 'Follow system' },
      ]
    }
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your account preferences and security settings.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
             <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-2">{section.title}</h3>
             <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-panel">
                {section.items.map((item, idx) => (
                  <button 
                    key={item.label}
                    className={`flex w-full items-center justify-between p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${idx !== section.items.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-bg dark:text-slate-400">
                        <item.icon size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.value}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </button>
                ))}
             </div>
          </div>
        ))}
        
        <button 
          onClick={() => navigate('/portal-select')}
          className="flex w-full items-center justify-between rounded-2xl border border-red-100 bg-red-50/50 p-4 text-left transition-all hover:bg-red-100 dark:border-red-900/20 dark:bg-red-900/10"
        >
          <div className="flex items-center gap-4 text-red-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/40">
              <LogOut size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">Logout</p>
              <p className="text-xs opacity-80">Return to role selection</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-red-300" />
        </button>
      </div>
    </div>
  );
};

export default CandidateSettings;
