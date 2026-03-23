import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

const SLIDE_TYPES = [
  { type: 'title', icon: '🏷️', label: 'Title' },
  { type: 'overview', icon: '📋', label: 'Overview' },
  { type: 'bullets', icon: '📝', label: 'Bullets' },
  { type: 'stats', icon: '📊', label: 'Stats' },
  { type: 'piechart', icon: '🥧', label: 'Pie Chart' },
  { type: 'barchart', icon: '📈', label: 'Bar Chart' },
  { type: 'donut', icon: '🍩', label: 'Donut' },
  { type: 'blocks', icon: '🧩', label: 'Blocks' },
  { type: 'timeline', icon: '📅', label: 'Timeline' },
  { type: 'comparison', icon: '⚖️', label: 'Comparison' },
  { type: 'process', icon: '⚙️', label: 'Process' },
  { type: 'quote', icon: '💬', label: 'Quote' },
  { type: 'swot', icon: '🎯', label: 'SWOT' },
  { type: 'roadmap', icon: '🗺️', label: 'Roadmap' },
  { type: 'funnel', icon: '🔺', label: 'Funnel' },
  { type: 'hubspoke', icon: '🌐', label: 'Hub & Spoke' },
  { type: 'closing', icon: '🏁', label: 'Closing' },
];

