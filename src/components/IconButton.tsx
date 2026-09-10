// MediKiosk AI — Large Accessible Icon Button
// Minimum 56x56px tap target, ARIA-labelled, focus ring, high-contrast support

import React from 'react';
import { useA11y } from './AccessibilityProvider';

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;           // aria-label AND visible text below icon
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  selected?: boolean;
  disabled?: boolean;
  badge?: string | number;
  className?: string;
  speakOnFocus?: boolean;  // if true, speaks the label when focused (audio mode)
  'aria-pressed'?: boolean;
  'aria-checked'?: boolean;
}

const SIZE_CLASSES = {
  sm: 'min-w-[48px] min-h-[48px] p-2 text-xs',
  md: 'min-w-[64px] min-h-[64px] p-3 text-sm',
  lg: 'min-w-[80px] min-h-[80px] p-4 text-base',
  xl: 'min-w-[100px] min-h-[100px] p-5 text-lg',
};

const ICON_SIZE_CLASSES = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
  xl: 'text-5xl',
};

const VARIANT_CLASSES = {
  primary: 'bg-teal-600 hover:bg-teal-700 text-white border-2 border-teal-700',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-2 border-red-700',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 border-2 border-transparent hover:border-slate-300',
  success: 'bg-green-600 hover:bg-green-700 text-white border-2 border-green-700',
};

const SELECTED_CLASSES = {
  primary: 'ring-4 ring-teal-300 bg-teal-700',
  secondary: 'ring-4 ring-teal-400 bg-teal-50 border-teal-500 text-teal-800',
  danger: 'ring-4 ring-red-300 bg-red-700',
  ghost: 'ring-4 ring-teal-300 bg-teal-50 border-teal-400',
  success: 'ring-4 ring-green-300 bg-green-700',
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'secondary',
  size = 'md',
  selected = false,
  disabled = false,
  badge,
  className = '',
  speakOnFocus = false,
  ...ariaProps
}) => {
  const { speak, audioMode } = useA11y();

  const handleFocus = () => {
    if (speakOnFocus && audioMode) {
      speak(label);
    }
  };

  const baseClasses = `
    relative flex flex-col items-center justify-center gap-1
    rounded-2xl cursor-pointer transition-all duration-150
    focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400 focus-visible:ring-offset-2
    active:scale-95
    ${SIZE_CLASSES[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : VARIANT_CLASSES[variant]}
    ${selected && !disabled ? SELECTED_CLASSES[variant] : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type="button"
      role={ariaProps['aria-checked'] !== undefined ? 'checkbox' : ariaProps['aria-pressed'] !== undefined ? 'button' : 'button'}
      aria-label={label}
      aria-pressed={ariaProps['aria-pressed']}
      aria-checked={ariaProps['aria-checked']}
      aria-selected={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onFocus={handleFocus}
      className={baseClasses}
    >
      {/* Badge */}
      {badge !== undefined && (
        <span
          aria-label={`${badge} items`}
          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {badge}
        </span>
      )}

      {/* Icon */}
      <span className={`${ICON_SIZE_CLASSES[size]} leading-none`} aria-hidden="true">
        {icon}
      </span>

      {/* Label */}
      <span className="text-center font-medium leading-tight max-w-[90px] break-words">
        {label}
      </span>
    </button>
  );
};
