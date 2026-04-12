import React, { useState } from 'react';
import { TextWithMath, BlockMath } from '../components/MathComponents';
import { Card, CollapsibleProof, FormulaCard } from '../components/Cards';

// ============================================================
// B2: Reihen — Vertiefung
// ============================================================
export default function ReiheContent({ katexReady }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Reihen &mdash; Vertiefung
      </h2>
      <TextWithMath
        text="In diesem Kapitel untersuchen wir **Reihen** $\sum_{k=0}^{\infty} a_k$, also unendliche Summen. Wir lernen die wichtigsten **Konvergenzkriterien** kennen und verstehen, wann eine Reihe konvergiert, divergiert oder nur bedingt konvergiert."
        katexReady={katexReady}
      />

      {/* ====================================================
          B2.1  Notwendiges Kriterium
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B2.1 &nbsp;Notwendiges Kriterium
      </h3>

      <Card type="theorem" title="Notwendiges Kriterium für Konvergenz" katexReady={katexReady}>
        <TextWithMath
          text="Wenn die Reihe $\sum_{k=0}^{\infty} a_k$ konvergiert, dann gilt **notwendigerweise**:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\sum_{k=0}^{\infty} a_k \text{ konvergent} \;\Longrightarrow\; \lim_{k \to \infty} a_k = 0"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Die Glieder einer konvergenten Reihe müssen also gegen Null gehen. Dies ist eine **notwendige**, aber **keine hinreichende** Bedingung!"
          katexReady={katexReady}
        />
      </Card>

      <Card type="warning" title="Die Umkehrung gilt NICHT!" katexReady={katexReady}>
        <TextWithMath
          text="Aus $a_k \to 0$ folgt **nicht**, dass $\sum a_k$ konvergiert! Das bekannteste Gegenbeispiel ist die **harmonische Reihe**:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\sum_{k=1}^{\infty} \frac{1}{k} = 1 + \frac{1}{2} + \frac{1}{3} + \frac{1}{4} + \cdots = \infty"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Obwohl $\frac{1}{k} \to 0$ gilt, divergiert die harmonische Reihe. Die Glieder gehen einfach **nicht schnell genug** gegen Null."
          katexReady={katexReady}
        />
      </Card>

      {/* ====================================================
          B2.2  Übersichtstabelle aller Konvergenzkriterien
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B2.2 &nbsp;Übersichtstabelle aller Konvergenzkriterien
      </h3>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">
          Alle Kriterien auf einen Blick
        </h4>
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="grid grid-cols-4 gap-px bg-slate-300 dark:bg-slate-600 rounded-t-lg overflow-hidden text-sm font-bold">
            <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 text-slate-800 dark:text-slate-100">
              Kriterium
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 text-slate-800 dark:text-slate-100">
              Formel / Bedingung
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 text-green-700 dark:text-green-400">
              Konvergenz
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 text-red-700 dark:text-red-400">
              Divergenz
            </div>
          </div>
          {/* Rows */}
          {[
            {
              name: 'Notwendiges Krit.',
              formula: '$a_k \\to 0$',
              conv: 'notwendig, nicht hinreichend',
              div: '$a_k \\not\\to 0 \\Rightarrow$ divergent',
            },
            {
              name: 'Majorantenkriterium',
              formula: '$|a_k| \\le b_k$',
              conv: '$\\sum b_k$ konv. $\\Rightarrow \\sum a_k$ abs. konv.',
              div: '—',
            },
            {
              name: 'Minorantenkriterium',
              formula: '$a_k \\ge b_k \\ge 0$',
              conv: '—',
              div: '$\\sum b_k$ div. $\\Rightarrow \\sum a_k$ div.',
            },
            {
              name: 'Quotientenkriterium',
              formula: '$\\lim \\left|\\frac{a_{k+1}}{a_k}\\right| = q$',
              conv: '$q < 1$',
              div: '$q > 1$',
            },
            {
              name: 'Wurzelkriterium',
              formula: '$\\limsup \\sqrt[k]{|a_k|} = q$',
              conv: '$q < 1$',
              div: '$q > 1$',
            },
            {
              name: 'Leibniz-Kriterium',
              formula: '$\\sum (-1)^k b_k$, $b_k \\searrow 0$',
              conv: 'stets konvergent',
              div: '—',
            },
            {
              name: 'Cauchy-Kriterium',
              formula: 'Partialsummen Cauchy-Folge',
              conv: 'genau dann konvergent',
              div: 'genau dann divergent',
            },
          ].map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-4 gap-px text-sm ${
                idx % 2 === 0
                  ? 'bg-slate-100 dark:bg-slate-700/50'
                  : 'bg-white dark:bg-slate-800'
              }`}
            >
              <div className="p-2 font-semibold text-slate-800 dark:text-slate-200">
                {row.name}
              </div>
              <div className="p-2 text-slate-700 dark:text-slate-300">
                <TextWithMath text={row.formula} katexReady={katexReady} />
              </div>
              <div className="p-2 text-green-700 dark:text-green-400">
                <TextWithMath text={row.conv} katexReady={katexReady} />
              </div>
              <div className="p-2 text-red-700 dark:text-red-400">
                <TextWithMath text={row.div} katexReady={katexReady} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
          Bei Quotienten- und Wurzelkriterium: Für <TextWithMath text="$q = 1$" katexReady={katexReady} /> ist keine Aussage möglich.
        </p>
      </div>

      {/* ====================================================
          Einzelne Kriterien im Detail
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B2.2a &nbsp;Vergleichskriterien
      </h3>

      {/* --- Majorantenkriterium --- */}
      <Card type="theorem" title="Majorantenkriterium (Vergleichskriterium)" katexReady={katexReady}>
        <TextWithMath
          text="Seien $\sum a_k$ und $\sum b_k$ Reihen mit $|a_k| \le b_k$ für alle $k \ge k_0$. Dann gilt:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\sum_{k=0}^{\infty} b_k \text{ konvergent} \;\Longrightarrow\; \sum_{k=0}^{\infty} a_k \text{ absolut konvergent}"
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Intuition:** Wenn eine grössere Reihe konvergiert, muss die kleinere erst recht konvergieren. Die konvergente Reihe $\sum b_k$ heisst **Majorante**."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Beispiel:** $\sum \frac{1}{k^2} \le \sum \frac{1}{k(k-1)}$ (Teleskop, konvergiert) $\Rightarrow \sum \frac{1}{k^2}$ konvergiert."
          katexReady={katexReady}
        />
      </Card>

      {/* --- Minorantenkriterium --- */}
      <Card type="theorem" title="Minorantenkriterium" katexReady={katexReady}>
        <TextWithMath
          text="Seien $a_k \ge b_k \ge 0$ für alle $k \ge k_0$. Dann gilt:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\sum_{k=0}^{\infty} b_k \text{ divergent} \;\Longrightarrow\; \sum_{k=0}^{\infty} a_k \text{ divergent}"
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Intuition:** Wenn schon eine kleinere Reihe divergiert, muss die grössere erst recht divergieren. Die divergente Reihe $\sum b_k$ heisst **Minorante**."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Beispiel:** $\frac{1}{\sqrt{k}} \ge \frac{1}{k}$ ist falsch, aber $\frac{1}{\sqrt{k}} \ge \frac{1}{k}$ für $k \ge 1$. Da $\sum \frac{1}{k}$ divergiert, divergiert auch $\sum \frac{1}{\sqrt{k}}$."
          katexReady={katexReady}
        />
      </Card>

      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B2.2b &nbsp;Quotienten- und Wurzelkriterium
      </h3>

      {/* --- Quotientenkriterium --- */}
      <Card type="theorem" title="Quotientenkriterium" katexReady={katexReady}>
        <TextWithMath
          text="Sei $\sum a_k$ eine Reihe mit $a_k \ne 0$ für alle $k$. Existiert der Grenzwert:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="q = \lim_{k \to \infty} \left|\frac{a_{k+1}}{a_k}\right|"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Dann gilt: Ist $q < 1$, so konvergiert $\sum a_k$ **absolut**. Ist $q > 1$, so **divergiert** $\sum a_k$. Für $q = 1$ ist **keine Aussage** möglich."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Intuition:** Der Quotient aufeinanderfolgender Glieder misst die «Schrumpfungsrate». Bei $q < 1$ schrumpfen die Glieder geometrisch schnell."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Beispiel:** Für $\sum \frac{1}{k!}$ gilt $\left|\frac{a_{k+1}}{a_k}\right| = \frac{1}{k+1} \to 0 < 1$, also konvergent."
          katexReady={katexReady}
        />
      </Card>

      {/* --- Wurzelkriterium --- */}
      <Card type="theorem" title="Wurzelkriterium" katexReady={katexReady}>
        <TextWithMath
          text="Sei $\sum a_k$ eine Reihe. Betrachte:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="q = \limsup_{k \to \infty} \sqrt[k]{|a_k|}"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Ist $q < 1$, so konvergiert $\sum a_k$ **absolut**. Ist $q > 1$, so **divergiert** $\sum a_k$. Für $q = 1$ ist **keine Aussage** möglich."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Intuition:** Das Wurzelkriterium vergleicht die Reihe mit einer geometrischen Reihe. Es ist **schärfer** als das Quotientenkriterium (liefert nie weniger Information)."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Beispiel:** Für $\sum \frac{1}{2^k}$ gilt $\sqrt[k]{|a_k|} = \frac{1}{2} < 1$, also konvergent."
          katexReady={katexReady}
        />
      </Card>

      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B2.2c &nbsp;Leibniz- und Cauchy-Kriterium
      </h3>

      {/* --- Leibniz-Kriterium --- */}
      <Card type="theorem" title="Leibniz-Kriterium (Alternierende Reihen)" katexReady={katexReady}>
        <TextWithMath
          text="Sei $(b_k)_{k \ge 0}$ eine Folge mit $b_k \ge 0$, die **monoton fällt** und gegen $0$ konvergiert: $b_0 \ge b_1 \ge b_2 \ge \cdots \to 0$. Dann konvergiert die **alternierende Reihe**:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\sum_{k=0}^{\infty} (-1)^k\, b_k \quad \text{ist konvergent}"
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Intuition:** Die Partialsummen springen abwechselnd über und unter den Grenzwert. Da die Sprünge immer kleiner werden, nähern sie sich dem Grenzwert an."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Beispiel:** Die alternierende harmonische Reihe $\sum_{k=1}^{\infty} \frac{(-1)^{k+1}}{k} = 1 - \frac{1}{2} + \frac{1}{3} - \frac{1}{4} + \cdots = \ln 2$ konvergiert nach Leibniz."
          katexReady={katexReady}
        />
      </Card>

      {/* --- Cauchy-Kriterium --- */}
      <Card type="theorem" title="Cauchy-Kriterium für Reihen" katexReady={katexReady}>
        <TextWithMath
          text="Die Reihe $\sum_{k=0}^{\infty} a_k$ konvergiert **genau dann**, wenn die Folge der Partialsummen $(S_n)$ eine **Cauchy-Folge** ist:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\forall\,\varepsilon > 0 \;\exists\, N \in \mathbb{N} \;\forall\, m > n \ge N \colon\; \left|\sum_{k=n+1}^{m} a_k\right| < \varepsilon"
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Intuition:** Ab einem bestimmten Index dürfen beliebig viele aufeinanderfolgende Summanden zusammen nur noch einen winzigen Beitrag liefern."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Beispiel:** Die geometrische Reihe $\sum q^k$ mit $|q| < 1$ erfüllt das Cauchy-Kriterium, da $\left|\sum_{k=n+1}^{m} q^k\right| \le \frac{|q|^{n+1}}{1 - |q|} \to 0$."
          katexReady={katexReady}
        />
      </Card>

      {/* ====================================================
          Absolute Konvergenz
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B2.2d &nbsp;Absolute Konvergenz
      </h3>

      <Card type="definition" title="Absolute und bedingte Konvergenz" katexReady={katexReady}>
        <TextWithMath
          text="Eine Reihe $\sum a_k$ heisst **absolut konvergent**, falls die Reihe der Beträge konvergiert:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\sum_{k=0}^{\infty} |a_k| < \infty"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Sie heisst **bedingt konvergent**, wenn $\sum a_k$ konvergiert, aber $\sum |a_k|$ divergiert."
          katexReady={katexReady}
        />
      </Card>

      <Card type="theorem" title="Absolute Konvergenz impliziert Konvergenz" katexReady={katexReady}>
        <TextWithMath
          text="Jede absolut konvergente Reihe ist auch konvergent:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\sum_{k=0}^{\infty} |a_k| \text{ konvergent} \;\Longrightarrow\; \sum_{k=0}^{\infty} a_k \text{ konvergent}"
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Die Umkehrung gilt nicht!** Eine Reihe kann konvergent sein, ohne absolut zu konvergieren."
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Beispiel:** Die alternierende harmonische Reihe $\sum \frac{(-1)^{k+1}}{k}$ konvergiert (Leibniz), aber $\sum \frac{1}{k}$ divergiert. Also ist sie **bedingt konvergent**."
          katexReady={katexReady}
        />
      </Card>

      {/* ====================================================
          B2.3  Umordnungssatz von Riemann
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B2.3 &nbsp;Umordnungssatz von Riemann
      </h3>

      <Card type="warning" title="Riemannscher Umordnungssatz" katexReady={katexReady}>
        <TextWithMath
          text="Sei $\sum a_k$ eine **bedingt konvergente** Reihe. Dann gibt es zu **jedem** $S \in \mathbb{R} \cup \{-\infty, +\infty\}$ eine Umordnung (Permutation $\sigma \colon \mathbb{N} \to \mathbb{N}$), sodass:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\sum_{k=0}^{\infty} a_{\sigma(k)} = S"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Das bedeutet: Durch blosses **Umordnen** der Summanden kann man eine bedingt konvergente Reihe auf **jeden beliebigen Wert** konvergieren lassen &mdash; oder sogar divergieren lassen!"
          katexReady={katexReady}
        />
        <TextWithMath
          text="**Konsequenz:** Bei bedingt konvergenten Reihen kommt es auf die **Reihenfolge** der Summation an. Nur bei **absolut konvergenten** Reihen ist jede Umordnung erlaubt und liefert denselben Wert."
          katexReady={katexReady}
        />
      </Card>

      <Card type="intuition" title="Warum funktioniert das?" katexReady={katexReady}>
        <TextWithMath
          text="Bei bedingter Konvergenz divergieren sowohl die positiven als auch die negativen Teilsummen jeweils gegen $+\infty$ bzw. $-\infty$. Man hat also «unendlich viel positives und negatives Material». Um eine Zielzahl $S$ zu treffen, addiert man zunächst positive Glieder, bis man $S$ überschreitet, dann negative, bis man unter $S$ fällt, und so weiter. Da die Glieder gegen Null gehen, werden die Überschreitungen immer kleiner."
          katexReady={katexReady}
        />
      </Card>

      <Card type="example" title="Umordnung der alternierenden harmonischen Reihe" katexReady={katexReady}>
        <TextWithMath
          text="Die alternierende harmonische Reihe konvergiert gegen $\ln 2$:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="1 - \frac{1}{2} + \frac{1}{3} - \frac{1}{4} + \frac{1}{5} - \cdots = \ln 2"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Ordnet man die Glieder um (z.B. immer ein positives, dann zwei negative), erhält man:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="1 - \frac{1}{2} - \frac{1}{4} + \frac{1}{3} - \frac{1}{6} - \frac{1}{8} + \cdots = \frac{1}{2}\ln 2"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Dieselben Summanden in anderer Reihenfolge ergeben einen **anderen Grenzwert**!"
          katexReady={katexReady}
        />
      </Card>
    </div>
  );
}