function SlideEditor({ slide, onSave, onClose }) {
  const theme = useTheme();
  const [edited, setEdited] = useState(JSON.parse(JSON.stringify(slide)));
  const [activeTab, setActiveTab] = useState('content');
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  function update(path, value) {
    setEdited(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (keys[i].includes('[')) {
          const [k, idx] = keys[i].replace(']', '').split('[');
          obj = obj[k][parseInt(idx)];
        } else {
          obj = obj[keys[i]];
        }
      }
      const lastKey = keys[keys.length - 1];
      if (lastKey.includes('[')) {
        const [k, idx] = lastKey.replace(']', '').split('[');
        obj[k][parseInt(idx)] = value;
      } else {
        obj[lastKey] = value;
      }
      return next;
    });
  }

  function addItem(arrayPath, defaultItem) {
    setEdited(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = arrayPath.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]].push(defaultItem);
      return next;
    });
  }

  function removeItem(arrayPath, idx) {
    setEdited(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = arrayPath.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]].splice(idx, 1);
      return next;
    });
  }

  const inputStyle = {
    width: '100%', background: theme.surface2,
    border: `1px solid ${theme.border}`, borderRadius: '8px',
    padding: '8px 12px', color: theme.text,
    fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
    outline: 'none', marginBottom: '8px'
  };

  const labelStyle = {
    fontSize: '11px', color: theme.muted,
    textTransform: 'uppercase', letterSpacing: '0.5px',
    marginBottom: '4px', display: 'block'
  };

  const typeInfo = SLIDE_TYPES.find(t => t.type === edited.type) || SLIDE_TYPES[0];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: '16px', width: '100%', maxWidth: '700px',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: theme.text }}>
              Edit Slide {slide.num}
            </div>
            {/* Type selector */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowTypeMenu(p => !p)} style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '11px',
                background: '#6C5CE720', border: '1px solid #6C5CE740',
                color: '#6C5CE7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                {typeInfo.icon} {typeInfo.label} ▾
              </button>
              {showTypeMenu && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, zIndex: 100,
                  background: theme.surface, border: `1px solid ${theme.border}`,
                  borderRadius: '10px', padding: '8px', marginTop: '4px',
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px',
                  minWidth: '280px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                }}>
                  {SLIDE_TYPES.map(opt => (
                    <button key={opt.type} onClick={() => { update('type', opt.type); setShowTypeMenu(false); }} style={{
                      padding: '6px 8px', borderRadius: '6px', fontSize: '11px',
                      background: edited.type === opt.type ? '#6C5CE720' : 'transparent',
                      border: `1px solid ${edited.type === opt.type ? '#6C5CE7' : 'transparent'}`,
                      color: theme.text, cursor: 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.muted, padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', padding: '0.75rem 1.5rem 0', borderBottom: `1px solid ${theme.border}`, flexShrink: 0 }}>
          {['content', 'data', 'style'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '6px 16px', borderRadius: '6px 6px 0 0',
              background: activeTab === tab ? '#6C5CE7' : 'transparent',
              border: `1px solid ${activeTab === tab ? '#6C5CE7' : theme.border}`,
              borderBottom: activeTab === tab ? '1px solid #6C5CE7' : 'none',
              color: activeTab === tab ? '#fff' : theme.muted,
              fontSize: '12px', cursor: 'pointer', textTransform: 'capitalize', fontWeight: activeTab === tab ? '600' : '400'
            }}>{tab}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>

          {activeTab === 'content' && (
            <>
              {/* Heading — all types */}
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={edited.heading || ''} onChange={e => update('heading', e.target.value)} placeholder="Slide heading..." />

              {/* TITLE */}
              {edited.type === 'title' && <>
                <label style={labelStyle}>Subheading</label>
                <input style={inputStyle} value={edited.subheading || ''} onChange={e => update('subheading', e.target.value)} placeholder="Subtitle..." />
                <label style={labelStyle}>Body</label>
                <input style={inputStyle} value={edited.body || ''} onChange={e => update('body', e.target.value)} placeholder="Tagline..." />
              </>}

              {/* BULLETS / OVERVIEW */}
              {(edited.type === 'bullets' || edited.type === 'overview') && <>
                <label style={labelStyle}>Bullet Points</label>
                {(edited.items || []).map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                    <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={item} onChange={e => update(`items[${i}]`, e.target.value)} placeholder={`Point ${i + 1}...`} />
                    <button onClick={() => removeItem('items', i)} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px', padding: '0 6px' }}>✕</button>
                  </div>
                ))}
                <button onClick={() => addItem('items', 'New point')} style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.muted, fontSize: '12px', cursor: 'pointer', marginTop: '4px' }}>+ Add Point</button>
              </>}

              {/* STATS */}
              {edited.type === 'stats' && <>
                <label style={labelStyle}>Statistics</label>
                {(edited.stats || []).map((stat, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <input style={{ ...inputStyle, marginBottom: 0, width: '100px' }} value={stat.value} onChange={e => update(`stats[${i}].value`, e.target.value)} placeholder="Value..." />
                    <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={stat.label} onChange={e => update(`stats[${i}].label`, e.target.value)} placeholder="Label..." />
                    <button onClick={() => removeItem('stats', i)} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                  </div>
                ))}
                <button onClick={() => addItem('stats', { value: 'XX%', label: 'New metric' })} style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.muted, fontSize: '12px', cursor: 'pointer' }}>+ Add Stat</button>
              </>}

              {/* BLOCKS */}
              {edited.type === 'blocks' && <>
                <label style={labelStyle}>Blocks</label>
                {(edited.blocks || []).map((block, i) => (
                  <div key={i} style={{ background: theme.surface2, borderRadius: '8px', padding: '10px', marginBottom: '8px', border: `1px solid ${theme.border}` }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <input style={{ ...inputStyle, marginBottom: 0, width: '50px' }} value={block.icon} onChange={e => update(`blocks[${i}].icon`, e.target.value)} placeholder="🔥" />
                      <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={block.title} onChange={e => update(`blocks[${i}].title`, e.target.value)} placeholder="Title..." />
                      <button onClick={() => removeItem('blocks', i)} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                    </div>
                    <textarea style={{ ...inputStyle, marginBottom: 0, height: '60px', resize: 'vertical' }} value={block.body} onChange={e => update(`blocks[${i}].body`, e.target.value)} placeholder="Description..." />
                  </div>
                ))}
                <button onClick={() => addItem('blocks', { icon: '⚡', title: 'New Block', body: 'Description here' })} style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.muted, fontSize: '12px', cursor: 'pointer' }}>+ Add Block</button>
              </>}

              {/* TIMELINE */}
              {edited.type === 'timeline' && <>
                <label style={labelStyle}>Timeline Items</label>
                {(edited.items || []).map((item, i) => (
                  <div key={i} style={{ background: theme.surface2, borderRadius: '8px', padding: '10px', marginBottom: '8px', border: `1px solid ${theme.border}` }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <input style={{ ...inputStyle, marginBottom: 0, width: '80px' }} value={item.year} onChange={e => update(`items[${i}].year`, e.target.value)} placeholder="Year..." />
                      <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={item.title} onChange={e => update(`items[${i}].title`, e.target.value)} placeholder="Title..." />
                      <button onClick={() => removeItem('items', i)} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                    </div>
                    <input style={{ ...inputStyle, marginBottom: 0 }} value={item.body} onChange={e => update(`items[${i}].body`, e.target.value)} placeholder="Description..." />
                  </div>
                ))}
                <button onClick={() => addItem('items', { year: '2024', title: 'New Event', body: 'Description' })} style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.muted, fontSize: '12px', cursor: 'pointer' }}>+ Add Item</button>
              </>}

              {/* COMPARISON */}
              {edited.type === 'comparison' && <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Left Column Title</label>
                    <input style={inputStyle} value={edited.col1?.title || ''} onChange={e => update('col1.title', e.target.value)} placeholder="Before..." />
                    <label style={labelStyle}>Left Items</label>
                    {(edited.col1?.items || []).map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={item} onChange={e => update(`col1.items[${i}]`, e.target.value)} />
                        <button onClick={() => removeItem('col1.items', i)} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                      </div>
                    ))}
                    <button onClick={() => addItem('col1.items', 'New point')} style={{ padding: '4px 10px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.muted, fontSize: '11px', cursor: 'pointer' }}>+ Add</button>
                  </div>
                  <div>
                    <label style={labelStyle}>Right Column Title</label>
                    <input style={inputStyle} value={edited.col2?.title || ''} onChange={e => update('col2.title', e.target.value)} placeholder="After..." />
                    <label style={labelStyle}>Right Items</label>
                    {(edited.col2?.items || []).map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={item} onChange={e => update(`col2.items[${i}]`, e.target.value)} />
                        <button onClick={() => removeItem('col2.items', i)} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                      </div>
                    ))}
                    <button onClick={() => addItem('col2.items', 'New point')} style={{ padding: '4px 10px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.muted, fontSize: '11px', cursor: 'pointer' }}>+ Add</button>
                  </div>
                </div>
              </>}

              {/* PROCESS */}
              {edited.type === 'process' && <>
                <label style={labelStyle}>Process Steps</label>
                {(edited.steps || []).map((step, i) => (
                  <div key={i} style={{ background: theme.surface2, borderRadius: '8px', padding: '10px', marginBottom: '8px', border: `1px solid ${theme.border}` }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <input style={{ ...inputStyle, marginBottom: 0, width: '60px' }} value={step.num} onChange={e => update(`steps[${i}].num`, e.target.value)} placeholder="01" />
                      <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={step.title} onChange={e => update(`steps[${i}].title`, e.target.value)} placeholder="Step title..." />
                      <button onClick={() => removeItem('steps', i)} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                    </div>
                    <input style={{ ...inputStyle, marginBottom: 0 }} value={step.body} onChange={e => update(`steps[${i}].body`, e.target.value)} placeholder="Step description..." />
                  </div>
                ))}
                <button onClick={() => addItem('steps', { num: String(( edited.steps || []).length + 1).padStart(2, '0'), title: 'New Step', body: 'Description' })} style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.muted, fontSize: '12px', cursor: 'pointer' }}>+ Add Step</button>
              </>}

              {/* QUOTE */}
              {edited.type === 'quote' && <>
                <label style={labelStyle}>Quote Text</label>
                <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={edited.quote || ''} onChange={e => update('quote', e.target.value)} placeholder="Quote text..." />
                <label style={labelStyle}>Attribution</label>
                <input style={inputStyle} value={edited.attribution || ''} onChange={e => update('attribution', e.target.value)} placeholder="— Author Name, Title" />
              </>}
              {/* SWOT */}
{edited.type === 'swot' && <>
  {[
    { key: 'strengths', label: 'Strengths', color: '#00E676' },
    { key: 'weaknesses', label: 'Weaknesses', color: '#FF6B6B' },
    { key: 'opportunities', label: 'Opportunities', color: '#00D2FF' },
    { key: 'threats', label: 'Threats', color: '#FFB300' },
  ].map(({ key, label, color }) => (
    <div key={key} style={{ marginBottom: '12px' }}>
      <label style={{ ...labelStyle, color }}>{label}</label>
      {(edited[key] || []).map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
          <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={item} onChange={e => update(`${key}[${i}]`, e.target.value)} />
          <button onClick={() => removeItem(key, i)} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px' }}>✕</button>
        </div>
      ))}
      <button onClick={() => addItem(key, 'New point')} style={{ padding: '4px 10px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.muted, fontSize: '11px', cursor: 'pointer' }}>+ Add</button>
    </div>
  ))}
</>}

