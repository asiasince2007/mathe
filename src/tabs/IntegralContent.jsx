import React, { useState, useMemo } from 'react';
import { TextWithMath } from '../components/MathComponents';
import { Card, CollapsibleProof, FormulaCard } from '../components/Cards';
import PlotlyChart from '../components/PlotlyChart';

const FUNCTIONS = {
  x2:    { label: 'f(x) = x²',      f: x => x * x,                   F: (a, b) => (b**3 - a**3) / 3,           name: '$x^2$' },
  sinx:  { label: 'f(x) = sin(x)',   f: x => Math.sin(x),             F: (a, b) => -Math.cos(b) + Math.cos(a),  name: '$\\sin(x)$' },
  sqrtx: { label: 'f(x) = √x',      f: x => Math.sqrt(Math.max(x,0)),F: (a, b) => (2/3)*(b**1.5 - Math.max(a,0)**1.5), name: '$\\sqrt{x}$' },
  gauss: { label: 'f(x) = e^(−x²)', f: x => Math.exp(-x * x),        F: null,                                   name: '$e^{-x^2}$' },
};

function numericalIntegral(f, a, b, n = 1000) {
  const dx = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += f(a + (i + 0.5) * dx);
  return sum * dx;
}

function buildRiemannData(funcObj, a, b, N, strategy) {
  const dx = (b - a) / N;
  const rects = [];
  let riemannSum = 0;

  for (let i = 0; i < N; i++) {
    const xi = a + i * dx;
    let sample;
    if (strategy === 'left')  sample = xi;
    else if (strategy === 'right') sample = xi + dx;
    else if (strategy === 'mid')   sample = xi + dx / 2;
    else sample = xi + Math.random() * dx;
    const fi = funcObj.f(sample);
    riemannSum += fi * dx;
    rects.push({ x: xi, w: dx, h: fi });
  }

  const trueVal = funcObj.F ? funcObj.F(a, b) : numericalIntegral(funcObj.f, a, b);
  return { rects, riemannSum, trueVal };
}

