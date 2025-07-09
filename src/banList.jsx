// BanList.jsx
import React from 'react';

export default function BanList({ banList, toggleBan }) {
  if (!banList || banList.size === 0) return null;

  return (
    <div style={{ marginTop: '1rem' }}>
      <strong>Ban List:</strong>
      {[...banList].map(value => (
        <span
          key={value}
          onClick={() => toggleBan(value)}
          style={{
            display: 'inline-block',
            margin: '0.25rem',
            padding: '0.25rem 0.5rem',
            background: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {value} ✕
        </span>
      ))}
    </div>
  );
}