{/* ROADMAP */}
{edited.type === 'roadmap' && <>
  <label style={labelStyle}>Phases</label>
  {(edited.phases || []).map((phase, i) => (
    <div key={i} style={{ background: theme.surface2, borderRadius: '8px', padding: '10px', marginBottom: '8px', border: `1px solid ${theme.border}` }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
        <input style={{ ...inputStyle, marginBottom: 0, width: '100px' }} value={phase.period} onChange={e => update(`phases[${i}].period`, e.target.value)} placeholder="Q1 2024..." />
        <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={phase.title} onChange={e => update(`phases[${i}].title`, e.target.value)} placeholder="Phase title..." />
        <button onClick={() => removeItem('phases', i)} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px' }}>✕</button>
      </div>
      {(phase.items || []).map((item, j) => (
        <input key={j} style={{ ...inputStyle, marginBottom: '4px' }} value={item} onChange={e => update(`phases[${i}].items[${j}]`, e.target.value)} placeholder="Milestone..." />
      ))}
    </div>
  ))}
  <button onClick={() => addItem('phases', { period: 'Q1 2025', title: 'New Phase', items: ['Milestone 1'] })} style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.muted, fontSize: '12px', cursor: 'pointer' }}>+ Add Phase</button>
</>}

{/* FUNNEL */}
{edited.type === 'funnel' && <>
  <label style={labelStyle}>Funnel Stages</label>
  {(edited.stages || []).map((stage, i) => (
    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
      <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={stage.label} onChange={e => update(`stages[${i}].label`, e.target.value)} placeholder="Stage name..." />
      <input style={{ ...inputStyle, marginBottom: 0, width: '100px' }} value={stage.value} onChange={e => update(`stages[${i}].value`, e.target.value)} placeholder="Value..." />
      <button onClick={() => removeItem('stages', i)} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px' }}>✕</button>
    </div>
  ))}
  <button onClick={() => addItem('stages', { label: 'New Stage', value: '0' })} style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.muted, fontSize: '12px', cursor: 'pointer' }}>+ Add Stage</button>
