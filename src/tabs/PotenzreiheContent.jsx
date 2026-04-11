import React from 'react';
import { TextWithMath, BlockMath } from '../components/MathComponents';
import { Card, CollapsibleProof, FormulaCard } from '../components/Cards';

// ============================================================
// B3: Potenzreihen — Vertiefung
// ============================================================
export default function PotenzreiheContent({ katexReady }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Potenzreihen &mdash; Vertiefung
      </h2>
      <TextWithMath
        text="Potenzreihen sind **Reihen der Form** $\sum a_n (x - x_0)^n$ und bilden das zentrale Werkzeug, um Funktionen lokal durch Polynome darzustellen. In diesem Kapitel untersuchen wir den **Konvergenzradius**, die **gliedweise Differenzierbarkeit** und den **Abel'schen Grenzwertsatz**."
        katexReady={katexReady}
      />

      {/* ====================================================
          B3.1  Konvergenzradius
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B3.1 &nbsp;Konvergenzradius
      </h3>

      <Card type="definition" title="Potenzreihe und Konvergenzradius" katexReady={katexReady}>
        <TextWithMath
          text="Eine **Potenzreihe** um den Entwicklungspunkt $x_0 \in \mathbb{R}$ ist eine Reihe der Form"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\sum_{n=0}^{\infty} a_n (x - x_0)^n, \qquad a_n \in \mathbb{R}."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Es gibt genau ein $R \in [0, \infty]$, den sogenannten **Konvergenzradius**, sodass die Reihe:"
          katexReady={katexReady}
        />
        <TextWithMath
          text="&bull; **absolut konvergiert** f&uuml;r $|x - x_0| < R$,"
          katexReady={katexReady}
        />
        <TextWithMath
          text="&bull; **divergiert** f&uuml;r $|x - x_0| > R$."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Auf dem Rand $|x - x_0| = R$ ist keine allgemeine Aussage m&ouml;glich."
          katexReady={katexReady}
        />
      </Card>

      <Card type="theorem" title="Formel von Cauchy-Hadamard" katexReady={katexReady}>
        <TextWithMath
          text="Der Konvergenzradius einer Potenzreihe $\sum a_n (x - x_0)^n$ ist gegeben durch"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\frac{1}{R} = \limsup_{n \to \infty} |a_n|^{1/n}."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Hierbei gilt die Konvention $1/0 = \infty$ und $1/\infty = 0$. Diese Formel funktioniert **immer** &mdash; der Limes superior existiert stets."
          katexReady={katexReady}
        />
      </Card>

      <Card type="theorem" title="Quotientenformel (Quotientenkriterium)" katexReady={katexReady}>
        <TextWithMath
          text="Falls der folgende Grenzwert existiert und $a_n \neq 0$ f&uuml;r fast alle $n$, so gilt:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="R = \lim_{n \to \infty} \left|\frac{a_n}{a_{n+1}}\right|."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Diese Formel ist in der Praxis oft einfacher zu berechnen als Cauchy-Hadamard, existiert aber **nicht immer**."
          katexReady={katexReady}
        />
      </Card>

      <Card type="intuition" title="Vergleich: Cauchy-Hadamard vs. Quotientenformel" katexReady={katexReady}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-600">
                <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-200"></th>
                <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-200">Cauchy-Hadamard</th>
                <th className="text-left py-2 font-semibold text-slate-700 dark:text-slate-200">Quotientenformel</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td className="py-2 pr-4 font-medium">Existenz</td>
                <td className="py-2 pr-4">Existiert <strong>immer</strong></td>
                <td className="py-2">Nur wenn der Limes existiert</td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td className="py-2 pr-4 font-medium">Berechnung</td>
                <td className="py-2 pr-4">Oft schwieriger (limsup)</td>
                <td className="py-2">Meist einfacher (Quotient)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Wann nutzen?</td>
                <td className="py-2 pr-4">Fallunterscheidungen, oszillierende Koeffizienten</td>
                <td className="py-2">Fakult&auml;ten, einfache Quotienten</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card type="example" title="Geometrische Reihe: $R = 1$" katexReady={katexReady}>
        <TextWithMath
          text="Die geometrische Reihe $\sum_{n=0}^{\infty} x^n$ hat $a_n = 1$ f&uuml;r alle $n$. Mit der Quotientenformel:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="R = \lim_{n \to \infty} \left|\frac{a_n}{a_{n+1}}\right| = \lim_{n \to \infty} \frac{1}{1} = 1."
          katexReady={katexReady}
        />
        <TextWithMath
          text="F&uuml;r $|x| < 1$ konvergiert sie gegen $\frac{1}{1-x}$. Am Rand $x = \pm 1$ divergiert sie."
          katexReady={katexReady}
        />
      </Card>

      <Card type="example" title="Exponentialreihe: $R = \infty$" katexReady={katexReady}>
        <TextWithMath
          text="F&uuml;r $e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!}$ ist $a_n = \frac{1}{n!}$. Quotientenformel:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="R = \lim_{n \to \infty} \frac{1/n!}{1/(n+1)!} = \lim_{n \to \infty} (n+1) = \infty."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Die Exponentialreihe konvergiert also f&uuml;r **alle** $x \in \mathbb{R}$."
          katexReady={katexReady}
        />
      </Card>

      <Card type="example" title="Logarithmusreihe $\ln(1+x)$: $R = 1$" katexReady={katexReady}>
        <TextWithMath
          text="Es gilt $\ln(1+x) = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n} x^n$ mit $a_n = \frac{(-1)^{n+1}}{n}$. Quotientenformel:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="R = \lim_{n \to \infty} \frac{1/n}{1/(n+1)} = \lim_{n \to \infty} \frac{n+1}{n} = 1."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Am Rand: Bei $x = 1$ konvergiert die Reihe (alternierende harmonische Reihe), bei $x = -1$ divergiert sie (harmonische Reihe)."
          katexReady={katexReady}
        />
      </Card>

      {/* ====================================================
          B3.2  Differenzierbarkeit von Potenzreihen
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B3.2 &nbsp;Differenzierbarkeit von Potenzreihen
      </h3>

      <Card type="theorem" title="Gliedweise Differenzierbarkeit" katexReady={katexReady}>
        <TextWithMath
          text="Sei $f(x) = \sum_{n=0}^{\infty} a_n (x - x_0)^n$ eine Potenzreihe mit Konvergenzradius $R > 0$. Dann ist $f$ auf dem offenen Intervall $(x_0 - R,\; x_0 + R)$ **beliebig oft differenzierbar**, und die Ableitungen erh&auml;lt man durch **gliedweises Differenzieren**:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="f'(x) = \sum_{n=1}^{\infty} n \, a_n (x - x_0)^{n-1}"
          katexReady={katexReady}
        />
        <FormulaCard
          math="f''(x) = \sum_{n=2}^{\infty} n(n-1) \, a_n (x - x_0)^{n-2}"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Allgemein f&uuml;r die $k$-te Ableitung:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="f^{(k)}(x) = \sum_{n=k}^{\infty} \frac{n!}{(n-k)!} \, a_n (x - x_0)^{n-k}"
          katexReady={katexReady}
        />
      </Card>

      <Card type="theorem" title="Konvergenzradius bleibt erhalten" katexReady={katexReady}>
        <TextWithMath
          text="Die durch gliedweises Differenzieren (oder Integrieren) entstandene Potenzreihe hat **denselben Konvergenzradius** $R$ wie die Ausgangsreihe."
          katexReady={katexReady}
        />
        <TextWithMath
          text="Das Verhalten am **Rand** $|x - x_0| = R$ kann sich jedoch &auml;ndern."
          katexReady={katexReady}
        />
      </Card>

      <Card type="theorem" title="Potenzreihen sind analytisch ($C^\omega$)" katexReady={katexReady}>
        <TextWithMath
          text="Jede Potenzreihe $f(x) = \sum a_n (x - x_0)^n$ mit $R > 0$ ist auf $(x_0 - R, x_0 + R)$ eine **analytische Funktion** ($C^\omega$). Das bedeutet: $f$ stimmt in einer Umgebung jedes Punktes mit ihrer eigenen Taylorreihe &uuml;berein. Insbesondere gilt:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="a_n = \frac{f^{(n)}(x_0)}{n!}"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Die Koeffizienten einer Potenzreihe sind also durch die Funktion **eindeutig bestimmt** (Identit&auml;tssatz f&uuml;r Potenzreihen)."
          katexReady={katexReady}
        />
      </Card>

      <Card type="example" title="Ableitung der Exponentialreihe" katexReady={katexReady}>
        <TextWithMath
          text="F&uuml;r $e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!}$ ergibt gliedweises Differenzieren:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\frac{d}{dx} e^x = \sum_{n=1}^{\infty} \frac{n \cdot x^{n-1}}{n!} = \sum_{n=1}^{\infty} \frac{x^{n-1}}{(n-1)!} = \sum_{m=0}^{\infty} \frac{x^m}{m!} = e^x"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Die Exponentialfunktion ist also ihre **eigene Ableitung** &mdash; eine direkte Konsequenz der Reihendarstellung."
          katexReady={katexReady}
        />
      </Card>

      {/* ====================================================
          B3.3  Abel'scher Grenzwertsatz
          ==================================================== */}
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 pt-4">
        B3.3 &nbsp;Abel&rsquo;scher Grenzwertsatz
      </h3>

      <Card type="theorem" title="Abel'scher Grenzwertsatz" katexReady={katexReady}>
        <TextWithMath
          text="Sei $f(x) = \sum_{n=0}^{\infty} a_n x^n$ eine Potenzreihe mit Konvergenzradius $R > 0$. Falls die Reihe am Randpunkt $x = R$ konvergiert, d.h. $\sum_{n=0}^{\infty} a_n R^n$ existiert, dann gilt:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\lim_{x \nearrow R} f(x) = \sum_{n=0}^{\infty} a_n R^n"
          katexReady={katexReady}
        />
        <TextWithMath
          text="Die Funktion $f$ ist also am Randpunkt $R$ **linksseitig stetig**. Analog gilt die Aussage am linken Randpunkt $x = -R$ (falls dort konvergent) mit dem rechtsseitigen Grenzwert."
          katexReady={katexReady}
        />
      </Card>

      <Card type="example" title="Anwendung: $\ln 2 = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n}$" katexReady={katexReady}>
        <TextWithMath
          text="Die Logarithmusreihe $\ln(1+x) = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n} x^n$ hat $R = 1$. Am Randpunkt $x = 1$ konvergiert die alternierende harmonische Reihe. Nach dem Abel'schen Grenzwertsatz folgt:"
          katexReady={katexReady}
        />
        <FormulaCard
          math="\ln 2 = \lim_{x \nearrow 1} \ln(1+x) = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n} = 1 - \frac{1}{2} + \frac{1}{3} - \frac{1}{4} + \cdots"
          katexReady={katexReady}
        />
      </Card>
    </div>
  );
}
