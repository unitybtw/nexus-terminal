import { CalendarDays, MapPin } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const initialEvents = [
  { id: 1, time: '14:00', title: 'BM Güvenlik Konseyi Acil Toplanıyor', location: 'New York, ABD', type: 'politics' },
  { id: 2, time: '14:30', title: 'Fed Başkanı Jerome Powell Konuşması', location: 'Washington, ABD', type: 'economy' },
  { id: 3, time: '15:15', title: '6.8 Şiddetinde Deprem Bildirildi', location: 'Tokyo, Japonya', type: 'alert' },
  { id: 4, time: '16:00', title: 'G7 Liderleri İklim Zirvesi', location: 'Paris, Fransa', type: 'politics' }
];

const mockEventData = [
  { title: 'Büyük Teknoloji Lansmanı', location: 'Cupertino, ABD', type: 'tech' },
  { title: 'Tsunami Uyarısı Kaldırıldı', location: 'Pasifik Okyanusu', type: 'alert' },
  { title: 'Merkez Bankası Sürpriz Karar', location: 'Londra, İngiltere', type: 'economy' },
  { title: 'Yapay Zeka Zirvesi Başlıyor', location: 'Cenevre, İsviçre', type: 'tech' },
  { title: 'Barış Görüşmeleri Yeniden Başladı', location: 'İstanbul, Türkiye', type: 'politics' }
];

const getTypeColor = (type: string) => {
  switch(type) {
    case 'politics': return 'var(--accent-purple)';
    case 'economy': return 'var(--accent-green)';
    case 'alert': return 'var(--accent-red)';
    case 'tech': return 'var(--accent-cyan)';
    default: return 'var(--accent-blue)';
  }
};

export const EventsTimeline: React.FC = () => {
  const [events, setEvents] = useState(initialEvents);
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvent = mockEventData[Math.floor(Math.random() * mockEventData.length)];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newEvent = {
        id: counter,
        time: timeStr,
        title: randomEvent.title,
        location: randomEvent.location,
        type: randomEvent.type
      };

      setEvents(prev => {
        const updated = [newEvent, ...prev].slice(0, 8); // Keep latest 8 events
        return updated;
      });
      setCounter(c => c + 1);
    }, 12000);

    return () => clearInterval(interval);
  }, [counter]);

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="flex-between" style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 className="flex-center" style={{ gap: '0.5rem', fontSize: '1.25rem' }}>
          <CalendarDays className="text-gradient" /> Canlı Olaylar
        </h2>
        <span className="live-indicator"></span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          {/* Timeline vertical line */}
          <div style={{ 
            position: 'absolute', left: '16px', top: '10px', bottom: '10px', 
            width: '2px', background: 'rgba(255,255,255,0.1)' 
          }} />

          {events.map((event) => (
            <div key={event.id} className="slide-down-animation" style={{ 
              display: 'flex', gap: '1rem', marginBottom: '1.5rem', position: 'relative' 
            }}>
              {/* Timeline dot */}
              <div style={{ 
                width: '12px', height: '12px', borderRadius: '50%', 
                background: getTypeColor(event.type),
                border: '3px solid var(--bg-panel)',
                position: 'absolute', left: '11px', top: '4px', zIndex: 2,
                boxShadow: `0 0 10px ${getTypeColor(event.type)}`
              }} />

              <div style={{ width: '50px', marginLeft: '35px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {event.time}
              </div>
              
              <div style={{ 
                flex: 1, background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', 
                borderRadius: '0.5rem', marginTop: '-0.25rem' 
              }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{event.title}</h4>
                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <MapPin size={12} /> {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
