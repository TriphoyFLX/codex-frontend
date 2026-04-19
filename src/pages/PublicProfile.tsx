import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/* ─── Icons ─────────────────────────────────────────────────── */
const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const SchoolIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M4 22h16"/><path d="M2 6l10-7 10 7"/><path d="M12 18v-8"/><path d="M9 12v4"/><path d="M15 12v4"/>
  </svg>
);
const XPIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const CoinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>
  </svg>
);
const LevelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2.26C4.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7 7 7 0 0 1 7 7c0 2.38-.81 4.47-2 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.34"/>
  </svg>
);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/* ─── Shared style block ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Manrope:wght@300;400;500;600;700&display=swap');
  :root { --acid:#5D45FD; --ink:#FAFAFA; --ink2:#FFFFFF; --line:rgba(0,0,0,0.08); --muted:rgba(0,0,0,0.45); --text:rgba(0,0,0,0.82); }
  .pp * { box-sizing: border-box; }
  .pp { font-family:'Manrope',sans-serif; background:var(--ink); color:var(--text); min-height:100vh; }

  @keyframes reveal { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  .rv{opacity:0;animation:reveal 0.6s cubic-bezier(0.22,1,0.36,1) forwards;}
  .d1{animation-delay:.04s}.d2{animation-delay:.1s}.d3{animation-delay:.17s}.d4{animation-delay:.25s}.d5{animation-delay:.33s}

  .sh{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted);}
  .disp{font-family:'Bebas Neue',sans-serif;letter-spacing:0.03em;}
  .mono-sm{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:0.06em;}
  .hr{height:1px;background:var(--line);}
  .badge{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;border:1px solid var(--line);color:var(--muted);padding:3px 8px;display:inline-block;}

  .btn-acid{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:var(--acid);color:#FFFFFF;border:none;padding:12px 22px;cursor:pointer;transition:opacity .15s;white-space:nowrap;border-radius:12px;}
  .btn-acid:hover{opacity:.88;}
  .btn-ghost{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:transparent;color:var(--muted);border:1px solid var(--line);padding:11px 20px;cursor:pointer;transition:border-color .15s,color .15s;white-space:nowrap;border-radius:12px;}
  .btn-ghost:hover{border-color:rgba(0,0,0,0.25);color:var(--text);}

  .card{border:1px solid var(--line);background:var(--ink2);padding:20px;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.05);}
  .stat-card{border:1px solid var(--line);background:var(--ink2);padding:16px;border-radius:12px;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:border-color .2s;}
  .stat-card:hover{border-color:rgba(93,69,253,0.3);}
`;

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProfile(); }, [userId]);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      setProfile(await (await fetch(`${API}/api/users/${userId}/public`, { headers })).json());
      setStats(await (await fetch(`${API}/api/users/${userId}/stats`, { headers })).json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  if (loading) return <div className="pp flex items-center justify-center" style={{ minHeight: '100vh' }}><span className="mono-sm">Загрузка...</span></div>;
  if (!profile) return <div className="pp flex items-center justify-center" style={{ minHeight: '100vh' }}><span className="mono-sm">Профиль не найден</span></div>;

  return (
    <>
      <style>{STYLES}</style>
      <div className="pp pb-20">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="rv d1" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center justify-between px-8 py-6">
            <div className="flex items-center gap-4">
              <button className="btn-ghost" style={{ padding: '8px 12px' }} onClick={() => navigate(-1)}><BackIcon /></button>
              <div>
                <div className="sh mb-2">Платформа / Профиль</div>
                <h1 className="disp" style={{ fontSize: 'clamp(36px,5vw,56px)', color: 'var(--text)' }}>Профиль</h1>
              </div>
            </div>
          </div>
        </div>

        {/* ── Profile Card ─────────────────────────────── */}
        <div className="rv d2 mt-8 px-8">
          <div className="card">
            <div className="flex items-start gap-6">
              {profile.avatar_url ? (
                <img src={profile.avatar_url.startsWith('http') ? profile.avatar_url : `${API}${profile.avatar_url}`} alt="Avatar" style={{ width: 80, height: 80, borderRadius: 20, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: 20, background: 'var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>{profile.username || profile.email}</h3>
                <p style={{ fontFamily: 'Manrope', fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{profile.email}</p>
                <div className="flex gap-4">
                  {profile.grade && <span className="mono-sm">Класс: {profile.grade}</span>}
                </div>
                {profile.school && (
                  <span className="mono-sm flex items-center gap-2 mt-2"><SchoolIcon /> {profile.school.name}</span>
                )}
              </div>
            </div>
            {profile.bio && (
              <p style={{ fontFamily: 'Manrope', fontSize: 13, color: 'var(--text)', marginTop: 16, lineHeight: 1.6 }}>{profile.bio}</p>
            )}
          </div>
        </div>

        {/* ── Stats ─────────────────────────────────────── */}
        {stats && (
          <div className="rv d3 mt-6 px-8">
            <div className="flex gap-4">
              <div className="stat-card">
                <span className="disp flex items-center gap-2" style={{ fontSize: 28, color: 'var(--acid)' }}><XPIcon /> {stats.xp || 0}</span>
                <span className="mono-sm" style={{ marginTop: 4 }}>XP</span>
              </div>
              <div className="stat-card">
                <span className="disp flex items-center gap-2" style={{ fontSize: 28, color: '#f59e0b' }}><CoinIcon /> {stats.coins || 0}</span>
                <span className="mono-sm" style={{ marginTop: 4 }}>Монеты</span>
              </div>
              <div className="stat-card">
                <span className="disp flex items-center gap-2" style={{ fontSize: 28, color: '#10b981' }}><LevelIcon /> {stats.level || 1}</span>
                <span className="mono-sm" style={{ marginTop: 4 }}>Уровень</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
