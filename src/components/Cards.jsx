import React, { useState } from 'react';
import { TextWithMath, BlockMath } from './MathComponents';

const CARD_STYLES = {
  definition: { border: '#6C63FF', bg: 'bg-[#F4F3FF] dark:bg-[#1e1b4b]', label: 'Definition', icon: '📖' },
  theorem: { border: '#22C55E', bg: 'bg-[#F0FDF4] dark:bg-[#052e16]', label: 'Satz', icon: '🔬' },
  proof: { border: '#94A3B8', bg: 'bg-white dark:bg-slate-800', label: 'Beweis', icon: '📝' },
  example: { border: '#F97316', bg: 'bg-[#FFF7ED] dark:bg-[#431407]', label: 'Beispiel', icon: '💡' },
  warning: { border: '#EF4444', bg: 'bg-[#FEF2F2] dark:bg-[#450a0a]', label: 'Achtung', icon: '⚠️' },
  intuition: { border: '#06B6D4', bg: 'bg-[#ECFEFF] dark:bg-[#083344]', label: 'Intuition', icon: '💭' },
};

export const Card = ({ type = 'definition', title, children, katexReady }) => {
  const style = CARD_STYLES[type] || CARD_STYLES.definition;
  return (
    <div className={`${style.bg} rounded-lg p-5 my-4 border-l-4 shadow-sm transition-all duration-300`} style={{ borderLeftColor: style.border }}>
      {title && (
        <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2 text-base flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ backgroundColor: style.border }}>{style.label}</span>
          <TextWithMath text={title} katexReady={katexReady} />
        </h4>
      )}
      <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
        {children}
      </div>
    </div>
  );
};

export const CollapsibleProof = ({ title = "Beweis zeigen", children, katexReady }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg my-4 border-l-4 shadow-sm overflow-hidden" style={{ borderLeftColor: '#94A3B8' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 p-4 text-left font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <span className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>&#9654;</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-500 text-white">Beweis</span>
        <TextWithMath text={title} katexReady={katexReady} />
      </button>
      <div className={`transition-all duration-500 ease-in-out ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-5 pb-5 text-slate-700 dark:text-slate-300 leading-relaxed text-sm border-t border-slate-200 dark:border-slate-600 pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export const FormulaCard = ({ math, katexReady }) => (
  <div className="my-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-md shadow-sm border border-slate-200 dark:border-slate-600 inline-block overflow-x-auto w-auto max-w-full">
    <BlockMath tex={math} katexReady={katexReady} />
  </div>
);
