import { Globe, Clock } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const initialNews = [
  {
    id: 1,
    title: 'Küresel Yapay Zeka Anlaşması İmzalandı',
    summary: 'Lider teknoloji firmaları ve hükümetler, YZ gelişimini denetleyecek yeni bir protokol üzerinde anlaştı.',
    category: 'Teknoloji',
    time: 'Şimdi',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    title: 'Avrupa Merkez Bankası Beklentileri Aştı',
    summary: 'Enflasyon verilerinin ardından AMB, faiz oranlarında sürpriz bir indirime gitti.',
    category: 'Ekonomi',
    time: '1 dk önce',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    title: 'Yeni Uzay Teleskobu İlk Görüntüleri Gönderdi',
    summary: 'Dünyadan 1.5 milyon kilometre uzaklıktaki teleskop, evrenin en derin köşelerini eşsiz bir netlikle görüntüledi.',
    category: 'Bilim',
    time: '3 dk önce',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
  }
];

const mockHeadlines = [
  { title: 'Asya Piyasalarında Büyük Dalgalanma', summary: 'Teknoloji hisselerindeki düşüş, genel endeksi baskıladı.', cat: 'Ekonomi', img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80' },
  { title: 'Otonom Araçlar İçin Yeni Yasa', summary: 'Sürücüsüz araçların trafikteki yeri yeniden tanımlanıyor.', cat: 'Teknoloji', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80' },
  { title: 'Küresel İklim Zirvesi Kararları', summary: 'Ülkeler karbon emisyonunu sıfırlama hedeflerini öne çekti.', cat: 'Dünya', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80' },
  { title: 'Yeni Nesil Çip Fabrikası Kuruluyor', summary: 'Yarı iletken krizini çözecek dev tesisin temelleri atıldı.', cat: 'Ekonomi', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80' }
];

export const NewsFeed: React.FC = () => {
  const [newsList, setNewsList] = useState(initialNews);
  const [counter, setCounter] = useState(4);

  useEffect(() => {
    // Generate a new news item every 8 seconds
    const interval = setInterval(() => {
      const randomHeadline = mockHeadlines[Math.floor(Math.random() * mockHeadlines.length)];
      
      const newArticle = {
        id: counter,
        title: randomHeadline.title,
        summary: randomHeadline.summary,
        category: randomHeadline.cat,
        time: 'Az önce',
        image: randomHeadline.img
      };

      setNewsList(prev => {
        const updated = [newArticle, ...prev].slice(0, 10); // Keep only top 10
        return updated;
      });
      setCounter(c => c + 1);
    }, 8000);

    return () => clearInterval(interval);
  }, [counter]);

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="flex-between" style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 className="flex-center" style={{ gap: '0.5rem', fontSize: '1.25rem' }}>
          <Globe className="text-gradient" /> Son Dakika
        </h2>
        <span className="live-indicator"></span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {newsList.map((news) => (
            <div key={news.id} style={{ 
              display: 'flex', gap: '1rem', padding: '1rem', 
              background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem',
              cursor: 'pointer'
            }} className="news-card slide-down-animation">
              <img 
                src={news.image} 
                alt={news.title} 
                style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '0.5rem' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                  <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 600, textTransform: 'uppercase' }}>
                      {news.category}
                    </span>
                    <span className="flex-center" style={{ fontSize: '0.75rem', color: 'var(--accent-red)', gap: '0.25rem', fontWeight: 600 }}>
                      <Clock size={12} /> {news.time}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{news.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {news.summary}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
