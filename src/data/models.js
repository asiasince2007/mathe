// --- Mathematische Hilfsfunktionen ---
const f = [];
export const factorial = (n) => {
  if (n < 0) return NaN;
  if (n > 170) return Infinity;
  if (n === 0 || n === 1) return 1;
  if (f[n] > 0) return f[n];
  return f[n] = factorial(n - 1) * n;
};

// Komplexe Arithmetik
export const cAdd = (a, b) => ({ r: a.r + b.r, i: a.i + b.i });
export const cMult = (a, b) => ({ r: a.r * b.r - a.i * b.i, i: a.r * b.i + a.i * b.r });
export const cAbs = (a) => Math.sqrt(a.r * a.r + a.i * a.i);

// --- Modelldefinitionen ---
export const FOLGEN = [
  { id: 'null_1', name: 'Standard-Nullfolge', tag: 'konvergent', formula: '$x_n = \\frac{1}{n}$', limit: 0, calc: (n) => 1 / n },
  { id: 'null_alt', name: 'Alternierende Nullfolge', tag: 'konvergent', formula: '$x_n = \\frac{(-1)^n}{n}$', limit: 0, calc: (n) => Math.pow(-1, n) / n },
  { id: 'geom', name: 'Geometrische Folge', tag: 'parameterabhängig', formula: '$x_n = q^n$', limit: (q) => Math.abs(q) < 1 ? 0 : (q === 1 ? 1 : null), calc: (n, q) => Math.pow(q, n), hasQ: true },
  { id: 'bruch', name: 'Gebrochenrationale Folge', tag: 'konvergent', formula: '$x_n = \\frac{2n}{n + 1}$', limit: 2, calc: (n) => (2 * n) / (n + 1) },
  { id: 'n_inv_sq', name: 'Quadratische Nullfolge', tag: 'konvergent', formula: '$x_n = \\frac{1}{n^2}$', limit: 0, calc: (n) => 1 / (n * n) },
  { id: 'bruch2', name: 'Rationale Folge', tag: 'konvergent', formula: '$x_n = \\frac{3n^2+1}{n^2+n}$', limit: 3, calc: (n) => (3 * n * n + 1) / (n * n + n) },
  { id: 'sqrt_folge', name: 'Wurzel-Nullfolge', tag: 'konvergent', formula: '$x_n = \\frac{1}{\\sqrt{n}}$', limit: 0, calc: (n) => 1 / Math.sqrt(n) },
  { id: 'log_n', name: 'Logarithmische Nullfolge', tag: 'konvergent', formula: '$x_n = \\frac{\\ln(n)}{n}$', limit: 0, calc: (n) => Math.log(n) / n },
  { id: 'euler', name: 'Euler-Folge', tag: 'konvergent', formula: '$x_n = \\left(1 + \\frac{1}{n}\\right)^n$', limit: Math.E, calc: (n) => Math.pow(1 + 1 / n, n) },
  { id: 'sin_damp', name: 'Gedämpfte Schwingung', tag: 'konvergent', formula: '$x_n = \\frac{\\sin(a \\cdot n)}{n}$', limit: 0, calc: (n, q, a) => Math.sin(a * n) / n, hasA: true },
  { id: 'div_alt', name: 'Pendelfolge', tag: 'divergent', formula: '$x_n = (-1)^n$', limit: null, calc: (n) => Math.pow(-1, n) },
  { id: 'n_sq', name: 'Quadratisches Wachstum', tag: 'divergent', formula: '$x_n = n^2$', limit: null, calc: (n) => n * n },
  { id: 'div_linear', name: 'Lineares Wachstum', tag: 'divergent', formula: '$x_n = n$', limit: null, calc: (n) => n },
  { id: 'div_fakult', name: 'Fakultäts-Wachstum', tag: 'divergent', formula: '$x_n = n!$', limit: null, calc: (n) => factorial(n) },
];

