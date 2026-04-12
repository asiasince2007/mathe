import React, { useState, useMemo } from 'react';
import { TextWithMath, BlockMath } from '../components/MathComponents';
import { Card, CollapsibleProof, FormulaCard } from '../components/Cards';
import PlotlyChart from '../components/PlotlyChart';

// ============================================================
// B4: Stetigkeit — Vertiefung
// ============================================================
export default function StetigkeitContent({ katexReady }) {
  // -----------------------------------------------------------
  // Interactive epsilon-delta visualisation state
  // -----------------------------------------------------------
  const [selectedFunc, setSelectedFunc] = useState('x2');
  const [x0, setX0] = useState(1.0);
  const [epsilon, setEpsilon] = useState(0.5);

  const funcMap = {
    x2:   { label: 'x²',    fn: (x) => x * x,        latex: 'f(x) = x^2' },
    sinx: { label: 'sin(x)', fn: (x) => Math.sin(x),  latex: 'f(x) = \\sin(x)' },
    invx: { label: '1/x',    fn: (x) => (x === 0 ? NaN : 1 / x), latex: 'f(x) = 1/x' },
  };

  const epsPlot = useMemo(() => {
    const { fn } = funcMap[selectedFunc];
    const f0 = fn(x0);

    // Sample the function
    const xs = [];
    const ys = [];
    const lo = selectedFunc === 'invx' ? 0.05 : -3;
    const hi = 3;
    const step = 0.01;
    for (let x = lo; x <= hi; x += step) {
      xs.push(x);
      ys.push(fn(x));
    }

    // Compute delta: largest symmetric interval around x0 where |f(x)-f(x0)| < eps
    let delta = 2.0;
    for (let d = 2.0; d > 0.001; d -= 0.002) {
      let ok = true;
      for (let t = -d; t <= d; t += 0.005) {
        const xTest = x0 + t;
        if (xTest < lo || xTest > hi) continue;
        if (Math.abs(fn(xTest) - f0) >= epsilon) { ok = false; break; }
      }
      if (ok) { delta = d; break; }
    }

    // Epsilon band (horizontal lines)
    const bandX = [lo, hi];
    const upperBand = [f0 + epsilon, f0 + epsilon];
    const lowerBand = [f0 - epsilon, f0 - epsilon];

    // Delta interval (vertical lines)
    const deltaLo = x0 - delta;
    const deltaHi = x0 + delta;
    const yRange = selectedFunc === 'invx' ? [-5, 10] : [-2, 5];

    // Highlighted segment within delta interval
    const hlX = [];
    const hlY = [];
    for (let x = Math.max(deltaLo, lo); x <= Math.min(deltaHi, hi); x += 0.005) {
      hlX.push(x);
      hlY.push(fn(x));
    }

    return {
      data: [
        {
          x: xs, y: ys, type: 'scatter', mode: 'lines',
          name: funcMap[selectedFunc].label,
          line: { color: '#6366f1', width: 2 },
        },
        {
          x: hlX, y: hlY, type: 'scatter', mode: 'lines',
          name: 'f im δ-Intervall',
          line: { color: '#22c55e', width: 4 },
        },
        {
          x: bandX, y: upperBand, type: 'scatter', mode: 'lines',
          name: 'f(x₀) + ε',
          line: { color: '#ef4444', width: 1.5, dash: 'dash' },
        },
        {
          x: bandX, y: lowerBand, type: 'scatter', mode: 'lines',
          name: 'f(x₀) − ε',
          line: { color: '#ef4444', width: 1.5, dash: 'dash' },
        },
        {
          x: [deltaLo, deltaLo], y: yRange, type: 'scatter', mode: 'lines',
          name: 'x₀ − δ', showlegend: false,
          line: { color: '#f59e0b', width: 1.5, dash: 'dot' },
        },
        {
          x: [deltaHi, deltaHi], y: yRange, type: 'scatter', mode: 'lines',
          name: 'x₀ + δ', showlegend: false,
          line: { color: '#f59e0b', width: 1.5, dash: 'dot' },
        },
        {
          x: [x0], y: [f0], type: 'scatter', mode: 'markers',
          name: '(x₀, f(x₀))',
          marker: { color: '#ef4444', size: 10, symbol: 'diamond' },
        },
      ],
      layout: {
        xaxis: { title: 'x', gridcolor: 'rgba(148,163,184,0.2)', range: [lo - 0.2, hi + 0.2] },
        yaxis: { title: 'f(x)', gridcolor: 'rgba(148,163,184,0.2)', range: yRange },
        legend: { x: 0.02, y: 0.98, bgcolor: 'rgba(0,0,0,0)' },
        height: 400,
        margin: { t: 30, b: 50, l: 50, r: 20 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#94a3b8' },
        annotations: [
          {
            x: x0, y: yRange[0] + 0.3, text: `δ ≈ ${delta.toFixed(3)}`,
            showarrow: false, font: { color: '#f59e0b', size: 13 },
          },
        ],
      },
    };
  }, [selectedFunc, x0, epsilon]);

  // ===========================================================
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Stetigkeit &mdash; Vertiefung
      </h2>
      <TextWithMath
        text="Dieses Kapitel behandelt den zentralen Begriff der **Stetigkeit** reeller Funktionen: Häufungspunkte von Mengen, drei äquivalente Stetigkeitsdefinitionen und wichtige Gegenbeispiele."
        katexReady={katexReady}
      />

      {/* ====================================================
          B4.1  Häufungspunkte von Mengen
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B4.1 &nbsp;Häufungspunkte von Mengen
      </h3>

      <Card type="definition" title="Häufungspunkt einer Menge" katexReady={katexReady}>
        <TextWithMath
          text="Sei $M \subseteq \mathbb{R}$. Ein Punkt $x \in \mathbb{R}$ heisst **Häufungspunkt** (HP) von $M$, wenn in jeder Umgebung von $x$ mindestens ein Punkt von $M$ liegt, der von $x$ verschieden ist:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\forall\,\varepsilon > 0\;\colon\; \bigl(U_\varepsilon(x) \setminus \{x\}\bigr) \cap M \neq \emptyset"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Äquivalent: Es gibt eine Folge $(x_n)$ in $M \setminus \{x\}$ mit $x_n \to x$."
          katexReady={katexReady}
        />
      </Card>

      <Card type="example" title="Häufungspunkte von $(0,1)$" katexReady={katexReady}>
        <TextWithMath
          text="Die Menge der Häufungspunkte des offenen Intervalls $(0,1)$ ist das **abgeschlossene** Intervall $[0,1]$. Jeder Punkt $x \in [0,1]$ lässt sich als Grenzwert einer Folge aus $(0,1) \setminus \{x\}$ darstellen. Punkte ausserhalb von $[0,1]$ sind keine HP, denn man findet eine $\varepsilon$-Umgebung, die $(0,1)$ nicht trifft."
          katexReady={katexReady}
        />
      </Card>

      <Card type="intuition" title="Anschauung: Randpunkte als HP" katexReady={katexReady}>
        <TextWithMath
          text="Auch die Randpunkte $0$ und $1$ sind Häufungspunkte, obwohl sie selbst **nicht** in $(0,1)$ liegen. Das unterscheidet HP von Mengen klar von HP von Folgen: Bei Mengen muss der Punkt $x$ nicht Element von $M$ sein."
          katexReady={katexReady}
        />
      </Card>

      {/* ====================================================
          B4.2  Drei äquivalente Stetigkeitsdefinitionen
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B4.2 &nbsp;Drei äquivalente Stetigkeitsdefinitionen
      </h3>

      <Card type="definition" title="Grenzwert-Definition der Stetigkeit" katexReady={katexReady}>
        <TextWithMath
          text="Sei $f \colon D \to \mathbb{R}$ und $x_0 \in D$ ein Häufungspunkt von $D$. Die Funktion $f$ heisst **stetig in $x_0$**, falls der Grenzwert von $f$ in $x_0$ existiert und mit dem Funktionswert übereinstimmt:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\lim_{x \to x_0} f(x) = f(x_0)"
          katexReady={katexReady}
        />
      </Card>

      <Card type="definition" title="$\varepsilon$-$\delta$-Definition der Stetigkeit" katexReady={katexReady}>
        <TextWithMath
          text="$f$ ist **stetig in $x_0$**, wenn es zu jedem $\varepsilon > 0$ ein $\delta > 0$ gibt, sodass:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\forall\,\varepsilon > 0\;\;\exists\,\delta > 0\;\colon\; |x - x_0| < \delta \;\Rightarrow\; |f(x) - f(x_0)| < \varepsilon"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Zu jeder vorgegebenen «Toleranz» $\varepsilon$ um den Funktionswert kann man den Input-Bereich $\delta$ so einschränken, dass alle Funktionswerte innerhalb der Toleranz bleiben."
          katexReady={katexReady}
        />
      </Card>

      <Card type="definition" title="Folgenstetigkeit" katexReady={katexReady}>
        <TextWithMath
          text="$f$ ist **stetig in $x_0$**, wenn für **jede** Folge $(x_n)$ in $D$ mit $x_n \to x_0$ gilt:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="x_n \to x_0 \;\;\Longrightarrow\;\; f(x_n) \to f(x_0)"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Diese Definition ist besonders nützlich, um **Unstetigkeit** nachzuweisen: Man findet eine einzige Folge $x_n \to x_0$ mit $f(x_n) \not\to f(x_0)$."
          katexReady={katexReady}
        />
      </Card>

      <Card type="theorem" title="Äquivalenz der drei Definitionen" katexReady={katexReady}>
        <TextWithMath
          text="Sei $f \colon D \to \mathbb{R}$ und $x_0$ ein Häufungspunkt von $D$. Dann sind die folgenden Aussagen **äquivalent**:"
          katexReady={katexReady}
        />
        <TextWithMath
          text="**(1)** $\lim_{x \to x_0} f(x) = f(x_0)$ &emsp; **(2)** $\varepsilon$-$\delta$-Bedingung &emsp; **(3)** Folgenstetigkeit"
          katexReady={katexReady}
        />
        <TextWithMath
          text="In der Praxis wählt man je nach Situation die bequemste Variante: $\varepsilon$-$\delta$ für explizite Beweise, Folgenstetigkeit zum Widerlegen."
          katexReady={katexReady}
        />
      </Card>

      {/* ====================================================
          Interactive ε-δ Visualisation
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        Interaktiv: $\varepsilon$-$\delta$-Visualisierung
      </h3>

      <Card type="intuition" title="Stetigkeit zum Anfassen" katexReady={katexReady}>
        <TextWithMath
          text="Wähle eine Funktion, einen Punkt $x_0$ und eine Toleranz $\varepsilon$. Das Diagramm zeigt das $\varepsilon$-Band (rot) um $f(x_0)$ und das berechnete $\delta$-Intervall (gelb). Der **grüne** Abschnitt bestätigt, dass $f$ im $\delta$-Intervall innerhalb des $\varepsilon$-Bandes bleibt."
          katexReady={katexReady}
        />

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center mt-3 mb-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Funktion:
            <select
              className="ml-2 px-2 py-1 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-sm"
              value={selectedFunc}
              onChange={(e) => setSelectedFunc(e.target.value)}
            >
              <option value="x2">x²</option>
              <option value="sinx">sin(x)</option>
              <option value="invx">1/x</option>
            </select>
          </label>

          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            x₀ = {x0.toFixed(2)}
            <input
              type="range" min={selectedFunc === 'invx' ? 0.1 : -2} max={2.5} step={0.05}
              value={x0}
              onChange={(e) => setX0(parseFloat(e.target.value))}
              className="ml-2 w-32 align-middle"
            />
          </label>

          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            ε = {epsilon.toFixed(2)}
            <input
              type="range" min={0.05} max={2} step={0.05}
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="ml-2 w-32 align-middle"
            />
          </label>
        </div>

        <PlotlyChart
          data={epsPlot.data}
          layout={epsPlot.layout}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%' }}
        />
      </Card>

      {/* ====================================================
          B4.3  Gegenbeispiele
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B4.3 &nbsp;Gegenbeispiele
      </h3>

      <Card type="warning" title="$\sin(1/x)$ — unendliche Oszillation bei $0$" katexReady={katexReady}>
        <TextWithMath
          text="Die Funktion $f(x) = \sin(1/x)$ ist für alle $x \neq 0$ definiert und stetig. An der Stelle $x_0 = 0$ oszilliert sie jedoch **unendlich oft** zwischen $-1$ und $+1$. Der Grenzwert $\lim_{x \to 0} \sin(1/x)$ existiert **nicht**, also ist $f$ in $0$ nicht stetig fortsetzbar."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Man kann Folgenstetigkeit nutzen: Wähle $x_n = \frac{1}{2\pi n} \to 0$ und $y_n = \frac{1}{2\pi n + \pi/2} \to 0$. Dann $f(x_n) = 0$ und $f(y_n) = 1$ — verschiedene Grenzwerte, also Unstetigkeit."
          katexReady={katexReady}
        />
      </Card>

      <Card type="example" title="Dirichlet-Funktion — nirgends stetig" katexReady={katexReady}>
        <TextWithMath
          text="Die **Dirichlet-Funktion** ist definiert als:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="D(x) = \begin{cases} 1 & \text{falls } x \in \mathbb{Q} \\ 0 & \text{falls } x \notin \mathbb{Q} \end{cases}"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Diese Funktion ist **nirgends stetig**: Sei $x_0 \in \mathbb{R}$ beliebig. In jeder Umgebung von $x_0$ liegen sowohl rationale als auch irrationale Zahlen (Dichtheit von $\mathbb{Q}$ und $\mathbb{R} \setminus \mathbb{Q}$). Daher findet man stets Folgen $x_n \to x_0$ mit $D(x_n) = 1$ und Folgen $y_n \to x_0$ mit $D(y_n) = 0$. Die Funktionswerte konvergieren nicht gegen einen einzigen Wert."
          katexReady={katexReady}
        />
      </Card>

      <Card type="intuition" title="Warum sind Gegenbeispiele wichtig?" katexReady={katexReady}>
        <TextWithMath
          text="Gegenbeispiele schärfen das Verständnis der Definition: **Stetigkeit** verlangt, dass sich $f(x)$ bei kleiner Änderung von $x$ nur wenig ändert. Funktionen wie $\sin(1/x)$ oder die Dirichlet-Funktion zeigen, wie dramatisch dieses Prinzip verletzt werden kann — und warum die $\varepsilon$-$\delta$-Formulierung so präzise sein muss."
          katexReady={katexReady}
        />
      </Card>
    </div>
  );
}
