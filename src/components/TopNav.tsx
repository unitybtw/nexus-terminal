import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, User, Activity } from 'lucide-react';

export const TopNav: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="glass-panel" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 1.5rem',
      marginBottom: 'var(--spacing-6)'
    }}>
      {/* Logo & Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Activity size={20} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, lineHeight: 1 }} className="text-gradient">
            NEXUS
          </h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Global Command Center
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ 
        flex: 1, 
        maxWidth: '500px', 
        position: 'relative',
        margin: '0 2rem'
      }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Hisse senedi, haber veya ülke ara..." 
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '2rem',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
            color: 'var(--text-primary)',
            outline: 'none',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.5)';
            e.target.style.borderColor = 'var(--accent-cyan)';
          }}
          onBlur={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.3)';
            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        />
      </div>

      {/* Right Side: Time & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
            {formatTime(currentTime)}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {formatDate(currentTime)}
          </span>
        </div>
        
        <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }}></div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
            <Bell size={20} />
            <span style={{ 
              position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', 
              background: 'var(--accent-red)', borderRadius: '50%', border: '2px solid var(--bg-panel)' 
            }}></span>
          </button>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <Settings size={20} />
          </button>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <User size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
