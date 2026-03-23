import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

export const TEMPLATES = [
  {
    id: 'dark-tech',
    name: 'Dark Tech',
    category: 'Technology',
    colors: { bg: '#0D1117', accent: '#00D2FF', accent2: '#6C5CE7', text: '#E6F1FF', muted: '#8B9CBB' },
    gradients: [['#0D1117','#1A2332'],['#111827','#0A1628'],['#0A0E1A','#162040'],['#0D1117','#0A1628']],
    titleFont: 'Syne',
    bodyFont: 'DM Sans',
    preview: ['#0D1117', '#00D2FF', '#6C5CE7'],
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    category: 'Business',
    colors: { bg: '#020B18', accent: '#00E5FF', accent2: '#0070F3', text: '#E0F7FF', muted: '#7BA5BB' },
    gradients: [['#020B18','#041830'],['#031020','#072040'],['#020A1A','#041530'],['#020B18','#031525']],
    titleFont: 'Syne',
    bodyFont: 'DM Sans',
    preview: ['#020B18', '#00E5FF', '#0070F3'],
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    category: 'Nature',
    colors: { bg: '#0A1A0F', accent: '#00E676', accent2: '#69F0AE', text: '#E8F5E9', muted: '#7AAB80' },
    gradients: [['#0A1A0F','#122A18'],['#0D1F12','#183020'],['#081510','#0F2015'],['#0A1A0F','#112018']],
    titleFont: 'Syne',
    bodyFont: 'DM Sans',
    preview: ['#0A1A0F', '#00E676', '#69F0AE'],
  },
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    category: 'Creative',
    colors: { bg: '#1A0A00', accent: '#FF6B35', accent2: '#FFB300', text: '#FFF3E0', muted: '#BB8A70' },
    gradients: [['#1A0A00','#2D1200'],['#1E0E00','#341500'],['#160800','#280F00'],['#1A0A00','#2A1000']],
    titleFont: 'Syne',
    bodyFont: 'DM Sans',
    preview: ['#1A0A00', '#FF6B35', '#FFB300'],
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    category: 'Premium',
    colors: { bg: '#0D0520', accent: '#9C27B0', accent2: '#E040FB', text: '#F3E5F5', muted: '#9B7AAB' },
    gradients: [['#0D0520','#180A35'],['#100728','#1E0D42'],['#0A0418','#150930'],['#0D0520','#16083A']],
    titleFont: 'Syne',
    bodyFont: 'DM Sans',
    preview: ['#0D0520', '#9C27B0', '#E040FB'],
  },
  {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    category: 'Minimal',
    colors: { bg: '#FFFFFF', accent: '#1A1A2E', accent2: '#4A4E69', text: '#1A1A2E', muted: '#6B7280' },
    gradients: [['#F8F9FA','#FFFFFF'],['#F0F2F5','#FAFAFA'],['#EEF0F3','#F8F8F8'],['#F5F5F5','#FFFFFF']],
    titleFont: 'Syne',
    bodyFont: 'DM Sans',
    preview: ['#FFFFFF', '#1A1A2E', '#4A4E69'],
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    category: 'Business',
    colors: { bg: '#0A1628', accent: '#2196F3', accent2: '#64B5F6', text: '#E3F2FD', muted: '#90A4AE' },
    gradients: [['#0A1628','#112240'],['#0D1B35','#162A4A'],['#081220','#0F1E38'],['#0A1628','#0E2040']],
    titleFont: 'Syne',
    bodyFont: 'DM Sans',
    preview: ['#0A1628', '#2196F3', '#64B5F6'],
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    category: 'Elegant',
    colors: { bg: '#1A0A0F', accent: '#F48FB1', accent2: '#F06292', text: '#FCE4EC', muted: '#BB8A9A' },
    gradients: [['#1A0A0F','#2D1018'],['#1E0E15','#34151E'],['#160810','#280F18'],['#1A0A0F','#2A1015']],
    titleFont: 'Syne',
    bodyFont: 'DM Sans',
    preview: ['#1A0A0F', '#F48FB1', '#F06292'],
  },
  {
    id: 'midnight-red',
    name: 'Midnight Red',
    category: 'Bold',
    colors: { bg: '#0D0000', accent: '#F44336', accent2: '#FF5722', text: '#FFEBEE', muted: '#BB8080' },
    gradients: [['#0D0000','#1A0505'],['#110303','#200808'],['#0A0000','#180404'],['#0D0000','#1A0505']],
    titleFont: 'Syne',
    bodyFont: 'DM Sans',
    preview: ['#0D0000', '#F44336', '#FF5722'],
  },
  {
    id: 'academic-white',
    name: 'Academic White',
    category: 'Academic',
    colors: { bg: '#F5F5F5', accent: '#1565C0', accent2: '#0D47A1', text: '#1A1A2E', muted: '#546E7A' },
    gradients: [['#E8EAF6','#F5F5F5'],['#E3F2FD','#FAFAFA'],['#EDE7F6','#F8F8F8'],['#E8EAF6','#F5F5F5']],
    titleFont: 'Syne',
    bodyFont: 'DM Sans',
    preview: ['#F5F5F5', '#1565C0', '#0D47A1'],
  },
  {
    id: 'neon-dark',
    name: 'Neon Dark',
    category: 'Modern',
    colors: { bg: '#050510', accent: '#00FF88', accent2: '#FF00FF', text: '#F0F0FF', muted: '#8080AA' },
    gradients: [['#050510','#0A0A20'],['#080818','#0F0F28'],['#030310','#080818'],['#050510','#0A0A1F']],
    titleFont: 'Syne',
    bodyFont: 'DM Sans',
    preview: ['#050510', '#00FF88', '#FF00FF'],
  },
  {
    id: 'golden-luxury',
    name: 'Golden Luxury',
    category: 'Premium',
    colors: { bg: '#0A0800', accent: '#FFD700', accent2: '#FFA000', text: '#FFFDE7', muted: '#BB9A50' },
    gradients: [['#0A0800','#1A1400'],['#0E0B00','#201800'],['#080600','#160F00'],['#0A0800','#181200']],
    titleFont: 'Syne',
    bodyFont: 'DM Sans',
    preview: ['#0A0800', '#FFD700', '#FFA000'],
  },
  {
  id: 'midnight-blue',
  name: 'Midnight Blue',
  category: 'Business',
  colors: { bg: '#000814', accent: '#4CC9F0', accent2: '#4361EE', text: '#E2E8F0', muted: '#94A3B8' },
  gradients: [['#000814','#001233'],['#000B1D','#001845'],['#000814','#001233'],['#000B1D','#001845']],
  titleFont: 'Syne', bodyFont: 'DM Sans',
  preview: ['#000814', '#4CC9F0', '#4361EE'],
},
{
  id: 'carbon',
  name: 'Carbon Dark',
  category: 'Technology',
  colors: { bg: '#111111', accent: '#F5F5F5', accent2: '#E0E0E0', text: '#FFFFFF', muted: '#9E9E9E' },
  gradients: [['#111111','#1A1A1A'],['#0D0D0D','#1F1F1F'],['#111111','#222222'],['#0D0D0D','#181818']],
  titleFont: 'Syne', bodyFont: 'DM Sans',
  preview: ['#111111', '#F5F5F5', '#E0E0E0'],
},
{
  id: 'aurora',
  name: 'Aurora',
  category: 'Creative',
  colors: { bg: '#0D0221', accent: '#7B2FBE', accent2: '#FF6B6B', text: '#F8F0FF', muted: '#B39DDB' },
  gradients: [['#0D0221','#1A0A3D'],['#0D0221','#2D0845'],['#0A0118','#1E0535'],['#0D0221','#1A0A3D']],
  titleFont: 'Syne', bodyFont: 'DM Sans',
  preview: ['#0D0221', '#7B2FBE', '#FF6B6B'],
},
{
  id: 'slate',
  name: 'Slate Pro',
  category: 'Minimal',
  colors: { bg: '#0F172A', accent: '#38BDF8', accent2: '#818CF8', text: '#F1F5F9', muted: '#94A3B8' },
  gradients: [['#0F172A','#1E293B'],['#0F172A','#1E293B'],['#0C1424','#1A2540'],['#0F172A','#1E293B']],
  titleFont: 'Syne', bodyFont: 'DM Sans',
  preview: ['#0F172A', '#38BDF8', '#818CF8'],
},
{
  id: 'crimson',
  name: 'Crimson',
  category: 'Bold',
  colors: { bg: '#0A0000', accent: '#DC2626', accent2: '#F97316', text: '#FEF2F2', muted: '#FCA5A5' },
  gradients: [['#0A0000','#1A0000'],['#0D0000','#200000'],['#080000','#160000'],['#0A0000','#1A0000']],
  titleFont: 'Syne', bodyFont: 'DM Sans',
  preview: ['#0A0000', '#DC2626', '#F97316'],
},
{
  id: 'ocean-deep',
  name: 'Ocean Deep',
  category: 'Nature',
  colors: { bg: '#001219', accent: '#94D2BD', accent2: '#0A9396', text: '#E9D8A6', muted: '#AE9B6E' },
  gradients: [['#001219','#001F2A'],['#001219','#002838'],['#000E14','#001A24'],['#001219','#001F2A']],
  titleFont: 'Syne', bodyFont: 'DM Sans',
  preview: ['#001219', '#94D2BD', '#0A9396'],
},
{
  id: 'lavender',
  name: 'Lavender',
  category: 'Elegant',
  colors: { bg: '#1A1035', accent: '#C084FC', accent2: '#818CF8', text: '#F5F0FF', muted: '#A78BFA' },
  gradients: [['#1A1035','#251848'],['#1A1035','#2D1F5A'],['#150D2A','#201540'],['#1A1035','#251848']],
  titleFont: 'Syne', bodyFont: 'DM Sans',
  preview: ['#1A1035', '#C084FC', '#818CF8'],
},
{
  id: 'matrix',
  name: 'Matrix',
  category: 'Technology',
  colors: { bg: '#000300', accent: '#00FF41', accent2: '#00CC33', text: '#CCFFCC', muted: '#66BB6A' },
  gradients: [['#000300','#000A00'],['#000300','#000D00'],['#000200','#000800'],['#000300','#000A00']],
  titleFont: 'Syne', bodyFont: 'DM Sans',
  preview: ['#000300', '#00FF41', '#00CC33'],
},
];

