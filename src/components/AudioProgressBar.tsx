// MediKiosk AI — Audio Progress Bar
// Uses icon milestones (not just "Step X of Y" text) for illiterate users

import React from 'react';
import { useA11y } from './AccessibilityProvider';

export interface ProgressStep {
  id: string | number;
  icon: string;       // emoji
  label: string;      // English label
  labelKey?: string;  // i18n key if you want translated label
}

interface AudioProgressBarProps {
  steps: ProgressStep[];
  currentStep: number; // 0-indexed
  className?: string;
}

export const AudioProgressBar: React.FC<AudioProgressBarProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  const { t, speak, audioMode } = useA11y();

  const handleStepClick = (idx: number, step: ProgressStep) => {
    if (idx > currentStep) return; // Can't jump ahead
    const label = step.labelKey ? t(step.labelKey) : step.label;
    if (audioMode) speak(`Step ${idx + 1} of ${steps.length}: ${label}`);
  };

  return (
    <nav
      aria-label="Progress"
      className={`flex items-center justify-between w-full ${className}`}
    >
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;
        const isFuture = idx > currentStep;
        const label = step.labelKey ? t(step.labelKey) : step.label;

        return (
          <React.Fragment key={step.id}>
            {/* Step node */}
            <button
              type="button"
              aria-label={`${isCompleted ? 'Completed: ' : isActive ? 'Current step: ' : 'Upcoming: '}${label}`}
              aria-current={isActive ? 'step' : undefined}
              onClick={() => handleStepClick(idx, step)}
              className={`
                flex flex-col items-center gap-1 group focus:outline-none
                focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-1
                rounded-lg p-1 transition-all duration-200
                ${isFuture ? 'opacity-40 cursor-default' : 'cursor-pointer'}
              `}
            >
              {/* Circle with icon */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-2xl
                  border-3 transition-all duration-200
                  ${isCompleted
                    ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                    : isActive
                    ? 'bg-white border-teal-600 text-teal-700 shadow-lg ring-4 ring-teal-100 scale-110'
                    : 'bg-slate-100 border-slate-300 text-slate-400'}
                `}
                aria-hidden="true"
              >
                {isCompleted ? '✓' : step.icon}
              </div>

              {/* Label */}
              <span
                className={`
                  text-xs font-medium text-center max-w-[64px] leading-tight
                  ${isActive ? 'text-teal-700 font-bold' : isCompleted ? 'text-teal-600' : 'text-slate-400'}
                `}
              >
                {label}
              </span>
            </button>

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-1 mx-1 rounded-full transition-all duration-300
                  ${idx < currentStep ? 'bg-teal-500' : 'bg-slate-200'}
                `}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
