import React from 'react';
import { decodeHtmlEntities, normalizeMathInput, renderMathToHtml } from '../utils/mathRendering';

// --- Robuster Text- und Mathe-Parser ---
export const TextWithMath = ({ text, katexReady }) => {
  if (!text) return null;
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$.*?\$)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = normalizeMathInput(part.slice(2, -2));
          if (katexReady) {
            try {
              return <span key={i} dangerouslySetInnerHTML={renderMathToHtml(math, true)} />;
            } catch (e) {
              return <span key={i}>{math}</span>;
            }
          }
          return <span key={i} className="font-serif italic">{math}</span>;
        }
        if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
          const math = normalizeMathInput(part.slice(1, -1));
          if (katexReady) {
            try {
              return <span key={i} dangerouslySetInnerHTML={renderMathToHtml(math)} />;
            } catch (e) {
              return <span key={i}>{math}</span>;
            }
          }
          return <span key={i} className="font-serif italic">{math}</span>;
        }

        const decodedPart = decodeHtmlEntities(part);
        const textParts = decodedPart.split(/(\*\*.*?\*\*)/g);
        return (
          <span key={i}>
            {textParts.map((tPart, j) => {
              if (tPart.startsWith('**') && tPart.endsWith('**') && tPart.length >= 4) {
                return <strong key={j} className="font-bold text-slate-900 dark:text-slate-100">{decodeHtmlEntities(tPart.slice(2, -2))}</strong>;
              }
              return <span key={j}>{tPart}</span>;
            })}
          </span>
        );
      })}
    </>
  );
};

export const BlockMath = ({ tex, katexReady }) => {
  if (!tex) return null;
  const mathStr = normalizeMathInput(tex.replace(/\$\$/g, '').replace(/\$/g, ''));
  if (!katexReady) return <div className="font-serif italic text-xl text-center w-full">{mathStr}</div>;
  try {
    return <div className="w-full flex justify-center text-xl" dangerouslySetInnerHTML={renderMathToHtml(mathStr, true)} />;
  } catch (e) {
    return <div className="font-serif italic text-xl text-center w-full">{mathStr}</div>;
  }
};

// SVG Mathe Renderer
export const SvgMath = ({ x, y, width = 100, height = 40, tex, color, anchor = "middle", bold = false, katexReady }) => {
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

  const cleanTex = typeof tex === 'string' ? normalizeMathInput(tex.replace(/\$/g, '')) : tex;

  return (
    <foreignObject x={fX} y={y} width={width} height={height} overflow="visible">
      <div style={style} xmlns="http://www.w3.org/1999/xhtml">
        {katexReady ? (
          <span dangerouslySetInnerHTML={renderMathToHtml(cleanTex)} />
        ) : (
          <span className="font-serif italic">{cleanTex}</span>
        )}
      </div>
    </foreignObject>
  );
};

export const Slider = ({ label, val, min, max, step, setFn, katexReady }) => (
  <div className="flex flex-col flex-1 min-w-[140px] px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
    <div className="flex justify-between text-xs mb-2">
      <span className="font-bold text-slate-700 dark:text-slate-300"><TextWithMath text={label} katexReady={katexReady} /></span>
      <span className="text-indigo-700 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-900/50 px-1.5 py-0.5 rounded font-bold">{val.toFixed(step < 1 ? 2 : 0)}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={val}
      onChange={(e) => setFn(parseFloat(e.target.value))}
      className="w-full cursor-pointer accent-indigo-600 bg-slate-200 dark:bg-slate-600 rounded-lg"
    />
  </div>
);
