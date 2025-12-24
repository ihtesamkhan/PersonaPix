
import React from 'react';

interface RoleItemProps {
  label: string;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const RoleItem: React.FC<RoleItemProps> = ({ 
  label, 
  onRemove, 
  onMoveUp, 
  onMoveDown,
  isFirst,
  isLast
}) => {
  return (
    <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm transition hover:border-indigo-300">
      <div className="flex flex-col mr-3 space-y-1">
        <button 
          onClick={onMoveUp} 
          disabled={isFirst}
          className={`text-xs ${isFirst ? 'text-slate-200' : 'text-slate-400 hover:text-indigo-600'}`}
        >
          ▲
        </button>
        <button 
          onClick={onMoveDown} 
          disabled={isLast}
          className={`text-xs ${isLast ? 'text-slate-200' : 'text-slate-400 hover:text-indigo-600'}`}
        >
          ▼
        </button>
      </div>
      <span className="flex-grow text-slate-700 font-medium">{label}</span>
      <button 
        onClick={onRemove}
        className="ml-2 text-slate-400 hover:text-red-500 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};
