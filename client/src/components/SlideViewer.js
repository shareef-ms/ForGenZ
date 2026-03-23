import React, { useState, useEffect, useRef } from 'react';

const ANIMATION_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&family=Montserrat:wght@700;800&family=Raleway:wght@700;800&family=Oswald:wght@600;700&family=Poppins:wght@600;700&display=swap');

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(32px) scale(0.98); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-32px) scale(0.98); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
.content-animate {
  animation: fadeIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
}
.item-animate {
  animation: slideInUp 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
  opacity: 0;
}
.scale-animate {
  animation: scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
}
`;

// ── Mini Charts ──
function PieChart({ data, colors, size = 140 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.values) return;
    const ctx = canvas.getContext('2d');
    const cx = size / 2, cy = size / 2, r = size / 2 - 6;
    const total = data.values.reduce((a, b) => a + b, 0);
    let startAngle = -Math.PI / 2;
    ctx.clearRect(0, 0, size, size);
    data.values.forEach((val, i) => {
      const slice = (val / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      startAngle += slice;
    });
  }, [data, colors, size]);
  return <canvas ref={canvasRef} width={size} height={size} style={{ borderRadius: '50%' }} />;
}

function DonutChart({ data, colors, size = 140, centerValue, centerLabel }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.values) return;
    const ctx = canvas.getContext('2d');
    const cx = size / 2, cy = size / 2, r = size / 2 - 6, innerR = r * 0.58;
    const total = data.values.reduce((a, b) => a + b, 0);
    let startAngle = -Math.PI / 2;
    ctx.clearRect(0, 0, size, size);
    data.values.forEach((val, i) => {
      const slice = (val / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, startAngle + slice);
      ctx.arc(cx, cy, innerR, startAngle + slice, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      startAngle += slice;
    });
  }, [data, colors, size]);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas ref={canvasRef} width={size} height={size} />
      {centerValue && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', fontFamily: 'Syne,sans-serif' }}>{centerValue}</div>
          {centerLabel && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>{centerLabel}</div>}
        </div>
      )}
    </div>
  );
}

function BarChart({ data, colors, width = 500, height = 200 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.values) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    const values = data.values;
    const labels = data.labels || [];
    const max = Math.max(...values);
    const padL = 30, padB = 28, padT = 12, padR = 10;
    const chartW = width - padL - padR;
    const chartH = height - padB - padT;
    const barW = (chartW / values.length) * 0.55;
    const gap = (chartW / values.length) * 0.45;

    for (let i = 0; i <= 4; i++) {
      const y = padT + chartH - (i / 4) * chartH;
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(width - padR, y); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '9px Arial'; ctx.textAlign = 'right';
      ctx.fillText(Math.round((i / 4) * max), padL - 4, y + 3);
    }

    values.forEach((val, i) => {
      const barH = (val / max) * chartH;
      const x = padL + i * (barW + gap) + gap / 2;
      const y = padT + chartH - barH;
      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(1, colors[0] + '80');
      ctx.fillStyle = grad;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, barW, barH, 3);
      else ctx.rect(x, y, barW, barH);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center';
      ctx.fillText(val + (data.unit || ''), x + barW / 2, y - 4);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '9px Arial';
      ctx.fillText(String(labels[i] || '').slice(-4), x + barW / 2, height - 6);
    });
  }, [data, colors, width, height]);
  return <canvas ref={canvasRef} width={width} height={height} />;
}

// ── Force dark backgrounds ──
const DARK_GRADIENTS = [
  ['#0D1117', '#1A2332'],
  ['#0A1628', '#162A4A'],
  ['#0A0E1A', '#162040'],
  ['#111827', '#0A1628'],
];

function getForcedDarkGradient(gradients, index) {
  const pair = (gradients || DARK_GRADIENTS)[index % (gradients || DARK_GRADIENTS).length];
  const isLight = (hex) => {
    try {
      const h = hex.replace('#', '');
      const r = parseInt(h.slice(0,2), 16);
      const g = parseInt(h.slice(2,4), 16);
      const b = parseInt(h.slice(4,6), 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) > 100;
    } catch { return false; }
  };
  if (isLight(pair[0]) || isLight(pair[1])) {
    return DARK_GRADIENTS[index % DARK_GRADIENTS.length];
  }
  return pair;
}

// ── Slide Renderer ──
function SlideRenderer({ slide, accent, accent2, titleFont, bodyFont, gradients, slideNum, total }) {
  const TEXT = '#FFFFFF';
  const MUTED = 'rgba(255,255,255,0.72)';
  const chartColors = [accent, accent2, '#FF6B6B', '#FFB300', '#00E676', '#FF79C6', '#69F0AE'];
  const bgPair = getForcedDarkGradient(gradients, slideNum);

  return (
    <div style={{
      width: '100%', aspectRatio: '16/9',
      background: `linear-gradient(135deg, ${bgPair[0]} 0%, ${bgPair[1]} 100%)`,
      borderRadius: '12px', position: 'relative', overflow: 'hidden',
      boxShadow: '0 32px 64px rgba(0,0,0,0.7)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${accent}, ${accent2})`, flexShrink: 0, zIndex: 2, position: 'relative' }} />

      <div style={{ flex: 1, padding: '32px 44px 24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 2, WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>

        {/* TITLE */}
        {slide.type === 'title' && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', maxWidth: '80%' }}>
            <div className="content-animate" style={{ width: '44px', height: '4px', background: accent, borderRadius: '2px', marginBottom: '20px' }} />
            <h1 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(26px,3.8vw,50px)', fontWeight: '800', color: TEXT, lineHeight: '1.15', letterSpacing: '-1px', margin: '0 0 14px', animationDelay: '0.1s' }}>{slide.heading}</h1>
            <p className="content-animate" style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(13px,1.7vw,19px)', color: MUTED, margin: 0, lineHeight: '1.5', animationDelay: '0.2s' }}>{slide.subheading || slide.body}</p>
          </div>
        )}

        {/* OVERVIEW / BULLETS */}
        {(slide.type === 'overview' || slide.type === 'bullets') && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: (slide.items||[]).length > 4 ? '1fr 1fr' : '1fr', gap: '8px', flex: 1 }}>
              {(slide.items || []).map((item, i) => (
                <div key={i} className="item-animate" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.08)', animationDelay: `${0.15 + i * 0.08}s` }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, marginTop: '6px', flexShrink: 0 }} />
                  <span style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(12px,1.4vw,16px)', color: TEXT, lineHeight: '1.5', opacity: 0.92 }}>{item}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* STATS */}
        {slide.type === 'stats' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min((slide.stats||[]).length,3)},1fr)`, gap: '16px', flex: 1 }}>
              {(slide.stats || []).map((stat, i) => (
                <div key={i} className="item-animate" style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '12px', padding: '22px 18px', textAlign: 'center', border: `1px solid ${accent}35`, display: 'flex', flexDirection: 'column', justifyContent: 'center', animationDelay: `${0.15 + i * 0.1}s` }}>
                  <div style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(26px,3.2vw,44px)', fontWeight: '800', color: accent, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(11px,1.2vw,14px)', color: MUTED, marginTop: '8px', lineHeight: '1.4' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PIE CHART */}
        {slide.type === 'piechart' && (
          <>
            <div style={{ marginBottom: '18px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div className="scale-animate" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '36px', flex: 1, animationDelay: '0.2s' }}>
              <PieChart data={slide.chartData} colors={chartColors} size={160} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(slide.chartData?.labels || []).map((label, i) => (
                  <div key={i} className="item-animate" style={{ display: 'flex', alignItems: 'center', gap: '10px', animationDelay: `${0.3 + i * 0.07}s` }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: chartColors[i % chartColors.length], flexShrink: 0 }} />
                    <span style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(12px,1.3vw,15px)', color: TEXT }}>{label}</span>
                    <span style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(12px,1.3vw,15px)', color: accent, fontWeight: '700', marginLeft: 'auto', paddingLeft: '12px' }}>{slide.chartData?.values?.[i]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* BAR CHART */}
        {slide.type === 'barchart' && (
          <>
            <div style={{ marginBottom: '14px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div className="scale-animate" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', animationDelay: '0.2s' }}>
              <BarChart data={slide.chartData} colors={chartColors} width={520} height={200} />
            </div>
          </>
        )}

        {/* DONUT */}
        {slide.type === 'donut' && (
          <>
            <div style={{ marginBottom: '18px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div className="scale-animate" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '36px', flex: 1, animationDelay: '0.2s' }}>
              <DonutChart data={slide.chartData} colors={chartColors} size={160} centerValue={slide.centerValue} centerLabel={slide.centerLabel} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(slide.chartData?.labels || []).map((label, i) => (
                  <div key={i} className="item-animate" style={{ display: 'flex', alignItems: 'center', gap: '10px', animationDelay: `${0.3 + i * 0.07}s` }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: chartColors[i % chartColors.length], flexShrink: 0 }} />
                    <span style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(12px,1.3vw,15px)', color: TEXT }}>{label}</span>
                    <span style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(12px,1.3vw,15px)', color: accent, fontWeight: '700', marginLeft: 'auto', paddingLeft: '12px' }}>{slide.chartData?.values?.[i]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* BLOCKS */}
        {slide.type === 'blocks' && (
          <>
            <div style={{ marginBottom: '18px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
              {(slide.blocks || []).slice(0, 4).map((b, i) => (
                <div key={i} className="item-animate" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px', border: `1px solid ${accent}25`, display: 'flex', flexDirection: 'column', gap: '6px', animationDelay: `${0.15 + i * 0.09}s` }}>
                  <div style={{ fontSize: '24px' }}>{b.icon}</div>
                  <div style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(13px,1.5vw,17px)', fontWeight: '700', color: TEXT }}>{b.title}</div>
                  <div style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(11px,1.2vw,13px)', color: MUTED, lineHeight: '1.5' }}>{b.body}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TIMELINE */}
        {slide.type === 'timeline' && (
          <>
            <div style={{ marginBottom: '18px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div style={{ flex: 1, paddingLeft: '20px', borderLeft: `2px solid ${accent}40`, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
              {(slide.items || []).map((it, i) => (
                <div key={i} className="item-animate" style={{ position: 'relative', paddingLeft: '14px', animationDelay: `${0.15 + i * 0.1}s` }}>
                  <div style={{ position: 'absolute', left: '-27px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: accent, border: '2px solid #0D1117' }} />
                  <div style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(12px,1.4vw,16px)', fontWeight: '700', color: accent }}>{it.year} <span style={{ color: TEXT }}>— {it.title}</span></div>
                  <div style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(11px,1.2vw,14px)', color: MUTED, marginTop: '3px', lineHeight: '1.5' }}>{it.body}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* COMPARISON */}
        {slide.type === 'comparison' && (
          <>
            <div style={{ marginBottom: '18px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', flex: 1 }}>
              <div className="item-animate" style={{ background: 'rgba(255,107,107,0.1)', borderRadius: '10px', padding: '18px', border: '1px solid rgba(255,107,107,0.3)', animationDelay: '0.2s' }}>
                <div style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(13px,1.5vw,17px)', fontWeight: '700', color: '#FF6B6B', textAlign: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,107,107,0.2)' }}>{slide.col1?.title}</div>
                {(slide.col1?.items || []).map((item, i) => (
                  <div key={i} className="item-animate" style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start', animationDelay: `${0.3 + i * 0.07}s` }}>
                    <span style={{ color: '#FF6B6B', fontSize: '14px', flexShrink: 0 }}>✗</span>
                    <span style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(11px,1.2vw,14px)', color: TEXT, lineHeight: '1.5' }}>{item}</span>
                  </div>
                ))}
              </div>
              <div className="item-animate" style={{ background: 'rgba(0,230,118,0.1)', borderRadius: '10px', padding: '18px', border: '1px solid rgba(0,230,118,0.3)', animationDelay: '0.25s' }}>
                <div style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(13px,1.5vw,17px)', fontWeight: '700', color: '#00E676', textAlign: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(0,230,118,0.2)' }}>{slide.col2?.title}</div>
                {(slide.col2?.items || []).map((item, i) => (
                  <div key={i} className="item-animate" style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start', animationDelay: `${0.3 + i * 0.07}s` }}>
                    <span style={{ color: '#00E676', fontSize: '14px', flexShrink: 0 }}>✓</span>
                    <span style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(11px,1.2vw,14px)', color: TEXT, lineHeight: '1.5' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* PROCESS */}
        {slide.type === 'process' && (
          <>
            <div style={{ marginBottom: '18px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              {(slide.steps || []).map((st, i, arr) => (
                <React.Fragment key={i}>
                  <div className="item-animate" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px', textAlign: 'center', border: `1px solid ${accent}30`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'center', animationDelay: `${0.15 + i * 0.1}s` }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: `${titleFont},sans-serif`, fontSize: '14px', fontWeight: '800', color: '#0D1117' }}>{st.num}</div>
                    <div style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(12px,1.4vw,16px)', fontWeight: '700', color: TEXT }}>{st.title}</div>
                    <div style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(10px,1.1vw,13px)', color: MUTED, lineHeight: '1.4' }}>{st.body}</div>
                  </div>
                  {i < arr.length - 1 && <div className="content-animate" style={{ color: accent, fontSize: '20px', flexShrink: 0, animationDelay: `${0.2 + i * 0.1}s` }}>→</div>}
                </React.Fragment>
              ))}
            </div>
          </>
        )}

        {/* QUOTE */}
        {slide.type === 'quote' && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <div className="content-animate" style={{ fontSize: 'clamp(48px,6vw,80px)', color: accent, lineHeight: '0.8', marginBottom: '14px', fontFamily: 'Georgia,serif' }}>"</div>
            <blockquote className="content-animate" style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(15px,1.9vw,23px)', fontStyle: 'italic', color: TEXT, lineHeight: '1.6', margin: '0 0 18px', borderLeft: `4px solid ${accent}`, paddingLeft: '22px', animationDelay: '0.15s' }}>{slide.quote}</blockquote>
            <div className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(13px,1.4vw,16px)', color: accent, paddingLeft: '22px', animationDelay: '0.25s' }}>{slide.attribution}</div>
          </div>
        )}

        {/* SWOT */}
        {slide.type === 'swot' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '10px', flex: 1 }}>
              {[
                { key: 'strengths', label: 'Strengths', color: '#00E676', bg: 'rgba(0,230,118,0.08)' },
                { key: 'weaknesses', label: 'Weaknesses', color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)' },
                { key: 'opportunities', label: 'Opportunities', color: '#00D2FF', bg: 'rgba(0,210,255,0.08)' },
                { key: 'threats', label: 'Threats', color: '#FFB300', bg: 'rgba(255,179,0,0.08)' },
              ].map(({ key, label, color, bg }, qi) => (
                <div key={key} className="item-animate" style={{ background: bg, borderRadius: '10px', padding: '14px', border: `1px solid ${color}30`, animationDelay: `${0.1 + qi * 0.08}s` }}>
                  <div style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(12px,1.4vw,15px)', fontWeight: '700', color, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                  {(slide[key] || []).map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '5px' }}>
                      <span style={{ color, flexShrink: 0, fontSize: '12px' }}>•</span>
                      <span style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(10px,1.1vw,13px)', color: TEXT, lineHeight: '1.4' }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ROADMAP */}
        {slide.type === 'roadmap' && (
          <>
            <div style={{ marginBottom: '18px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flex: 1, position: 'relative', alignItems: 'flex-start', paddingTop: '28px' }}>
              <div style={{ position: 'absolute', top: '16px', left: '24px', right: '24px', height: '2px', background: `${accent}40` }} />
              {(slide.phases || []).map((phase, j) => (
                <div key={j} className="item-animate" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative', animationDelay: `${0.15 + j * 0.1}s` }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: `${titleFont},sans-serif`, fontSize: '13px', fontWeight: '800', color: '#0D1117', zIndex: 1, flexShrink: 0 }}>{j + 1}</div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '10px', border: `1px solid ${accent}25`, width: '100%' }}>
                    <div style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(10px,1.2vw,13px)', fontWeight: '700', color: accent, marginBottom: '3px' }}>{phase.period}</div>
                    <div style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(11px,1.3vw,14px)', fontWeight: '700', color: TEXT, marginBottom: '6px' }}>{phase.title}</div>
                    {(phase.items || []).map((item, k) => (
                      <div key={k} style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(9px,1vw,12px)', color: MUTED, marginBottom: '3px' }}>• {item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* FUNNEL */}
        {slide.type === 'funnel' && (
          <>
            <div style={{ marginBottom: '18px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
              {(slide.stages || []).map((stage, j, arr) => {
                const width = 100 - (j * (55 / arr.length));
                const colors = [accent, accent2, '#00E676', '#FFB300', '#FF6B6B'];
                return (
                  <div key={j} className="item-animate" style={{ width: `${width}%`, background: `${colors[j % colors.length]}20`, border: `1px solid ${colors[j % colors.length]}50`, borderRadius: '8px', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animationDelay: `${0.1 + j * 0.1}s` }}>
                    <div style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(12px,1.4vw,16px)', fontWeight: '700', color: colors[j % colors.length] }}>{stage.label}</div>
                    <div style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(14px,1.8vw,20px)', fontWeight: '800', color: TEXT }}>{stage.value}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* HUB & SPOKE */}
        {slide.type === 'hubspoke' && (
          <>
            <div style={{ marginBottom: '14px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="scale-animate" style={{ width: '80px', height: '80px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, flexShrink: 0, boxShadow: `0 0 24px ${accent}50`, animationDelay: '0.1s' }}>
                <div style={{ fontFamily: `${titleFont},sans-serif`, fontSize: '11px', fontWeight: '800', color: '#0D1117', textAlign: 'center', padding: '6px' }}>{slide.center || 'Core'}</div>
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {(slide.spokes || []).slice(0, 6).map((spoke, j) => {
                  const count = Math.min((slide.spokes || []).length, 6);
                  const angle = (j / count) * 360 - 90;
                  const rad = (angle * Math.PI) / 180;
                  const r = 40;
                  const x = 50 + r * Math.cos(rad);
                  const y = 50 + r * Math.sin(rad);
                  return (
                    <div key={j} className="item-animate" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', background: 'rgba(255,255,255,0.08)', border: `1px solid ${accent}40`, borderRadius: '8px', padding: '7px 12px', textAlign: 'center', minWidth: '70px', animationDelay: `${0.2 + j * 0.07}s` }}>
                      <div style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(10px,1.1vw,13px)', color: TEXT, fontWeight: '500' }}>{spoke}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* CLOSING */}
        {slide.type === 'closing' && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
            <div className="scale-animate" style={{ width: '48px', height: '48px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '18px' }}>✓</div>
            <h1 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(26px,3.8vw,50px)', fontWeight: '800', color: TEXT, margin: '0 0 10px', letterSpacing: '-1px', animationDelay: '0.1s' }}>{slide.heading}</h1>
            <p className="content-animate" style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(13px,1.5vw,17px)', color: MUTED, margin: '0 0 20px', maxWidth: '80%', animationDelay: '0.2s' }}>{slide.body}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '380px' }}>
              {(slide.items || []).map((item, i) => (
                <div key={i} className="item-animate" style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(12px,1.3vw,15px)', color: accent, background: `${accent}18`, borderRadius: '6px', padding: '8px 16px', border: `1px solid ${accent}30`, animationDelay: `${0.3 + i * 0.08}s` }}>{item}</div>
              ))}
            </div>
          </div>
        )}

        {/* DEFAULT */}
        {!['title','overview','bullets','stats','piechart','barchart','donut','blocks','timeline','comparison','process','quote','swot','roadmap','funnel','hubspoke','closing'].includes(slide.type) && (
          <>
            <div style={{ marginBottom: '18px' }}>
              <h2 className="content-animate" style={{ fontFamily: `${titleFont},sans-serif`, fontSize: 'clamp(18px,2.4vw,30px)', fontWeight: '700', color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h2>
              <div className="content-animate" style={{ height: '2px', width: '44px', background: accent, borderRadius: '1px', animationDelay: '0.1s' }} />
            </div>
            <div className="content-animate" style={{ fontFamily: `${bodyFont},sans-serif`, fontSize: 'clamp(13px,1.5vw,17px)', color: TEXT, lineHeight: '1.7', flex: 1, animationDelay: '0.2s' }}>
              {slide.body || (slide.items || []).join('\n')}
            </div>
          </>
        )}
      </div>

      <div style={{ height: '2px', background: `linear-gradient(90deg, ${accent}40, ${accent2}40)`, flexShrink: 0, position: 'relative', zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: '8px', right: '14px', fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Sans,sans-serif', zIndex: 2 }}>
        {slideNum + 1} / {total}
      </div>
    </div>
  );
}

// ── Main SlideViewer ──
function SlideViewer({ slides, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex || 0);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState('right');

  const savedTheme = JSON.parse(localStorage.getItem('slideai-theme') || '{}');
  const savedFonts = JSON.parse(localStorage.getItem('slideai-fonts') || '{}');
  const accent = savedTheme.accent || '#6C5CE7';
  const accent2 = savedTheme.accent2 || '#00D2FF';
  const titleFont = savedFonts.title || 'Syne';
  const bodyFont = savedFonts.body || 'DM Sans';
  const gradients = savedTheme.gradients || DARK_GRADIENTS;
  const slide = slides[current];

  // Inject animation styles
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = ANIMATION_STYLES;
    document.head.appendChild(styleEl);
    return () => { try { document.head.removeChild(styleEl); } catch(e) {} };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setDirection('right');
        setAnimKey(k => k + 1);
        setCurrent(c => Math.min(c + 1, slides.length - 1));
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setDirection('left');
        setAnimKey(k => k + 1);
        setCurrent(c => Math.max(c - 1, 0));
      }
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, slides.length]);

  function goNext() {
    setDirection('right');
    setAnimKey(k => k + 1);
    setCurrent(c => Math.min(c + 1, slides.length - 1));
  }

  function goPrev() {
    setDirection('left');
    setAnimKey(k => k + 1);
    setCurrent(c => Math.max(c - 1, 0));
  }

  function goTo(i) {
    setDirection(i > current ? 'right' : 'left');
    setAnimKey(k => k + 1);
    setCurrent(i);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: 'rgba(0,0,0,0.9)', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '16px', fontWeight: '700', color: '#fff' }}>
          For<span style={{ color: accent }}>GenZ</span>
          <span style={{ color: '#555', fontSize: '13px', fontWeight: '400', marginLeft: '10px' }}>Presentation</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={goPrev} disabled={current === 0} style={{ width: '32px', height: '32px', borderRadius: '50%', background: current === 0 ? 'transparent' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: current === 0 ? '#333' : '#fff', fontSize: '16px', cursor: current === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
            <span style={{ fontSize: '13px', color: '#777', minWidth: '55px', textAlign: 'center' }}>{current + 1} / {slides.length}</span>
            <button onClick={goNext} disabled={current === slides.length - 1} style={{ width: '32px', height: '32px', borderRadius: '50%', background: current === slides.length - 1 ? 'transparent' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: current === slides.length - 1 ? '#333' : '#fff', fontSize: '16px', cursor: current === slides.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          </div>
          <button onClick={onClose} style={{ padding: '6px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#777', fontSize: '13px', cursor: 'pointer' }}>✕ Exit</button>
        </div>
      </div>

      {/* Slide area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 80px', overflow: 'hidden' }}>
        <div
          key={animKey}
          style={{
            width: '100%', maxWidth: '1000px',
            animation: `${direction === 'right' ? 'fadeInRight' : 'fadeInLeft'} 0.4s cubic-bezier(0.22,1,0.36,1) forwards`
          }}
        >
          <SlideRenderer
            slide={slide}
            accent={accent}
            accent2={accent2}
            titleFont={titleFont}
            bodyFont={bodyFont}
            gradients={gradients}
            slideNum={current}
            total={slides.length}
          />
        </div>
      </div>

      {/* Thumbnail strip */}
      <div style={{ display: 'flex', gap: '7px', padding: '10px 18px', background: 'rgba(0,0,0,0.9)', borderTop: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto', flexShrink: 0 }}>
        {slides.map((s, i) => {
          const bgPair = getForcedDarkGradient(gradients, i);
          return (
            <div key={i} onClick={() => goTo(i)} style={{
              width: '88px', height: '50px', flexShrink: 0, borderRadius: '6px',
              cursor: 'pointer', overflow: 'hidden',
              border: i === current ? `2px solid ${accent}` : '2px solid rgba(255,255,255,0.08)',
              background: `linear-gradient(135deg, ${bgPair[0]}, ${bgPair[1]})`,
              transition: 'border-color 0.15s', position: 'relative', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ height: '2px', background: accent, flexShrink: 0 }} />
              <div style={{ flex: 1, padding: '4px 6px', overflow: 'hidden' }}>
                <div style={{ fontSize: '7px', fontWeight: '700', color: 'rgba(255,255,255,0.85)', fontFamily: 'Syne,sans-serif', lineHeight: '1.2', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{s.heading}</div>
              </div>
              <div style={{ position: 'absolute', bottom: '3px', right: '5px', fontSize: '7px', color: 'rgba(255,255,255,0.3)' }}>{i + 1}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SlideViewer;