import { AlertTriangle } from 'lucide-react';

const Notifications = () => {
  return (
    <div className="mt-8 flex items-start gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-6 dark:border-[#bf6b00] dark:bg-[#552400]">
      <div className="rounded-lg p-2 text-amber-500 dark:text-[#facc15]">
        <AlertTriangle size={20} />
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-orange-50">Complete Your Company Profile</h4>
        <p className="mt-1 text-sm text-slate-600 dark:text-orange-100/90">
          Create your company profile to unlock job posting features and start attracting top talent to your organization.
        </p>
      </div>
    </div>
  );
};

export default Notifications;
