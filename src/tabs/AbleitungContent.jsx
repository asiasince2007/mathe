import React, { useState, useMemo } from 'react';
import { TextWithMath, BlockMath } from '../components/MathComponents';
import { Card, CollapsibleProof, FormulaCard } from '../components/Cards';
import PlotlyChart from '../components/PlotlyChart';

// ============================================================
// Sub-tab 1: 1D Differenzierbarkeit
// ============================================================
function DiffSection({ katexReady }) {
  const [x0, setX0] = useState(1.0);
  const [h, setH] = useState(1.5);
  const [funcId, setFuncId] = useState('x2');

  const funcs = {
    x2:   { label: 'f(x) = x\u00B2',       f: x => x * x,           df: x => 2 * x, name: '$f(x)=x^2$' },
    x3:   { label: 'f(x) = x\u00B3',       f: x => x * x * x,      df: x => 3 * x * x, name: '$f(x)=x^3$' },
    sinx: { label: 'f(x) = sin(x)',   f: x => Math.sin(x),     df: x => Math.cos(x), name: '$f(x)=\\sin(x)$' },
    abs:  { label: 'f(x) = |x|',      f: x => Math.abs(x),     df: x => x > 0 ? 1 : (x < 0 ? -1 : NaN), name: '$f(x)=|x|$' },
  };
  const fn = funcs[funcId];

  const plotData = useMemo(() => {
    const xs = [];
    const ys = [];
    for (let x = -4; x <= 4; x += 0.05) {
      xs.push(x);
      ys.push(fn.f(x));
    }

    const y0 = fn.f(x0);
    const y1 = fn.f(x0 + h);
    const slope = h !== 0 ? (y1 - y0) / h : NaN;

    // Secant line
    const secXs = [x0 - 1.5, x0 + h + 1.5];
    const secYs = secXs.map(x => y0 + slope * (x - x0));

    // Tangent line (true derivative)
    const dv = fn.df(x0);
    const tanXs = [x0 - 2, x0 + 2];
    const tanYs = tanXs.map(x => y0 + dv * (x - x0));

    return {
      data: [
        { x: xs, y: ys, type: 'scatter', mode: 'lines', name: 'f(x)', line: { color: '#6366f1', width: 3 } },
        { x: secXs, y: secYs, type: 'scatter', mode: 'lines', name: `Sekante (m=${slope.toFixed(3)})`, line: { color: '#f97316', width: 2, dash: 'dash' } },
        { x: tanXs, y: tanYs, type: 'scatter', mode: 'lines', name: `Tangente (m=${isNaN(dv) ? '?' : dv.toFixed(3)})`, line: { color: '#22c55e', width: 2 } },
        { x: [x0, x0 + h], y: [y0, y1], type: 'scatter', mode: 'markers', name: 'Punkte', marker: { color: ['#f97316', '#f97316'], size: 10 } },
      ],
      slope,
      dv,
    };
  }, [x0, h, funcId]);

  return (
    <div className="space-y-5">
      <Card type="intuition" title="Worum geht es?" katexReady={katexReady}>
        <TextWithMath text="Die **Ableitung** misst die momentane Steigung einer Funktion an einem Punkt. Man nähert sich ihr, indem man die Steigung einer **Sekante** (durch zwei Punkte) betrachtet und den Abstand $h$ gegen $0$ gehen lässt." katexReady={katexReady} />
      </Card>

      <Card type="definition" title="Differentialquotient (Ableitung)" katexReady={katexReady}>
        <FormulaCard math="f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}" katexReady={katexReady} />
        <TextWithMath text="Existiert dieser Grenzwert, so heißt $f$ **differenzierbar** in $x_0$. Der Wert $f'(x_0)$ ist die Steigung der **Tangente** an den Graphen im Punkt $(x_0, f(x_0))$." katexReady={katexReady} />
      </Card>

      <Card type="definition" title="Alternative Form (symmetrischer DQ)" katexReady={katexReady}>
        <FormulaCard math="f'(x_0) = \lim_{x \to x_0} \frac{f(x) - f(x_0)}{x - x_0}" katexReady={katexReady} />
        <TextWithMath text="Äquivalent: Man lässt den zweiten Punkt $x$ gegen $x_0$ wandern." katexReady={katexReady} />
      </Card>

      {/* Interactive plot */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Interaktive Visualisierung: Sekante &rarr; Tangente</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(funcs).map(([id, fc]) => (
            <button key={id} onClick={() => setFuncId(id)}
              className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${funcId === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
              {fc.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mb-3">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-bold">x&#8320; =</span>
            <input type="range" min={-3} max={3} step={0.1} value={x0} onChange={e => setX0(+e.target.value)} className="w-32 accent-indigo-600" />
            <span className="font-mono text-indigo-600 dark:text-indigo-400 w-12">{x0.toFixed(1)}</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-bold">h =</span>
            <input type="range" min={0.01} max={3} step={0.01} value={h} onChange={e => setH(+e.target.value)} className="w-32 accent-orange-500" />
            <span className="font-mono text-orange-600 dark:text-orange-400 w-12">{h.toFixed(2)}</span>
          </label>
        </div>
        <PlotlyChart
          data={plotData.data}
          layout={{
            xaxis: { title: 'x', range: [-4.5, 4.5], gridcolor: 'rgba(148,163,184,0.2)' },
            yaxis: { title: 'f(x)', range: [-2, 10], gridcolor: 'rgba(148,163,184,0.2)' },
            legend: { x: 0.02, y: 0.98, bgcolor: 'rgba(0,0,0,0)' },
            height: 380,
          }}
          style={{ width: '100%' }}
        />
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 flex flex-wrap gap-4">
          <span>Sekantensteigung: <strong className="text-orange-600 dark:text-orange-400">{plotData.slope.toFixed(4)}</strong></span>
          <span>Tangente (exakt): <strong className="text-green-600 dark:text-green-400">{isNaN(plotData.dv) ? 'existiert nicht!' : plotData.dv.toFixed(4)}</strong></span>
        </div>
      </div>

      <Card type="example" title="Durchgerechnetes Beispiel: $f(x) = x^2$" katexReady={katexReady}>
        <TextWithMath text="Sei $f(x) = x^2$ und $x_0$ beliebig. Dann:" katexReady={katexReady} />
        <FormulaCard math="\frac{f(x_0+h)-f(x_0)}{h} = \frac{(x_0+h)^2 - x_0^2}{h} = \frac{x_0^2 + 2x_0 h + h^2 - x_0^2}{h} = 2x_0 + h" katexReady={katexReady} />
        <TextWithMath text="Für $h \to 0$ ergibt sich $f'(x_0) = 2x_0$. Die Parabel ist überall differenzierbar." katexReady={katexReady} />
      </Card>

      <Card type="warning" title="Nicht-Differenzierbarkeit: $f(x) = |x|$ bei $x_0 = 0$" katexReady={katexReady}>
        <TextWithMath text="Betrachte den Differenzenquotienten:" katexReady={katexReady} />
        <FormulaCard math="\frac{|0+h| - |0|}{h} = \frac{|h|}{h} = \begin{cases} +1 & h > 0 \\ -1 & h < 0 \end{cases}" katexReady={katexReady} />
        <TextWithMath text="Die links- und rechtsseitigen Grenzwerte sind **verschieden** ($-1 \neq +1$). Der Grenzwert existiert nicht &mdash; die Betragsfunktion hat bei $0$ einen **Knick** und ist dort **nicht differenzierbar**!" katexReady={katexReady} />
        <TextWithMath text="Wähle oben $f(x) = |x|$ mit $x_0 = 0$ und verkleinere $h$, um den Knick zu sehen." katexReady={katexReady} />
      </Card>

      <Card type="theorem" title="Differenzierbar $\Rightarrow$ stetig" katexReady={katexReady}>
        <TextWithMath text="Ist $f$ differenzierbar in $x_0$, so ist $f$ auch stetig in $x_0$." katexReady={katexReady} />
        <TextWithMath text="**Achtung:** Die Umkehrung gilt **nicht**! $|x|$ ist stetig in $0$, aber nicht differenzierbar." katexReady={katexReady} />
      </Card>

      <CollapsibleProof title="Beweis: Differenzierbar $\Rightarrow$ stetig" katexReady={katexReady}>
        <TextWithMath text="Es gilt:" katexReady={katexReady} />
        <FormulaCard math="f(x) - f(x_0) = \frac{f(x) - f(x_0)}{x - x_0} \cdot (x - x_0)" katexReady={katexReady} />
        <TextWithMath text="Für $x \to x_0$ konvergiert der Bruch gegen $f'(x_0)$ (existiert nach Voraussetzung) und der Faktor $(x-x_0) \to 0$. Also $f(x) \to f(x_0)$. $\blacksquare$" katexReady={katexReady} />
      </CollapsibleProof>
    </div>
  );
}

// ============================================================
// Sub-tab 2: Mittelwertsatz 1D
// ============================================================
function MWSSection({ katexReady }) {
  const [a, setA] = useState(0.5);
  const [b, setB] = useState(3.5);
  const [funcId, setFuncId] = useState('x2');

  const funcs = {
    x2:   { label: 'x\u00B2', f: x => x * x, df: x => 2 * x, name: '$x^2$' },
    x3:   { label: 'x\u00B3', f: x => x * x * x, df: x => 3 * x * x, name: '$x^3$' },
    sinx: { label: 'sin(x)', f: x => Math.sin(x), df: x => Math.cos(x), name: '$\\sin(x)$' },
    sqrt: { label: '\u221Ax', f: x => x >= 0 ? Math.sqrt(x) : 0, df: x => x > 0.01 ? 0.5 / Math.sqrt(x) : NaN, name: '$\\sqrt{x}$' },
  };
  const fn = funcs[funcId];

  const plotData = useMemo(() => {
    const xs = [], ys = [];
    const lo = Math.min(a, b) - 0.5, hi = Math.max(a, b) + 0.5;
    for (let x = lo; x <= hi; x += 0.02) {
      xs.push(x); ys.push(fn.f(x));
    }
    const fa = fn.f(a), fb = fn.f(b);
    const secSlope = (fb - fa) / (b - a);

    // Find xi where f'(xi) = secSlope via bisection / scan
    let xi = null;
    const step = 0.001;
    for (let x = Math.min(a, b) + step; x < Math.max(a, b); x += step) {
      const d = fn.df(x);
      if (!isNaN(d) && Math.abs(d - secSlope) < 0.01) { xi = x; break; }
    }

    const traces = [
      { x: xs, y: ys, type: 'scatter', mode: 'lines', name: 'f(x)', line: { color: '#6366f1', width: 3 } },
      // Secant
      { x: [a, b], y: [fa, fb], type: 'scatter', mode: 'lines+markers', name: `Sekante (m=${secSlope.toFixed(3)})`, line: { color: '#ef4444', width: 2, dash: 'dash' }, marker: { size: 8, color: '#ef4444' } },
    ];
    if (xi !== null) {
      const fxi = fn.f(xi);
      const tanXs = [xi - 1.2, xi + 1.2];
      const tanYs = tanXs.map(x => fxi + secSlope * (x - xi));
      traces.push({ x: tanXs, y: tanYs, type: 'scatter', mode: 'lines', name: `Tangente bei \u03BE=${xi.toFixed(2)}`, line: { color: '#22c55e', width: 2.5 } });
      traces.push({ x: [xi], y: [fxi], type: 'scatter', mode: 'markers', name: '\u03BE', marker: { size: 10, color: '#22c55e', symbol: 'diamond' } });
    }
    return { traces, secSlope, xi };
  }, [a, b, funcId]);

  return (
    <div className="space-y-5">
      <Card type="theorem" title="Mittelwertsatz der Differentialrechnung" katexReady={katexReady}>
        <TextWithMath text="Sei $f: [a,b] \to \mathbb{R}$ stetig auf $[a,b]$ und differenzierbar auf $(a,b)$. Dann existiert ein $\xi \in (a,b)$ mit:" katexReady={katexReady} />
        <FormulaCard math="f'(\xi) = \frac{f(b) - f(a)}{b - a}" katexReady={katexReady} />
        <TextWithMath text="Die Tangente bei $\xi$ ist also **parallel** zur Sekante durch $(a, f(a))$ und $(b, f(b))$." katexReady={katexReady} />
      </Card>

      <Card type="intuition" title="Geschwindigkeits-Analogie" katexReady={katexReady}>
        <TextWithMath text="Stell dir vor, du fährst mit dem Auto von A nach B. Die Durchschnittsgeschwindigkeit auf der Strecke beträgt $80$ km/h. Dann gab es **mindestens einen Moment** $\xi$, in dem dein Tacho exakt $80$ km/h angezeigt hat!" katexReady={katexReady} />
      </Card>

      {/* Interactive MWS plot */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Interaktive Visualisierung: MWS</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(funcs).map(([id, fc]) => (
            <button key={id} onClick={() => setFuncId(id)}
              className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${funcId === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              {fc.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mb-3">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-bold">a =</span>
            <input type="range" min={0} max={3} step={0.1} value={a} onChange={e => setA(+e.target.value)} className="w-28 accent-red-500" />
            <span className="font-mono text-red-600 dark:text-red-400 w-10">{a.toFixed(1)}</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-bold">b =</span>
            <input type="range" min={1} max={5} step={0.1} value={b} onChange={e => setB(+e.target.value)} className="w-28 accent-red-500" />
            <span className="font-mono text-red-600 dark:text-red-400 w-10">{b.toFixed(1)}</span>
          </label>
        </div>
        <PlotlyChart
          data={plotData.traces}
          layout={{
            xaxis: { title: 'x', gridcolor: 'rgba(148,163,184,0.2)' },
            yaxis: { title: 'f(x)', gridcolor: 'rgba(148,163,184,0.2)' },
            legend: { x: 0.02, y: 0.98, bgcolor: 'rgba(0,0,0,0)' },
            height: 380,
          }}
          style={{ width: '100%' }}
        />
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sekantensteigung: <strong className="text-red-600 dark:text-red-400">{plotData.secSlope.toFixed(4)}</strong>
          {plotData.xi !== null && <span className="ml-4">MWS-Stelle: <strong className="text-green-600 dark:text-green-400">&xi; &asymp; {plotData.xi.toFixed(3)}</strong></span>}
        </div>
      </div>

      <Card type="theorem" title="Folgerungen aus dem MWS" katexReady={katexReady}>
        <div className="space-y-2">
          <TextWithMath text="**1. Konstanz-Kriterium:** Ist $f'(x) = 0$ für alle $x \in (a,b)$, so ist $f$ **konstant** auf $[a,b]$." katexReady={katexReady} />
          <TextWithMath text="**2. Monotonie-Kriterium:** $f' \ge 0$ auf $(a,b)$ $\Rightarrow$ $f$ ist **monoton wachsend**." katexReady={katexReady} />
          <TextWithMath text="**3. Lipschitz-Abschätzung:** Ist $|f'(x)| \le L$ für alle $x \in (a,b)$, dann:" katexReady={katexReady} />
          <FormulaCard math="|f(x) - f(y)| \le L \cdot |x - y| \quad \forall\, x,y \in [a,b]" katexReady={katexReady} />
        </div>
      </Card>

      <CollapsibleProof title="Beweisskizze: Rolle $\Rightarrow$ MWS" katexReady={katexReady}>
        <TextWithMath text="**Satz von Rolle:** Sei $g$ stetig auf $[a,b]$, differenzierbar auf $(a,b)$, mit $g(a)=g(b)$. Dann $\exists\,\xi: g'(\xi)=0$." katexReady={katexReady} />
        <TextWithMath text="**MWS-Beweis:** Definiere die Hilfsfunktion" katexReady={katexReady} />
        <FormulaCard math="g(x) = f(x) - f(a) - \frac{f(b)-f(a)}{b-a}(x-a)" katexReady={katexReady} />
        <TextWithMath text="Dann ist $g(a) = g(b) = 0$. Nach dem Satz von Rolle existiert $\xi \in (a,b)$ mit $g'(\xi) = 0$, also:" katexReady={katexReady} />
        <FormulaCard math="g'(\xi) = f'(\xi) - \frac{f(b)-f(a)}{b-a} = 0 \quad \Rightarrow \quad f'(\xi) = \frac{f(b)-f(a)}{b-a} \quad \blacksquare" katexReady={katexReady} />
      </CollapsibleProof>

      <Card type="warning" title="Voraussetzungen sind wichtig!" katexReady={katexReady}>
        <TextWithMath text="Ohne **Stetigkeit** auf $[a,b]$ oder **Differenzierbarkeit** auf $(a,b)$ kann der MWS scheitern. Beispiel: $f(x) = |x|$ auf $[-1,1]$ &mdash; die Sekantensteigung ist $0$, aber $f'(x) = \pm 1 \neq 0$ überall (und bei $0$ existiert $f'$ nicht)." katexReady={katexReady} />
      </Card>
    </div>
  );
}

// ============================================================
// Sub-tab 3: C^k & unendlich oft differenzierbar
// ============================================================
function CkSection({ katexReady }) {
  const [activeClass, setActiveClass] = useState(null);

  const classes = [
    { id: 'c0', label: 'C\u2070', color: '#ef4444', desc: 'Stetig', examples: '$|x|$, $\\sqrt{x}$', counter: '$\\lfloor x \\rfloor$ (Treppen-Funktion, hat Sprünge)' },
    { id: 'c1', label: 'C\u00B9', color: '#f97316', desc: 'Einmal stetig differenzierbar', examples: '$x|x|$, $x^2$', counter: '$|x|$ (Knick bei $0$, $f\'$ springt)' },
    { id: 'c2', label: 'C\u00B2', color: '#eab308', desc: 'Zweimal stetig differenzierbar', examples: '$x^3$, $\\sin(x)$', counter: '$x^2|x|$ ist $C^2$ aber nicht $C^3$ bei $0$' },
    { id: 'ck', label: 'C\u1D4F', color: '#22c55e', desc: 'k-mal stetig differenzierbar', examples: 'Polynome vom Grad $\\le k$', counter: '' },
    { id: 'cinf', label: 'C\u221E', color: '#6366f1', desc: 'Unendlich oft differenzierbar (glatt)', examples: '$e^x$, $\\sin(x)$, $\\cos(x)$, Polynome', counter: '' },
    { id: 'analytic', label: 'C\u03C9', color: '#8b5cf6', desc: 'Analytisch (= Potenzreihe)', examples: '$e^x$, $\\sin(x)$, alle Potenzreihen', counter: '$e^{-1/x^2}$ (glatt, aber nicht analytisch bei $0$!)' },
  ];

  return (
    <div className="space-y-5">
      <Card type="definition" title="Klassen $C^k(D)$" katexReady={katexReady}>
        <div className="space-y-2">
          <TextWithMath text="Sei $D \subseteq \mathbb{R}$ offen. Dann ist $f \in C^k(D)$, falls $f$ **$k$-mal differenzierbar** ist und $f^{(k)}$ **stetig** ist." katexReady={katexReady} />
          <FormulaCard math="C^0(D) \supset C^1(D) \supset C^2(D) \supset \cdots \supset C^\infty(D) \supset C^\omega(D)" katexReady={katexReady} />
          <TextWithMath text="Insbesondere: $C^\infty(D) = \bigcap_{k=0}^\infty C^k(D)$." katexReady={katexReady} />
        </div>
      </Card>

      {/* Visual hierarchy */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Hierarchie der Glattheit (klicke auf eine Klasse)</h4>
        <div className="relative flex justify-center">
          <svg viewBox="0 0 400 260" className="w-full max-w-md">
            {/* Nested ellipses */}
            {classes.slice().reverse().map((c, i) => {
              const rx = 190 - i * 28;
              const ry = 120 - i * 17;
              return (
                <g key={c.id} onClick={() => setActiveClass(activeClass === c.id ? null : c.id)} className="cursor-pointer">
                  <ellipse cx={200} cy={130} rx={rx} ry={ry} fill={c.color} fillOpacity={activeClass === c.id ? 0.25 : 0.08} stroke={c.color} strokeWidth={activeClass === c.id ? 3 : 1.5} strokeDasharray={c.id === 'analytic' ? '6,3' : 'none'} />
                  <text x={200} y={130 - ry + 16} textAnchor="middle" fill={c.color} fontSize="13" fontWeight="bold" className="select-none">{c.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
        {activeClass && (() => {
          const c = classes.find(cl => cl.id === activeClass);
          return (
            <div className="mt-3 p-3 rounded-lg border-l-4 transition-all" style={{ borderColor: c.color, background: `${c.color}11` }}>
              <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">{c.label}: {c.desc}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400"><TextWithMath text={`**Beispiele:** ${c.examples}`} katexReady={katexReady} /></p>
              {c.counter && <p className="text-sm text-red-600 dark:text-red-400 mt-1"><TextWithMath text={`**Gegenbeispiel:** ${c.counter}`} katexReady={katexReady} /></p>}
            </div>
          );
        })()}
      </div>

      <Card type="example" title="$C^0$ aber nicht $C^1$: $f(x) = |x|$" katexReady={katexReady}>
        <TextWithMath text="$f$ ist überall stetig ($C^0$), aber $f'(0)$ existiert nicht (Knick!). Also $f \notin C^1(\mathbb{R})$." katexReady={katexReady} />
      </Card>

      <Card type="example" title="$C^1$ aber nicht $C^2$: $f(x) = x|x|$" katexReady={katexReady}>
        <TextWithMath text="Es gilt $f'(x) = 2|x|$, also existiert $f'$ überall und ist stetig: $f \in C^1$. Aber $f''(0)$ existiert nicht, da $|x|$ bei $0$ einen Knick hat. Also $f \notin C^2$." katexReady={katexReady} />
      </Card>

      <Card type="example" title="$C^\infty$ aber nicht $C^\omega$: Die Bump-Funktion" katexReady={katexReady}>
        <FormulaCard math="f(x) = \begin{cases} e^{-1/x^2} & x \neq 0 \\ 0 & x = 0 \end{cases}" katexReady={katexReady} />
        <TextWithMath text="Diese Funktion ist **unendlich oft differenzierbar** mit $f^{(k)}(0) = 0$ für alle $k$. Ihre Taylorreihe um $0$ ist also die Nullfunktion &mdash; sie stimmt aber **nicht** mit $f$ überein (für $x \neq 0$ ist $f > 0$). Also: $f \in C^\infty \setminus C^\omega$." katexReady={katexReady} />
      </Card>

      <Card type="theorem" title="Potenzreihen sind analytisch ($C^\omega$)" katexReady={katexReady}>
        <TextWithMath text="Jede Funktion, die als konvergente Potenzreihe darstellbar ist, gehört zu $C^\omega$ und damit automatisch auch zu $C^\infty$." katexReady={katexReady} />
        <FormulaCard math="f(x) = \sum_{n=0}^\infty a_n (x-x_0)^n \quad \Rightarrow \quad f \in C^\omega" katexReady={katexReady} />
        <TextWithMath text="Insbesondere: $e^x, \sin(x), \cos(x), \frac{1}{1-x}$ sind alle analytisch in ihrem Definitionsbereich." katexReady={katexReady} />
      </Card>

      <Card type="warning" title="Klausur-Falle: $C^1 \Rightarrow$ total differenzierbar (in $\mathbb{R}^n$)" katexReady={katexReady}>
        <TextWithMath text="In der mehrdimensionalen Analysis gilt: Sind alle **partiellen Ableitungen stetig** ($f \in C^1$), dann ist $f$ **total differenzierbar**. Das ist die wichtigste hinreichende Bedingung!" katexReady={katexReady} />
        <TextWithMath text="Die Umkehrung gilt nicht: Total differenzierbar $\not\Rightarrow C^1$." katexReady={katexReady} />
      </Card>
    </div>
  );
}

// ============================================================
// Main AbleitungContent component
// ============================================================
export default function AbleitungContent({ subTab, katexReady }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Ableitung &mdash; Vertiefung</h2>
      {!subTab && (
        <Card type="intuition" title="Willkommen!" katexReady={katexReady}>
          <TextWithMath text="Wähle oben einen Unterabschnitt: **1D Differenzierbarkeit**, **Mittelwertsatz (1D)** oder **$C^k$ & $\infty$-oft differenzierbar**." katexReady={katexReady} />
        </Card>
      )}
      {subTab === 'diff' && <DiffSection katexReady={katexReady} />}
      {subTab === 'mws' && <MWSSection katexReady={katexReady} />}
      {subTab === 'ck' && <CkSection katexReady={katexReady} />}
    </div>
  );
}
