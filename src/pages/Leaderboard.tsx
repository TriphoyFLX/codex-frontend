import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

/* ─── Icons ─────────────────────────────────────────────────── */
const TrophyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2.26C4.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7 7 7 0 0 1 7 7c0 2.38-.81 4.47-2 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.34"/>
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

/* ─── Shared style block ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Manrope:wght@300;400;500;600;700&display=swap');
  :root { --acid:#5D45FD; --ink:#FAFAFA; --ink2:#FFFFFF; --line:rgba(0,0,0,0.08); --muted:rgba(0,0,0,0.45); --text:rgba(0,0,0,0.82); }
  .lb * { box-sizing: border-box; }
  .lb { font-family:'Manrope',sans-serif; background:var(--ink); color:var(--text); min-height:100vh; }

  @keyframes reveal { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  .rv{opacity:0;animation:reveal 0.6s cubic-bezier(0.22,1,0.36,1) forwards;}
  .d1{animation-delay:.04s}.d2{animation-delay:.1s}.d3{animation-delay:.17s}.d4{animation-delay:.25s}.d5{animation-delay:.33s}

  .sh{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted);}
  .disp{font-family:'Bebas Neue',sans-serif;letter-spacing:0.03em;}
  .mono-sm{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:0.06em;}
  .hr{height:1px;background:var(--line);}
  .badge{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;border:1px solid var(--line);color:var(--muted);padding:3px 8px;display:inline-block;}

  .tab-btn{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;padding:10px 20px;border-radius:10px;cursor:pointer;transition:all .15s;border:none;background:transparent;color:var(--muted);}
  .tab-btn:hover{color:var(--text);}
  .tab-btn.active{background:var(--acid);color:#FFFFFF;}

  .leader-row{border:1px solid var(--line);background:var(--ink2);padding:16px;border-radius:12px;display:flex;align-items:center;gap:16px;transition:border-color .2s;}
  .leader-row:hover{border-color:rgba(93,69,253,0.3);}
  .leader-row.gold{border-color:rgba(234,179,8,0.5);background:rgba(234,179,8,0.05);}
  .leader-row.silver{border-color:rgba(156,163,175,0.5);background:rgba(156,163,175,0.05);}
  .leader-row.bronze{border-color:rgba(180,83,9,0.5);background:rgba(180,83,9,0.05);}
`;

export default function Leaderboard() {
  const { token } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [type, setType] = useState<'global' | 'school'>('global');

  useEffect(() => { loadLeaderboard(); }, [type, token]);

  const loadLeaderboard = async () => {
    if (!token) return;
    try {
      setLeaderboard(type === 'global' ? await api.leaderboard.getGlobal(token) : await api.leaderboard.getSchool(token));
    } catch (e) { console.error(e); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="lb pb-20">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="rv d1" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <div className="sh mb-2">Платформа / Рейтинг</div>
              <h1 className="disp" style={{ fontSize: 'clamp(36px,5vw,56px)', color: 'var(--text)' }}>Рейтинг</h1>
            </div>
            <div className="flex gap-3">
              <button className={`tab-btn ${type === 'global' ? 'active' : ''}`} onClick={() => setType('global')}>Глобальный</button>
              <button className={`tab-btn ${type === 'school' ? 'active' : ''}`} onClick={() => setType('school')}>Школа</button>
            </div>
          </div>
        </div>

        {/* ── Leaderboard List ─────────────────────────────── */}
        <div className="rv d2 mt-8 px-8">
          <div className="flex items-center gap-6 pb-5">
            <span className="sh flex items-center gap-2"><TrophyIcon /> {type === 'global' ? 'Глобальный рейтинг' : 'Рейтинг школы'}</span>
            <span className="mono-sm">{leaderboard.length} участников</span>
          </div>
          <div className="hr" />
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {leaderboard.map((entry, idx) => (
              <div key={entry.id} className={`leader-row ${idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : ''}`}>
                <span className="disp" style={{ fontSize: 24, width: 32, textAlign: 'center', color: idx === 0 ? '#eab308' : idx === 1 ? '#9ca3af' : idx === 2 ? '#b45309' : 'var(--muted)' }}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{entry.user?.profile?.username || entry.user?.email}</span>
                </div>
                <div className="flex gap-6">
                  <span className="mono-sm flex items-center gap-2"><XPIcon /> {entry.xp}</span>
                  <span className="mono-sm flex items-center gap-2"><CoinIcon /> {entry.coins}</span>
                  <span className="mono-sm flex items-center gap-2"><LevelIcon /> {entry.level}</span>
                </div>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <span className="mono-sm">Рейтинг пуст</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
