import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, Calculator, CheckCircle, AlertCircle, Globe, SlidersHorizontal, BookOpen, Lightbulb } from 'lucide-react';

// --- Mathematische Hilfsfunktionen ---
const f = [];
const factorial = (n) => {
  if (n === 0 || n === 1) return 1;
  if (f[n] > 0) return f[n];
  return f[n] = factorial(n - 1) * n;
};

// Komplexe Arithmetik
const cAdd = (a, b) => ({ r: a.r + b.r, i: a.i + b.i });
const cMult = (a, b) => ({ r: a.r * b.r - a.i * b.i, i: a.r * b.i + a.i * b.r });
const cAbs = (a) => Math.sqrt(a.r * a.r + a.i * a.i);

// --- Modelldefinitionen ---
const FOLGEN = [
  { id: 'null_1', name: 'Standard-Nullfolge', formula: '$x_n = \\frac{1}{n}$', limit: 0, calc: (n) => 1 / n },
  { id: 'null_alt', name: 'Alternierende Nullfolge', formula: '$x_n = \\frac{(-1)^n}{n}$', limit: 0, calc: (n) => Math.pow(-1, n) / n },
  { id: 'geom', name: 'Geometrische Folge', formula: '$x_n = q^n$', limit: (q) => Math.abs(q) < 1 ? 0 : (q === 1 ? 1 : null), calc: (n, q) => Math.pow(q, n), hasQ: true },
  { id: 'bruch', name: 'Gebrochenrationale Folge', formula: '$x_n = \\frac{2n}{n + 1}$', limit: 2, calc: (n) => (2 * n) / (n + 1) },
  { id: 'div_alt', name: 'Pendelfolge (Divergent)', formula: '$x_n = (-1)^n$', limit: null, calc: (n) => Math.pow(-1, n) },
  { id: 'euler', name: 'Euler-Folge', formula: '$x_n = \\left(1 + \\frac{1}{n}\\right)^n$', limit: Math.E, calc: (n) => Math.pow(1 + 1 / n, n) },
  { id: 'sin_damp', name: 'Gedämpfte Schwingung', formula: '$x_n = \\frac{\\sin(a \\cdot n)}{n}$', limit: 0, calc: (n, q, a) => Math.sin(a * n) / n, hasA: true },
  { id: 'n_sq', name: 'Quadratisches Wachstum', formula: '$x_n = n^2$', limit: null, calc: (n) => n * n }
];

const REIHEN = [
  { id: 'harm', name: 'Harmonische Reihe', formula: '$S_n = \\sum_{k=1}^n \\frac{1}{k}$', limit: null, calcTerm: (k) => 1 / k },
  { id: 'harm_alt', name: 'Alternierende Harmonische', formula: '$S_n = \\sum_{k=1}^n \\frac{(-1)^{k+1}}{k}$', limit: Math.log(2), calcTerm: (k) => Math.pow(-1, k + 1) / k },
  { id: 'geom_reihe', name: 'Geometrische Reihe', formula: '$S_n = \\sum_{k=0}^n q^k$', limit: (q) => Math.abs(q) < 1 ? (q / (1 - q)) : null, calcTerm: (k, q) => Math.pow(q, k), hasQ: true },
  { id: 'basel', name: 'Basel-Problem', formula: '$S_n = \\sum_{k=1}^n \\frac{1}{k^2}$', limit: (Math.PI * Math.PI) / 6, calcTerm: (k) => 1 / (k * k) },
  { id: 'euler_e', name: 'Euler-Reihe', formula: '$S_n = \\sum_{k=0}^n \\frac{1}{k!}$', limit: Math.E, calcTerm: (k) => 1 / factorial(k) },
  { id: 'teleskop', name: 'Teleskopreihe', formula: '$S_n = \\sum_{k=1}^n \\frac{1}{k(k+1)}$', limit: 1, calcTerm: (k) => 1 / (k * (k + 1)) }
];

const POTENZREIHEN = [
  { id: 'p_geom', name: 'Geometrische Reihe', formula: '$\\frac{1}{1-x} = \\sum_{n=0}^\\infty x^n$', target: (x) => x !== 1 ? 1 / (1 - x) : NaN, term: (x, n) => Math.pow(x, n) },
  { id: 'p_exp', name: 'Exponentialfunktion', formula: '$e^x = \\sum_{n=0}^\\infty \\frac{x^n}{n!}$', target: (x) => Math.exp(x), term: (x, n) => Math.pow(x, n) / factorial(n) },
  { id: 'p_sin', name: 'Sinusfunktion', formula: '$\\sin(x) = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n+1}}{(2n+1)!}$', target: (x) => Math.sin(x), term: (x, n) => Math.pow(-1, n) * Math.pow(x, 2 * n + 1) / factorial(2 * n + 1) },
  { id: 'p_ln', name: 'Natürlicher Logarithmus', formula: '$\\ln(1+x) = \\sum_{n=1}^\\infty \\frac{(-1)^{n+1} x^n}{n}$', target: (x) => x > -1 ? Math.log(1 + x) : NaN, term: (x, n) => n > 0 ? Math.pow(-1, n + 1) * Math.pow(x, n) / n : 0 }
];

const INTEGRALE = [
  { id: 'i_quad', name: 'Normalparabel', formula: '$\\int_0^b z^2 \\, dz$', f: (x) => x * x, F: (x) => (x * x * x) / 3 },
  { id: 'i_sin', name: 'Sinus-Bogen', formula: '$\\int_0^b \\sin(z) \\, dz$', f: (x) => Math.sin(x), F: (x) => -Math.cos(x) },
  { id: 'i_exp', name: 'Exponentialfunktion', formula: '$\\int_0^b e^z \\, dz$', f: (x) => Math.exp(x), F: (x) => Math.exp(x) },
  { id: 'i_sqrt', name: 'Wurzelfunktion', formula: '$\\int_0^b \\sqrt{z} \\, dz$', f: (x) => x >= 0 ? Math.sqrt(x) : NaN, F: (x) => x >= 0 ? (2 / 3) * Math.pow(x, 1.5) : NaN }
];

const FUNKTIONEN = [
  { id: 'f_quad', name: 'Parabel', formula: '$f(z) = a \\cdot z^2$', f: (x, a) => a * x * x, df: (x, a) => 2 * a * x, hasA: true },
  { id: 'f_sin', name: 'Sinus-Welle', formula: '$f(z) = \\sin(a \\cdot z)$', f: (x, a) => Math.sin(a * x), df: (x, a) => a * Math.cos(a * x), hasA: true },
  { id: 'f_abs', name: 'Betragsfunktion', formula: '$f(z) = |z|$', f: (x) => Math.abs(x), df: (x) => x > 0 ? 1 : (x < 0 ? -1 : NaN) },
  { id: 'f_sprung', name: 'Signum-Sprung', formula: '$f(z) = \\text{sgn}(z)$', f: (x) => x >= 0 ? 1 : -1, df: (x) => x !== 0 ? 0 : NaN, hasJump: true },
  { id: 'f_bruch', name: 'Polstelle', formula: '$f(z) = \\frac{1}{z}$', f: (x) => x !== 0 ? 1 / x : NaN, df: (x) => -1 / (x * x), hasJump: true },
  { id: 'f_sqrt', name: 'Wurzelfunktion', formula: '$f(z) = \\sqrt{z}$', f: (x) => x >= 0 ? Math.sqrt(x) : NaN, df: (x) => x > 0 ? 0.5 / Math.sqrt(x) : NaN },
  { id: 'f_sin_1_x', name: 'Grenzfall (Sinus)', formula: '$f(z) = z \\cdot \\sin\\left(\\frac{1}{z}\\right)$', f: (x) => x !== 0 ? x * Math.sin(1 / x) : 0, df: (x) => x !== 0 ? Math.sin(1 / x) - (1 / x) * Math.cos(1 / x) : NaN }
];

const EXPLANATIONS = {
  'null_1': "Die Standard-Nullfolge schlechthin. Der Nenner wächst unaufhaltsam an, weshalb die Werte immer kleiner werden und sich der $0$ asymptotisch annähern.",
  'null_alt': "Diese Folge springt bei jedem Schritt über die Null-Linie. Da der Nenner trotzdem wächst, werden die Sprünge immer kleiner. Wie ein Pendel kommt sie bei $a=0$ zur Ruhe.",
  'geom': "Das Verhalten hängt extrem vom Basis-Parameter $q$ ab! Für $|q| < 1$ konvergiert sie gegen $0$. Ist $|q| > 1$, explodieren die Werte.",
  'bruch': "Zähler und Nenner wachsen beide ins Unendliche! Da aber der Leitkoeffizient bei beiden $n$ ist, pendelt sich das Verhältnis bei $\\frac{2}{1} = 2$ ein.",
  'div_alt': "Divergenz in Reinkultur! Die Werte springen ewig zwischen $1$ und $-1$ hin und her. Es gibt keinen eindeutigen Grenzwert $a$.",
  'euler': "Die Euler-Folge. Sie beschreibt kontinuierliches Wachstum und konvergiert gegen die Eulersche Zahl $e \\approx 2.718$.",
  'sin_damp': "Eine klassische gedämpfte Schwingung. Der Sinus lässt die Werte pendeln, aber die Division durch $n$ zwingt die Amplitude unweigerlich auf $0$.",
  'n_sq': "Divergenz ins Unendliche. Die Werte wachsen quadratisch an ($n^2$) und entziehen sich jedem noch so großen Schwellenwert.",

  'harm': "Die berühmte Harmonische Reihe ist DIVERGENT! Obwohl die einzelnen Glieder ($\\frac{1}{k}$) gegen Null gehen, tun sie das zu langsam. Die Fläche summiert sich auf $\\infty$.",
  'harm_alt': "Anders als die normale harmonische Reihe KONVERGIERT diese. Durch den Vorzeichenwechsel zieht jeder zweite Term wieder etwas ab (Grenzwert $S \\approx \\ln(2)$).",
  'geom_reihe': "Diese Reihe konvergiert NUR streng für $|q| < 1$. Sobald $q=1$ ist ($1+1+1+\\dots$), schießt die Reihe ins $\\infty$ ab.",
  'basel': "Das Basel-Problem! Im Gegensatz zu $\\frac{1}{k}$ schrumpfen die Quadrate $\\frac{1}{k^2}$ rasant schnell. Die Addition bleibt bei einer festen Zahl stehen ($\\frac{\\pi^2}{6}$).",
  'euler_e': "Die unendliche Reihe der Fakultäten konvergiert extrem schnell gegen die Eulersche Zahl $e$.",
  'teleskop': "Eine Teleskopreihe. Die inneren Terme heben sich gegenseitig auf, sodass am Ende nur der allererste Term ($1$) als Grenzwert übrig bleibt.",

  'p_geom': "Die blaue Kurve passt sich der grauen Funktion NUR im Intervall von $x=-1$ bis $x=1$ an. Das ist der Konvergenzradius $R=1$!",
  'p_exp': "Das Polynom hat einen Konvergenzradius von $R=\\infty$! Je größer $N$, desto besser passt es weltweit.",
  'p_sin': "Die Taylorreihe des Sinus verwendet nur ungerade Potenzen ($x, x^3, x^5$).",
  'p_ln': "Die Logarithmus-Reihe konvergiert extrem langsam und ist nur im Bereich von $(-1, 1]$ definiert.",

  'i_quad': "Das Integral einer Parabel berechnet die Fläche unter der Kurve. Der Flächeninhalt wächst kubisch (hoch 3). Die Riemann-Rechtecke nähern sich dieser exakten Fläche an.",
  'i_sin': "Die Fläche unter einem Sinus-Bogen. Integriert man von $0$ bis $\\pi$, ergibt sich exakt eine Fläche von $2$. Geht man weiter bis $2\\pi$, hebt sich die Fläche zu $0$ auf.",
  'i_exp': "Die Exponentialfunktion ist faszinierend: Sie ist ihre eigene Ableitung und ihr eigenes Integral! Die Fläche unter ihr wächst exponentiell.",
  'i_sqrt': "Die Wurzelfunktion steigt anfangs steil an und flacht dann ab. Die integrierte Fläche wächst entsprechend sanfter als bei der Parabel.",

  'f_quad': "Eine perfekte, glatte Kurve. Überall stetig, überall differenzierbar, lokal Lipschitz-stetig.",
  'f_sin': "Eine harmonische Welle. Sie ist überall stetig, unendlich oft differenzierbar und GLOBAL Lipschitz-stetig.",
  'f_abs': "**ACHTUNG KNICK!** Überall stetig, aber bei Null NICHT DIFFERENZIERBAR! Die Sekante springt von $-1$ auf $+1$. Sie ist jedoch global Lipschitz-stetig.",
  'f_sprung': "**ACHTUNG RISS!** Unstetig bei Null. Da sie reißt, ist sie dort logischerweise auch nicht differenzierbar und niemals Lipschitz-stetig.",
  'f_bruch': "**ACHTUNG ASYMPTOTE!** In der Null existiert die Funktion nicht. Der Graph flieht nach $\\pm\\infty$.",
  'f_sqrt': "**ACHTUNG STEILHEIT!** Bei Null ist die Funktion stetig. Sie ist dort jedoch NICHT DIFFERENZIERBAR (die Tangente steht senkrecht, Steigung $\\infty$). Wegen dieser unendlichen Steigung existiert in der Nähe von $0$ auch KEINE Lipschitz-Konstante $L$, die den Graphen einfangen könnte!",
  'f_sin_1_x': "Ein spannender Grenzfall: Die Funktion ist stetig (da die Amplitude gegen $0$ drückt), pendelt aber in der Nähe der Null unendlich oft hin und her. Sie ist dort nicht differenzierbar!"
};