export const REIHEN = [
  { id: 'harm', name: 'Harmonische Reihe', tag: 'divergent', formula: '$S_n = \\sum_{k=1}^n \\frac{1}{k}$', limit: null, calcTerm: (k) => 1 / k },
  { id: 'harm_alt', name: 'Alternierende Harmonische', tag: 'konvergent', formula: '$S_n = \\sum_{k=1}^n \\frac{(-1)^{k+1}}{k}$', limit: Math.log(2), calcTerm: (k) => Math.pow(-1, k + 1) / k },
  { id: 'geom_reihe', name: 'Geometrische Reihe', tag: 'parameterabhängig', formula: '$S_n = \\sum_{k=0}^n q^k$', limit: (q) => Math.abs(q) < 1 ? (1 / (1 - q)) : null, calcTerm: (k, q) => Math.pow(q, k), hasQ: true, startK: 0 },
  { id: 'basel', name: 'Basel-Problem', tag: 'konvergent', formula: '$S_n = \\sum_{k=1}^n \\frac{1}{k^2}$', limit: (Math.PI * Math.PI) / 6, calcTerm: (k) => 1 / (k * k) },
  { id: 'euler_e', name: 'Euler-Reihe', tag: 'konvergent', formula: '$S_n = \\sum_{k=0}^n \\frac{1}{k!}$', limit: Math.E, calcTerm: (k) => 1 / factorial(k), startK: 0 },
  { id: 'teleskop', name: 'Teleskopreihe', tag: 'konvergent', formula: '$S_n = \\sum_{k=1}^n \\frac{1}{k(k+1)}$', limit: 1, calcTerm: (k) => 1 / (k * (k + 1)) },
  { id: 'r_p3', name: 'p-Reihe (p=3)', tag: 'konvergent', formula: '$S_n = \\sum_{k=1}^n \\frac{1}{k^3}$', limit: 1.2020569, calcTerm: (k) => 1 / (k * k * k) },
  { id: 'r_leibniz', name: 'Leibniz-Reihe', tag: 'konvergent', formula: '$S_n = \\sum_{k=0}^n \\frac{(-1)^k}{2k+1}$', limit: Math.PI / 4, calcTerm: (k) => Math.pow(-1, k) / (2 * k + 1), startK: 0 },
  { id: 'r_mengoli', name: 'Mengoli-Reihe', tag: 'konvergent', formula: '$S_n = \\sum_{k=1}^n \\frac{1}{k(k+1)(k+2)}$', limit: 0.25, calcTerm: (k) => 1 / (k * (k + 1) * (k + 2)) },
  { id: 'r_div_sqrt', name: 'Wurzel-Reihe', tag: 'divergent', formula: '$S_n = \\sum_{k=1}^n \\frac{1}{\\sqrt{k}}$', limit: null, calcTerm: (k) => 1 / Math.sqrt(k) },
  { id: 'r_div_geom', name: 'Divergente Geometrische', tag: 'divergent', formula: '$S_n = \\sum_{k=0}^n 2^k$', limit: null, calcTerm: (k) => Math.pow(2, k), startK: 0 },
];