</>}

{/* HUB & SPOKE */}
{edited.type === 'hubspoke' && <>
  <label style={labelStyle}>Center Hub</label>
  <input style={inputStyle} value={edited.center || ''} onChange={e => update('center', e.target.value)} placeholder="Center topic..." />
  <label style={labelStyle}>Spokes</label>
  {(edited.spokes || []).map((spoke, i) => (
    <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
      <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={spoke} onChange={e => update(`spokes[${i}]`, e.target.value)} placeholder="Spoke topic..." />
      <button onClick={() => removeItem('spokes', i)} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px' }}>✕</button>
    </div>
  ))}
  <button onClick={() => addItem('spokes', 'New Spoke')} style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.muted, fontSize: '12px', cursor: 'pointer' }}>+ Add Spoke</button>
</>}

              {/* CLOSING */}
              {edited.type === 'closing' && <>
                <label style={labelStyle}>Body</label>
                <input style={inputStyle} value={edited.body || ''} onChange={e => update('body', e.target.value)} placeholder="Closing message..." />
                <label style={labelStyle}>Takeaways</label>
                {(edited.items || []).map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                    <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={item} onChange={e => update(`items[${i}]`, e.target.value)} />
                    <button onClick={() => removeItem('items', i)} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                  </div>
                ))}
                <button onClick={() => addItem('items', 'New takeaway')} style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.muted, fontSize: '12px', cursor: 'pointer' }}>+ Add Takeaway</button>
              </>}
            </>
          )}

          {activeTab === 'data' && (
            <>
              {/* CHART DATA */}
              {(edited.type === 'piechart' || edited.type === 'barchart' || edited.type === 'donut') && <>
                <label style={labelStyle}>Chart Labels</label>
                {(edited.chartData?.labels || []).map((label, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                    <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={label} onChange={e => update(`chartData.labels[${i}]`, e.target.value)} placeholder="Label..." />
                    <input style={{ ...inputStyle, marginBottom: 0, width: '80px' }} type="number" value={edited.chartData?.values?.[i] || 0} onChange={e => update(`chartData.values[${i}]`, parseFloat(e.target.value))} placeholder="Value" />
                    <button onClick={() => { removeItem('chartData.labels', i); removeItem('chartData.values', i); }} style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                  </div>
                ))}
                <button onClick={() => { addItem('chartData.labels', 'New Label'); addItem('chartData.values', 10); }} style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.muted, fontSize: '12px', cursor: 'pointer' }}>+ Add Data Point</button>

                {edited.type === 'donut' && <>
                  <label style={{ ...labelStyle, marginTop: '12px' }}>Center Value</label>
                  <input style={inputStyle} value={edited.centerValue || ''} onChange={e => update('centerValue', e.target.value)} placeholder="e.g. 68%" />
                  <label style={labelStyle}>Center Label</label>
                  <input style={inputStyle} value={edited.centerLabel || ''} onChange={e => update('centerLabel', e.target.value)} placeholder="e.g. Growth" />
                </>}
              </>}

              {!['piechart', 'barchart', 'donut'].includes(edited.type) && (
                <div style={{ textAlign: 'center', color: theme.muted, fontSize: '13px', padding: '2rem' }}>
                  No chart data for this slide type.<br />Switch to a chart type to edit data.
                </div>
              )}
            </>
          )}

          {activeTab === 'style' && (
            <div style={{ textAlign: 'center', color: theme.muted, fontSize: '13px', padding: '2rem' }}>
              🎨 Style customization coming soon.<br />
              Template colors and fonts apply globally from the input section.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.muted, fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSave(edited)} style={{ padding: '10px 28px', background: '#6C5CE7', border: 'none', borderRadius: '8px', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            ✓ Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default SlideEditor;