const DEFINITIONS = {
  'folge': {
    title: "Definition: Konvergenz einer Folge ($\\varepsilon$-Kriterium)",
    math: "$$ \\forall \\varepsilon > 0 \\quad \\exists N \\in \\mathbb{N} : \\forall n \\ge N \\implies | x_n - a | < \\varepsilon $$",
    text: "Zu jeder (noch so kleinen) Fehlerschranke $\\varepsilon$ gibt es einen Index $N$, ab dem alle weiteren Folgenglieder im Schlauch um den Grenzwert $a$ liegen."
  },
  'reihe': {
    title: "Definition: Konvergenz einer Reihe (Partialsummen!)",
    math: "$$ S = \\lim_{n \\to \\infty} S_n \\quad \\text{mit} \\quad S_n = \\sum_{k=1}^n a_k $$",
    text: "WICHTIG: Eine unendliche Reihe konvergiert, wenn die Folge ihrer aufsummierten Partialsummen $S_n$ konvergiert. Der $\\varepsilon$-Schlauch umschließt den Zielwert $S$. Er gilt für die blaue Partialsummen-Linie, NICHT für die einzelnen Glieder $a_k$!"
  },
  'potenzreihe': {
    title: "Definition: Potenzreihe & Taylorpolynom",
    math: "$$ f(x) = \\sum_{k=0}^\\infty c_k (x - x_0)^k $$",
    text: "Eine Funktion wird als unendliches Polynom angenähert. Dies funktioniert nur im sogenannten Konvergenzradius $R$ um das Zentrum $x_0$."
  },
  'integral': {
    title: "Definition: Riemann-Integral",
    math: "$$ \\int_a^b f(x) \\, dx = \\lim_{N \\to \\infty} \\sum_{i=1}^N f(x_i^*) \\Delta x $$",
    text: "Das Integral entspricht dem exakten Flächeninhalt unter der Kurve. Die Riemann-Summe nähert diesen durch die Aufsummierung von $N$ unendlich schmaler Rechtecke an."
  },
  'stetigkeit': {
    title: "Definition: $\\varepsilon$-$\\delta$-Stetigkeit",
    math: "$$ \\forall \\varepsilon > 0 \\quad \\exists \\delta > 0 : |z - z_*| < \\delta \\implies |f(z) - f(z_*)| < \\varepsilon $$",
    text: "Eine Funktion ist an der Stelle $z_*$ stetig, wenn wir zu jedem $\\varepsilon$-Schlauch ein $\\delta$-Fenster finden können, sodass der Graph das Rechteck nicht verlässt."
  },
  'lipschitz': {
    title: "Definition: Lipschitz-Stetigkeit",
    math: "$$ \\exists L > 0 : \\forall x, y \\in D \\implies |f(x) - f(y)| \\le L \\cdot |x - y| $$",
    text: "Die Steigung (Sekante) zwischen zwei beliebigen Punkten darf niemals die Lipschitz-Konstante $L$ überschreiten. Der Graph muss in einen Doppel-Kegel passen."
  },
  'ableitung': {
    title: "Definition: Differentialquotient",
    math: "$$ f'(x_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h) - f(x_0)}{h} $$",
    text: "Die Ableitung ist der Grenzwert der Sekantensteigung, wenn sich der Abstand $h$ der beiden Punkte auf der $x$-Achse der Null nähert."
  }
};

// --- Robuster Text- und Mathe-Parser ---
const TextWithMath = ({ text, katexReady }) => {
  if (!text) return null;
  const parts = text.split(/(\$.*?\$)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          if (katexReady && window.katex) {
            try {
              return <span key={i} dangerouslySetInnerHTML={{ __html: window.katex.renderToString(math, { throwOnError: false }) }} />;
            } catch (e) {
              return <span key={i}>{math}</span>;
            }
          }
          return <span key={i} className="font-serif italic">{math}</span>;
        }

        const textParts = part.split(/(\*\*.*?\*\*)/g);
        return (
          <span key={i}>
            {textParts.map((tPart, j) => {
              if (tPart.startsWith('**') && tPart.endsWith('**') && tPart.length >= 4) {
                return <strong key={j} className="font-bold text-slate-900">{tPart.slice(2, -2)}</strong>;
              }
              return <span key={j}>{tPart}</span>;
            })}
          </span>
        );
      })}
    </>
  );
};

const BlockMath = ({ tex, katexReady }) => {
  if (!tex) return null;
  const mathStr = tex.replace(/\$\$/g, '').replace(/\$/g, '');
  if (!katexReady || !window.katex) return <div className="font-serif italic text-xl text-center w-full">{mathStr}</div>;
  try {
    return <div className="w-full flex justify-center text-xl" dangerouslySetInnerHTML={{ __html: window.katex.renderToString(mathStr, { displayMode: true, throwOnError: false }) }} />;
  } catch (e) {
    return <div className="font-serif italic text-xl text-center w-full">{mathStr}</div>;
  }
};

// SVG Mathe Renderer 
const SvgMath = ({ x, y, width = 100, height = 40, tex, color, anchor = "middle", bold = false, katexReady }) => {
  if (!tex) return null;
  let fX = x;
  if (anchor === "middle") fX = x - width / 2;
  if (anchor === "end") fX = x - width;

  const style = {
    color: color,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: anchor === 'middle' ? 'center' : (anchor === 'end' ? 'flex-end' : 'flex-start'),
    fontWeight: bold ? 'bold' : 'normal',
    fontSize: '14px'
  };

  const cleanTex = typeof tex === 'string' ? tex.replace(/\$/g, '') : tex;

  return (
    <foreignObject x={fX} y={y} width={width} height={height} overflow="visible">
      <div style={style} xmlns="http://www.w3.org/1999/xhtml">
        {katexReady && window.katex ? (
          <span dangerouslySetInnerHTML={{ __html: window.katex.renderToString(cleanTex, { throwOnError: false }) }} />
        ) : (
          <span className="font-serif italic">{cleanTex}</span>
        )}
      </div>
    </foreignObject>
  );
};

const Slider = ({ label, val, min, max, step, setFn, katexReady }) => (
  <div className="flex flex-col flex-1 min-w-[140px] px-3 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
    <div className="flex justify-between text-xs mb-2">
      <span className="font-bold text-slate-700"><TextWithMath text={label} katexReady={katexReady} /></span>
      <span className="text-indigo-700 font-mono bg-indigo-50 px-1.5 py-0.5 rounded font-bold">{val.toFixed(step < 1 ? 2 : 0)}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={val}
      onChange={(e) => setFn(parseFloat(e.target.value))}
      className="w-full cursor-pointer accent-indigo-600 bg-slate-200 rounded-lg"
    />
  </div>
);