export const POTENZREIHEN = [
  { id: 'p_geom', name: 'Geometrische Reihe', tag: 'R=1', formula: '$\\frac{1}{1-x} = \\sum_{n=0}^\\infty x^n$', radius: 1, startK: 0, target: (x) => x !== 1 ? 1 / (1 - x) : NaN, term: (x, n) => Math.pow(x, n) },
  { id: 'p_exp', name: 'Exponentialfunktion', tag: 'R=∞', formula: '$e^x = \\sum_{n=0}^\\infty \\frac{x^n}{n!}$', radius: Infinity, startK: 0, target: (x) => Math.exp(x), term: (x, n) => Math.pow(x, n) / factorial(n) },
  { id: 'p_sin', name: 'Sinusfunktion', tag: 'R=∞', formula: '$\\sin(x) = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n+1}}{(2n+1)!}$', radius: Infinity, startK: 0, target: (x) => Math.sin(x), term: (x, n) => Math.pow(-1, n) * Math.pow(x, 2 * n + 1) / factorial(2 * n + 1) },
  { id: 'p_cos', name: 'Kosinusfunktion', tag: 'R=∞', formula: '$\\cos(x) = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n}}{(2n)!}$', radius: Infinity, startK: 0, target: (x) => Math.cos(x), term: (x, n) => Math.pow(-1, n) * Math.pow(x, 2 * n) / factorial(2 * n) },
  { id: 'p_sinh', name: 'Sinus Hyperbolicus', tag: 'R=∞', formula: '$\\sinh(x) = \\sum_{n=0}^\\infty \\frac{x^{2n+1}}{(2n+1)!}$', radius: Infinity, startK: 0, target: (x) => Math.sinh(x), term: (x, n) => Math.pow(x, 2 * n + 1) / factorial(2 * n + 1) },
  { id: 'p_ln', name: 'Natürlicher Logarithmus', tag: 'R=1', formula: '$\\ln(1+x) = \\sum_{n=1}^\\infty \\frac{(-1)^{n+1} x^n}{n}$', radius: 1, startK: 1, target: (x) => x > -1 ? Math.log(1 + x) : NaN, term: (x, n) => n > 0 ? Math.pow(-1, n + 1) * Math.pow(x, n) / n : 0 },
  { id: 'p_atan', name: 'Arkustangens', tag: 'R=1', formula: '$\\arctan(x) = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n+1}}{2n+1}$', radius: 1, startK: 0, target: (x) => Math.atan(x), term: (x, n) => Math.pow(-1, n) * Math.pow(x, 2 * n + 1) / (2 * n + 1) },
];

export const INTEGRALE = [
  { id: 'i_quad', name: 'Normalparabel', tag: 'Standardintegral', formula: '$\\int_0^b z^2 \\, dz$', f: (x) => x * x, F: (x) => (x * x * x) / 3 },
  { id: 'i_sin', name: 'Sinus-Bogen', tag: 'Standardintegral', formula: '$\\int_0^b \\sin(z) \\, dz$', f: (x) => Math.sin(x), F: (x) => -Math.cos(x) },
  { id: 'i_cos', name: 'Kosinus-Bogen', tag: 'Standardintegral', formula: '$\\int_0^b \\cos(z) \\, dz$', f: (x) => Math.cos(x), F: (x) => Math.sin(x) },
  { id: 'i_exp', name: 'Exponentialfunktion', tag: 'Standardintegral', formula: '$\\int_0^b e^z \\, dz$', f: (x) => Math.exp(x), F: (x) => Math.exp(x) },
  { id: 'i_sqrt', name: 'Wurzelfunktion', tag: 'Standardintegral', formula: '$\\int_0^b \\sqrt{z} \\, dz$', f: (x) => x >= 0 ? Math.sqrt(x) : NaN, F: (x) => x >= 0 ? (2 / 3) * Math.pow(x, 1.5) : NaN },
  { id: 'i_poly3', name: 'Kubische Funktion', tag: 'Standardintegral', formula: '$\\int_0^b z^3 \\, dz$', f: (x) => x * x * x, F: (x) => (x * x * x * x) / 4 },
  { id: 'i_abs', name: 'Betragsfunktion', tag: 'Knick im Integranden', formula: '$\\int_0^b |z| \\, dz$', f: (x) => Math.abs(x), F: (x) => (x * Math.abs(x)) / 2 },
  { id: 'i_inv', name: 'Kehrwertfunktion', tag: 'Uneigentliches Integral', formula: '$\\int_1^b \\frac{1}{z} \\, dz$', f: (x) => x > 0 ? 1 / x : NaN, F: (x) => x > 0 ? Math.log(x) : NaN, lower: 1 },
];