export const FONT_PAIRS = [
  { id: 'syne-dm', title: 'Syne', body: 'DM Sans', label: 'Modern' },
  { id: 'poppins-inter', title: 'Poppins', body: 'Inter', label: 'Clean' },
  { id: 'montserrat-opensans', title: 'Montserrat', body: 'Open Sans', label: 'Professional' },
  { id: 'playfair-lato', title: 'Playfair Display', body: 'Lato', label: 'Elegant' },
  { id: 'raleway-roboto', title: 'Raleway', body: 'Roboto', label: 'Technical' },
  { id: 'oswald-sourcesans', title: 'Oswald', body: 'Source Sans Pro', label: 'Bold' },
];

const CATEGORIES = ['All', 'Business', 'Academic', 'Technology', 'Creative', 'Minimal', 'Premium', 'Elegant', 'Bold', 'Modern', 'Nature'];

function TemplateSelector({ selectedTemplate, selectedFonts, onTemplateChange, onFontsChange }) {
  const theme = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('templates');

  const filtered = activeCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem'
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
        {['templates', 'fonts'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '6px 16px',
            background: activeTab === tab ? '#6C5CE7' : 'transparent',
            border: `1px solid ${activeTab === tab ? '#6C5CE7' : theme.border}`,
            borderRadius: '6px', color: activeTab === tab ? '#fff' : theme.muted,
            fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            textTransform: 'capitalize', fontWeight: activeTab === tab ? '600' : '400'
          }}>
            {tab === 'templates' ? '🎨 Templates' : '🔤 Fonts'}
          </button>
        ))}
      </div>

      {activeTab === 'templates' && (
        <>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem', overflowX: 'auto' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
                border: `1px solid ${activeCategory === cat ? '#6C5CE7' : theme.border}`,
                background: activeCategory === cat ? '#6C5CE720' : 'transparent',
                color: activeCategory === cat ? '#6C5CE7' : theme.muted,
                cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif'
              }}>{cat}</button>
            ))}
          </div>

          {/* Template grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
            {filtered.map(tpl => (
              <div key={tpl.id} onClick={() => onTemplateChange(tpl)} style={{
                borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
                border: `2px solid ${selectedTemplate?.id === tpl.id ? '#6C5CE7' : theme.border}`,
                transition: 'all 0.15s',
                transform: selectedTemplate?.id === tpl.id ? 'scale(1.02)' : 'scale(1)'
              }}
                onMouseEnter={e => { if (selectedTemplate?.id !== tpl.id) e.currentTarget.style.borderColor = '#6C5CE780'; }}
                onMouseLeave={e => { if (selectedTemplate?.id !== tpl.id) e.currentTarget.style.borderColor = theme.border; }}
              >
                {/* Color preview */}
                <div style={{ height: '60px', background: tpl.colors.bg, position: 'relative', overflow: 'hidden' }}>
                  {/* Gradient bars */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${tpl.preview[1]}, ${tpl.preview[2]})` }} />
                  {/* Sample slide mini */}
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ height: '4px', width: '60%', background: tpl.colors.accent, borderRadius: '2px', marginBottom: '4px' }} />
                    <div style={{ height: '3px', width: '40%', background: tpl.colors.muted + '80', borderRadius: '2px', marginBottom: '3px' }} />
                    <div style={{ height: '3px', width: '50%', background: tpl.colors.muted + '60', borderRadius: '2px' }} />
                  </div>
                  {selectedTemplate?.id === tpl.id && (
                    <div style={{ position: 'absolute', top: '4px', right: '4px', background: '#6C5CE7', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff' }}>✓</div>
                  )}
                </div>
                {/* Info */}
                <div style={{ padding: '6px 8px', background: theme.surface2 }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: theme.text }}>{tpl.name}</div>
                  <div style={{ fontSize: '9px', color: theme.muted, marginTop: '1px' }}>{tpl.category}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'fonts' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
          {FONT_PAIRS.map(fp => (
            <div key={fp.id} onClick={() => onFontsChange(fp)} style={{
              borderRadius: '10px', padding: '12px 14px', cursor: 'pointer',
              border: `2px solid ${selectedFonts?.id === fp.id ? '#6C5CE7' : theme.border}`,
              background: selectedFonts?.id === fp.id ? '#6C5CE710' : theme.surface2,
              transition: 'all 0.15s'
            }}>
              <div style={{ fontSize: '16px', fontFamily: fp.title + ', sans-serif', fontWeight: '700', color: theme.text, marginBottom: '4px' }}>
                {fp.title}
              </div>
              <div style={{ fontSize: '12px', fontFamily: fp.body + ', sans-serif', color: theme.muted, marginBottom: '6px' }}>
                {fp.body}
              </div>
              <div style={{ fontSize: '10px', color: '#6C5CE7', fontWeight: '500' }}>{fp.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TemplateSelector;