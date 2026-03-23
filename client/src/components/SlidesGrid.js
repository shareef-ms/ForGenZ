import React, { useState, useEffect, useRef } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext,
  sortableKeyboardCoordinates, rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SlideEditor from './SlideEditor';
import SlideViewer from './SlideViewer';
import AddSlideModal from './AddSlideModal';
import { useTheme } from '../ThemeContext';
import ImageSearch from './ImageSearch';

// ── Mini Chart Components ──
function MiniPieChart({ data, colors, size = 80 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || !data.values) return;
    const ctx = canvas.getContext('2d');
    const cx = size / 2, cy = size / 2, r = size / 2 - 4;
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

function MiniDonutChart({ data, colors, size = 80 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || !data.values) return;
    const ctx = canvas.getContext('2d');
    const cx = size / 2, cy = size / 2, r = size / 2 - 4, innerR = r * 0.55;
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
  return <canvas ref={canvasRef} width={size} height={size} />;
}

function MiniBarChart({ data, colors, width = 160, height = 70 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || !data.values) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    const values = data.values;
    const labels = data.labels || [];
    const max = Math.max(...values);
    const barW = (width - 20) / values.length - 4;
    const chartH = height - 20;
    values.forEach((val, i) => {
      const barH = (val / max) * chartH;
      const x = 10 + i * (barW + 4);
      const y = chartH - barH;
      ctx.fillStyle = colors[0];
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '7px Arial';
      ctx.textAlign = 'center';
      const label = labels[i] ? String(labels[i]).slice(-4) : '';
      ctx.fillText(label, x + barW / 2, height - 4);
    });
  }, [data, colors, width, height]);
  return <canvas ref={canvasRef} width={width} height={height} />;
}