export const FUNKTIONEN = [
  { id: 'f_quad', name: 'Parabel', formula: '$f(z) = a \\cdot z^2$', f: (x, a) => a * x * x, df: (x, a) => 2 * a * x, hasA: true, tags: { stetigkeit: 'stetig', lipschitz: 'lokal Lipschitz', ableitung: 'differenzierbar' } },
  { id: 'f_sin', name: 'Sinus-Welle', formula: '$f(z) = \\sin(a \\cdot z)$', f: (x, a) => Math.sin(a * x), df: (x, a) => a * Math.cos(a * x), hasA: true, tags: { stetigkeit: 'stetig', lipschitz: 'global Lipschitz', ableitung: 'differenzierbar' } },
  { id: 'f_exp', name: 'Exponentialfunktion', formula: '$f(z) = e^z$', f: (x) => Math.exp(x), df: (x) => Math.exp(x), tags: { stetigkeit: 'stetig', lipschitz: 'lokal Lipschitz', ableitung: 'differenzierbar' } },
  { id: 'f_cubic', name: 'Kubische Funktion', formula: '$f(z) = z^3$', f: (x) => x * x * x, df: (x) => 3 * x * x, tags: { stetigkeit: 'stetig', lipschitz: 'lokal Lipschitz', ableitung: 'differenzierbar' } },
  { id: 'f_x_abs_x', name: 'Glatter Betrag', formula: '$f(z) = z|z|$', f: (x) => x * Math.abs(x), df: (x) => 2 * Math.abs(x), tags: { stetigkeit: 'stetig', lipschitz: 'lokal Lipschitz', ableitung: 'differenzierbar' } },
  { id: 'f_abs', name: 'Betragsfunktion', formula: '$f(z) = |z|$', f: (x) => Math.abs(x), df: (x) => x > 0 ? 1 : (x < 0 ? -1 : NaN), tags: { stetigkeit: 'stetig', lipschitz: 'global Lipschitz', ableitung: 'nicht diff. bei 0' } },
  { id: 'f_sqrt', name: 'Wurzelfunktion', formula: '$f(z) = \\sqrt{z}$', f: (x) => x >= 0 ? Math.sqrt(x) : NaN, df: (x) => x > 0 ? 0.5 / Math.sqrt(x) : NaN, tags: { stetigkeit: 'stetig', lipschitz: 'nicht Lipschitz bei 0', ableitung: 'nicht diff. bei 0' } },
  { id: 'f_sin_1_x', name: 'Topologischer Sinus', formula: '$f(z) = z \\cdot \\sin\\left(\\frac{1}{z}\\right)$', f: (x) => x !== 0 ? x * Math.sin(1 / x) : 0, df: (x) => x !== 0 ? Math.sin(1 / x) - (1 / x) * Math.cos(1 / x) : NaN, tags: { stetigkeit: 'stetig (Grenzfall)', lipschitz: 'lokal Lipschitz', ableitung: 'nicht diff. bei 0' } },
  { id: 'f_sprung', name: 'Signum-Sprung', formula: '$f(z) = \\text{sgn}(z)$', f: (x) => x >= 0 ? 1 : -1, df: (x) => x !== 0 ? 0 : NaN, hasJump: true, tags: { stetigkeit: 'unstetig', lipschitz: 'nicht Lipschitz', ableitung: 'nicht differenzierbar' } },
  { id: 'f_bruch', name: 'Polstelle', formula: '$f(z) = \\frac{1}{z}$', f: (x) => x !== 0 ? 1 / x : NaN, df: (x) => -1 / (x * x), hasJump: true, tags: { stetigkeit: 'unstetig (Pol)', lipschitz: 'nicht Lipschitz', ableitung: 'nicht def. bei 0' } },
  { id: 'f_floor', name: 'Gaußklammer', formula: '$f(z) = \\lfloor z \\rfloor$', f: (x) => Math.floor(x), df: (x) => (x === Math.floor(x)) ? NaN : 0, hasJump: true, tags: { stetigkeit: 'unstetig', lipschitz: 'nicht Lipschitz', ableitung: 'nicht differenzierbar' } },
  { id: 'f_heaviside', name: 'Heaviside-Funktion', formula: '$f(z) = \\Theta(z)$', f: (x) => x >= 0 ? 1 : 0, df: (x) => x !== 0 ? 0 : NaN, hasJump: true, tags: { stetigkeit: 'unstetig', lipschitz: 'nicht Lipschitz', ableitung: 'nicht differenzierbar' } },
];

