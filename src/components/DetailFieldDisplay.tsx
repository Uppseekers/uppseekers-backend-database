import React from 'react';
import { isFieldMissing, cleanText, NOT_ADDED_TEXT } from '../utils/textCleaner';

interface DetailFieldDisplayProps {
  value: string | undefined | null;
  className?: string;
  fallbackText?: string;
  mono?: boolean;
}

export const DetailFieldDisplay: React.FC<DetailFieldDisplayProps> = ({
  value,
  className = '',
  fallbackText = NOT_ADDED_TEXT,
  mono = false,
}) => {
  if (isFieldMissing(value)) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-normal text-slate-500 bg-slate-100/90 border border-slate-200/80 italic">
        {fallbackText}
      </span>
    );
  }

  return (
    <span className={`${mono ? 'font-mono' : ''} ${className}`}>
      {cleanText(value)}
    </span>
  );
};
