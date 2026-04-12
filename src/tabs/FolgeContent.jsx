import React, { useMemo } from 'react';
import { TextWithMath, BlockMath } from '../components/MathComponents';
import { Card, CollapsibleProof, FormulaCard } from '../components/Cards';
import PlotlyChart from '../components/PlotlyChart';

// ============================================================
// B1: Folgen — Vertiefung
// ============================================================
export default function FolgeContent({ katexReady }) {
  // -----------------------------------------------------------
  // B1.3 Plotly data: sequence with limsup / liminf envelope
  // Sequence: a_n = sin(n) + (-1)^n / n
  // -----------------------------------------------------------
  const limsupPlot = useMemo(() => {
    const N = 80;
    const ns = [];
    const an = [];
    const supEnv = [];
    const infEnv = [];

    // Compute sequence values
    for (let n = 1; n <= N; n++) {
      ns.push(n);
      an.push(Math.sin(n) + Math.pow(-1, n) / n);
    }

    // sup of tail / inf of tail
    for (let k = 0; k < N; k++) {
      let tailSup = -Infinity;
      let tailInf = Infinity;
      for (let j = k; j < N; j++) {
        if (an[j] > tailSup) tailSup = an[j];
        if (an[j] < tailInf) tailInf = an[j];
      }
      supEnv.push(tailSup);
      infEnv.push(tailInf);
    }

    return {
      data: [
        {
          x: ns, y: an, type: 'scatter', mode: 'markers',
          name: 'a_n', marker: { color: '#6366f1', size: 5 },
        },
        {
          x: ns, y: supEnv, type: 'scatter', mode: 'lines',
          name: 'sup{a_k : k >= n}',
          line: { color: '#ef4444', width: 2, dash: 'dash' },
        },
        {
          x: ns, y: infEnv, type: 'scatter', mode: 'lines',
          name: 'inf{a_k : k >= n}',
          line: { color: '#22c55e', width: 2, dash: 'dash' },
        },
      ],
      layout: {
        xaxis: { title: 'n', gridcolor: 'rgba(148,163,184,0.2)' },
        yaxis: { title: 'a_n', gridcolor: 'rgba(148,163,184,0.2)' },
        legend: { x: 0.02, y: 0.98, bgcolor: 'rgba(0,0,0,0)' },
        height: 360,
      },
    };
  }, []);

  // -----------------------------------------------------------
  // B1.6 Plot: (1 + 1/n)^n converging to e
  // -----------------------------------------------------------
  const eulerPlot = useMemo(() => {
    const ns = [];
    const vals = [];
    for (let n = 1; n <= 100; n++) {
      ns.push(n);
      vals.push(Math.pow(1 + 1 / n, n));
    }
    const eLine = Array(100).fill(Math.E);

    return {
      data: [
        {
          x: ns, y: vals, type: 'scatter', mode: 'markers',
          name: '(1+1/n)^n', marker: { color: '#6366f1', size: 5 },
        },
        {
          x: ns, y: eLine, type: 'scatter', mode: 'lines',
          name: 'e = 2.71828...',
          line: { color: '#ef4444', width: 2, dash: 'dot' },
        },
      ],
      layout: {
        xaxis: { title: 'n', gridcolor: 'rgba(148,163,184,0.2)' },
        yaxis: { title: 'a_n', range: [2, 3], gridcolor: 'rgba(148,163,184,0.2)' },
        legend: { x: 0.5, y: 0.15, bgcolor: 'rgba(0,0,0,0)' },
        height: 340,
      },
    };
  }, []);

  // ===========================================================
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Folgen &mdash; Vertiefung
      </h2>
      <TextWithMath
        text="Dieses Kapitel behandelt zentrale Begriffe rund um **Folgen** in $\mathbb{R}$: Häufungspunkte, Beschränktheit, Limes superior/inferior, Teilfolgen und die grossen Konvergenzsätze."
        katexReady={katexReady}
      />

      {/* ====================================================
          B1.1  Häufungspunkte
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B1.1 &nbsp;Häufungspunkte
      </h3>

      <Card type="definition" title="Häufungspunkt einer Folge" katexReady={katexReady}>
        <TextWithMath
          text="Sei $(a_n)_{n \in \mathbb{N}}$ eine Folge in $\mathbb{R}$. Ein Punkt $a \in \mathbb{R}$ heisst **Häufungspunkt** (HP) der Folge, wenn in jeder $\varepsilon$-Umgebung von $a$ **unendlich viele** Folgenglieder liegen:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\forall\,\varepsilon > 0 \;\colon\; \bigl|\{n \in \mathbb{N} : |a_n - a| < \varepsilon\}\bigr| = \infty"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Äquivalent: Es gibt eine **Teilfolge** $(a_{n_k})$, die gegen $a$ konvergiert."
          katexReady={katexReady}
        />
      </Card>

      <Card type="intuition" title="Anschauung: Cluster-Punkte" katexReady={katexReady}>
        <TextWithMath
          text="Man kann sich Häufungspunkte als **Cluster** vorstellen: Egal wie eng man um $a$ ein Fenster legt, es drängen sich immer wieder Folgenglieder hinein. Im Gegensatz zum Grenzwert müssen sich aber nicht **alle** späten Glieder dort sammeln &mdash; es reicht, wenn immer wieder welche zurückkehren."
          katexReady={katexReady}
        />
      </Card>

      <Card type="example" title="Häufungspunkte von $a_n = (-1)^n$" katexReady={katexReady}>
        <TextWithMath
          text="Die Folge $(-1)^n = -1, +1, -1, +1, \ldots$ hat **zwei** Häufungspunkte: $+1$ und $-1$. Die Teilfolge der geraden Indizes konvergiert gegen $+1$, die der ungeraden gegen $-1$. Die Folge selbst besitzt keinen Grenzwert."
          katexReady={katexReady}
        />
      </Card>

      {/* ====================================================
          B1.2  Beschränktheit, Supremum & Infimum
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B1.2 &nbsp;Beschränktheit, Supremum &amp; Infimum
      </h3>

      <Card type="definition" title="Beschränkte Folge, Supremum, Infimum" katexReady={katexReady}>
        <TextWithMath
          text="Eine Folge $(a_n)$ heisst **nach oben beschränkt**, falls es ein $M \in \mathbb{R}$ gibt mit $a_n \le M$ für alle $n$. Analog **nach unten beschränkt**. Sie heisst **beschränkt**, wenn beides gilt."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Das **Supremum** $\sup\{a_n : n \in \mathbb{N}\}$ ist die **kleinste obere Schranke** der Wertemenge. Das **Infimum** $\inf\{a_n : n \in \mathbb{N}\}$ ist die **grösste untere Schranke**."
          katexReady={katexReady}
        />
      </Card>

      <Card type="theorem" title="$\varepsilon$-Charakterisierung des Supremums" katexReady={katexReady}>
        <TextWithMath
          text="Sei $s = \sup A$ mit $A \subseteq \mathbb{R}$ nach oben beschränkt. Dann gilt:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\forall\,\varepsilon > 0\;\;\exists\, a \in A \colon\; s - \varepsilon < a \le s"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Das Supremum wird also beliebig gut von Elementen aus $A$ **approximiert**. Analog für das Infimum."
          katexReady={katexReady}
        />
      </Card>

      <Card type="example" title="Beispiel: $a_n = \frac{n}{n+1}$" katexReady={katexReady}>
        <TextWithMath
          text="Für $a_n = \frac{n}{n+1}$ gilt $0 < a_n < 1$ für alle $n \ge 1$. Damit ist die Folge beschränkt mit:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\inf_{n \ge 1} a_n = \tfrac{1}{2},\qquad \sup_{n \ge 1} a_n = 1"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Das Supremum $1$ wird nie angenommen (denn $\frac{n}{n+1} < 1$ stets), aber beliebig gut approximiert."
          katexReady={katexReady}
        />
      </Card>

      {/* ====================================================
          B1.3  Limes superior & Limes inferior
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B1.3 &nbsp;Limes superior &amp; Limes inferior
      </h3>

      <Card type="definition" title="Limes superior und Limes inferior" katexReady={katexReady}>
        <TextWithMath
          text="Sei $(a_n)$ eine beschränkte Folge. Dann definiert man:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\limsup_{n \to \infty} a_n \;=\; \inf_{n \ge 1}\;\sup_{k \ge n} a_k \;=\; \lim_{n \to \infty}\!\Bigl(\sup_{k \ge n} a_k\Bigr)"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\liminf_{n \to \infty} a_n \;=\; \sup_{n \ge 1}\;\inf_{k \ge n} a_k \;=\; \lim_{n \to \infty}\!\Bigl(\inf_{k \ge n} a_k\Bigr)"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Es gilt stets $\liminf a_n \le \limsup a_n$. Die Folge konvergiert genau dann, wenn **beide gleich** sind."
          katexReady={katexReady}
        />
      </Card>

      <Card type="intuition" title="Anschauung: Hüllkurven der Folge" katexReady={katexReady}>
        <TextWithMath
          text="Stelle dir $\sup_{k \ge n} a_k$ als die **obere Hüllkurve** vor: Von Index $n$ an betrachtet, ist das der höchste noch erreichbare Wert. Diese Hüllkurve fällt monoton und ihr Grenzwert ist der $\limsup$. Analog steigt $\inf_{k \ge n} a_k$ monoton zum $\liminf$."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Der $\limsup$ ist der **grösste Häufungspunkt** und der $\liminf$ der **kleinste Häufungspunkt** der Folge."
          katexReady={katexReady}
        />
      </Card>

      {/* Interactive Limsup / Liminf chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
          Visualisierung: Hüllkurven von&nbsp;
          <TextWithMath text="$a_n = \sin(n) + \frac{(-1)^n}{n}$" katexReady={katexReady} />
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Die rote gestrichelte Linie zeigt <TextWithMath text="$\sup_{k \ge n} a_k$" katexReady={katexReady} /> (fällt monoton),
          die grüne <TextWithMath text="$\inf_{k \ge n} a_k$" katexReady={katexReady} /> (steigt monoton).
        </p>
        <PlotlyChart
          data={limsupPlot.data}
          layout={limsupPlot.layout}
          style={{ width: '100%' }}
        />
      </div>

      {/* ====================================================
          B1.4  Teilfolgen
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B1.4 &nbsp;Teilfolgen
      </h3>

      <Card type="definition" title="Teilfolge" katexReady={katexReady}>
        <TextWithMath
          text="Sei $(a_n)_{n \in \mathbb{N}}$ eine Folge und $(n_k)_{k \in \mathbb{N}}$ eine **streng monoton wachsende** Folge natürlicher Zahlen ($n_1 < n_2 < n_3 < \cdots$). Dann heisst $(a_{n_k})_{k \in \mathbb{N}}$ eine **Teilfolge** von $(a_n)$."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Man wählt also unendlich viele Glieder der ursprünglichen Folge aus, behält aber deren Reihenfolge bei."
          katexReady={katexReady}
        />
      </Card>

      <Card type="theorem" title="Zusammenhang Teilfolgen und Häufungspunkte" katexReady={katexReady}>
        <TextWithMath
          text="Ein Punkt $a$ ist genau dann Häufungspunkt von $(a_n)$, wenn es eine **Teilfolge** $(a_{n_k})$ gibt mit $a_{n_k} \to a$."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Insbesondere: **Jede beschränkte Folge** in $\mathbb{R}$ besitzt eine **konvergente Teilfolge**. (Dies ist der Satz von Bolzano-Weierstraß.)"
          katexReady={katexReady}
        />
      </Card>

      {/* ====================================================
          B1.5  Bolzano-Weierstraß
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B1.5 &nbsp;Satz von Bolzano-Weierstraß
      </h3>

      <Card type="theorem" title="Bolzano-Weierstraß" katexReady={katexReady}>
        <TextWithMath
          text="**Jede beschränkte Folge** in $\mathbb{R}$ besitzt (mindestens) eine **konvergente Teilfolge**."
          katexReady={katexReady}
        />
        <FormulaCard
          math="(a_n) \text{ beschränkt} \;\Longrightarrow\; \exists\,(a_{n_k}) \text{ mit } a_{n_k} \to a \in \mathbb{R}"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Dies ist einer der fundamentalsten Sätze der Analysis. Er folgt direkt aus der **Vollständigkeit** von $\mathbb{R}$."
          katexReady={katexReady}
        />
      </Card>

      <CollapsibleProof title="Beweisskizze (Intervallhalbierung)" katexReady={katexReady}>
        <TextWithMath
          text="**Idee:** Wiederholte Halbierung eines Intervalls, das stets unendlich viele Folgenglieder enthält."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Schritt 1.** Da $(a_n)$ beschränkt ist, gibt es $a, b$ mit $a_n \in [a, b]$ für alle $n$. Setze $I_0 = [a, b]$."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Schritt 2.** Halbiere $I_0$ in $[a, \frac{a+b}{2}]$ und $[\frac{a+b}{2}, b]$. Mindestens eine Hälfte enthält **unendlich viele** Folgenglieder. Wähle diese als $I_1$."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Schritt 3.** Iteriere: Aus $I_k$ wird durch Halbierung $I_{k+1}$ gewählt, sodass $I_{k+1}$ unendlich viele Glieder enthält. Es gilt $|I_k| = \frac{b - a}{2^k} \to 0$."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Schritt 4.** Die geschachtelten Intervalle $I_0 \supset I_1 \supset I_2 \supset \cdots$ haben nach dem **Intervallschachtelungsprinzip** genau einen gemeinsamen Punkt $c$. In jedem $I_k$ wähle ein Folgenglied $a_{n_k}$ (mit $n_k > n_{k-1}$). Dann konvergiert $(a_{n_k}) \to c$. $\square$"
          katexReady={katexReady}
        />
      </CollapsibleProof>

      {/* ====================================================
          B1.6  Monotoniekriterium
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B1.6 &nbsp;Monotoniekriterium
      </h3>

      <Card type="theorem" title="Konvergenz monotoner, beschränkter Folgen" katexReady={katexReady}>
        <TextWithMath
          text="Jede **monoton wachsende und nach oben beschränkte** Folge in $\mathbb{R}$ konvergiert. Ebenso konvergiert jede **monoton fallende und nach unten beschränkte** Folge."
          katexReady={katexReady}
        />
        <FormulaCard
          math="(a_n) \text{ monoton wachsend, beschränkt} \;\Longrightarrow\; \lim_{n \to \infty} a_n = \sup\{a_n : n \in \mathbb{N}\}"
          katexReady={katexReady}
        />
      </Card>

      <CollapsibleProof title="Beweis (mittels Supremum)" katexReady={katexReady}>
        <TextWithMath
          text="Sei $(a_n)$ monoton wachsend und nach oben beschränkt. Dann existiert $s = \sup\{a_n : n \in \mathbb{N}\}$ (Vollständigkeit von $\mathbb{R}$)."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Behauptung:** $\lim_{n \to \infty} a_n = s$."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Sei $\varepsilon > 0$. Nach der $\varepsilon$-Charakterisierung des Supremums existiert ein $N \in \mathbb{N}$ mit $s - \varepsilon < a_N \le s$."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Da $(a_n)$ monoton wachsend ist, gilt für alle $n \ge N$:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="s - \varepsilon < a_N \le a_n \le s \;\Longrightarrow\; |a_n - s| < \varepsilon"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Also $a_n \to s$. $\square$"
          katexReady={katexReady}
        />
      </CollapsibleProof>

      <Card type="example" title="Klassiker: $a_n = \left(1 + \frac{1}{n}\right)^n \to e$" katexReady={katexReady}>
        <TextWithMath
          text="Die Folge $a_n = \bigl(1 + \frac{1}{n}\bigr)^n$ ist **monoton wachsend** und **nach oben beschränkt** (z.B. durch $3$). Nach dem Monotoniekriterium konvergiert sie. Ihr Grenzwert ist die **Eulersche Zahl**:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="e = \lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n \approx 2{,}71828"
          katexReady={katexReady}
        />
      </Card>

      {/* Euler sequence visualization */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
          Visualisierung:&nbsp;
          <TextWithMath text="$\left(1 + \frac{1}{n}\right)^n$" katexReady={katexReady} />
          &nbsp;konvergiert monoton gegen&nbsp;
          <TextWithMath text="$e$" katexReady={katexReady} />
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Die Punkte steigen monoton und nähern sich der roten Linie bei <TextWithMath text="$e \approx 2{,}71828$" katexReady={katexReady} />.
        </p>
        <PlotlyChart
          data={eulerPlot.data}
          layout={eulerPlot.layout}
          style={{ width: '100%' }}
        />
      </div>

      <Card type="warning" title="Monotonie allein reicht nicht!" katexReady={katexReady}>
        <TextWithMath
          text="Die Folge $a_n = n$ ist monoton wachsend, aber **nicht beschränkt** &mdash; und divergiert gegen $+\infty$. Für Konvergenz sind **beide** Voraussetzungen (Monotonie **und** Beschränktheit) nötig."
          katexReady={katexReady}
        />
      </Card>
    </div>
  );
}