export default function IntegralContent({ katexReady }) {
  const [N, setN] = useState(10);
  const [strategy, setStrategy] = useState('mid');
  const [funcId, setFuncId] = useState('x2');
  const funcObj = FUNCTIONS[funcId];

  const a = funcId === 'sqrtx' ? 0 : (funcId === 'sinx' ? 0 : 0);
  const b = funcId === 'sinx' ? Math.PI : (funcId === 'sqrtx' ? 4 : 2);

  const { rects, riemannSum, trueVal, plotData, plotLayout } = useMemo(() => {
    const { rects, riemannSum, trueVal } = buildRiemannData(funcObj, a, b, N, strategy);

    // Function curve
    const curveX = [], curveY = [];
    for (let x = a; x <= b + 0.01; x += (b - a) / 300) {
      curveX.push(x);
      curveY.push(funcObj.f(x));
    }

    // Rectangle traces – split by over/underestimate
    const overX = [], overW = [], overY = [], overColor = [];
    const underX = [], underW = [], underY = [], underColor = [];
    rects.forEach(r => {
      const midVal = funcObj.f(r.x + r.w / 2);
      const over = r.h > midVal;
      const arr = over ? { x: overX, w: overW, y: overY, c: overColor } : { x: underX, w: underW, y: underY, c: underColor };
      arr.x.push(r.x + r.w / 2);
      arr.w.push(r.w);
      arr.y.push(r.h);
      arr.c.push(over ? 'rgba(239,68,68,0.35)' : 'rgba(59,130,246,0.35)');
    });

    const makeBarTrace = (xs, ys, ws, colors, name) => ({
      x: xs, y: ys, width: ws, type: 'bar', name,
      marker: { color: colors, line: { color: colors.map(c => c.replace('0.35', '0.8')), width: 1 } },
      hoverinfo: 'skip',
    });

    const plotData = [
      makeBarTrace(overX, overY, overW, overColor, 'Überschätzung'),
      makeBarTrace(underX, underY, underW, underColor, 'Unterschätzung'),
      { x: curveX, y: curveY, type: 'scatter', mode: 'lines', name: 'f(x)', line: { color: '#6366f1', width: 3 } },
    ];

    const plotLayout = {
      barmode: 'overlay',
      xaxis: { title: 'x', range: [a - 0.1, b + 0.1] },
      yaxis: { title: 'f(x)', rangemode: 'tozero' },
      legend: { orientation: 'h', y: -0.2 },
      margin: { t: 30, r: 20, b: 60, l: 50 },
    };

    return { rects, riemannSum, trueVal, plotData, plotLayout };
  }, [N, strategy, funcId]);

  const strategies = [
    { id: 'left', label: 'Links' }, { id: 'right', label: 'Rechts' },
    { id: 'mid', label: 'Mitte' }, { id: 'random', label: 'Zufall' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Integral — Vertiefung</h2>

      {/* 1. Partition & Riemann Sum Definition */}
      <Card type="definition" title="Partition und Riemann-Summe" katexReady={katexReady}>
        <TextWithMath text="Sei $f:[a,b]\to\mathbb{R}$ beschränkt. Eine **Zerlegung** von $[a,b]$ ist eine endliche Menge" katexReady={katexReady} />
        <FormulaCard math="Z = \{x_0, x_1, \ldots, x_N\}, \quad a = x_0 < x_1 < \cdots < x_N = b" katexReady={katexReady} />
        <TextWithMath text="Wählt man in jedem Teilintervall $[x_{i-1}, x_i]$ eine **Stützstelle** $\xi_i^* \in [x_{i-1}, x_i]$, so heißt" katexReady={katexReady} />
        <FormulaCard math="S_N = \sum_{i=1}^{N} f(\xi_i^*)\,\Delta x_i, \qquad \Delta x_i = x_i - x_{i-1}" katexReady={katexReady} />
        <TextWithMath text="eine **Riemann-Summe**. Typische Wahlen: $\xi_i^* = x_{i-1}$ (links), $\xi_i^* = x_i$ (rechts), $\xi_i^* = \frac{x_{i-1}+x_i}{2}$ (Mitte)." katexReady={katexReady} />
      </Card>

      {/* 2. Interactive Visualization */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Interaktive Riemann-Summe</h4>

        {/* Function selector */}
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(FUNCTIONS).map(([id, fc]) => (
            <button key={id} onClick={() => setFuncId(id)}
              className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${funcId === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
              {fc.label}
            </button>
          ))}
        </div>

        {/* Strategy selector */}
        <div className="flex flex-wrap gap-2 mb-3">
          {strategies.map(s => (
            <button key={s.id} onClick={() => setStrategy(s.id)}
              className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${strategy === s.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* N slider */}
        <div className="flex items-center gap-3 mb-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">N = {N}</label>
          <input type="range" min={1} max={50} step={1} value={N} onChange={e => setN(+e.target.value)}
            className="flex-1 cursor-pointer accent-indigo-600" />
        </div>

        <PlotlyChart data={plotData} layout={plotLayout} style={{ width: '100%', height: 350 }} />

        {/* Summary */}
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="bg-indigo-50 dark:bg-indigo-900/40 rounded-lg p-3 text-center">
            <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Riemann-Summe</span>
            <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{riemannSum.toFixed(6)}</span>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/40 rounded-lg p-3 text-center">
            <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Exakter Wert</span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{trueVal.toFixed(6)}</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          Fehler: {Math.abs(riemannSum - trueVal).toFixed(6)} &mdash;
          <span className="text-red-500"> rot</span> = Überschätzung,
          <span className="text-blue-500"> blau</span> = Unterschätzung
        </p>
      </div>

      {/* 3. Ober- und Untersumme */}
      <Card type="theorem" title="Ober- und Untersumme" katexReady={katexReady}>
        <TextWithMath text="Für eine Zerlegung $Z$ von $[a,b]$ definiere:" katexReady={katexReady} />
        <FormulaCard math="U(f,Z) = \sum_{i=1}^{N} \inf_{x \in [x_{i-1},x_i]} f(x)\,\Delta x_i \qquad \text{(Untersumme)}" katexReady={katexReady} />
        <FormulaCard math="O(f,Z) = \sum_{i=1}^{N} \sup_{x \in [x_{i-1},x_i]} f(x)\,\Delta x_i \qquad \text{(Obersumme)}" katexReady={katexReady} />
        <TextWithMath text="$f$ heißt **Riemann-integrierbar**, wenn das Supremum aller Untersummen gleich dem Infimum aller Obersummen ist:" katexReady={katexReady} />
        <FormulaCard math="\sup_Z U(f,Z) = \inf_Z O(f,Z) =: \int_a^b f(x)\,dx" katexReady={katexReady} />
      </Card>

      {/* 4. Stückweise stetig => integrierbar */}
      <Card type="theorem" title="Stückweise stetig $\Rightarrow$ Riemann-integrierbar" katexReady={katexReady}>
        <TextWithMath text="Ist $f:[a,b]\to\mathbb{R}$ **stückweise stetig** (d.h. stetig bis auf endlich viele Sprungstellen), so ist $f$ Riemann-integrierbar auf $[a,b]$." katexReady={katexReady} />
        <TextWithMath text="Insbesondere ist jede stetige Funktion $f \in C([a,b])$ integrierbar." katexReady={katexReady} />
      </Card>

      {/* 5. Hauptsatz */}
      <Card type="theorem" title="Hauptsatz der Differential- und Integralrechnung" katexReady={katexReady}>
        <TextWithMath text="Sei $f:[a,b]\to\mathbb{R}$ stetig." katexReady={katexReady} />
        <TextWithMath text="**Teil 1 (Integralfunktion):** Die Funktion" katexReady={katexReady} />
        <FormulaCard math="F(x) = \int_a^x f(t)\,dt" katexReady={katexReady} />
        <TextWithMath text="ist differenzierbar auf $(a,b)$ mit $F'(x) = f(x)$ für alle $x \in (a,b)$." katexReady={katexReady} />
        <TextWithMath text="**Teil 2 (Newton-Leibniz):** Ist $F$ eine beliebige Stammfunktion von $f$ (d.h. $F'=f$), so gilt:" katexReady={katexReady} />
        <FormulaCard math="\int_a^b f(x)\,dx = F(b) - F(a)" katexReady={katexReady} />
      </Card>

      {/* 6. Collapsible proof sketch */}
      <CollapsibleProof title="Beweisskizze zum Hauptsatz" katexReady={katexReady}>
        <TextWithMath text="**Teil 1:** Wir zeigen $F'(x)=f(x)$. Für $h>0$:" katexReady={katexReady} />
        <FormulaCard math="\frac{F(x+h)-F(x)}{h} = \frac{1}{h}\int_x^{x+h} f(t)\,dt" katexReady={katexReady} />
        <TextWithMath text="Da $f$ stetig ist, existiert nach dem Mittelwertsatz der Integralrechnung ein $\xi_h \in [x, x+h]$ mit" katexReady={katexReady} />
        <FormulaCard math="\frac{1}{h}\int_x^{x+h} f(t)\,dt = f(\xi_h)" katexReady={katexReady} />
        <TextWithMath text="Für $h \to 0$ gilt $\xi_h \to x$ und somit $f(\xi_h) \to f(x)$ (Stetigkeit). Also $F'(x)=f(x)$." katexReady={katexReady} />
        <TextWithMath text="**Teil 2:** Ist $G$ eine weitere Stammfunktion, so ist $(F-G)'=0$, also $F-G=c$. Damit $\int_a^b f\,dx = F(b)-F(a) = G(b)+c - (G(a)+c) = G(b)-G(a)$." katexReady={katexReady} />
      </CollapsibleProof>
    </div>
  );
}
