import React from 'react';
import { cleanText } from '../utils/textCleaner';

interface BlurredNameProps {
  fullName: string;
  className?: string;
  lastNameClassName?: string;
  showPrivacyBadge?: boolean;
}

export const BlurredName: React.FC<BlurredNameProps> = ({
  fullName,
  className = '',
  lastNameClassName = '',
  showPrivacyBadge = false,
}) => {
  const cleaned = cleanText(fullName).trim();
  if (!cleaned) return <span className={className}>Unknown Student</span>;

  const parts = cleaned.split(/\s+/);
  
  if (parts.length === 1) {
    // Single name or nickname: display first 2 characters, blur remainder
    const firstPart = parts[0].slice(0, 2);
    const rest = parts[0].slice(2) || '••••';
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span>{firstPart}</span>
        <span
          className={`select-none filter blur-[7px] bg-slate-300/70 text-transparent rounded px-1 tracking-widest ${lastNameClassName}`}
          aria-hidden="true"
        >
          {rest}
        </span>
        {showPrivacyBadge && (
          <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            Masked
          </span>
        )}
      </span>
    );
  }

  // Multi-part name: First part(s) are clear, the last word is blurred
  const lastName = parts[parts.length - 1];
  const firstName = parts.slice(0, parts.length - 1).join(' ');

  return (
    <span className={`inline-flex items-baseline gap-1.5 flex-wrap ${className}`}>
      <span className="font-semibold text-slate-900">{firstName}</span>
      <span
        className={`select-none filter blur-[6.5px] bg-slate-200/80 text-slate-700/40 rounded px-1.5 py-0.5 tracking-wider font-mono text-[0.9em] transition-all cursor-not-allowed ${lastNameClassName}`}
        title="Last name is masked for student privacy"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        {lastName.length > 2 ? lastName.replace(/./g, '●') : '●●●●'}
      </span>
      {showPrivacyBadge && (
        <span className="text-[10px] uppercase tracking-wider font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 select-none">
          Private
        </span>
      )}
    </span>
  );
};
