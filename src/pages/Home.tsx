import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/* ─── Icons ─────────────────────────────────────────────────── */
const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const ArrowUpRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/>
    <polyline points="7 7 17 7 17 17"/>
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 3 16"/>
    <path d="M17 6h6v6"/>
  </svg>
);

/* ─── Ticker content ─────────────────────────────────────────── */
const TICKER = [
  'РЕКОМЕНДУЕМЫЙ КУРС',
  '✦',
  'ВЫБОР РЕДАКЦИИ',
  '✦',
  'НАЧНИ СЕЙЧАС',
  '✦',
  'FEATURED COURSE',
  '✦',
];

/* ─── Component ──────────────────────────────────────────────── */
export default function Home() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [featuredCourse, setFeaturedCourse] = useState<any>(null);
  const [socialStats, setSocialStats] = useState<any>(null);

  useEffect(() => {
    if (token) {
      loadFeaturedCourse();
      loadSocialStats();
    }
  }, [token]);

  const loadFeaturedCourse = async () => {
    try {
      const data = await fetch(
        `/api/courses?scope=all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await data.json();
      console.log('Featured course data:', json);
      if (Array.isArray(json) && json.length > 0) {
        console.log('Setting featured course:', json[0]);
        setFeaturedCourse(json[0]);
      }
    } catch (e) { console.error(e); }
  };

  const loadSocialStats = async () => {
    try {
      const data = await fetch(
        `/api/users/me/social`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await data.json();
      setSocialStats(json);
    } catch (e) { console.error(e); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .glass-effect {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        @keyframes reveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reveal { 
          opacity: 0; 
          animation: reveal 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; 
        }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.15s; }
        .d3 { animation-delay: 0.25s; }
        .d4 { animation-delay: 0.35s; }

        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .ticker-wrap {
          overflow: hidden;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          background: rgba(255, 255, 255, 0.4);
        }

        .ticker-track {
          display: flex;
          gap: 0;
          width: max-content;
          animation: ticker 20s linear infinite;
        }

        .ticker-item {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: #64748b;
          padding: 10px 24px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .ticker-item.accent {
          color: #10b981;
        }

        .featured-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .featured-card:hover .fc-img {
          transform: scale(1.03);
        }

        .fc-img {
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .featured-card:hover .fc-btn {
          background: #10b981;
          border-color: #10b981;
          color: white;
        }

        .fc-btn {
          transition: all 0.3s;
        }

        .stat-card {
          cursor: default;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          transition: all 0.3s;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(16, 185, 129, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .stat-card.clickable {
          cursor: pointer;
        }

        .stat-num {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(48px, 5vw, 72px);
          line-height: 1;
          letter-spacing: -0.02em;
          color: #1e293b;
        }

        .stat-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #64748b;
        }

        .stat-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #64748b;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .stat-card:hover .stat-icon {
          border-color: #10b981;
          color: #10b981;
          background: #f0fdf4;
        }

        .fc-title {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .diff-badge {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          color: #475569;
          padding: 6px 14px;
          border-radius: 100px;
        }

        .info-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #475569;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .section-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #10b981;
        }

        .h-rule {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.08), transparent);
        }
      `}</style>

      <div className="min-h-screen px-5 py-5">
        <div className="max-w-7xl mx-auto">

          {/* ── Featured Course ──────────────────────────────────── */}
          {featuredCourse && (
            <div
              className="featured-card reveal d1 mb-5"
              style={{ height: 480 }}
              onClick={() => navigate(`/courses/${featuredCourse.id}`)}
            >
              {/* image */}
              {featuredCourse.image_url ? (
                <img
                  className="fc-img absolute inset-0"
                  src={featuredCourse.image_url.startsWith('http') ? featuredCourse.image_url : `/uploads${featuredCourse.image_url}`}
                  alt={featuredCourse.title}
                  onLoad={() => console.log('Course image loaded successfully')}
                  onError={(e) => {
                    console.error('Failed to load course image:', {
                      imageUrl: featuredCourse.image_url,
                      constructedUrl: featuredCourse.image_url.startsWith('http') ? featuredCourse.image_url : `/uploads${featuredCourse.image_url}`,
                      error: e
                    });
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-100" />
              )}

              {/* overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-600/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-800/70 via-purple-500/30 to-transparent" />

              {/* top bar */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5">
                <div className="diff-badge">{featuredCourse.difficulty || 'Средний'}</div>
                <div className="info-pill">
                  <UserIcon />
                  <span>{featuredCourse._count?.enrollments || 0} студентов</span>
                </div>
              </div>

              {/* bottom content */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10">
                <div className="section-label mb-3 flex items-center gap-2">
                  <TrendingUpIcon />
                  <span>Рекомендуем</span>
                </div>

                <h2 className="fc-title text-white mb-4"
                  style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
                  {featuredCourse.title}
                </h2>

                <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-xl line-clamp-2">
                  {featuredCourse.description}
                </p>

                <button
                  className="fc-btn flex items-center gap-2 px-6 py-3 rounded-xl
                    bg-white/20 backdrop-blur-sm border border-white/30
                    text-white text-sm font-semibold
                    hover:shadow-lg"
                >
                  Начать курс
                  <ArrowUpRight />
                </button>
              </div>
            </div>
          )}

          {/* ── Ticker ───────────────────────────────────────────── */}
          <div className="ticker-wrap reveal d2 rounded-xl mb-5">
            <div className="ticker-track">
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className={`ticker-item ${t === '✦' ? 'accent' : ''}`}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Stats ────────────────────────────────────────────── */}
          <div className="reveal d3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Likes */}
              <div className="stat-card p-6 rounded-2xl">
                <div className="flex items-start justify-between mb-5">
                  <div className="stat-icon">
                    <HeartIcon />
                  </div>
                  <span className="text-xs font-bold text-gray-400">01</span>
                </div>
                <div className="stat-num mb-3">{socialStats?.totalLikes ?? '0'}</div>
                <div className="h-rule my-3" />
                <div className="stat-label">Лайков получено</div>
              </div>

              {/* Comments */}
              <div className="stat-card p-6 rounded-2xl">
                <div className="flex items-start justify-between mb-5">
                  <div className="stat-icon">
                    <MessageIcon />
                  </div>
                  <span className="text-xs font-bold text-gray-400">02</span>
                </div>
                <div className="stat-num mb-3">{socialStats?.totalComments ?? '0'}</div>
                <div className="h-rule my-3" />
                <div className="stat-label">Комментариев</div>
              </div>

              {/* Current course */}
              <div
                className={`stat-card p-6 rounded-2xl ${socialStats?.currentCourse ? 'clickable' : ''}`}
                onClick={() => socialStats?.currentCourse && navigate(`/courses/${socialStats.currentCourse.id}`)}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="stat-icon">
                    <BookIcon />
                  </div>
                  <span className="text-xs font-bold text-gray-400">03</span>
                </div>
                <div
                  className="stat-num mb-3"
                  style={{ fontSize: 'clamp(24px, 3vw, 42px)' }}
                >
                  {socialStats?.currentCourse
                    ? socialStats.currentCourse.title.substring(0, 12) +
                      (socialStats.currentCourse.title.length > 12 ? '…' : '')
                    : '—'}
                </div>
                <div className="h-rule my-3" />
                <div className="stat-label flex items-center justify-between">
                  <span>Текущий курс</span>
                  {socialStats?.currentCourse && (
                    <span className="text-emerald-500"><ArrowUpRight /></span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer note ──────────────────────────────────────── */}
          <div className="reveal d4 flex items-center justify-between mt-5 pt-3">
            <span className="section-label">Ваша активность</span>
            <span className="text-xs font-medium text-gray-400">
              {new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>

        </div>
      </div>
    </>
  );
}