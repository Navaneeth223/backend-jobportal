import React from 'react';
import { Check } from 'lucide-react';

const StepWizard = ({ steps, currentStep }) => {
  return (
    <div className="-mx-4 overflow-x-auto px-4 py-4 no-scrollbar">
      <div className="mx-auto flex min-w-max items-start sm:min-w-0 sm:items-center sm:justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep - 1;
          const isActive = index === currentStep - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex w-[5.5rem] shrink-0 flex-col items-center gap-2 text-center sm:w-auto sm:min-w-[5rem]">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${isCompleted ? 'border-green-500 bg-green-500 text-white' : isActive ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-400 dark:border-slate-800 dark:bg-panel'}`}
                >
                  {isCompleted ? <Check size={20} /> : index + 1}
                </div>
                <span className={`whitespace-nowrap text-xs font-bold ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="mx-3 mt-5 h-0.5 w-10 shrink-0 bg-slate-200 dark:bg-slate-800 sm:mx-4 sm:mt-0 sm:w-auto sm:flex-1">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepWizard;
