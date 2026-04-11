import React, { useEffect, useRef } from 'react';

let Plotly = null;
let plotlyLoading = false;
let plotlyCallbacks = [];

function loadPlotly() {
  if (Plotly) return Promise.resolve(Plotly);
  if (plotlyLoading) {
    return new Promise(resolve => plotlyCallbacks.push(resolve));
  }
  plotlyLoading = true;
  return import('plotly.js-dist-min').then(mod => {
    Plotly = mod.default || mod;
    plotlyCallbacks.forEach(cb => cb(Plotly));
    plotlyCallbacks = [];
    return Plotly;
  });
}

export default function PlotlyChart({ data, layout, config, style, className }) {
  const ref = useRef(null);
  const plotlyRef = useRef(null);

  useEffect(() => {
    loadPlotly().then(P => {
      plotlyRef.current = P;
      if (ref.current) {
        const isDark = document.documentElement.classList.contains('dark');
        const mergedLayout = {
          paper_bgcolor: 'transparent',
          plot_bgcolor: isDark ? '#1e293b' : '#ffffff',
          font: { color: isDark ? '#e2e8f0' : '#334155', family: 'system-ui, sans-serif' },
          margin: { t: 40, r: 20, b: 50, l: 60 },
          autosize: true,
          ...layout,
        };
        const mergedConfig = {
          responsive: true,
          displayModeBar: false,
          ...config,
        };
        P.newPlot(ref.current, data, mergedLayout, mergedConfig);
      }
    });
    return () => {
      if (ref.current && plotlyRef.current) {
        try { plotlyRef.current.purge(ref.current); } catch (e) {}
      }
    };
  }, [data, layout, config]);

  return <div ref={ref} style={style} className={className} />;
}