// ── Slide Content Renderer ──
function SlideContent({ slide, accent, theme }) {
  const muted = 'rgba(255,255,255,0.65)';
  const chartColors = [accent, '#FF6B6B', '#FFB300', '#00E676', '#FF79C6', '#69F0AE'];

  if (slide.type === 'title') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '22px', fontWeight: '800', color: '#fff', lineHeight: '1.2', marginBottom: '8px' }}>{slide.heading}</div>
      <div style={{ fontSize: '12px', color: muted }}>{slide.subheading || slide.body}</div>
    </div>
  );

  if (slide.type === 'overview' || slide.type === 'bullets') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{slide.heading}</div>
      {(slide.items || []).slice(0, 4).map((item, j) => (
        <div key={j} style={{ fontSize: '11px', color: muted, marginBottom: '5px', paddingLeft: '12px', position: 'relative', lineHeight: '1.4' }}>
          <span style={{ position: 'absolute', left: 0, color: accent, fontSize: '10px' }}>▸</span>
          {item}
        </div>
      ))}
    </div>
  );

  if (slide.type === 'stats') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>{slide.heading}</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {(slide.stats || []).slice(0, 3).map((s, j) => (
          <div key={j} style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center', border: `1px solid ${accent}30` }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '18px', fontWeight: '800', color: accent }}>{s.value}</div>
            <div style={{ fontSize: '9px', color: muted, marginTop: '2px', lineHeight: '1.3' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (slide.type === 'piechart') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{slide.heading}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <MiniPieChart data={slide.chartData} colors={chartColors} size={80} />
        <div style={{ flex: 1 }}>
          {(slide.chartData?.labels || []).slice(0, 4).map((label, j) => (
            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: chartColors[j % chartColors.length], flexShrink: 0 }} />
              <span style={{ fontSize: '9px', color: muted }}>{label}</span>
              <span style={{ fontSize: '9px', color: accent, marginLeft: 'auto' }}>{slide.chartData?.values?.[j]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (slide.type === 'barchart') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>{slide.heading}</div>
      <MiniBarChart data={slide.chartData} colors={chartColors} width={240} height={80} />
    </div>
  );

  if (slide.type === 'donut') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{slide.heading}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <MiniDonutChart data={slide.chartData} colors={chartColors} size={80} />
          {slide.centerValue && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '13px', fontWeight: '800', color: '#fff' }}>{slide.centerValue}</div>
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          {(slide.chartData?.labels || []).slice(0, 4).map((label, j) => (
            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: chartColors[j % chartColors.length], flexShrink: 0 }} />
              <span style={{ fontSize: '9px', color: muted }}>{label}</span>
              <span style={{ fontSize: '9px', color: accent, marginLeft: 'auto' }}>{slide.chartData?.values?.[j]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (slide.type === 'blocks') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{slide.heading}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {(slide.blocks || []).slice(0, 4).map((b, j) => (
          <div key={j} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '7px 8px', border: `1px solid ${accent}20` }}>
            <div style={{ fontSize: '14px', marginBottom: '2px' }}>{b.icon}</div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#fff', marginBottom: '2px' }}>{b.title}</div>
            <div style={{ fontSize: '9px', color: muted, lineHeight: '1.3' }}>{b.body?.slice(0, 50)}{b.body?.length > 50 ? '...' : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (slide.type === 'timeline') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>{slide.heading}</div>
      <div style={{ paddingLeft: '16px', borderLeft: `2px solid ${accent}40` }}>
        {(slide.items || []).slice(0, 4).map((it, j) => (
          <div key={j} style={{ marginBottom: '8px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-20px', top: '3px', width: '8px', height: '8px', borderRadius: '50%', background: accent }} />
            <div style={{ fontSize: '10px', fontWeight: '700', color: accent }}>{it.year} — <span style={{ color: '#fff' }}>{it.title}</span></div>
            <div style={{ fontSize: '9px', color: muted, lineHeight: '1.3', marginTop: '1px' }}>{it.body?.slice(0, 60)}{it.body?.length > 60 ? '...' : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (slide.type === 'comparison') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{slide.heading}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <div style={{ background: 'rgba(255,100,100,0.1)', borderRadius: '6px', padding: '7px', border: '1px solid rgba(255,107,107,0.3)' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#FF6B6B', textAlign: 'center', marginBottom: '5px' }}>{slide.col1?.title}</div>
          {(slide.col1?.items || []).slice(0, 3).map((item, j) => (
            <div key={j} style={{ fontSize: '9px', color: muted, marginBottom: '3px', paddingLeft: '8px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#FF6B6B' }}>•</span>{item}
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(0,230,118,0.1)', borderRadius: '6px', padding: '7px', border: '1px solid rgba(0,230,118,0.3)' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#00E676', textAlign: 'center', marginBottom: '5px' }}>{slide.col2?.title}</div>
          {(slide.col2?.items || []).slice(0, 3).map((item, j) => (
            <div key={j} style={{ fontSize: '9px', color: muted, marginBottom: '3px', paddingLeft: '8px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#00E676' }}>•</span>{item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (slide.type === 'process') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{slide.heading}</div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', flexWrap: 'wrap' }}>
        {(slide.steps || []).slice(0, 4).map((st, j, arr) => (
          <React.Fragment key={j}>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '6px 8px', textAlign: 'center', flex: '1', minWidth: '55px', border: `1px solid ${accent}25` }}>
              <div style={{ fontSize: '9px', color: accent, fontWeight: '700' }}>{st.num}</div>
              <div style={{ fontSize: '10px', color: '#fff', fontWeight: '600', marginTop: '2px' }}>{st.title}</div>
              <div style={{ fontSize: '8px', color: muted, marginTop: '2px', lineHeight: '1.3' }}>{st.body?.slice(0, 30)}...</div>
            </div>
            {j < arr.length - 1 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', alignSelf: 'center', flexShrink: 0 }}>→</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  if (slide.type === 'quote') return (
    <div>
      <div style={{ fontSize: '36px', color: accent, lineHeight: '0.8', marginBottom: '6px', fontFamily: 'Georgia,serif' }}>"</div>
      <div style={{ fontSize: '12px', fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5', marginBottom: '8px' }}>
        {slide.quote?.slice(0, 120)}{slide.quote?.length > 120 ? '...' : ''}
      </div>
      <div style={{ fontSize: '10px', color: muted }}>{slide.attribution}</div>
    </div>
  );

  if (slide.type === 'swot') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{slide.heading}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
        {[
          { key: 'strengths', label: 'S — Strengths', color: '#00E676', bg: 'rgba(0,230,118,0.12)' },
          { key: 'weaknesses', label: 'W — Weaknesses', color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)' },
          { key: 'opportunities', label: 'O — Opportunities', color: '#00D2FF', bg: 'rgba(0,210,255,0.12)' },
          { key: 'threats', label: 'T — Threats', color: '#FFB300', bg: 'rgba(255,179,0,0.12)' },
        ].map(({ key, label, color, bg }) => (
          <div key={key} style={{ background: bg, borderRadius: '6px', padding: '6px 8px', border: `1px solid ${color}30` }}>
            <div style={{ fontSize: '9px', fontWeight: '800', color, marginBottom: '3px', textTransform: 'uppercase' }}>{label}</div>
            {(slide[key] || []).slice(0, 2).map((item, j) => (
              <div key={j} style={{ fontSize: '9px', color: 'rgba(255,255,255,0.75)', marginBottom: '2px' }}>• {item}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  if (slide.type === 'roadmap') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{slide.heading}</div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {(slide.phases || []).slice(0, 4).map((phase, j) => (
          <div key={j} style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '6px 7px', border: `1px solid ${accent}25` }}>
            <div style={{ fontSize: '9px', color: accent, fontWeight: '700', marginBottom: '2px' }}>{phase.period}</div>
            <div style={{ fontSize: '10px', color: '#fff', fontWeight: '600', marginBottom: '3px', lineHeight: '1.2' }}>{phase.title}</div>
            {(phase.items || []).slice(0, 2).map((item, k) => (
              <div key={k} style={{ fontSize: '8px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.3' }}>• {item}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  if (slide.type === 'funnel') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{slide.heading}</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        {(slide.stages || []).slice(0, 4).map((stage, j) => {
          const width = 100 - (j * 18);
          const colors = [accent, '#00D2FF', '#00E676', '#FFB300'];
          return (
            <div key={j} style={{ width: `${width}%`, background: `${colors[j % colors.length]}25`, border: `1px solid ${colors[j % colors.length]}50`, borderRadius: '4px', padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: colors[j % colors.length] }}>{stage.label}</div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#fff' }}>{stage.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (slide.type === 'hubspoke') return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>{slide.heading}</div>
      <div style={{ position: 'relative', height: '110px' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '52px', height: '52px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: `0 0 12px ${accent}50` }}>
          <div style={{ fontSize: '8px', fontWeight: '800', color: '#000', textAlign: 'center', padding: '2px', lineHeight: '1.2' }}>{(slide.center || 'Core').slice(0, 8)}</div>
        </div>
        {(slide.spokes || []).slice(0, 6).map((spoke, j) => {
          const count = Math.min((slide.spokes || []).length, 6);
          const angle = (j / count) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const r = 44;
          const x = 50 + r * Math.cos(rad);
          const y = 50 + r * Math.sin(rad);
          return (
            <div key={j} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', background: 'rgba(0,0,0,0.5)', border: `1px solid ${accent}40`, borderRadius: '4px', padding: '3px 6px', zIndex: 2, whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '8px', color: '#fff', fontWeight: '600' }}>{spoke.slice(0, 12)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (slide.type === 'closing') return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>{slide.heading}</div>
      <div style={{ fontSize: '11px', color: muted, marginBottom: '10px' }}>{slide.body}</div>
      {(slide.items || []).slice(0, 3).map((item, j) => (
        <div key={j} style={{ fontSize: '10px', color: accent, marginBottom: '4px' }}>✓ {item}</div>
      ))}
    </div>
  );

  // Default
  return (
    <div>
      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{slide.heading}</div>
      <div style={{ fontSize: '11px', color: muted, lineHeight: '1.5' }}>{slide.body || (slide.items || []).slice(0, 3).join(' • ')}</div>
    </div>
  );
}

// ── Sortable Slide Card ──
function SortableSlide({ slide, i, gradients, accent, typeBadgeColors, theme, onView, onEdit, onRegenerate, onDelete, isRegenerating, isDeleting, isSelected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.num });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDeleting ? 0 : isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  const bgPair = gradients[i % gradients.length];
  const badgeColor = typeBadgeColors[slide.type] || '#6C5CE7';

  return (
    <div ref={setNodeRef} style={style}>
      <div
        onClick={() => onSelect && onSelect(slide.num)}
        style={{
          borderRadius: '14px', overflow: 'hidden',
          border: `1.5px solid ${isSelected ? accent : isDragging ? accent : theme.border}`,
          background: theme.surface,
          transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
          boxShadow: isSelected ? `0 0 0 2px ${accent}30` : 'none',
          cursor: 'pointer'
        }}
        onMouseEnter={e => { if (!isDragging) e.currentTarget.style.transform = 'translateY(-3px)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {/* Slide preview — drag handle */}
        <div
          {...attributes}
          {...listeners}
          onClick={e => { e.stopPropagation(); onView(i); }}
          style={{
            minHeight: '240px', padding: '20px 18px 16px', position: 'relative',
            background: isRegenerating
              ? theme.surface2
              : `linear-gradient(135deg, ${bgPair[0]}F0, ${bgPair[1]}F0)`,
            cursor: isDragging ? 'grabbing' : 'pointer',
            display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}
        >
          {/* Top row */}
          <div style={{ position: 'absolute', top: '10px', left: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.7)', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>{slide.num}</span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>⠿</span>
          </div>
          <span style={{
            position: 'absolute', top: '10px', right: '12px',
            fontSize: '9px', padding: '3px 8px', borderRadius: '20px',
            fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px',
            background: `${badgeColor}25`, color: badgeColor, border: `1px solid ${badgeColor}40`
          }}>{slide.type}</span>

          {isRegenerating ? (
            <div style={{ textAlign: 'center', color: '#8B8A9E', fontSize: '13px', padding: '20px 0' }}>
              ⟳ Regenerating...
            </div>
          ) : (
            <div style={{ marginTop: '20px' }}>
              <SlideContent slide={slide} accent={accent} theme={theme} />
            </div>
          )}
        </div>

        {/* Image search */}
        <div style={{ padding: '8px 14px', borderTop: `1px solid ${theme.border}` }}
          onClick={e => e.stopPropagation()}>
          <ImageSearch slide={slide} onImageSelect={(url) => console.log('Image selected:', url)} />
        </div>

        {/* Footer */}
        <div
          style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${theme.border}` }}
          onClick={e => e.stopPropagation()}
        >
          <span style={{ fontSize: '10px', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{slide.type}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => onRegenerate(slide)} disabled={isRegenerating} style={{ background: 'transparent', border: 'none', color: theme.muted, fontSize: '11px', cursor: 'pointer', padding: '2px 6px' }}>↺</button>
            <button onClick={() => onEdit(slide)} style={{ background: 'transparent', border: 'none', color: accent, fontSize: '11px', cursor: 'pointer', padding: '2px 6px' }}>✎ edit</button>
            <button onClick={() => onDelete(slide.num)} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', fontSize: '11px', cursor: 'pointer', padding: '2px 6px' }}>🗑</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main SlidesGrid ──
function SlidesGrid({ slides: initialSlides, deckTitle, currentSlide, onSlideSelect }) {
  const [slides, setSlides] = useState(initialSlides);
  const [editingSlide, setEditingSlide] = useState(null);
  const [regenerating, setRegenerating] = useState(null);
  const [viewerIndex, setViewerIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingNum, setDeletingNum] = useState(null);

  const theme = useTheme();
  const slideTheme = JSON.parse(localStorage.getItem('slideai-theme') || '{}');
  const accent = slideTheme.accent || '#6C5CE7';
  const rawGradients = slideTheme.gradients || [['#0D1117', '#1A2332']];

  // Force dark gradients for card previews
  const gradients = rawGradients.map(pair => {
    const isDark = (hex) => {
      try {
        const h = (hex || '').replace('#', '');
        const r = parseInt(h.slice(0,2), 16);
        const g = parseInt(h.slice(2,4), 16);
        const b = parseInt(h.slice(4,6), 16);
        return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
      } catch { return true; }
    };
    if (!isDark(pair[0]) || !isDark(pair[1])) {
      return ['#0D1117', '#1A2332'];
    }
    return pair;
  });

  const typeBadgeColors = {
    title: '#6C5CE7', overview: '#00B894', bullets: '#0984E3',
    stats: '#FDCB6E', piechart: '#E17055', barchart: '#00CEC9',
    donut: '#A29BFE', blocks: '#55EFC4', timeline: '#74B9FF',
    comparison: '#FD79A8', process: '#FFEAA7', quote: '#DFE6E9',
    swot: '#00E676', roadmap: '#00D2FF', funnel: '#FF6B35',
    hubspoke: '#9C27B0', closing: '#6C5CE7'
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSlides(prev => {
        const oldIndex = prev.findIndex(s => s.num === active.id);
        const newIndex = prev.findIndex(s => s.num === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        return reordered.map((s, i) => ({ ...s, num: i + 1 }));
      });
    }
  }

  function handleSave(updatedSlide) {
    setSlides(prev => prev.map(s => s.num === updatedSlide.num ? updatedSlide : s));
    setEditingSlide(null);
  }

  function handleAddSlide(newSlide, insertIndex) {
    setSlides(prev => {
      const updated = [...prev];
      updated.splice(insertIndex, 0, newSlide);
      return updated.map((s, i) => ({ ...s, num: i + 1 }));
    });
    setShowAddModal(false);
  }

  function deleteSlide(num) {
    if (slides.length <= 1) { alert('Cannot delete the only slide!'); return; }
    setDeletingNum(num);
    setTimeout(() => {
      setSlides(prev => prev.filter(s => s.num !== num).map((s, i) => ({ ...s, num: i + 1 })));
      setDeletingNum(null);
    }, 300);
  }

  async function regenerateSlide(slide) {
    setRegenerating(slide.num);
    try {
      const topic = localStorage.getItem('slideai-topic') || 'general';
      const style = localStorage.getItem('slideai-style') || 'academic';
      const res = await fetch('https://forgenz-production.up.railway.app/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, style, slideType: slide.type, slideNum: slide.num })
      });
      const data = await res.json();
      if (data.slide) setSlides(prev => prev.map(s => s.num === slide.num ? { ...data.slide, num: slide.num } : s));
    } catch (e) { alert('Regeneration failed.'); }
    setRegenerating(null);
  }

  async function exportPptx() {
    try {
      const themeKey = localStorage.getItem('slideai-theme-key') || 'dark-tech';
      const response = await fetch('https://forgenz-production.up.railway.app/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides, deckTitle, theme: themeKey })
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deckTitle || 'ForGenZ'}.pptx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) { alert('Export failed.'); }
  }

  return (
    <div>
      {editingSlide && <SlideEditor slide={editingSlide} onSave={handleSave} onClose={() => setEditingSlide(null)} />}
      {viewerIndex !== null && <SlideViewer slides={slides} startIndex={viewerIndex} onClose={() => setViewerIndex(null)} />}
      {showAddModal && <AddSlideModal onAdd={handleAddSlide} onClose={() => setShowAddModal(false)} totalSlides={slides.length} />}

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '20px', fontWeight: '700', color: theme.text }}>
          {deckTitle}
          <span style={{ color: theme.muted, fontSize: '13px', fontWeight: '400', marginLeft: '10px' }}>{slides.length} slides</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowAddModal(true)} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.muted, fontFamily: 'DM Sans,sans-serif', fontSize: '13px', cursor: 'pointer' }}>+ Add Slide</button>
          <button onClick={() => setViewerIndex(0)} style={{ padding: '8px 18px', background: accent, border: 'none', borderRadius: '8px', color: '#fff', fontFamily: 'Syne,sans-serif', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>▶ Present</button>
          <button onClick={exportPptx} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.muted, fontFamily: 'DM Sans,sans-serif', fontSize: '13px', cursor: 'pointer' }}>⬇ Export .pptx</button>
        </div>
      </div>

      <div style={{ fontSize: '11px', color: theme.muted, marginBottom: '1rem' }}>⠿ Drag to reorder · click to present · ✎ to edit</div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={slides.map(s => s.num)} strategy={rectSortingStrategy}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', width: '100%', paddingBottom: '2rem' }}>
            {slides.map((slide, i) => (
              <SortableSlide
                key={slide.num}
                slide={slide}
                i={i}
                gradients={gradients}
                accent={accent}
                typeBadgeColors={typeBadgeColors}
                theme={theme}
                onView={() => setViewerIndex(i)}
                onEdit={setEditingSlide}
                onRegenerate={regenerateSlide}
                onDelete={deleteSlide}
                isRegenerating={regenerating === slide.num}
                isDeleting={deletingNum === slide.num}
                isSelected={currentSlide === slide.num}
                onSelect={(num) => onSlideSelect && onSlideSelect(num)}
              />
            ))}

            {/* Add slide card */}
            <div onClick={() => setShowAddModal(true)} style={{
              borderRadius: '14px', border: `2px dashed ${theme.border}`,
              background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              minHeight: '260px', gap: '8px', transition: 'border-color 0.2s, background 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = `${accent}08`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ fontSize: '28px', color: theme.muted }}>+</div>
              <div style={{ fontSize: '13px', color: theme.muted }}>Add New Slide</div>
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default SlidesGrid;