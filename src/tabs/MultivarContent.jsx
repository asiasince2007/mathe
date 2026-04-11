import React from 'react';
import { TextWithMath } from '../components/MathComponents';

export default function MultivarContent({ subTab, katexReady }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        <TextWithMath text="Differentialrechnung in $\mathbb{R}^n$" katexReady={katexReady} />
      </h2>
      <p className="text-slate-600 dark:text-slate-400">Wähle einen Unterabschnitt in der Sub-Navigation oben.</p>
      {subTab === 'partial' && <div className="text-slate-500 dark:text-slate-400 italic">Partielle Differenzierbarkeit — Inhalte werden geladen...</div>}
      {subTab === 'gradient' && <div className="text-slate-500 dark:text-slate-400 italic">Richtungsableitung &amp; Gradient — Inhalte werden geladen...</div>}
      {subTab === 'total' && <div className="text-slate-500 dark:text-slate-400 italic">Totale Differenzierbarkeit — Inhalte werden geladen...</div>}
      {subTab === 'mws_rn' && <div className="text-slate-500 dark:text-slate-400 italic">Mittelwertsatz in Rⁿ — Inhalte werden geladen...</div>}
    </div>
  );
}
