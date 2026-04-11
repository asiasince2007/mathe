import React from 'react';
import { TextWithMath } from '../components/MathComponents';

export default function AbleitungContent({ subTab, katexReady }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Ableitung</h2>
      <p className="text-slate-600 dark:text-slate-400">Wähle einen Unterabschnitt in der Sub-Navigation oben.</p>
      {subTab === 'diff' && <div className="text-slate-500 dark:text-slate-400 italic">1D Differenzierbarkeit — Inhalte werden geladen...</div>}
      {subTab === 'mws' && <div className="text-slate-500 dark:text-slate-400 italic">Mittelwertsatz (1D) — Inhalte werden geladen...</div>}
      {subTab === 'ck' && <div className="text-slate-500 dark:text-slate-400 italic">Cᵏ &amp; ∞-oft differenzierbar — Inhalte werden geladen...</div>}
    </div>
  );
}