export const MULTIVAR = [
  { id: 'mv_poly', name: 'Paraboloid', tag: 'total differenzierbar', formula: '$f(x,y) = x^2 + y^2$', f: (x, y) => x * x + y * y, fx: (x, y) => 2 * x, fy: (x, y) => 2 * y, totalDiff: true },
  { id: 'mv_prod', name: 'Sattelfläche', tag: 'total differenzierbar', formula: '$f(x,y) = xy$', f: (x, y) => x * y, fx: (x, y) => y, fy: (x, y) => x, totalDiff: true },
  { id: 'mv_saddle', name: 'Hyperbolisches Paraboloid', tag: 'total differenzierbar', formula: '$f(x,y) = x^2 - y^2$', f: (x, y) => x * x - y * y, fx: (x, y) => 2 * x, fy: (x, y) => -2 * y, totalDiff: true },
  { id: 'mv_exp', name: 'Exponentialfläche', tag: 'total differenzierbar', formula: '$f(x,y) = e^{x+y}$', f: (x, y) => Math.exp(x + y), fx: (x, y) => Math.exp(x + y), fy: (x, y) => Math.exp(x + y), totalDiff: true },
  { id: 'mv_sin_cos', name: 'Trigonometrische Fläche', tag: 'total differenzierbar', formula: '$f(x,y) = \\sin(x)\\cos(y)$', f: (x, y) => Math.sin(x) * Math.cos(y), fx: (x, y) => Math.cos(x) * Math.cos(y), fy: (x, y) => -Math.sin(x) * Math.sin(y), totalDiff: true },
  { id: 'mv_abs', name: 'Betrags-Summe', tag: 'nicht total diff.', formula: '$f(x,y) = |x| + |y|$', f: (x, y) => Math.abs(x) + Math.abs(y), fx: (x, y) => x > 0 ? 1 : (x < 0 ? -1 : NaN), fy: (x, y) => y > 0 ? 1 : (y < 0 ? -1 : NaN), totalDiff: false },
  { id: 'mv_classic', name: 'Standardgegenbeispiel', tag: 'nur partiell diff.', formula: '$f(x,y) = \\frac{xy}{x^2+y^2}$', f: (x, y) => (x * x + y * y) !== 0 ? (x * y) / (x * x + y * y) : 0, fx: (x, y) => { const d = x * x + y * y; return d !== 0 ? (y * (y * y - x * x)) / (d * d) : NaN; }, fy: (x, y) => { const d = x * x + y * y; return d !== 0 ? (x * (x * x - y * y)) / (d * d) : NaN; }, totalDiff: false },
  { id: 'mv_sqrt', name: 'Wurzel-Produkt', tag: 'nur partiell diff.', formula: '$f(x,y) = \\sqrt{|xy|}$', f: (x, y) => Math.sqrt(Math.abs(x * y)), fx: (x, y) => { const p = Math.abs(x * y); return p > 0.0001 ? (y * Math.sign(x * y)) / (2 * Math.sqrt(p)) : 0; }, fy: (x, y) => { const p = Math.abs(x * y); return p > 0.0001 ? (x * Math.sign(x * y)) / (2 * Math.sqrt(p)) : 0; }, totalDiff: false },
];

export const getTag = (model, mode) => {
  if (model.tags) return model.tags[mode] || '';
  return model.tag || '';
};
