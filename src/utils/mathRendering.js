import katex from 'katex';

let entityDecoder;

const MATH_COMMANDS = [
  'Longrightarrow',
  'Rightarrow',
  'operatorname',
  'limsup',
  'liminf',
  'setminus',
  'subseteq',
  'supseteq',
  'supset',
  'mathbb',
  'mathbf',
  'mathrm',
  'varepsilon',
  'epsilon',
  'delta',
  'Delta',
  'gamma',
  'Gamma',
  'theta',
  'Theta',
  'nabla',
  'sigma',
  'Sigma',
  'omega',
  'Omega',
  'lambda',
  'mu',
  'nu',
  'xi',
  'pi',
  'rho',
  'tau',
  'phi',
  'psi',
  'chi',
  'eta',
  'zeta',
  'approx',
  'neq',
  'ne',
  'leq',
  'geq',
  'le',
  'ge',
  'infty',
  'forall',
  'exists',
  'implies',
  'iff',
  'to',
  'mapsto',
  'rightarrow',
  'leftarrow',
  'nearrow',
  'searrow',
  'left',
  'right',
  'bigl',
  'Bigl',
  'bigr',
  'Bigr',
  'frac',
  'tfrac',
  'dfrac',
  'sum',
  'prod',
  'int',
  'oint',
  'sqrt',
  'sin',
  'cos',
  'tan',
  'arctan',
  'ln',
  'log',
  'exp',
  'cdot',
  'times',
  'pm',
  'mp',
  'quad',
  'qquad',
  'text',
  'begin',
  'end',
  'dots',
  'ldots',
  'cdots',
  'vdots',
  'ddots',
  'colon',
  'cap',
  'cup',
  'in',
  'notin',
  'not',
  'emptyset',
  'partial',
  'sup',
  'inf',
  'lim',
  'lfloor',
  'rfloor',
  'blacksquare',
  'square',
];

const normalizedCommandRegex = new RegExp(
  `(?<![A-Za-z\\\\])(${MATH_COMMANDS.sort((a, b) => b.length - a.length).join('|')})(?=[^A-Za-z]|$)`,
  'g',
);

export const decodeHtmlEntities = (value) => {
  if (!value || !value.includes('&') || typeof document === 'undefined') {
    return value;
  }

  if (!entityDecoder) {
    entityDecoder = document.createElement('textarea');
  }

  entityDecoder.innerHTML = value;
  return entityDecoder.value;
};

export const normalizeMathInput = (value) => {
  if (!value || typeof value !== 'string') {
    return value;
  }

  return value.replace(normalizedCommandRegex, '\\$1');
};

export const renderMathToHtml = (tex, displayMode = false) => ({
  __html: katex.renderToString(normalizeMathInput(tex), {
    displayMode,
    throwOnError: false,
    strict: 'ignore',
  }),
});
