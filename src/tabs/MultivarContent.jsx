import React, { useState, useMemo } from 'react';
import { TextWithMath } from '../components/MathComponents';
import { Card, CollapsibleProof, FormulaCard } from '../components/Cards';
import PlotlyChart from '../components/PlotlyChart';

// ============================================================
// Sub-tab 1: Partielle Differenzierbarkeit
// ============================================================
function PartialSection({ katexReady }) {
  const [funcId, setFuncId] = useState('paraboloid');
  const [x0, setX0] = useState(0.5);
  const [y0, setY0] = useState(0.5);
  const [showFx, setShowFx] = useState(true);
  const [showFy, setShowFy] = useState(true);

  const funcs = {
    paraboloid: { label: 'Paraboloid', f: (x, y) => x*x + y*y, fx: (x) => 2*x, fy: (_, y) => 2*y, name: '$f(x,y)=x^2+y^2$' },
    saddle:     { label: 'Sattelfläche', f: (x, y) => x*x - y*y, fx: (x) => 2*x, fy: (_, y) => -2*y, name: '$f(x,y)=x^2-y^2$' },
    sincos:     { label: 'sin·cos', f: (x, y) => Math.sin(x)*Math.cos(y), fx: (x, y) => Math.cos(x)*Math.cos(y), fy: (x, y) => -Math.sin(x)*Math.sin(y), name: '$f(x,y)=\\sin(x)\\cos(y)$' },
  };
  const fn = funcs[funcId];

  const plotData = useMemo(() => {
    const N = 28, R = 2;
    const xs = Array.from({ length: N }, (_, i) => -R + 2*R*i/(N-1));
    const ys = Array.from({ length: N }, (_, i) => -R + 2*R*i/(N-1));
    const z = ys.map(y => xs.map(x => fn.f(x, y)));
    const z0 = fn.f(x0, y0);
    const fxV = fn.fx(x0, y0);
    const fyV = fn.fy(x0, y0);

    const traces = [
      { x: xs, y: ys, z, type: 'surface', colorscale: 'Viridis', opacity: 0.8, showscale: false, name: 'f(x,y)' },
    ];
    if (showFx) {
      const sxs = Array.from({ length: 30 }, (_, i) => -R + 2*R*i/29);
      traces.push({ x: sxs, y: sxs.map(() => y0), z: sxs.map(x => fn.f(x, y0)), type: 'scatter3d', mode: 'lines', name: 'Schnitt y=y₀', line: { color: '#fb923c', width: 3 } });
      traces.push({ x: [-R, R], y: [y0, y0], z: [-R, R].map(x => z0 + fxV*(x-x0)), type: 'scatter3d', mode: 'lines', name: '∂f/∂x Tangente', line: { color: '#f97316', width: 5 } });
    }
    if (showFy) {
      const sys = Array.from({ length: 30 }, (_, i) => -R + 2*R*i/29);
      traces.push({ x: sys.map(() => x0), y: sys, z: sys.map(y => fn.f(x0, y)), type: 'scatter3d', mode: 'lines', name: 'Schnitt x=x₀', line: { color: '#4ade80', width: 3 } });
      traces.push({ x: [x0, x0], y: [-R, R], z: [-R, R].map(y => z0 + fyV*(y-y0)), type: 'scatter3d', mode: 'lines', name: '∂f/∂y Tangente', line: { color: '#22c55e', width: 5 } });
    }
    traces.push({ x: [x0], y: [y0], z: [z0], type: 'scatter3d', mode: 'markers', name: '(x₀,y₀)', marker: { size: 6, color: '#ef4444' }, showlegend: false });
    return { traces, fxV, fyV, z0 };
  }, [x0, y0, funcId, showFx, showFy]);

  return (
    <div className="space-y-5">
      <Card type="intuition" title="Warum partielle Ableitungen?" katexReady={katexReady}>
        <TextWithMath text="Bei $f(x,y)$ ist der Graph eine **Fläche** im $\mathbb{R}^3$ — es gibt keine eindeutige 'Steigung'. Idee: **Eine Variable festhalten** und nur nach der anderen differenzieren. Das entspricht dem Schnitt der Fläche mit einer Ebene parallel zur Koordinatenachse." katexReady={katexReady} />
      </Card>

      <Card type="definition" title="Partielle Ableitung als Grenzwert" katexReady={katexReady}>
        <FormulaCard math="\frac{\partial f}{\partial x}(x_0, y_0) \;=\; \lim_{h \to 0} \frac{f(x_0 + h,\; y_0) - f(x_0,\, y_0)}{h}" katexReady={katexReady} />
        <TextWithMath text="Analog $\partial f/\partial y$: $x = x_0$ festhalten, $y$ variieren. Schreibweisen: $f_x$, $\partial_x f$, $D_1 f$." katexReady={katexReady} />
      </Card>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Interaktive Visualisierung: Schnittkurven &amp; Tangenten</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(funcs).map(([id, fc]) => (
            <button key={id} onClick={() => setFuncId(id)}
              className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${funcId === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
              {fc.label}
            </button>
          ))}
          <button onClick={() => setShowFx(v => !v)}
            className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${showFx ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
            ∂f/∂x
          </button>
          <button onClick={() => setShowFy(v => !v)}
            className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${showFy ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
            ∂f/∂y
          </button>
        </div>
        <div className="flex flex-wrap gap-4 mb-3">
          {[['x₀', x0, setX0, 'accent-indigo-600', 'text-indigo-600 dark:text-indigo-400'],
            ['y₀', y0, setY0, 'accent-indigo-600', 'text-indigo-600 dark:text-indigo-400']].map(([label, val, setter, accentCls, textCls]) => (
            <label key={label} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-bold">{label} =</span>
              <input type="range" min={-1.5} max={1.5} step={0.1} value={val} onChange={e => setter(+e.target.value)} className={`w-28 ${accentCls}`} />
              <span className={`font-mono w-10 ${textCls}`}>{val.toFixed(1)}</span>
            </label>
          ))}
        </div>
        <PlotlyChart
          data={plotData.traces}
          layout={{ scene: { xaxis: { title: 'x' }, yaxis: { title: 'y' }, zaxis: { title: 'f' }, camera: { eye: { x: 1.5, y: 1.5, z: 1.0 } } }, legend: { x: 0, y: 1, bgcolor: 'rgba(0,0,0,0)', font: { size: 11 } }, height: 420, margin: { l: 0, r: 0, t: 20, b: 0 } }}
          style={{ width: '100%' }}
        />
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 flex flex-wrap gap-4">
          <span>∂f/∂x: <strong className="text-orange-600 dark:text-orange-400">{plotData.fxV.toFixed(4)}</strong></span>
          <span>∂f/∂y: <strong className="text-green-600 dark:text-green-400">{plotData.fyV.toFixed(4)}</strong></span>
          <span>f(x₀,y₀): <strong className="text-indigo-600 dark:text-indigo-400">{plotData.z0.toFixed(4)}</strong></span>
        </div>
      </div>

      <Card type="definition" title="Jacobi-Matrix" katexReady={katexReady}>
        <TextWithMath text="Für $f: \mathbb{R}^n \to \mathbb{R}^m$ ist die **Jacobi-Matrix** (Funktionalmatrix) definiert als:" katexReady={katexReady} />
        <FormulaCard math="Jf(x) = \begin{pmatrix} \frac{\partial f_1}{\partial x_1} & \cdots & \frac{\partial f_1}{\partial x_n} \\ \vdots & \ddots & \vdots \\ \frac{\partial f_m}{\partial x_1} & \cdots & \frac{\partial f_m}{\partial x_n} \end{pmatrix} \in \mathbb{R}^{m \times n}" katexReady={katexReady} />
        <TextWithMath text="Für $f: \mathbb{R}^n \to \mathbb{R}$ ist $Jf = (\nabla f)^T$ ein Zeilenvektor." katexReady={katexReady} />
      </Card>

      <Card type="warning" title="Partiell diff. ≠ stetig ≠ total diff.!" katexReady={katexReady}>
        <TextWithMath text="**Gegenbeispiel:** Betrachte" katexReady={katexReady} />
        <FormulaCard math="f(x,y) = \begin{cases} \dfrac{xy}{x^2+y^2} & (x,y) \neq (0,0) \\ 0 & (x,y) = (0,0) \end{cases}" katexReady={katexReady} />
        <TextWithMath text="Beide partiellen Ableitungen bei $(0,0)$ **existieren** und sind $0$. Aber $f$ ist bei $(0,0)$ **nicht stetig**: Entlang $y=x$ gilt $f(t,t) = \tfrac{1}{2}$ für alle $t \neq 0$. Also auch **nicht total differenzierbar**." katexReady={katexReady} />
      </Card>
    </div>
  );
}

// ============================================================
// Sub-tab 2: Richtungsableitung & Gradient
// ============================================================
function GradientSection({ katexReady }) {
  const [funcId, setFuncId] = useState('paraboloid');
  const [x0, setX0] = useState(0.8);
  const [y0, setY0] = useState(0.6);
  const [theta, setTheta] = useState(45);

  const funcs = {
    paraboloid: { label: 'Paraboloid', f: (x, y) => x*x + y*y,               fx: (x) => 2*x, fy: (_, y) => 2*y },
    saddle:     { label: 'Sattel',     f: (x, y) => x*x - y*y,               fx: (x) => 2*x, fy: (_, y) => -2*y },
    exp:        { label: 'exp·Gauss',  f: (x, y) => Math.exp(-(x*x + y*y)),  fx: (x, y) => -2*x*Math.exp(-(x*x+y*y)), fy: (x, y) => -2*y*Math.exp(-(x*x+y*y)) },
  };
  const fn = funcs[funcId];

  const plotData = useMemo(() => {
    const N = 40, R = 2;
    const xs = Array.from({ length: N }, (_, i) => -R + 2*R*i/(N-1));
    const ys = Array.from({ length: N }, (_, i) => -R + 2*R*i/(N-1));
    const z = ys.map(y => xs.map(x => fn.f(x, y)));

    const gx = fn.fx(x0, y0), gy = fn.fy(x0, y0);
    const gNorm = Math.sqrt(gx*gx + gy*gy);
    const tRad = theta * Math.PI / 180;
    const vx = Math.cos(tRad), vy = Math.sin(tRad);
    const dv = gx*vx + gy*vy;
    const S = 0.45;

    const traces = [
      { x: xs, y: ys, z, type: 'contour', colorscale: 'RdBu', contours: { coloring: 'heatmap' }, showscale: false, name: 'f(x,y)', opacity: 0.9 },
      { x: [x0, x0 + S*vx], y: [y0, y0 + S*vy], type: 'scatter', mode: 'lines', name: 'v (Richtung)', line: { color: '#f97316', width: 3 } },
      { x: [x0], y: [y0], type: 'scatter', mode: 'markers', name: '(x₀,y₀)', marker: { color: '#ef4444', size: 9 }, showlegend: false },
    ];
    if (gNorm > 1e-9) {
      traces.push({ x: [x0, x0 + S*gx/gNorm], y: [y0, y0 + S*gy/gNorm], type: 'scatter', mode: 'lines', name: '∇f', line: { color: '#8b5cf6', width: 3 } });
    }

    const annotations = [
      { ax: x0, ay: y0, x: x0 + S*vx, y: y0 + S*vy, xref: 'x', yref: 'y', axref: 'x', ayref: 'y', showarrow: true, arrowhead: 3, arrowsize: 1.4, arrowwidth: 2.5, arrowcolor: '#f97316', text: '' },
    ];
    if (gNorm > 1e-9) {
      annotations.push({ ax: x0, ay: y0, x: x0 + S*gx/gNorm, y: y0 + S*gy/gNorm, xref: 'x', yref: 'y', axref: 'x', ayref: 'y', showarrow: true, arrowhead: 3, arrowsize: 1.4, arrowwidth: 2.5, arrowcolor: '#8b5cf6', text: '' });
    }

    return { traces, annotations, gx, gy, gNorm, dv };
  }, [x0, y0, funcId, theta]);

  return (
    <div className="space-y-5">
      <Card type="definition" title="Richtungsableitung" katexReady={katexReady}>
        <FormulaCard math="D_v f(x_0) \;=\; \lim_{t \to 0} \frac{f(x_0 + t\,v) - f(x_0)}{t}" katexReady={katexReady} />
        <TextWithMath text="Für einen Einheitsvektor $v$ ($\|v\|=1$) misst $D_v f(x_0)$ die **momentane Änderungsrate** von $f$ ausgehend von $x_0$ in Richtung $v$." katexReady={katexReady} />
      </Card>

      <Card type="definition" title="Gradient" katexReady={katexReady}>
        <FormulaCard math="\nabla f(x) \;=\; \left(\frac{\partial f}{\partial x_1},\; \frac{\partial f}{\partial x_2},\; \ldots,\; \frac{\partial f}{\partial x_n}\right)^T" katexReady={katexReady} />
        <TextWithMath text="Der Gradient ist der Vektor aller partiellen Ableitungen und zeigt in Richtung des **steilsten Anstiegs**." katexReady={katexReady} />
      </Card>

      <Card type="theorem" title="Richtungsableitung via Gradient: $D_v f = \langle \nabla f,\, v \rangle$" katexReady={katexReady}>
        <TextWithMath text="Ist $f$ total differenzierbar in $x_0$ und $\|v\|=1$, so gilt:" katexReady={katexReady} />
        <FormulaCard math="D_v f(x_0) \;=\; \langle \nabla f(x_0),\; v \rangle \;=\; \nabla f(x_0)^T \cdot v" katexReady={katexReady} />
        <TextWithMath text="Das Skalarprodukt ersetzt die Grenzwertberechnung durch eine einfache Formel." katexReady={katexReady} />
      </Card>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Interaktive Visualisierung: Gradient &amp; Richtungsableitung</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(funcs).map(([id, fc]) => (
            <button key={id} onClick={() => setFuncId(id)}
              className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${funcId === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
              {fc.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mb-3">
          {[['x₀', x0, setX0, 'accent-indigo-600', 'text-indigo-600 dark:text-indigo-400'],
            ['y₀', y0, setY0, 'accent-indigo-600', 'text-indigo-600 dark:text-indigo-400']].map(([label, val, setter, a, t]) => (
            <label key={label} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-bold">{label} =</span>
              <input type="range" min={-1.5} max={1.5} step={0.1} value={val} onChange={e => setter(+e.target.value)} className={`w-24 ${a}`} />
              <span className={`font-mono w-10 ${t}`}>{val.toFixed(1)}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-bold">θ =</span>
            <input type="range" min={0} max={360} step={5} value={theta} onChange={e => setTheta(+e.target.value)} className="w-24 accent-orange-500" />
            <span className="font-mono w-12 text-orange-600 dark:text-orange-400">{theta}°</span>
          </label>
        </div>
        <PlotlyChart
          data={plotData.traces}
          layout={{
            xaxis: { title: 'x', range: [-2.2, 2.2], gridcolor: 'rgba(148,163,184,0.2)' },
            yaxis: { title: 'y', range: [-2.2, 2.2], gridcolor: 'rgba(148,163,184,0.2)', scaleanchor: 'x' },
            legend: { x: 0.02, y: 0.98, bgcolor: 'rgba(0,0,0,0)', font: { size: 11 } },
            annotations: plotData.annotations,
            height: 380,
          }}
          style={{ width: '100%' }}
        />
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 flex flex-wrap gap-4">
          <span>∇f = <strong className="text-purple-600 dark:text-purple-400">({plotData.gx.toFixed(3)}, {plotData.gy.toFixed(3)})</strong></span>
          <span>|∇f| = <strong className="text-purple-600 dark:text-purple-400">{plotData.gNorm.toFixed(3)}</strong></span>
          <span>D_v f = <strong className="text-orange-600 dark:text-orange-400">{plotData.dv.toFixed(4)}</strong></span>
        </div>
      </div>

      <Card type="theorem" title="Gradient = Richtung des steilsten Anstiegs" katexReady={katexReady}>
        <TextWithMath text="Unter allen Einheitsvektoren $v$ wird $D_v f(x_0)$ **maximal** für $v = \nabla f / \|\nabla f\|$. Der maximale Wert ist $\|\nabla f(x_0)\|$." katexReady={katexReady} />
        <FormulaCard math="\max_{\|v\|=1} D_v f(x_0) \;=\; \|\nabla f(x_0)\|,\quad \text{erreicht für } v = \frac{\nabla f(x_0)}{\|\nabla f(x_0)\|}" katexReady={katexReady} />
      </Card>

      <CollapsibleProof title="Beweis: Cauchy-Schwarz-Argument" katexReady={katexReady}>
        <TextWithMath text="Mit der **Cauchy-Schwarz-Ungleichung** gilt für $\|v\|=1$:" katexReady={katexReady} />
        <FormulaCard math="D_v f(x_0) = \langle \nabla f(x_0), v \rangle \;\le\; \|\nabla f(x_0)\| \cdot \|v\| = \|\nabla f(x_0)\|" katexReady={katexReady} />
        <TextWithMath text="Gleichheit genau dann, wenn $v \parallel \nabla f(x_0)$, d.h. $v = \nabla f / \|\nabla f\|$. $\blacksquare$" katexReady={katexReady} />
      </CollapsibleProof>

      <Card type="intuition" title="Gradient steht senkrecht auf Niveaulinien" katexReady={katexReady}>
        <TextWithMath text="Die **Niveaulinien** $\{(x,y) : f(x,y) = c\}$ sind Kurven mit konstantem $f$-Wert. Der Gradient $\nabla f(x_0)$ steht stets **orthogonal** auf der Niveaulinie durch $x_0$." katexReady={katexReady} />
        <TextWithMath text="**Begründung:** Für eine Kurve $\gamma$ auf der Niveaulinie gilt $f(\gamma(t)) = c$, also $\langle \nabla f, \gamma'(t) \rangle = 0$ per Kettenregel." katexReady={katexReady} />
      </Card>
    </div>
  );
}

// ============================================================
// Sub-tab 3: Totale Differenzierbarkeit
// ============================================================
function TotalSection({ katexReady }) {
  const [funcId, setFuncId] = useState('paraboloid');
  const [x0, setX0] = useState(0.8);
  const [y0, setY0] = useState(0.6);
  const [zoom, setZoom] = useState(1.0);

  const funcs = {
    paraboloid: { label: 'Paraboloid', f: (x, y) => x*x + y*y,               fx: (x) => 2*x, fy: (_, y) => 2*y },
    saddle:     { label: 'Sattel',     f: (x, y) => x*x - y*y,               fx: (x) => 2*x, fy: (_, y) => -2*y },
    sincos:     { label: 'sin·cos',    f: (x, y) => Math.sin(x)*Math.cos(y),  fx: (x, y) => Math.cos(x)*Math.cos(y), fy: (x, y) => -Math.sin(x)*Math.sin(y) },
  };
  const fn = funcs[funcId];

  const plotData = useMemo(() => {
    const N = 28;
    const r = 1.5 / zoom;
    const xs = Array.from({ length: N }, (_, i) => x0 - r + 2*r*i/(N-1));
    const ys = Array.from({ length: N }, (_, i) => y0 - r + 2*r*i/(N-1));
    const z = ys.map(y => xs.map(x => fn.f(x, y)));
    const fxV = fn.fx(x0, y0), fyV = fn.fy(x0, y0), z0 = fn.f(x0, y0);
    const zTan = ys.map(y => xs.map(x => z0 + fxV*(x-x0) + fyV*(y-y0)));
    const traces = [
      { x: xs, y: ys, z, type: 'surface', colorscale: 'Viridis', opacity: 0.78, showscale: false, name: 'f(x,y)' },
      { x: xs, y: ys, z: zTan, type: 'surface', colorscale: [[0,'rgba(249,115,22,0.15)'],[1,'rgba(249,115,22,0.6)']], opacity: 0.55, showscale: false, name: 'Tangentialebene' },
    ];
    return { traces, fxV, fyV, z0 };
  }, [x0, y0, funcId, zoom]);

  return (
    <div className="space-y-5">
      <Card type="intuition" title="Motivation: Lokale lineare Approximation" katexReady={katexReady}>
        <TextWithMath text="$f$ ist **total differenzierbar** in $x_0$, wenn die Fläche lokal durch eine **Hyperebene** approximierbar ist — besser als es $\|h\|$ allein erzwingt. Zoom in den Plot: Je mehr man zoomt, desto flacher (= ebener) wirkt die Fläche. Das ist totale Differenzierbarkeit!" katexReady={katexReady} />
      </Card>

      <Card type="definition" title="Total differenzierbar (Fréchet)" katexReady={katexReady}>
        <TextWithMath text="$f: D \to \mathbb{R}$ heißt **total differenzierbar** in $x_0$, falls eine lineare Abbildung $L$ existiert mit:" katexReady={katexReady} />
        <FormulaCard math="\lim_{\|h\| \to 0} \frac{f(x_0 + h) - f(x_0) - L(h)}{\|h\|} = 0" katexReady={katexReady} />
        <TextWithMath text="Schreibweise: $f(x_0+h) = f(x_0) + Df(x_0)\cdot h + o(\|h\|)$ mit $Df(x_0) = (\nabla f(x_0))^T$." katexReady={katexReady} />
      </Card>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Interaktive Visualisierung: Fläche + Tangentialebene</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(funcs).map(([id, fc]) => (
            <button key={id} onClick={() => setFuncId(id)}
              className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${funcId === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
              {fc.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mb-3">
          {[['x₀', x0, setX0, 'accent-indigo-600', 'text-indigo-600 dark:text-indigo-400'],
            ['y₀', y0, setY0, 'accent-indigo-600', 'text-indigo-600 dark:text-indigo-400']].map(([label, val, setter, a, t]) => (
            <label key={label} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-bold">{label} =</span>
              <input type="range" min={-1.5} max={1.5} step={0.1} value={val} onChange={e => setter(+e.target.value)} className={`w-24 ${a}`} />
              <span className={`font-mono w-10 ${t}`}>{val.toFixed(1)}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-bold">Zoom =</span>
            <input type="range" min={0.5} max={8} step={0.5} value={zoom} onChange={e => setZoom(+e.target.value)} className="w-24 accent-green-500" />
            <span className="font-mono w-10 text-green-600 dark:text-green-400">{zoom.toFixed(1)}×</span>
          </label>
        </div>
        <PlotlyChart
          data={plotData.traces}
          layout={{ scene: { xaxis: { title: 'x' }, yaxis: { title: 'y' }, zaxis: { title: 'f' }, camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } } }, legend: { x: 0, y: 1, bgcolor: 'rgba(0,0,0,0)', font: { size: 11 } }, height: 420, margin: { l: 0, r: 0, t: 20, b: 0 } }}
          style={{ width: '100%' }}
        />
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Tangentialebene: <strong className="text-orange-500">T(x,y) = {plotData.z0.toFixed(3)} + {plotData.fxV.toFixed(3)}(x−x₀) + {plotData.fyV.toFixed(3)}(y−y₀)</strong>
        </div>
      </div>

      <Card type="theorem" title="$C^1 \Rightarrow$ total differenzierbar (Klausurrelevant!)" katexReady={katexReady}>
        <TextWithMath text="Sind alle partiellen Ableitungen **stetig** in einer Umgebung von $x_0$ (d.h. $f \in C^1$), so ist $f$ **total differenzierbar** in $x_0$." katexReady={katexReady} />
        <TextWithMath text="**Strategie in der Klausur:** Zeige $f \in C^1$ (stetige partielle Ableitungen) $\Rightarrow$ sofort total differenzierbar." katexReady={katexReady} />
      </Card>

      <Card type="warning" title="Umkehrung gilt nicht: Total diff. $\not\Rightarrow C^1$" katexReady={katexReady}>
        <TextWithMath text="Es gibt total differenzierbare Funktionen, bei denen die partiellen Ableitungen **nicht stetig** sind:" katexReady={katexReady} />
        <FormulaCard math="f(x) = x^2 \sin\!\left(\tfrac{1}{x}\right),\quad f(0) = 0" katexReady={katexReady} />
        <TextWithMath text="$f$ ist überall differenzierbar, aber $f'$ ist bei $0$ unstetig." katexReady={katexReady} />
      </Card>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">
          <TextWithMath text="Hierarchie der Differenzierbarkeit in $\mathbb{R}^n$" katexReady={katexReady} />
        </h4>
        <div className="flex flex-col items-center gap-1 text-sm">
          {[
            { label: '$C^1$ (stetig partiell diff.)', color: '#6366f1' },
            { label: 'total differenzierbar', color: '#22c55e', note: 'Umkehrung falsch!' },
            { label: 'partiell differenzierbar', color: '#f97316' },
          ].map((row, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="px-6 py-2 rounded-lg font-bold text-white text-center min-w-56" style={{ backgroundColor: row.color }}>
                <TextWithMath text={row.label} katexReady={katexReady} />
              </div>
              {i < 2 && (
                <div className="flex items-center gap-2 my-1">
                  <span className="text-xl text-slate-400">↓</span>
                  {row.note && <span className="text-xs text-red-500 dark:text-red-400 italic">{row.note}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
          <TextWithMath text="Gegenbeispiel partiell $\not\Rightarrow$ total: $f(x,y) = xy/(x^2+y^2)$ — partiell diff. aber unstetig bei $(0,0)$" katexReady={katexReady} />
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Sub-tab 4: Mittelwertsatz in ℝⁿ
// ============================================================
function MwsRnSection({ katexReady }) {
  const [funcId, setFuncId] = useState('paraboloid');
  const [ax, setAx] = useState(-1.2);
  const [ay, setAy] = useState(-0.5);
  const [bx, setBx] = useState(1.0);
  const [by, setBy] = useState(0.8);

  const funcs = {
    paraboloid: { label: 'Paraboloid', f: (x, y) => x*x + y*y,               fx: (x) => 2*x, fy: (_, y) => 2*y },
    saddle:     { label: 'Sattel',     f: (x, y) => x*x - y*y,               fx: (x) => 2*x, fy: (_, y) => -2*y },
    bowl:       { label: 'sin(r²)',    f: (x, y) => Math.sin(x*x + y*y),     fx: (x, y) => 2*x*Math.cos(x*x+y*y), fy: (x, y) => 2*y*Math.cos(x*x+y*y) },
  };
  const fn = funcs[funcId];

  const plotData = useMemo(() => {
    const N = 40, R = 2;
    const xs = Array.from({ length: N }, (_, i) => -R + 2*R*i/(N-1));
    const ys = Array.from({ length: N }, (_, i) => -R + 2*R*i/(N-1));
    const z = ys.map(y => xs.map(x => fn.f(x, y)));
    const fa = fn.f(ax, ay), fb = fn.f(bx, by);
    const diff = fb - fa;
    const dx = bx - ax, dy = by - ay;

    let xiT = 0.5, bestErr = Infinity;
    for (let t = 0; t <= 1; t += 0.005) {
      const x = ax + t*dx, y = ay + t*dy;
      const err = Math.abs(fn.fx(x, y)*dx + fn.fy(x, y)*dy - diff);
      if (err < bestErr) { bestErr = err; xiT = t; }
    }
    const xxi = ax + xiT*dx, yxi = ay + xiT*dy;
    const gxxi = fn.fx(xxi, yxi), gyxi = fn.fy(xxi, yxi);
    const gN = Math.sqrt(gxxi*gxxi + gyxi*gyxi);
    const S = 0.38;

    const lineXs = Array.from({ length: 20 }, (_, i) => ax + dx*i/19);
    const lineYs = Array.from({ length: 20 }, (_, i) => ay + dy*i/19);

    const traces = [
      { x: xs, y: ys, z, type: 'contour', colorscale: 'Blues', contours: { coloring: 'heatmap' }, showscale: false, name: 'f(x,y)', opacity: 0.9 },
      { x: lineXs, y: lineYs, type: 'scatter', mode: 'lines', name: '[A, B]', line: { color: '#ef4444', width: 2.5 } },
      { x: [ax, bx], y: [ay, by], type: 'scatter', mode: 'markers+text', text: ['A', 'B'], textposition: 'top center', name: 'A, B', marker: { color: '#ef4444', size: 10 }, textfont: { color: '#ef4444', size: 13 } },
      { x: [xxi], y: [yxi], type: 'scatter', mode: 'markers+text', text: ['ξ'], textposition: 'top right', name: 'ξ (MWS)', marker: { color: '#22c55e', size: 10, symbol: 'diamond' }, textfont: { color: '#22c55e', size: 13 } },
    ];
    const annotations = [];
    if (gN > 1e-9) {
      annotations.push({ ax: xxi, ay: yxi, x: xxi + S*gxxi/gN, y: yxi + S*gyxi/gN, xref: 'x', yref: 'y', axref: 'x', ayref: 'y', showarrow: true, arrowhead: 3, arrowsize: 1.4, arrowwidth: 2.5, arrowcolor: '#8b5cf6', text: '' });
      traces.push({ x: [xxi, xxi + S*gxxi/gN], y: [yxi, yxi + S*gyxi/gN], type: 'scatter', mode: 'lines', name: '∇f(ξ)', line: { color: '#8b5cf6', width: 2.5 } });
    }
    const gradDot = gxxi*dx + gyxi*dy;
    return { traces, annotations, fa, fb, diff, xxi, yxi, gradDot };
  }, [ax, ay, bx, by, funcId]);

  return (
    <div className="space-y-5">
      <Card type="intuition" title="Übergang vom 1D-MWS" katexReady={katexReady}>
        <TextWithMath text="Der **1D-MWS** gibt $f'(\xi) = [f(b)-f(a)]/(b-a)$. In $\mathbb{R}^n$ gibt es kein Division durch $b-a \in \mathbb{R}^n$, aber die Gleichung lässt sich als **Skalarprodukt** formulieren: $f(b)-f(a) = \langle \nabla f(\xi), b-a \rangle$." katexReady={katexReady} />
        <TextWithMath text="Schlüsselidee: Reduziere auf 1D via $g(t) = f(a + t(b-a))$." katexReady={katexReady} />
      </Card>

      <Card type="theorem" title="Mittelwertsatz in $\mathbb{R}^n$" katexReady={katexReady}>
        <TextWithMath text="Sei $f: D \to \mathbb{R}$ mit $D \subseteq \mathbb{R}^n$ offen und $f \in C^1$. Seien $a, b \in D$ mit $[a,b] \subset D$. Dann existiert $\xi$ auf der Strecke $[a,b]$ mit:" katexReady={katexReady} />
        <FormulaCard math="f(b) - f(a) \;=\; \langle \nabla f(\xi),\; b - a \rangle \;=\; \nabla f(\xi)^T (b-a)" katexReady={katexReady} />
      </Card>

      <CollapsibleProof title="Beweis: Reduktion auf 1D via $g(t) = f(a+t(b-a))$" katexReady={katexReady}>
        <TextWithMath text="Definiere $g: [0,1] \to \mathbb{R}$ durch $g(t) = f(a + t(b-a))$. Nach der **Kettenregel** gilt:" katexReady={katexReady} />
        <FormulaCard math="g'(t) \;=\; \langle \nabla f(a + t(b-a)),\; b-a \rangle" katexReady={katexReady} />
        <TextWithMath text="Wende den **1D-MWS** auf $g$ auf $[0,1]$ an: Es existiert $t_0 \in (0,1)$ mit $g'(t_0) = g(1) - g(0) = f(b) - f(a)$. Mit $\xi := a + t_0(b-a)$:" katexReady={katexReady} />
        <FormulaCard math="f(b) - f(a) \;=\; g'(t_0) \;=\; \langle \nabla f(\xi),\; b-a \rangle \quad \blacksquare" katexReady={katexReady} />
      </CollapsibleProof>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Interaktive Visualisierung: MWS in ℝ²</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(funcs).map(([id, fc]) => (
            <button key={id} onClick={() => setFuncId(id)}
              className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${funcId === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
              {fc.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mb-3">
          {[['Ax', ax, setAx], ['Ay', ay, setAy], ['Bx', bx, setBx], ['By', by, setBy]].map(([label, val, setter]) => (
            <label key={label} className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-bold w-8">{label} =</span>
              <input type="range" min={-1.8} max={1.8} step={0.1} value={val} onChange={e => setter(+e.target.value)} className="w-20 accent-red-500" />
              <span className="font-mono w-10 text-red-600 dark:text-red-400">{val.toFixed(1)}</span>
            </label>
          ))}
        </div>
        <PlotlyChart
          data={plotData.traces}
          layout={{
            xaxis: { title: 'x', range: [-2.2, 2.2], gridcolor: 'rgba(148,163,184,0.2)' },
            yaxis: { title: 'y', range: [-2.2, 2.2], gridcolor: 'rgba(148,163,184,0.2)', scaleanchor: 'x' },
            legend: { x: 0.02, y: 0.98, bgcolor: 'rgba(0,0,0,0)', font: { size: 11 } },
            annotations: plotData.annotations,
            height: 380,
          }}
          style={{ width: '100%' }}
        />
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 flex flex-wrap gap-4">
          <span>f(B)−f(A): <strong className="text-red-600 dark:text-red-400">{plotData.diff.toFixed(4)}</strong></span>
          <span>ξ ≈ <strong className="text-green-600 dark:text-green-400">({plotData.xxi.toFixed(2)}, {plotData.yxi.toFixed(2)})</strong></span>
          <span>⟨∇f(ξ), B−A⟩ ≈ <strong className="text-purple-600 dark:text-purple-400">{plotData.gradDot.toFixed(4)}</strong></span>
        </div>
      </div>

      <Card type="theorem" title="Korollar: Lipschitz-Abschätzung" katexReady={katexReady}>
        <TextWithMath text="Ist $\|\nabla f(x)\| \le L$ für alle $x \in [a,b]$, so folgt aus dem MWS via Cauchy-Schwarz:" katexReady={katexReady} />
        <FormulaCard math="|f(b) - f(a)| \;=\; |\langle \nabla f(\xi),\, b-a \rangle| \;\le\; \|\nabla f(\xi)\| \cdot \|b-a\| \;\le\; L \cdot \|b-a\|" katexReady={katexReady} />
        <TextWithMath text="Das ist die **Lipschitz-Bedingung**: $f$ kann sich höchstens proportional zur Wegstrecke ändern." katexReady={katexReady} />
      </Card>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">
          <TextWithMath text="Vergleich: MWS in $\mathbb{R}^1$ vs. $\mathbb{R}^n$" katexReady={katexReady} />
        </h4>
        <table className="w-full text-sm border-collapse min-w-[480px]">
          <thead>
            <tr className="border-b-2 border-slate-300 dark:border-slate-600">
              <th className="text-left py-2 px-3 text-slate-500 dark:text-slate-400 font-semibold w-1/4"></th>
              <th className="py-2 px-3 text-indigo-600 dark:text-indigo-400 font-bold text-left">MWS in $\mathbb{R}^1$</th>
              <th className="py-2 px-3 text-green-600 dark:text-green-400 font-bold text-left">MWS in $\mathbb{R}^n$</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-slate-300">
            {[
              ['Aussage', "$f'(\\xi)(b-a) = f(b)-f(a)$", "$\\langle \\nabla f(\\xi), b-a \\rangle = f(b)-f(a)$"],
              ['Bedingung', '$f$ stetig auf $[a,b]$, diff. auf $(a,b)$', '$f \\in C^1$, $[a,b] \\subset D$'],
              ['Beweis', 'Satz von Rolle', 'Reduktion auf $g(t) = f(a+t(b-a))$'],
              ['Lipschitz', '$|f(b)-f(a)| \\le |f\'|_\\infty \\cdot |b-a|$', '$|f(b)-f(a)| \\le \\|\\nabla f\\|_\\infty \\cdot \\|b-a\\|$'],
              ['Vektorwertig?', '(nicht relevant)', '**Nein** — kein $f: D \\to \\mathbb{R}^m$!'],
            ].map(([key, v1, v2], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-slate-50 dark:bg-slate-700/30' : ''}>
                <td className="py-2 px-3 font-semibold text-slate-500 dark:text-slate-400"><TextWithMath text={key} katexReady={katexReady} /></td>
                <td className="py-2 px-3"><TextWithMath text={v1} katexReady={katexReady} /></td>
                <td className="py-2 px-3"><TextWithMath text={v2} katexReady={katexReady} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card type="warning" title="MWS gilt nicht für vektorwertige Funktionen $f: \mathbb{R}^n \to \mathbb{R}^m$!" katexReady={katexReady}>
        <TextWithMath text="Für $f: [a,b] \to \mathbb{R}^m$ mit $m > 1$ existiert im Allgemeinen **kein** $\xi$ mit $f(b)-f(a) = f'(\xi)(b-a)$." katexReady={katexReady} />
        <TextWithMath text="**Gegenbeispiel:** $f(t) = (\cos t, \sin t)^T$ auf $[0, 2\pi]$. Es gilt $f(2\pi)-f(0) = (0,0)^T$, aber $f'(\xi) = (-\sin\xi, \cos\xi)^T \neq (0,0)^T$ für alle $\xi$." katexReady={katexReady} />
        <TextWithMath text="**Rettung:** Die schwächere Abschätzung gilt: $\|f(b)-f(a)\| \le \|Jf\|_\infty \cdot |b-a|$." katexReady={katexReady} />
      </Card>
    </div>
  );
}

// ============================================================
// Main MultivarContent component
// ============================================================
export default function MultivarContent({ subTab, katexReady }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        <TextWithMath text="Differentialrechnung in $\mathbb{R}^n$" katexReady={katexReady} />
      </h2>
      {!subTab && (
        <Card type="intuition" title="Willkommen!" katexReady={katexReady}>
          <TextWithMath text="Wähle oben einen Unterabschnitt: **Partielle Differenzierbarkeit**, **Richtungsableitung &amp; Gradient**, **Totale Differenzierbarkeit** oder **Mittelwertsatz ($\mathbb{R}^n$)**." katexReady={katexReady} />
        </Card>
      )}
      {subTab === 'partial'  && <PartialSection  katexReady={katexReady} />}
      {subTab === 'gradient' && <GradientSection katexReady={katexReady} />}
      {subTab === 'total'    && <TotalSection    katexReady={katexReady} />}
      {subTab === 'mws_rn'   && <MwsRnSection    katexReady={katexReady} />}
    </div>
  );
}
