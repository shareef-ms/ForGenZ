import React from 'react';
import { useTheme } from '../ThemeContext';
import { useScreenSize } from '../useScreenSize';

function Header({ onHome }) {
  const theme = useTheme();
  const { isMobile } = useScreenSize();

  return (
    <div style={{
      padding: isMobile ? '1rem 1.2rem' : '1.2rem 2.5rem',
      borderBottom: `1px solid ${theme.border}`,
      background: theme.surface,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'background 0.3s'
    }}>
      {/* Logo */}
      <div onClick={onHome} style={{ cursor: 'pointer' }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: isMobile ? '20px' : '22px',
          fontWeight: '800', letterSpacing: '-1px', color: theme.text
        }}>
          For<span style={{ color: theme.accent }}>GenZ</span>
        </div>
        {!isMobile && (
          <div style={{ fontSize: '11px', color: theme.muted, letterSpacing: '1px', textTransform: 'uppercase' }}>
            AI Presentations for Gen Z
          </div>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Dark/Light toggle */}
        <button onClick={theme.toggle} style={{
          background: theme.surface2, border: `1px solid ${theme.border}`,
          borderRadius: '8px', padding: '8px 12px', cursor: 'pointer',
          fontSize: '16px', transition: 'all 0.2s'
        }}>
          {theme.isDark ? '☀️' : '🌙'}
        </button>

        {/* Ad banner */}
        {!isMobile && (
          <div style={{
            background: theme.surface2, border: `1px solid ${theme.border}`,
            borderRadius: '8px', padding: '8px 16px',
            fontSize: '12px', color: theme.muted
          }}>
            Ad · <span style={{ color: theme.accent, fontWeight: '500' }}>Upgrade to Pro ₹99/mo</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;