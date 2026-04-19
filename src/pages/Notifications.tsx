import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* ─── Icons ─────────────────────────────────────────────────── */
const Plus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const BellIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/* ─── Shared style block ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Manrope:wght@300;400;500;600;700&display=swap');
  :root { --acid:#5D45FD; --ink:#FAFAFA; --ink2:#FFFFFF; --line:rgba(0,0,0,0.08); --muted:rgba(0,0,0,0.45); --text:rgba(0,0,0,0.82); }
  .nf * { box-sizing: border-box; }
  .nf { font-family:'Manrope',sans-serif; background:var(--ink); color:var(--text); min-height:100vh; }

  @keyframes reveal { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  .rv{opacity:0;animation:reveal 0.6s cubic-bezier(0.22,1,0.36,1) forwards;}
  .d1{animation-delay:.04s}.d2{animation-delay:.1s}.d3{animation-delay:.17s}.d4{animation-delay:.25s}.d5{animation-delay:.33s}

  .sh{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted);}
  .disp{font-family:'Bebas Neue',sans-serif;letter-spacing:0.03em;}
  .mono-sm{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:0.06em;}
  .hr{height:1px;background:var(--line);}

  .btn-acid{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:var(--acid);color:#FFFFFF;border:none;padding:12px 22px;cursor:pointer;transition:opacity .15s;white-space:nowrap;border-radius:12px;}
  .btn-acid:hover{opacity:.88;}
  .btn-ghost{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:transparent;color:var(--muted);border:1px solid var(--line);padding:11px 20px;cursor:pointer;transition:border-color .15s,color .15s;white-space:nowrap;border-radius:12px;}
  .btn-ghost:hover{border-color:rgba(0,0,0,0.25);color:var(--text);}

  .card{border:1px solid var(--line);background:var(--ink2);padding:20px;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.05);}
  .notif-card{border:1px solid var(--line);background:var(--ink2);padding:20px;border-radius:16px;transition:border-color .2s,background .2s;}
  .notif-card:hover{border-color:rgba(93,69,253,0.3);background:rgba(93,69,253,0.02);}

  .inp{width:100%;background:rgba(0,0,0,0.03);border:1px solid var(--line);color:var(--text);font-family:'Manrope',sans-serif;font-size:13px;padding:11px 14px;outline:none;transition:border-color .15s;border-radius:12px;}
  .inp:focus{border-color:rgba(93,69,253,0.5);}
  .inp::placeholder{color:var(--muted);}
  textarea.inp{resize:vertical;font-family:'DM Mono',monospace;font-size:12px;}

  .panel{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(10px);z-index:100;display:flex;align-items:center;justify-content:center;}
  .panel-box{background:var(--ink2);border:1px solid var(--line);width:100%;max-width:520px;margin:0 16px;max-height:90vh;overflow-y:auto;border-radius:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.15);}

  .check-box{display:flex;align-items:center;gap:10px;cursor:pointer;}
  .check-box input{accent-color:var(--acid);width:16px;height:16px;}
  .check-box label{font-family:'Manrope',font-size:13px;color:var(--text);cursor:pointer;}
`;

export default function Notifications() {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', user_ids: '', send_to_all: false });

  useEffect(() => { if (token) loadNotifications(); }, [token]);

  const loadNotifications = async () => {
    try {
      const r = await fetch(`${API}/api/notifications`, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(await r.json());
    } catch (e) { console.error(e); }
  };

  const handleCreate = async () => {
    if (!token || (user?.role !== 'TEACHER' && user?.role !== 'ADMIN')) return;
    try {
      let user_ids;
      if (!formData.send_to_all) {
        user_ids = formData.user_ids.split(',').map((id: string) => id.trim());
      }
      await fetch(`${API}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, user_ids }),
      });
      setShowCreate(false);
      setFormData({ title: '', content: '', user_ids: '', send_to_all: false });
      loadNotifications();
    } catch (e) { console.error(e); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="nf pb-20">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="rv d1" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <div className="sh mb-2">Платформа / Уведомления</div>
              <h1 className="disp" style={{ fontSize: 'clamp(36px,5vw,56px)', color: 'var(--text)' }}>Уведомления</h1>
            </div>
            {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
              <button className="btn-acid flex items-center gap-2" onClick={() => setShowCreate(true)}>
                <Plus /> Отправить уведомление
              </button>
            )}
          </div>
        </div>

        {/* ── Notifications List ─────────────────────────── */}
        <div className="rv d2 mt-8 px-8">
          <div className="flex items-center gap-6 pb-5">
            <span className="sh">Ваши уведомления</span>
            <span className="mono-sm">{notifications.length} уведомлений</span>
          </div>
          <div className="hr" />
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map((notif) => (
              <div key={notif.id} className="notif-card">
                <div className="flex items-start justify-between gap-4">
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="mono-sm flex items-center gap-2"><BellIcon /> {notif.notification?.title}</span>
                    </div>
                    <p style={{ fontFamily: 'Manrope', fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 12 }}>{notif.notification?.content}</p>
                    <div className="flex gap-4">
                      <span className="mono-sm flex items-center gap-2"><UserIcon /> {notif.notification?.creator?.profile?.username || notif.notification?.creator?.email}</span>
                      <span className="mono-sm flex items-center gap-2"><ClockIcon /> {new Date(notif.notification?.created_at).toLocaleString('ru-RU')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="card text-center">
                <span className="mono-sm">Уведомлений пока нет</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Create Modal ─────────────────────────────────── */}
      {showCreate && (
        <div className="panel">
          <div className="panel-box">
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--line)' }}>
              <div>
                <div className="sh mb-1">Новое</div>
                <span className="disp" style={{ fontSize: 28, color: 'var(--text)' }}>Отправить уведомление</span>
              </div>
              <button className="btn-ghost" style={{ padding: '8px 10px' }} onClick={() => setShowCreate(false)}><XIcon /></button>
            </div>
            <div className="p-6 space-y-3">
              <input className="inp" placeholder="Заголовок" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              <textarea className="inp" placeholder="Содержание" rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
              <label className="check-box">
                <input type="checkbox" checked={formData.send_to_all} onChange={e => setFormData({ ...formData, send_to_all: e.target.checked })} />
                <span>Отправить всем пользователям</span>
              </label>
              {!formData.send_to_all && (
                <input className="inp" placeholder="ID пользователей (через запятую)" value={formData.user_ids} onChange={e => setFormData({ ...formData, user_ids: e.target.value })} />
              )}
            </div>
            <div className="flex" style={{ borderTop: '1px solid var(--line)' }}>
              <button className="btn-ghost flex-1" style={{ borderRight: '1px solid var(--line)', borderLeft: 'none', borderBottom: 'none', borderTop: 'none' }} onClick={() => setShowCreate(false)}>Отмена</button>
              <button className="btn-acid flex-1" onClick={handleCreate}>Отправить</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