export default function App() {
  // Reihenfolge der Reiter wie gefordert
  const [mode, setMode] = useState('folge');
  const [domainMode, setDomainMode] = useState('reell');
  const [activeId, setActiveId] = useState('null_1');
  const [katexReady, setKatexReady] = useState(false);

  const [epsilon, setEpsilon] = useState(0.4);
  const [qParam, setQParam] = useState(0.85);
  const [aParam, setAParam] = useState(2.0);
  const [nMax, setNMax] = useState(15);
  const [x0, setX0] = useState(1.5);
  const [delta, setDelta] = useState(0.5);
  const [hParam, setHParam] = useState(1.0);
  const [lParam, setLParam] = useState(1.5);
  const [bottomTab, setBottomTab] = useState('calc');
  const [sumType, setSumType] = useState('mid'); // 'mid', 'lower', 'upper'

  useEffect(() => {
    if (window.katex) {
      setKatexReady(true);
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
    script.onload = () => setKatexReady(true);
    document.head.appendChild(script);
  }, []);

  const comp = useMemo(() => {
    let result = {
      isDiscrete: mode === 'folge' || mode === 'reihe',
      isPower: mode === 'potenzreihe',
      isIntegral: mode === 'integral',
      model: null, data: [], limit: null, limitText: "Divergent",
      X_MIN: 0, X_MAX: 10, Y_MIN: -5, Y_MAX: 5,
      nEpsilon: null, deltaOk: true, lipschitzOk: true, secantPts: null, tangentPts: null, mSec: null, mTan: null,
      valAtTarget: null, termAtTarget: null, cPlot: null,
      rects: [], lowerRects: [], upperRects: [], riemannSum: null, lowerSum: null, upperSum: null
    };

    let modelsArray = FUNKTIONEN;
    if (mode === 'folge') modelsArray = FOLGEN;
    else if (mode === 'reihe') modelsArray = REIHEN;
    else if (mode === 'potenzreihe') modelsArray = POTENZREIHEN;
    else if (mode === 'integral') modelsArray = INTEGRALE;

    result.model = modelsArray.find(m => m.id === activeId) || modelsArray[0];

    // === KOMPLEXE LOGIK ===
    if (domainMode === 'komplex') {
      const C_Y_RANGE = mode === 'potenzreihe' ? 2.5 : 2;
      const aspect = 1000 / 450;
      result.X_MIN = -C_Y_RANGE * aspect; result.X_MAX = C_Y_RANGE * aspect;
      result.Y_MIN = -C_Y_RANGE; result.Y_MAX = C_Y_RANGE;

      let cPlot = { points: [], paths: [], limit: null, limitRadius: epsilon, nEpsilon: null };
      const phi = 0.5;
      const qC = { r: qParam * Math.cos(phi), i: qParam * Math.sin(phi) };

      if (mode === 'folge') {
        cPlot.limit = { r: 0, i: 0 };
        if (qParam >= 1) cPlot.limit = null;
        let curr = { r: 1, i: 0 };
        for (let i = 1; i <= nMax; i++) {
          curr = cMult(curr, qC); cPlot.points.push({ n: i, ...curr });
        }
        if (cPlot.limit) {
          result.limitText = "$0 + 0i$";
          for (let i = nMax - 1; i >= 0; i--) {
            if (cAbs(cPlot.points[i]) >= epsilon) { cPlot.nEpsilon = i + 2; break; }
          }
          if (cPlot.nEpsilon > nMax) cPlot.nEpsilon = null;
          if (cPlot.nEpsilon === null && cPlot.points.length > 0 && cAbs(cPlot.points[0]) < epsilon) cPlot.nEpsilon = 1;
          result.nEpsilon = cPlot.nEpsilon;
        }
      } else if (mode === 'reihe') {
        const denomR = 1 - qC.r; const denomI = -qC.i; const denomSq = denomR * denomR + denomI * denomI;
        if (qParam < 1 && denomSq !== 0) {
          cPlot.limit = { r: denomR / denomSq, i: -denomI / denomSq };
          result.limitText = `$${cPlot.limit.r.toFixed(2)} ${cPlot.limit.i >= 0 ? '+' : '-'} ${Math.abs(cPlot.limit.i).toFixed(2)}i$`;
        } else cPlot.limit = null;

        let sum = { r: 0, i: 0 }; let term = { r: 1, i: 0 };
        for (let i = 1; i <= nMax; i++) {
          term = cMult(term, qC); sum = cAdd(sum, term); cPlot.points.push({ n: i, ...sum });
        }
      } else if (mode === 'potenzreihe') {
        const z0 = { r: x0, i: 0.5 }; cPlot.targetZ = z0;
        const dR = 1 - z0.r; const dI = -z0.i; const dSq = dR * dR + dI * dI;
        if (dSq !== 0) {
          cPlot.limit = { r: dR / dSq, i: -dI / dSq };
          result.limitText = `$${cPlot.limit.r.toFixed(2)} ${cPlot.limit.i >= 0 ? '+' : '-'} ${Math.abs(cPlot.limit.i).toFixed(2)}i$`;
        }
        let sum = { r: 1, i: 0 }; let term = { r: 1, i: 0 };
        cPlot.points.push({ n: 0, ...sum });
        for (let i = 1; i <= nMax; i++) {
          term = cMult(term, z0); sum = cAdd(sum, term); cPlot.points.push({ n: i, ...sum });
        }
      } else if (mode === 'integral') {
        cPlot.limit = null;
        result.limitText = `\\int_\\gamma f(z) \\, dz`;
        let pathPts = [];
        for (let i = 0; i <= nMax; i++) {
          let t = (i / nMax) * Math.PI;
          pathPts.push({ r: x0 * Math.cos(t), i: x0 * Math.sin(t) });
        }
        cPlot.points = pathPts;
      } else {
        cPlot.z0 = { r: x0, i: 0.5 }; cPlot.delta = delta;
        cPlot.scale = 2 * cAbs(cPlot.z0); cPlot.angle = Math.atan2(cPlot.z0.i, cPlot.z0.r);
        result.limitText = `\\mathbb{C}\\text{-Ebene}`;
      }
      result.cPlot = cPlot;
      return result;
    }

    // === REELLE LOGIK === 
    if (result.isDiscrete) {
      result.limit = typeof result.model.limit === 'function' ? result.model.limit(qParam, aParam) : result.model.limit;
      if (result.limit !== null && result.limit !== undefined && !isNaN(result.limit)) {
        result.limitText = `$${result.limit.toFixed(4)}$`;
      }

      let sum = 0;
      for (let i = 1; i <= nMax; i++) {
        if (mode === 'folge') {
          const val = result.model.calc(i, qParam, aParam); result.data.push({ n: i, val });
          if (i === nMax) result.valAtTarget = val;
        } else {
          const term = result.model.calcTerm(i, qParam, aParam); sum += term; result.data.push({ n: i, val: sum, term });
          if (i === nMax) { result.valAtTarget = sum; result.termAtTarget = term; }
        }
      }

      if (result.limit !== null && result.limit !== undefined && !isNaN(result.limit)) {
        for (let i = nMax - 1; i >= 0; i--) {
          if (Math.abs(result.data[i].val - result.limit) >= epsilon) { result.nEpsilon = i + 2; break; }
        }
        if (result.nEpsilon > nMax) result.nEpsilon = null;
        if (result.nEpsilon === null && result.data.length > 0 && Math.abs(result.data[0].val - result.limit) < epsilon) result.nEpsilon = 1;
      }

      let yValues = result.data.map(d => d.val).filter(v => !isNaN(v));
      if (result.limit !== null && result.limit !== undefined && !isNaN(result.limit)) {
        yValues.push(result.limit + epsilon * 1.5, result.limit - epsilon * 1.5);
      }
      const padding = (Math.max(...yValues) - Math.min(...yValues)) * 0.1 || 1;
      result.X_MIN = 1; result.X_MAX = nMax;
      result.Y_MIN = Math.min(...yValues) - padding; result.Y_MAX = Math.max(...yValues) + padding;

    } else if (result.isIntegral) {
      const a = 0;
      const b = Math.abs(x0) < 0.001 ? 0.001 : x0;

      result.X_MIN = Math.min(-1, b - 1);
      result.X_MAX = Math.max(3, b + 1);

      // Exact Integral
      const exact = result.model.F(b) - result.model.F(a);
      result.limit = exact;
      result.limitText = !isNaN(exact) ? `$${exact.toFixed(4)}$` : "Undefiniert";

      // Riemann Summen: Unter-, Mittel- und Obersumme berechnen
      const N = nMax;
      const dx = (b - a) / N;
      let riemannSum = 0, lowerSum = 0, upperSum = 0;

      for (let i = 0; i < N; i++) {
        const x_left = a + i * dx;
        const x_right = a + (i + 1) * dx;
        const x_mid = a + (i + 0.5) * dx;

        const y_mid = result.model.f(x_mid);
        const y_left = result.model.f(x_left);
        const y_right = result.model.f(x_right);

        // Annäherung für das Minimum und Maximum im Intervall
        const y_min = Math.min(y_left, y_right, y_mid);
        const y_max = Math.max(y_left, y_right, y_mid);

        if (!isNaN(y_mid)) {
          riemannSum += y_mid * dx;
          lowerSum += y_min * dx;
          upperSum += y_max * dx;

          const rx = dx > 0 ? x_left : x_right;
          result.rects.push({ x: rx, y: y_mid, w: Math.abs(dx) });
          result.lowerRects.push({ x: rx, y: y_min, w: Math.abs(dx) });
          result.upperRects.push({ x: rx, y: y_max, w: Math.abs(dx) });
        }
      }
      result.riemannSum = riemannSum;
      result.lowerSum = lowerSum;
      result.upperSum = upperSum;

      // Curve data
      let rawYMin = 0, rawYMax = 0;
      for (let i = 0; i <= 200; i++) {
        const x = result.X_MIN + (result.X_MAX - result.X_MIN) * (i / 200);
        const y = result.model.f(x);
        result.data.push({ x, y });
        if (!isNaN(y) && isFinite(y)) {
          rawYMin = Math.min(rawYMin, y, 0);
          rawYMax = Math.max(rawYMax, y, 0);
        }
      }
      const yPad = (rawYMax - rawYMin) * 0.2 || 1;
      result.Y_MIN = rawYMin - yPad; result.Y_MAX = rawYMax + yPad;

    } else if (result.isPower) {
      result.X_MIN = (activeId === 'p_geom' || activeId === 'p_ln') ? -1.5 : -3;
      result.X_MAX = (activeId === 'p_geom' || activeId === 'p_ln') ? 1.5 : 3;
      if (activeId === 'p_ln') { result.X_MIN = -0.9; result.X_MAX = 2.5; }

      let rawYMin = 0, rawYMax = 0;
      for (let i = 0; i <= 200; i++) {
        const x = result.X_MIN + (result.X_MAX - result.X_MIN) * (i / 200);
        const yTarget = result.model.target(x);
        let yApprox = 0;
        for (let k = activeId === 'p_ln' ? 1 : 0; k <= nMax; k++) { yApprox += result.model.term(x, k); }
        result.data.push({ x, yTarget, yApprox });
        if (!isNaN(yTarget) && isFinite(yTarget) && Math.abs(yTarget) < 20) {
          rawYMin = Math.min(rawYMin, yTarget, yApprox > -20 ? yApprox : 0);
          rawYMax = Math.max(rawYMax, yTarget, yApprox < 20 ? yApprox : 0);
        }
      }
      result.Y_MIN = Math.max(-10, rawYMin - 1); result.Y_MAX = Math.min(10, rawYMax + 1);

    } else {
      result.X_MIN = -3; result.X_MAX = 3;
      if (activeId === 'f_sqrt') { result.X_MIN = -0.5; result.X_MAX = 4; }

      let rawYMin = 0, rawYMax = 0;
      let initFound = false;
      for (let i = 0; i <= 200; i++) {
        const x = result.X_MIN + (result.X_MAX - result.X_MIN) * (i / 200);
        const y = result.model.f(x, aParam);
        result.data.push({ x, y });
        if (!isNaN(y) && isFinite(y)) {
          if (!initFound) { rawYMin = rawYMax = y; initFound = true; }
          rawYMin = Math.min(rawYMin, y); rawYMax = Math.max(rawYMax, y);
        }
      }
      rawYMin = Math.max(-10, rawYMin); rawYMax = Math.min(10, rawYMax);

      const L = result.model.f(x0, aParam);
      result.limit = L;
      result.limitText = (!isNaN(result.limit) && result.limit !== null) ? `$${result.limit.toFixed(4)}$` : "Undefiniert";

      if ((mode === 'stetigkeit' || mode === 'lipschitz') && !isNaN(L) && L !== null) {
        rawYMin = Math.min(rawYMin, L - epsilon * 1.5);
        rawYMax = Math.max(rawYMax, L + epsilon * 1.5);
        if (mode === 'lipschitz') {
          rawYMin = Math.min(rawYMin, L - lParam * 2);
          rawYMax = Math.max(rawYMax, L + lParam * 2);
        }
      }
      result.Y_MIN = rawYMin - ((rawYMax - rawYMin) * 0.2 || 1);
      result.Y_MAX = rawYMax + ((rawYMax - rawYMin) * 0.2 || 1);

      if (mode === 'stetigkeit' && !isNaN(result.limit) && result.limit !== null) {
        for (let pt of result.data) {
          if (pt.x >= x0 - delta && pt.x <= x0 + delta && !isNaN(pt.y) && Math.abs(pt.y - result.limit) >= epsilon) { result.deltaOk = false; break; }
        }
      }

      if (mode === 'lipschitz' && !isNaN(result.limit) && result.limit !== null) {
        for (let pt of result.data) {
          if (!isNaN(pt.y) && Math.abs(pt.y - result.limit) > lParam * Math.abs(pt.x - x0) + 0.01) {
            result.lipschitzOk = false; break;
          }
        }
      }

      if (mode === 'ableitung' && !isNaN(result.limit) && result.limit !== null) {
        const safeH = hParam === 0 ? 0.0001 : hParam;
        const y2 = result.model.f(x0 + safeH, aParam);
        if (!isNaN(y2)) {
          result.mSec = (y2 - result.limit) / safeH;
          result.secantPts = [{ x: result.X_MIN, y: result.mSec * (result.X_MIN - x0) + result.limit }, { x: result.X_MAX, y: result.mSec * (result.X_MAX - x0) + result.limit }];
        }
        result.mTan = result.model.df(x0, aParam);
        if (!isNaN(result.mTan)) {
          result.tangentPts = [{ x: result.X_MIN, y: result.mTan * (result.X_MIN - x0) + result.limit }, { x: result.X_MAX, y: result.mTan * (result.X_MAX - x0) + result.limit }];
        }
      }
    }
    return result;
  }, [mode, activeId, epsilon, qParam, aParam, nMax, x0, delta, hParam, lParam, domainMode]);

  const W = 1000, H = 450, PL = 130, PR = 80, PT = 40, PB = 50;
  const scaleX = (val) => PL + ((val - comp.X_MIN) / (comp.X_MAX - comp.X_MIN || 1)) * (W - PL - PR);
  const scaleY = (y) => H - PB - ((y - comp.Y_MIN) / (comp.Y_MAX - comp.Y_MIN || 1)) * (H - PT - PB);

  let xAxisY = scaleY(0);
  if (comp.Y_MIN > 0) xAxisY = H - PB;
  if (comp.Y_MAX < 0) xAxisY = PT;

  let yAxisX = scaleX(0);
  if (comp.X_MIN > 0) yAxisX = PL;
  if (comp.X_MAX < 0) yAxisX = W - PR;

  const xLabel = comp.isDiscrete ? "$n$" : (domainMode === 'komplex' ? "$\\text{Re}(z)$" : (mode === 'stetigkeit' ? "$z_*$" : "$x$"));
  const yLabel = comp.isDiscrete ? (mode === 'folge' ? "$x_n$" : "$S_n$") : (domainMode === 'komplex' ? "$\\text{Im}(z)$" : (mode === 'potenzreihe' ? "$S_N(x)$" : (mode === 'integral' ? "$f(x)$" : (mode === 'stetigkeit' ? "$f(z_*)$" : "$f(x)$"))));

  const getContinuousPaths = (dataKey) => {
    if (comp.data.length === 0) return [];
    let paths = [];
    let curr = "";
    for (let i = 0; i < comp.data.length; i++) {
      const yVal = comp.data[i][dataKey];
      if (isNaN(yVal)) {
        if (curr !== "") { paths.push(curr); curr = ""; }
        continue;
      }
      const xPos = scaleX(comp.data[i].x);
      const yPos = scaleY(yVal);
      if (curr === "") {
        curr = `M ${xPos},${yPos}`;
      } else {
        const prevY = comp.data[i - 1][dataKey];
        if (!isNaN(prevY) && Math.abs(yVal - prevY) > (comp.Y_MAX - comp.Y_MIN) * 0.5) {
          paths.push(curr);
          curr = `M ${xPos},${yPos}`;
        } else {
          curr += ` L ${xPos},${yPos}`;
        }
      }
    }
    if (curr !== "") paths.push(curr);
    return paths;
  };

  const handleMode = (m) => {
    setMode(m);
    if (m === 'folge') setActiveId('null_1');
    if (m === 'reihe') setActiveId('harm');
    if (m === 'potenzreihe') setActiveId('p_exp');
    if (m === 'integral') setActiveId('i_quad');
    if (m === 'stetigkeit' || m === 'lipschitz' || m === 'ableitung') setActiveId('f_quad');
  };

  // --- SHORT EVALUATION FOR GRAPH BADGE ---
  const getShortEvaluation = () => {
    if (domainMode === 'komplex') return { text: "Komplexe Ebene aktiv", type: "info" };

    if (mode === 'folge') {
      if (comp.limit === null) return { text: "Divergent", type: "error" };
      if (comp.nEpsilon) return { text: "Konvergent", type: "success" };
      return { text: "Konvergent (Bedingung aktuell verletzt)", type: "warning" };
    }
    if (mode === 'reihe') {
      if (comp.limit === null) return { text: "Divergent", type: "error" };
      return { text: "Konvergent", type: "success" };
    }
    if (mode === 'potenzreihe') {
      if (activeId === 'p_geom' || activeId === 'p_ln') return { text: "Lokal konvergent ($R=1$)", type: "warning" };
      return { text: "Global konvergent ($R=\\infty$)", type: "success" };
    }
    if (mode === 'integral') {
      if (isNaN(comp.limit)) return { text: "Fläche undefiniert", type: "error" };

      let sumVal = sumType === 'upper' ? comp.upperSum : (sumType === 'lower' ? comp.lowerSum : comp.riemannSum);
      const err = Math.abs(comp.limit - sumVal);
      const label = sumType === 'upper' ? "Obersumme" : (sumType === 'lower' ? "Untersumme" : "Mittelsumme");

      if (err < 0.05) return { text: `${label} (Fehler: ${err.toFixed(3)})`, type: "success" };
      return { text: `${label} (Fehler: ${err.toFixed(3)})`, type: "warning" };
    }
    if (mode === 'stetigkeit') {
      if (isNaN(comp.limit) || comp.limit === null) return { text: "Nicht definiert (Unstetig)", type: "error" };
      if (activeId === 'f_sprung' && x0 === 0) return { text: "Unstetig an dieser Stelle", type: "error" };
      if (comp.deltaOk) return { text: "Stetig an dieser Stelle", type: "success" };
      return { text: "Bedingung nicht erfüllt", type: "warning" };
    }
    if (mode === 'lipschitz') {
      if (isNaN(comp.limit) || comp.limit === null) return { text: "Nicht definiert", type: "error" };
      if (activeId === 'f_sprung' && x0 === 0) return { text: "Nicht Lipschitz-stetig", type: "error" };
      if (activeId === 'f_sqrt' && x0 === 0) return { text: "Nicht lokal Lipschitz-stetig", type: "error" };
      if (comp.lipschitzOk) return { text: "Lokal Lipschitz-stetig", type: "success" };
      return { text: "Lipschitz-Bedingung verletzt", type: "warning" };
    }
    if (mode === 'ableitung') {
      if (isNaN(comp.limit) || comp.limit === null) return { text: "Nicht definiert", type: "error" };
      if ((activeId === 'f_abs' || activeId === 'f_sqrt' || activeId === 'f_sprung') && x0 === 0) {
        return { text: "Nicht differenzierbar", type: "error" };
      }
      return { text: "Differenzierbar", type: "success" };
    }
    return { text: "", type: "info" };
  };

  const getDynamicEvaluation = () => {
    if (domainMode === 'komplex') {
      if (mode === 'integral') return "**Kurvenintegral in $\\mathbb{C}$:** Statt Flächen unter Kurven summieren wir komplexe Funktionswerte entlang eines Integrationswegs $\\gamma$. Ist die Funktion holomorph und der Weg geschlossen, ist das Integral oft exakt $0$ (Cauchyscher Integralsatz)!";
      return "**Hinweis:** Im komplexen Modus ($\\mathbb{C}$) gelten strengere Regeln. Beobachte die visuelle Transformation in der Gaußschen Ebene.";
    }

    if (mode === 'folge') {
      if (comp.limit === null) return `**Divergent:** Die Folge divergiert und besitzt keinen Grenzwert. Ein $\\varepsilon$-Schlauch kann die Werte für $n \\to \\infty$ niemals alle einfangen.`;
      if (comp.nEpsilon) return `**Konvergenz-Bedingung erfüllt:** Ab dem Index $N = ${comp.nEpsilon}$ verlassen die Werte den Schlauch $[${(comp.limit - epsilon).toFixed(2)}, ${(comp.limit + epsilon).toFixed(2)}]$ um den Grenzwert $a=${comp.limit}$ nie wieder.`;
      return `**Konvergenz-Bedingung aktuell nicht erfüllt:** In den ersten $N = ${nMax}$ Punkten springen die Werte noch aus dem Schlauch heraus. Erhöhe $N$ oder wähle ein größeres $\\varepsilon$!`;
    }

    if (mode === 'reihe') {
      if (comp.limit === null) return `**Divergent:** Die Reihe besitzt keinen endlichen Grenzwert! Addiert man unendlich viele Terme, wächst die aufsummierte Reihe ins Unermessliche (oder pendelt).`;
      return `**Konvergent:** Die **Partialsummen $S_n$** (blaue Linie) nähern sich dem Gesamtwert $S = ${comp.limitText}$ an. Der $\\varepsilon$-Schlauch prüft, ab wann die *aufsummierte* Fläche den Toleranzbereich nicht mehr verlässt!`;
    }

    if (mode === 'potenzreihe') {
      if (activeId === 'p_geom' || activeId === 'p_ln') return `**Lokal konvergent (Radius $R=1$):** Nur für $x \\in (-1, 1)$ schmiegt sich das Polynom an die Funktion an. Außerhalb reißt es brutal ab und divergiert!`;
      return `**Global konvergent (Radius $R=\\infty$):** Egal welches $x$ du wählst, wenn du den Grad $N$ groß genug machst, wird das Polynom die Funktion überall perfekt kopieren.`;
    }

    if (mode === 'integral') {
      if (isNaN(comp.limit)) return `**Undefiniert:** Das Integral kann mit diesen Grenzen nicht berechnet werden (Definitionslücke).`;

      let sumStr = "";
      if (sumType === 'lower') sumStr = `Die **Untersumme** schätzt die Fläche durch den niedrigsten Wert in jedem Intervall ab ($U_N = ${comp.lowerSum.toFixed(4)}$). Sie ist stets kleiner oder gleich der exakten Fläche.`;
      else if (sumType === 'upper') sumStr = `Die **Obersumme** schätzt die Fläche durch den höchsten Wert in jedem Intervall ab ($O_N = ${comp.upperSum.toFixed(4)}$). Sie ist stets größer oder gleich der exakten Fläche.`;
      else sumStr = `Die **Mittelsumme** nutzt den Funktionswert in der Intervallmitte ($R_N = ${comp.riemannSum.toFixed(4)}$) und liefert meist die beste und neutralste Näherung.`;

      return `**Riemann-Integral:** Die exakte Fläche unter der Kurve beträgt $I = ${comp.limit.toFixed(4)}$. ${sumStr} Der Fehler wird stetig kleiner, je mehr Rechtecke du wählst!`;
    }

    if (mode === 'stetigkeit') {
      if (isNaN(comp.limit) || comp.limit === null) return `**Nicht definiert (unstetig):** An der Stelle $z_* = ${x0.toFixed(2)}$ ist die Funktion gar nicht definiert (z.B. Polstelle)! Sie kann hier nicht stetig sein.`;
      if (activeId === 'f_sprung' && x0 === 0) return `**Unstetig an dieser Stelle!** Hier liegt ein Sprung vor! Egal wie klein du $\\delta$ machst, für ein kleines $\\varepsilon$ bricht der Graph IMMER aus dem Rechteck aus. Beweis für Unstetigkeit!`;
      if (comp.deltaOk) return `**Stetigkeits-Bedingung erfüllt:** Für das gewählte $\\varepsilon=${epsilon.toFixed(2)}$ und $\\delta=${delta.toFixed(2)}$ bleibt der Graph brav innerhalb des Rechtecks. Dies ist die Voraussetzung für Stetigkeit an $z_*=${x0.toFixed(2)}$.`;
      return `**Stetigkeits-Bedingung nicht erfüllt:** Der Graph bricht oben oder unten aus dem Rechteck aus! Das gewählte $\\delta=${delta.toFixed(2)}$ ist noch zu groß, um die Funktion im $\\varepsilon$-Schlauch zu halten.`;
    }

    if (mode === 'lipschitz') {
      if (isNaN(comp.limit) || comp.limit === null) return `**Nicht definiert:** Ohne Funktionswert kann keine Lipschitz-Stetigkeit geprüft werden.`;
      if (activeId === 'f_sprung' && x0 === 0) return `**Nicht Lipschitz-stetig!** Die Funktion ist hier unstetig, also erst recht niemals Lipschitz-stetig!`;
      if (activeId === 'f_sqrt' && x0 === 0) return `**Nicht lokal Lipschitz-stetig!** Die Tangente steht bei $x=0$ senkrecht (Steigung $\\infty$). Egal wie groß du $L$ wählst, der Graph wird den Kegel bei $x=0$ immer verlassen.`;
      if (comp.lipschitzOk) return `**Lipschitz-Bedingung erfüllt:** Der Graph bleibt im Kegel! Die lokale Steigung ist hier nirgendwo steiler als $L=${lParam.toFixed(2)}$.`;
      return `**Lipschitz-Bedingung verletzt:** Der Graph wächst oder fällt schneller als die Konstante $L=${lParam.toFixed(2)}$ es erlaubt und durchbricht die Kegelwände! Erhöhe $L$.`;
    }

    if (mode === 'ableitung') {
      if (isNaN(comp.limit) || comp.limit === null) return `**Nicht differenzierbar:** An dieser Stelle existiert nicht einmal ein Funktionswert.`;
      if (activeId === 'f_abs' && x0 === 0) return `**Nicht differenzierbar! (KNICK)** Die Steigung links ist $-1$, rechts ist $+1$. Eine eindeutige Tangente existiert nicht.`;
      if (activeId === 'f_sqrt' && x0 === 0) return `**Nicht im klassischen Sinne differenzierbar!** Die Ableitung strebt gegen $\\infty$ (senkrechte Tangente).`;
      if (activeId === 'f_sprung' && x0 === 0) return `**Nicht differenzierbar!** Die Funktion ist an dieser Stelle unstetig (Sprung).`;
      return `**Differenzierbar an dieser Stelle:** Die blaue Sekante hat die Steigung $m=${comp.mSec?.toFixed(3)}$. Wenn du $h$ gegen $0$ schiebst, wird sie zur roten Tangente mit der wahren Ableitung $f'(${x0.toFixed(2)}) = ${comp.mTan?.toFixed(3)}$.`;
    }

    return "";
  };

  const shortEval = getShortEvaluation();
  const typeColors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    error: 'bg-rose-50 border-rose-200 text-rose-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  };
  const TypeIcon = shortEval.type === 'success' ? CheckCircle : (shortEval.type === 'info' ? Info : AlertCircle);


  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col font-sans text-sm">

      {/* 1. HEADER */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-2">
          <Activity className="text-indigo-600" size={20} />
          <h1 className="font-bold text-slate-800 text-lg hidden sm:block">Analysis Explorer Pro</h1>
        </div>
        <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-lg border border-slate-200 gap-1.5">
          {['folge', 'reihe', 'potenzreihe', 'stetigkeit', 'lipschitz', 'ableitung', 'integral'].map(m => (
            <button key={m} onClick={() => handleMode(m)} className={`px-3 py-1.5 text-xs font-bold rounded-md capitalize transition-colors ${mode === m ? 'bg-white shadow-md text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}>
              {m === 'lipschitz' ? 'Lipschitz' : m}
            </button>
          ))}
        </div>
      </header>

      {/* 2. CONTROLS BAR */}
      <div className="bg-white border-b border-slate-200 p-4 shrink-0 shadow-sm z-10 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex bg-slate-200 p-1.5 rounded-xl w-full md:w-64 shrink-0">
            <button onClick={() => setDomainMode('reell')} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${domainMode === 'reell' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><TextWithMath text="$\mathbb{R}$ Reell (1D/2D)" katexReady={katexReady} /></button>
            <button onClick={() => setDomainMode('komplex')} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${domainMode === 'komplex' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-emerald-700'}`}><TextWithMath text="$\mathbb{C}$ Komplex (2D/3D)" katexReady={katexReady} /></button>
          </div>

          <div className="flex-1 w-full flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-slate-400 shrink-0" />
            {domainMode === 'reell' || mode === 'integral' ? (
              <select value={activeId} onChange={(e) => setActiveId(e.target.value)} className="w-full max-w-md bg-slate-50 border border-slate-300 text-slate-800 text-sm font-bold rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2 shadow-sm">
                {(mode === 'folge' ? FOLGEN : mode === 'reihe' ? REIHEN : mode === 'potenzreihe' ? POTENZREIHEN : mode === 'integral' ? INTEGRALE : FUNKTIONEN).map(m => <option key={m.id} value={m.id}>{m.name.replace(/\$/g, '')}</option>)}
              </select>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-2 rounded-lg text-xs w-full max-w-md flex items-center gap-2 font-medium">
                <Info size={16} className="shrink-0" /> <TextWithMath text="Repräsentatives Modell für $\mathbb{C}$" katexReady={katexReady} />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-end">
          {comp.model?.hasQ && <Slider label={domainMode === 'komplex' ? "Radius ($q$)" : "Basis ($q$)"} val={qParam} min={0.1} max={1.5} step={0.05} setFn={setQParam} katexReady={katexReady} />}
          {comp.model?.hasA && domainMode === 'reell' && <Slider label="Faktor ($a$)" val={aParam} min={0.5} max={5.0} step={0.5} setFn={setAParam} katexReady={katexReady} />}
          {(comp.isDiscrete || comp.isPower || mode === 'integral') && <Slider label={mode === 'integral' ? "Rechtecke ($N$)" : (comp.isPower ? "Grad ($N$)" : "Punkte ($N$)")} val={nMax} min={2} max={comp.isPower ? 30 : 60} step={1} setFn={setNMax} katexReady={katexReady} />}
          {(!comp.isDiscrete && !comp.isPower) && <Slider label={mode === 'integral' ? "Obergrenze ($b$)" : (domainMode === 'komplex' ? "Ziel ($z_0$)" : (mode === 'stetigkeit' ? "Ziel ($z_*$)" : "Ziel ($x_0$)"))} val={x0} min={-2.0} max={2.0} step={0.1} setFn={setX0} katexReady={katexReady} />}
          {(mode === 'folge' || mode === 'reihe' || mode === 'stetigkeit') && <Slider label="Toleranz ($\varepsilon$)" val={epsilon} min={0.1} max={2.0} step={0.1} setFn={setEpsilon} katexReady={katexReady} />}
          {mode === 'stetigkeit' && <Slider label="Umgebung ($\delta$)" val={delta} min={0.1} max={1.5} step={0.05} setFn={setDelta} katexReady={katexReady} />}
          {mode === 'lipschitz' && <Slider label="Konstante ($L$)" val={lParam} min={0.1} max={5.0} step={0.1} setFn={setLParam} katexReady={katexReady} />}
          {mode === 'ableitung' && domainMode === 'reell' && <Slider label="Schritt ($h$)" val={hParam} min={-2.0} max={2.0} step={0.05} setFn={setHParam} katexReady={katexReady} />}

          {mode === 'integral' && domainMode === 'reell' && (
            <div className="flex flex-col flex-1 min-w-[170px] px-3 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-bold text-slate-700">Art der Summe</span>
              </div>
              <div className="flex bg-slate-200 p-1 rounded-lg w-full">
                <button onClick={() => setSumType('lower')} className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${sumType === 'lower' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Unter</button>
                <button onClick={() => setSumType('mid')} className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${sumType === 'mid' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Mitte</button>
                <button onClick={() => setSumType('upper')} className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${sumType === 'upper' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Ober</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. RIESIGER GRAPH */}
      <main className="w-full shrink-0 relative bg-slate-100 p-2 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-5xl aspect-[21/9] max-h-[65vh] min-h-[400px] border border-slate-200 rounded-2xl shadow-xl relative overflow-hidden bg-white">

          <div className="absolute top-5 left-6 bg-white/90 backdrop-blur border border-slate-200 px-5 py-2.5 rounded-xl shadow-md z-10 flex flex-col gap-1">
            <span className="font-bold text-slate-800 text-base">
              {domainMode === 'komplex' && mode !== 'integral' ? `Komplexe Ebene (${mode})` : comp.model?.name.replace(/\$/g, '')}
            </span>
            {(domainMode === 'reell' || mode === 'integral') && <span className="font-serif text-indigo-700 font-bold tracking-wide text-sm"><TextWithMath text={comp.model?.formula} katexReady={katexReady} /></span>}
          </div>

          {/* DYNAMIC SHORT EVALUATION BADGE (TOP RIGHT) */}
          <div className={`absolute top-5 right-6 backdrop-blur border px-4 py-2.5 rounded-xl shadow-md z-10 flex items-center gap-2 font-bold text-sm ${typeColors[shortEval.type]}`}>
            <TypeIcon size={20} className="shrink-0" />
            <TextWithMath text={shortEval.text} katexReady={katexReady} />
          </div>

          <div className="w-full h-full p-2">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full overflow-visible">
              <defs>
                <marker id="axisArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" /></marker>
              </defs>

              <g opacity="0.3">
                {[...Array(11)].map((_, i) => {
                  const x = comp.X_MIN + (i / 10) * (comp.X_MAX - comp.X_MIN);
                  return <line key={`gx-${i}`} x1={scaleX(x)} y1={PT} x2={scaleX(x)} y2={H - PB} stroke="#cbd5e1" strokeWidth="1" />
                })}
                {[...Array(11)].map((_, i) => {
                  const y = comp.Y_MIN + (i / 10) * (comp.Y_MAX - comp.Y_MIN);
                  return <line key={`gy-${i}`} x1={PL} y1={scaleY(y)} x2={W - PR} y2={scaleY(y)} stroke="#cbd5e1" strokeWidth="1" />
                })}
              </g>

              {/* ACHSEN */}
              <g>
                <line x1={PL} y1={xAxisY} x2={W - PR + 20} y2={xAxisY} stroke="#64748b" strokeWidth="2" markerEnd="url(#axisArrow)" />
                <line x1={yAxisX} y1={H - PB} x2={yAxisX} y2={PT - 20} stroke="#64748b" strokeWidth="2" markerEnd="url(#axisArrow)" />

                {/* Achsen-Labels NEBEN dem Pfeil positioniert */}
                <SvgMath x={W - PR + 30} y={xAxisY - 20} width={60} height={40} tex={xLabel} anchor="start" color="#334155" bold={true} katexReady={katexReady} />
                <SvgMath x={yAxisX + 15} y={PT - 40} width={60} height={40} tex={yLabel} anchor="start" color="#334155" bold={true} katexReady={katexReady} />

                <circle cx={yAxisX} cy={xAxisY} r="3" fill="#64748b" />
                <SvgMath x={yAxisX - 12} y={xAxisY + 10} width={20} height={20} tex="0" anchor="end" color="#64748b" katexReady={katexReady} />
              </g>

              {/* TEXT OVERLAY FÜR DIVERGENTE REIHEN/FOLGEN */}
              {domainMode === 'reell' && comp.limit === null && (mode === 'folge' || mode === 'reihe') && (
                <SvgMath x={W / 2} y={H - PB - 30} width={400} height={30} tex="\text{Divergent: Kein Grenzwert für }\varepsilon\text{-Schlauch vorhanden}" color="#f43f5e" bold={true} katexReady={katexReady} />
              )}

              {/* === KOMPLEXER PLOT === */}
              {domainMode === 'komplex' && comp.cPlot && (
                <g>
                  {(mode === 'folge' || mode === 'reihe') && comp.cPlot.limit && <circle cx={scaleX(comp.cPlot.limit.r)} cy={scaleY(comp.cPlot.limit.i)} r={Math.abs(scaleX(epsilon) - scaleX(0))} fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />}
                  {(mode === 'folge' || mode === 'reihe') && comp.cPlot.limit && <circle cx={scaleX(comp.cPlot.limit.r)} cy={scaleY(comp.cPlot.limit.i)} r="5" fill="#10b981" />}
                  {(mode === 'folge' || mode === 'reihe') && <path d={`M ${comp.cPlot.points.map(p => `${scaleX(p.r)},${scaleY(p.i)}`).join(' L ')}`} fill="none" stroke="#94a3b8" strokeWidth="2" />}
                  {(mode === 'folge' || mode === 'reihe') && comp.cPlot.points.map((p, i) => { const isPastN = comp.cPlot.nEpsilon && p.n >= comp.cPlot.nEpsilon; return <circle key={i} cx={scaleX(p.r)} cy={scaleY(p.i)} r={isPastN ? "5" : "3.5"} fill={isPastN ? "#10b981" : "#3b82f6"} />; })}

                  {mode === 'potenzreihe' && (
                    <g>
                      <circle cx={scaleX(0)} cy={scaleY(0)} r={Math.abs(scaleX(1) - scaleX(0))} fill="rgba(99, 102, 241, 0.08)" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="4 4" />
                      <circle cx={scaleX(comp.cPlot.limit.r)} cy={scaleY(comp.cPlot.limit.i)} r="6" fill="#f43f5e" />
                      <path d={`M ${comp.cPlot.points.map(p => `${scaleX(p.r)},${scaleY(p.i)}`).join(' L ')}`} fill="none" stroke="#3b82f6" strokeWidth="3" />
                      {comp.cPlot.points.map((p, i) => <circle key={i} cx={scaleX(p.r)} cy={scaleY(p.i)} r="3" fill="#1e293b" />)}
                      <SvgMath x={scaleX(comp.cPlot.limit.r) + 10} y={scaleY(comp.cPlot.limit.i) - 15} width={40} height={30} tex={mode === 'stetigkeit' ? "z_*" : "z_0"} anchor="start" color="#f43f5e" bold={true} katexReady={katexReady} />
                    </g>
                  )}
                  {mode === 'integral' && (
                    <g>
                      <path d={`M ${comp.cPlot.points.map(p => `${scaleX(p.r)},${scaleY(p.i)}`).join(' L ')}`} fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6 4" />
                      {comp.cPlot.points.map((p, i) => <circle key={i} cx={scaleX(p.r)} cy={scaleY(p.i)} r="4" fill="#3b82f6" />)}
                      <SvgMath x={W / 2} y={PT + 20} width={400} height={30} tex="\text{Komplexes Wegintegral entlang Weg } \gamma" color="#3b82f6" bold={true} katexReady={katexReady} />
                    </g>
                  )}
                  {(mode === 'stetigkeit' || mode === 'lipschitz') && (
                    <g>
                      <circle cx={scaleX(comp.cPlot.z0.r)} cy={scaleY(comp.cPlot.z0.i)} r={Math.abs(scaleX(comp.cPlot.delta) - scaleX(0))} fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                        const rad = deg * Math.PI / 180; const r = comp.cPlot.delta * 0.9;
                        const startX = comp.cPlot.z0.r + Math.cos(rad) * r; const startY = comp.cPlot.z0.i + Math.sin(rad) * r;
                        return (
                          <g key={deg}>
                            <line x1={scaleX(startX)} y1={scaleY(startY)} x2={scaleX(comp.cPlot.z0.r)} y2={scaleY(comp.cPlot.z0.i)} stroke="#3b82f6" strokeWidth="2.5" />
                            <circle cx={scaleX(startX)} cy={scaleY(startY)} r="4" fill="#3b82f6" />
                          </g>
                        )
                      })}
                      <circle cx={scaleX(comp.cPlot.z0.r)} cy={scaleY(comp.cPlot.z0.i)} r="6" fill="#f43f5e" />
                      <SvgMath x={scaleX(comp.cPlot.z0.r) + 10} y={scaleY(comp.cPlot.z0.i) - 15} width={40} height={30} tex={mode === 'stetigkeit' ? "z_*" : "z_0"} anchor="start" color="#f43f5e" bold={true} katexReady={katexReady} />
                    </g>
                  )}
                  {mode === 'ableitung' && (
                    <g>
                      <rect x={scaleX(comp.cPlot.z0.r) - 30} y={scaleY(comp.cPlot.z0.i) - 30} width="60" height="60" fill="rgba(148, 163, 184, 0.2)" stroke="#94a3b8" strokeWidth="2" />
                      <g transform={`translate(${scaleX(comp.cPlot.z0.r)}, ${scaleY(comp.cPlot.z0.i)}) rotate(${-comp.cPlot.angle * 180 / Math.PI}) scale(${comp.cPlot.scale})`}>
                        <rect x="-30" y="-30" width="60" height="60" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" strokeWidth="2.5" />
                        <line x1="0" y1="0" x2="30" y2="0" stroke="#f43f5e" strokeWidth="3" />
                        <line x1="0" y1="0" x2="0" y2="-30" stroke="#3b82f6" strokeWidth="3" />
                      </g>
                      <circle cx={scaleX(comp.cPlot.z0.r)} cy={scaleY(comp.cPlot.z0.i)} r="6" fill="#1e293b" />
                    </g>
                  )}
                </g>
              )}

              {/* === REELLER PLOT === */}
              {domainMode === 'reell' && (
                <g>
                  {/* Stetigkeit Epsilon-Delta */}
                  {mode === 'stetigkeit' && comp.limit !== null && !isNaN(comp.limit) && (
                    <g>
                      <rect x={PL} y={scaleY(comp.limit + epsilon)} width={W - PL - PR} height={Math.max(0, scaleY(comp.limit - epsilon) - scaleY(comp.limit + epsilon))} fill="rgba(99, 102, 241, 0.08)" />
                      <line x1={PL - 10} y1={scaleY(comp.limit + epsilon)} x2={W - PR} y2={scaleY(comp.limit + epsilon)} stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1={PL - 10} y1={scaleY(comp.limit - epsilon)} x2={W - PR} y2={scaleY(comp.limit - epsilon)} stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" />

                      <SvgMath x={PL - 15} y={scaleY(comp.limit + epsilon) - 15} width={100} height={30} tex={"f(z_*)+\\varepsilon"} anchor="end" color="#6366f1" bold={true} katexReady={katexReady} />
                      <SvgMath x={PL - 15} y={scaleY(comp.limit - epsilon) - 15} width={100} height={30} tex={"f(z_*)-\\varepsilon"} anchor="end" color="#6366f1" bold={true} katexReady={katexReady} />

                      <rect x={scaleX(x0 - delta)} y={PT} width={scaleX(x0 + delta) - scaleX(x0 - delta)} height={H - PT - PB} fill="rgba(16, 185, 129, 0.08)" />
                      <line x1={scaleX(x0 - delta)} y1={PT} x2={scaleX(x0 - delta)} y2={H - PB + 10} stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1={scaleX(x0 + delta)} y1={PT} x2={scaleX(x0 + delta)} y2={H - PB + 10} stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />

                      <SvgMath x={scaleX(x0 - delta)} y={H - PB + 10} width={80} height={30} tex={"z_*-\\delta"} anchor="middle" color="#10b981" bold={true} katexReady={katexReady} />
                      <SvgMath x={scaleX(x0 + delta)} y={H - PB + 10} width={80} height={30} tex={"z_*+\\delta"} anchor="middle" color="#10b981" bold={true} katexReady={katexReady} />

                      <rect x={scaleX(x0 - delta)} y={scaleY(comp.limit + epsilon)} width={scaleX(x0 + delta) - scaleX(x0 - delta)} height={Math.max(0, scaleY(comp.limit - epsilon) - scaleY(comp.limit + epsilon))} fill="rgba(245, 158, 11, 0.25)" stroke={comp.deltaOk ? "#10b981" : "#f43f5e"} strokeWidth="3" />
                      <line x1={scaleX(x0)} y1={scaleY(comp.limit)} x2={scaleX(x0)} y2={H - PB} stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
                      <SvgMath x={scaleX(x0)} y={H - PB + 10} width={40} height={30} tex="z_*" anchor="middle" color="#334155" bold={true} katexReady={katexReady} />

                      <circle cx={scaleX(x0)} cy={scaleY(comp.limit)} r="7" fill="#1e293b" />
                      <line x1={PL - 10} y1={scaleY(comp.limit)} x2={scaleX(x0)} y2={scaleY(comp.limit)} stroke="#475569" strokeWidth="2" strokeDasharray="2 2" />
                      <SvgMath x={PL - 15} y={scaleY(comp.limit) - 15} width={80} height={30} tex="f(z_*)" anchor="end" color="#334155" bold={true} katexReady={katexReady} />
                    </g>
                  )}

                  {/* Lipschitz */}
                  {mode === 'lipschitz' && comp.limit !== null && !isNaN(comp.limit) && (
                    <g>
                      <path d={`M ${scaleX(comp.X_MIN)},${scaleY(comp.limit + lParam * Math.abs(comp.X_MIN - x0))} 
                               L ${scaleX(x0)},${scaleY(comp.limit)} 
                               L ${scaleX(comp.X_MAX)},${scaleY(comp.limit + lParam * Math.abs(comp.X_MAX - x0))} 
                               L ${scaleX(comp.X_MAX)},${scaleY(comp.limit - lParam * Math.abs(comp.X_MAX - x0))} 
                               L ${scaleX(x0)},${scaleY(comp.limit)} 
                               L ${scaleX(comp.X_MIN)},${scaleY(comp.limit - lParam * Math.abs(comp.X_MIN - x0))} Z`}
                        fill="rgba(16, 185, 129, 0.15)" />
                      <line x1={scaleX(comp.X_MIN)} y1={scaleY(comp.limit + lParam * Math.abs(comp.X_MIN - x0))} x2={scaleX(comp.X_MAX)} y2={scaleY(comp.limit + lParam * Math.abs(comp.X_MAX - x0))} stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 4" />
                      <line x1={scaleX(comp.X_MIN)} y1={scaleY(comp.limit - lParam * Math.abs(comp.X_MIN - x0))} x2={scaleX(comp.X_MAX)} y2={scaleY(comp.limit - lParam * Math.abs(comp.X_MAX - x0))} stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 4" />

                      {/* Steigungs-Labels */}
                      <SvgMath x={scaleX(comp.X_MAX)} y={scaleY(comp.limit + lParam * Math.abs(comp.X_MAX - x0)) - 15} width={80} height={30} tex="+L" anchor="end" color="#10b981" bold={true} katexReady={katexReady} />
                      <SvgMath x={scaleX(comp.X_MAX)} y={scaleY(comp.limit - lParam * Math.abs(comp.X_MAX - x0)) + 15} width={80} height={30} tex="-L" anchor="end" color="#10b981" bold={true} katexReady={katexReady} />

                      <line x1={scaleX(x0)} y1={scaleY(comp.limit)} x2={scaleX(x0)} y2={H - PB} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                      <SvgMath x={scaleX(x0)} y={H - PB + 10} width={40} height={30} tex="x_0" anchor="middle" color="#334155" bold={true} katexReady={katexReady} />
                      <circle cx={scaleX(x0)} cy={scaleY(comp.limit)} r="7" fill="#10b981" />
                    </g>
                  )}

                  {/* Ableitung */}
                  {mode === 'ableitung' && comp.limit !== null && !isNaN(comp.limit) && (
                    <g>
                      {comp.tangentPts && <line x1={scaleX(comp.tangentPts[0].x)} y1={scaleY(comp.tangentPts[0].y)} x2={scaleX(comp.tangentPts[1].x)} y2={scaleY(comp.tangentPts[1].y)} stroke="#f43f5e" strokeWidth="3.5" />}
                      {comp.secantPts && <line x1={scaleX(comp.secantPts[0].x)} y1={scaleY(comp.secantPts[0].y)} x2={scaleX(comp.secantPts[1].x)} y2={scaleY(comp.secantPts[1].y)} stroke="#3b82f6" strokeWidth="3" strokeDasharray="6 3" />}
                      <line x1={scaleX(x0)} y1={scaleY(comp.limit)} x2={scaleX(x0)} y2={H - PB} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                      <circle cx={scaleX(x0)} cy={scaleY(comp.limit)} r="7" fill="#f43f5e" />
                      <SvgMath x={scaleX(x0)} y={H - PB + 10} width={40} height={30} tex="x_0" anchor="middle" color="#334155" bold={true} katexReady={katexReady} />
                      {!isNaN(comp.model.f(x0 + hParam, aParam)) && (
                        <g>
                          <line x1={scaleX(x0 + hParam)} y1={scaleY(comp.model.f(x0 + hParam, aParam))} x2={scaleX(x0 + hParam)} y2={H - PB} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                          <circle cx={scaleX(x0 + hParam)} cy={scaleY(comp.model.f(x0 + hParam, aParam))} r="7" fill="#3b82f6" />
                          <SvgMath x={scaleX(x0 + hParam)} y={H - PB + 10} width={60} height={30} tex="x_0+h" anchor="middle" color="#334155" bold={true} katexReady={katexReady} />
                        </g>
                      )}
                    </g>
                  )}

                  {/* Riemann Integral Rechtecke - NEU mit Auswahl (Ober-, Unter- oder Mittelsumme) */}
                  {comp.isIntegral && (
                    <g>
                      {(sumType === 'upper' ? comp.upperRects : (sumType === 'lower' ? comp.lowerRects : comp.rects)).map((r, i) => {
                        const xSvg = scaleX(r.x);
                        const wSvg = scaleX(r.x + r.w) - scaleX(r.x);
                        const ySvgTop = r.y >= 0 ? scaleY(r.y) : scaleY(0);
                        const hSvg = Math.abs(scaleY(r.y) - scaleY(0));

                        let fill = "rgba(59, 130, 246, 0.3)";
                        let stroke = "#3b82f6";
                        if (sumType === 'upper') { fill = "rgba(244, 63, 94, 0.3)"; stroke = "#f43f5e"; }
                        if (sumType === 'lower') { fill = "rgba(16, 185, 129, 0.3)"; stroke = "#10b981"; }

                        return <rect key={`rect-${i}`} x={xSvg} y={ySvgTop} width={wSvg} height={hSvg} fill={fill} stroke={stroke} strokeWidth="1" />
                      })}
                      {/* Integrationsgrenzen Markierungen */}
                      <line x1={scaleX(0)} y1={PT} x2={scaleX(0)} y2={H - PB} stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1={scaleX(x0)} y1={PT} x2={scaleX(x0)} y2={H - PB} stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
                      <SvgMath x={scaleX(x0)} y={xAxisY + (x0 < 0 ? -25 : 15)} width={40} height={30} tex="b" anchor="middle" color="#f43f5e" bold={true} katexReady={katexReady} />
                      <SvgMath x={scaleX(0)} y={xAxisY + 15} width={40} height={30} tex="a" anchor="middle" color="#64748b" bold={true} katexReady={katexReady} />
                    </g>
                  )}

                  {/* Kurven */}
                  {comp.isPower && (
                    <g>
                      {getContinuousPaths('yTarget').map((p, idx) => <path key={`t-${idx}`} d={p} fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6 4" />)}
                      {getContinuousPaths('yApprox').map((p, idx) => <path key={`a-${idx}`} d={p} fill="none" stroke="#3b82f6" strokeWidth="4" />)}
                    </g>
                  )}
                  {(!comp.isDiscrete && !comp.isPower) && getContinuousPaths('y').map((p, idx) => <path key={idx} d={p} fill="none" stroke={mode === 'lipschitz' && !comp.lipschitzOk ? "#f43f5e" : "#1e293b"} strokeWidth={comp.isIntegral ? 3 : 4} strokeLinecap="round" strokeLinejoin="round" />)}

                  {/* Folgen / Reihen */}
                  {comp.isDiscrete && comp.limit !== null && !isNaN(comp.limit) && (
                    <g>
                      <rect x={PL} y={scaleY(comp.limit + epsilon)} width={W - PL - PR} height={Math.max(0, scaleY(comp.limit - epsilon) - scaleY(comp.limit + epsilon))} fill="rgba(99, 102, 241, 0.08)" />
                      <line x1={PL - 10} y1={scaleY(comp.limit + epsilon)} x2={W - PR} y2={scaleY(comp.limit + epsilon)} stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1={PL - 10} y1={scaleY(comp.limit - epsilon)} x2={W - PR} y2={scaleY(comp.limit - epsilon)} stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1={PL - 10} y1={scaleY(comp.limit)} x2={W - PR} y2={scaleY(comp.limit)} stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="6 4" />

                      <SvgMath x={PL - 15} y={scaleY(comp.limit + epsilon) - 15} width={100} height={30} tex={mode === 'folge' ? "a+\\varepsilon" : "S+\\varepsilon"} anchor="end" color="#6366f1" bold={true} katexReady={katexReady} />
                      <SvgMath x={PL - 15} y={scaleY(comp.limit - epsilon) - 15} width={100} height={30} tex={mode === 'folge' ? "a-\\varepsilon" : "S-\\varepsilon"} anchor="end" color="#6366f1" bold={true} katexReady={katexReady} />
                      <SvgMath x={PL - 15} y={scaleY(comp.limit) - 15} width={40} height={30} tex={mode === 'folge' ? "a" : "S"} anchor="end" color="#4f46e5" bold={true} katexReady={katexReady} />

                      {comp.nEpsilon && (
                        <g>
                          <line x1={scaleX(comp.nEpsilon)} y1={PT} x2={scaleX(comp.nEpsilon)} y2={H - PB + 10} stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 4" />
                          <rect x={scaleX(comp.nEpsilon)} y={PT} width={W - PR - scaleX(comp.nEpsilon)} height={H - PT - PB} fill="rgba(16, 185, 129, 0.05)" />
                          <SvgMath x={scaleX(comp.nEpsilon)} y={H - PB + 10} width={40} height={30} tex="N_\varepsilon" anchor="middle" color="#10b981" bold={true} katexReady={katexReady} />
                        </g>
                      )}
                    </g>
                  )}

                  {comp.isDiscrete && mode === 'reihe' && <path d={`M ${comp.data.map(d => `${scaleX(d.n)},${scaleY(d.val)}`).join(' L ')}`} fill="none" stroke="#e2e8f0" strokeWidth="3" />}
                  {comp.isDiscrete && comp.data.map((d, i) => {
                    const inEps = comp.limit !== null && Math.abs(d.val - comp.limit) < epsilon;
                    const pastN = comp.nEpsilon !== null && d.n >= comp.nEpsilon;
                    let c = comp.limit !== null ? (pastN ? "#10b981" : (!inEps ? "#f43f5e" : "#8b5cf6")) : "#64748b";
                    return (
                      <g key={i}>
                        <circle cx={scaleX(d.n)} cy={scaleY(d.val)} r="5" fill={c} />
                        {mode === 'reihe' && i === comp.data.length - 1 && (
                          <SvgMath x={scaleX(d.n) + 10} y={scaleY(d.val) - 20} width={120} height={30} tex="\text{Partialsummen } S_n" anchor="start" color="#64748b" katexReady={katexReady} />
                        )}
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>
          </div>

          <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex justify-between items-center text-base">
            <div className="flex gap-6 items-center">
              <span className="text-slate-600 flex items-center">{mode === 'integral' ? "Exakte Fläche:" : "Ziel/Grenzwert:"} <strong className="text-slate-900 ml-2 font-mono bg-white px-3 py-1 rounded-md border border-slate-200"><TextWithMath text={comp.limitText} katexReady={katexReady} /></strong></span>

              {domainMode === 'reell' && (mode === 'folge' || mode === 'reihe') && comp.limit !== null && (
                <span className={`flex items-center gap-1.5 font-bold ${comp.nEpsilon ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {comp.nEpsilon ? <CheckCircle size={20} /> : <AlertCircle size={20} />} <TextWithMath text={comp.nEpsilon ? `$N_\\varepsilon = ${comp.nEpsilon}$` : `$N_\\varepsilon = \\text{Nicht erreicht}$`} katexReady={katexReady} />
                </span>
              )}
              {domainMode === 'reell' && mode === 'lipschitz' && !isNaN(comp.limit) && comp.limit !== null && (
                <span className={`flex items-center gap-1.5 font-bold ${comp.lipschitzOk ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {comp.lipschitzOk ? <CheckCircle size={20} /> : <AlertCircle size={20} />} {comp.lipschitzOk ? "Lokal Lipschitz-stetig (Im Kegel)" : "NICHT Lipschitz-stetig (Bricht aus)"}
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 2.5 DEFINITION PANEL (MOVED BELOW GRAPH) */}
      <div className="bg-indigo-50/70 border-b border-t border-indigo-100 p-4 shrink-0 shadow-inner">
        <div className="max-w-6xl mx-auto flex gap-4 items-start">
          <BookOpen size={24} className="text-indigo-500 shrink-0 mt-0.5" />
          <div className="w-full overflow-hidden">
            <h3 className="text-base font-bold text-indigo-900 mb-1"><TextWithMath text={DEFINITIONS[mode]?.title || ""} katexReady={katexReady} /></h3>
            <div className="my-2 bg-white px-4 py-2 rounded-md shadow-sm border border-indigo-100 inline-block overflow-x-auto w-auto max-w-full text-indigo-900">
              <BlockMath tex={DEFINITIONS[mode]?.math || ""} katexReady={katexReady} />
            </div>
            <p className="text-sm text-indigo-700 leading-relaxed mt-1"><TextWithMath text={DEFINITIONS[mode]?.text || ""} katexReady={katexReady} /></p>
          </div>
        </div>
      </div>

      {/* 4. TEXT PANEL */}
      <div className="bg-white border-t border-slate-200 flex flex-col z-20">

        <div className="flex border-b border-slate-200 bg-slate-50 sticky top-0 z-30 shadow-sm">
          <button onClick={() => setBottomTab('calc')} className={`flex-1 py-5 text-lg font-bold flex items-center justify-center gap-2 transition-colors ${bottomTab === 'calc' ? 'bg-white text-indigo-700 border-b-2 border-indigo-500' : 'text-slate-500 hover:bg-slate-100'}`}>
            <Calculator size={22} /> Live-Analyse: Was bedeutet das hier?
          </button>
          <button onClick={() => setBottomTab('complex')} className={`flex-1 py-5 text-lg font-bold flex items-center justify-center gap-2 transition-colors ${bottomTab === 'complex' ? 'bg-white text-emerald-700 border-b-2 border-emerald-500' : 'text-slate-500 hover:bg-slate-100'}`}>
            <Globe size={22} /> <TextWithMath text="$\mathbb{R}$ vs. $\mathbb{C}$ (Dimensionen)" katexReady={katexReady} />
          </button>
        </div>

        <div className="p-8 md:p-12 w-full max-w-6xl mx-auto text-base text-slate-700 leading-relaxed min-h-[40vh]">
          {bottomTab === 'calc' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-xl">
                  <Info size={24} className="text-blue-600" />
                  Modell: {comp.model?.name.replace(/\$/g, '')}
                </h3>
                <p className="text-slate-700 leading-relaxed text-lg mb-6">
                  <TextWithMath text={EXPLANATIONS?.[activeId] || "Dieses Modell zeigt klassisches analytisches Verhalten."} katexReady={katexReady} />
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-4 text-xl flex items-center gap-2">
                  <Lightbulb size={24} className="text-amber-500" />
                  Live-Auswertung der aktuellen Regler
                </h3>
                <div className="bg-white border-l-4 border-amber-400 p-6 rounded-r-xl shadow-sm text-lg leading-relaxed">
                  <TextWithMath text={getDynamicEvaluation()} katexReady={katexReady} />
                </div>
              </div>
            </div>
          )}

          {bottomTab === 'complex' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-800 text-2xl block mb-6 pb-4 border-b border-slate-200"><TextWithMath text="In $\mathbb{R}$ (Reeller Raum)" katexReady={katexReady} /></span>
                {mode === 'folge' && <p className="text-lg"><TextWithMath text="Die Folge springt auf einer eindimensionalen Linie hin und her. Der Schlauch ist ein simples **Intervall** $[a-\varepsilon, a+\varepsilon]$." katexReady={katexReady} /></p>}
                {mode === 'reihe' && <p className="text-lg">Partialsummen sind wie das Aneinanderhängen von Stöcken (nach links oder rechts) auf einer Linie.</p>}
                {mode === 'potenzreihe' && <p className="text-lg"><TextWithMath text="Die Reihe konvergiert auf einem eindimensionalen **Konvergenzintervall** (z.B. von $-1$ bis $1$)." katexReady={katexReady} /></p>}
                {mode === 'integral' && <p className="text-lg"><TextWithMath text="Man integriert entlang der flachen $x$-Achse von $a$ nach $b$. Es ist das klassische Aufsummieren von senkrechten Flächen-Rechtecken." katexReady={katexReady} /></p>}
                {mode === 'stetigkeit' && <p className="text-lg"><TextWithMath text="Du kannst dich dem Punkt $z_*$ nur aus **zwei Richtungen** (von links oder rechts) nähern." katexReady={katexReady} /></p>}
                {mode === 'lipschitz' && <p className="text-lg"><TextWithMath text="Der Graph darf einen Kegel mit der Steigung $\pm L$ nicht verlassen. Es geht um eine globale Schranke für die Steigung in einer Ebene." katexReady={katexReady} /></p>}
                {mode === 'ableitung' && <p className="text-lg">Die Ableitung ist schlichtweg eine reelle Zahl, die die <strong>Steigung</strong> der eindimensionalen Tangente beschreibt.</p>}
              </div>
              <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-200">
                <span className="font-bold text-emerald-800 text-2xl block mb-6 pb-4 border-b border-emerald-200 flex items-center gap-3"><Globe size={28} /> <TextWithMath text="In $\mathbb{C}$ (Komplexer Raum)" katexReady={katexReady} /></span>
                {mode === 'folge' && <p className="text-lg text-emerald-900"><TextWithMath text="Die Punkte wandern in einer **2D-Ebene**. Der Schlauch wird zu einem **Kreis** um den Zielpunkt $a$. Die Folge muss vom Kreis eingefangen werden (Spiralen)." katexReady={katexReady} /></p>}
                {mode === 'reihe' && <p className="text-lg text-emerald-900">Partialsummen bilden komplexe <strong>Vektor-Polygonzüge</strong>. Jeder Summand ist ein Pfeil mit Länge und Winkel. Aus simplen Reihen werden faszinierende Spiral-Muster!</p>}
                {mode === 'potenzreihe' && <p className="text-lg text-emerald-900"><TextWithMath text="Dieses Intervall entpuppt sich als der Durchmesser eines perfekten **Konvergenzkreises** in der Gaußschen Ebene! Innerhalb der Kreisscheibe konvergiert das komplexe Polynom." katexReady={katexReady} /></p>}
                {mode === 'integral' && <p className="text-lg text-emerald-900"><TextWithMath text="Riemann-Integrale werden zu **Wegintegralen** $\int_\\gamma f(z) dz$. Man wandert entlang eines Kurvenpfades in der Ebene. Komplexe Integrale holomorpher Funktionen über geschlossene Kurven sind oft exakt $0$!" katexReady={katexReady} /></p>}
                {mode === 'stetigkeit' && <p className="text-lg text-emerald-900"><TextWithMath text="Du musst dich dem Punkt $z_*$ aus **allen 360 Grad Richtungen** der Ebene nähern können, und immer muss das gleiche Ergebnis herauskommen. Ein viel strengeres Kriterium!" katexReady={katexReady} /></p>}
                {mode === 'lipschitz' && <p className="text-lg text-emerald-900"><TextWithMath text="Der Abstand zweier Bildpunkte in der Ebene ist durch das $L$-fache ihres ursprünglichen Abstandes beschränkt. Geometrisch: Keine extreme Streckung der Vektoren erlaubt." katexReady={katexReady} /></p>}
                {mode === 'ableitung' && <p className="text-lg text-emerald-900"><TextWithMath text="Nennt sich **Holomorphie**. Die Ableitung $f'(z)$ bewirkt geometrisch eine perfekte **Dreh-Streckung (Amplitwist)**. Ein kleines quadratisches Gitter bleibt absolut quadratisch, es wird nur rotiert und vergrößert!" katexReady={katexReady} /></p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}