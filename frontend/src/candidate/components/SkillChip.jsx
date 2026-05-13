import React from 'react';
import { X } from 'lucide-react';

const SkillChip = ({ label, onRemove, removable }) => {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
      {label}
      {removable && onRemove && (
        <button
          onClick={() => onRemove(label)}
          className="rounded-full hover:bg-blue-200/50 dark:hover:bg-blue-800/50"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SkillChip;
