import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/* ─── Icons ─────────────────────────────────────────────────── */
const Back = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const SchoolIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M4 22h16"/><path d="M2 6l10-7 10 7"/><path d="M12 18v-8"/><path d="M9 12v4"/><path d="M15 12v4"/>
  </svg>
);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/* ─── Shared style block ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Manrope:wght@300;400;500;600;700&display=swap');
  :root { --acid:#5D45FD; --ink:#09090B; --ink2:#111113; --line:rgba(255,255,255,0.08); --muted:rgba(255,255,255,0.35); --text:rgba(255,255,255,0.88); }
  .ed * { box-sizing: border-box; }
  .ed { font-family:'Manrope',sans-serif; background:var(--ink); color:var(--text); min-height:100vh; }

  @keyframes reveal { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  .rv{opacity:0;animation:reveal 0.6s cubic-bezier(0.22,1,0.36,1) forwards;}
  .d1{animation-delay:.04s}.d2{animation-delay:.1s}.d3{animation-delay:.17s}.d4{animation-delay:.25s}.d5{animation-delay:.33s}

  .sh{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted);}
  .disp{font-family:'Bebas Neue',sans-serif;letter-spacing:0.03em;}
  .mono-sm{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:0.06em;}
  .hr{height:1px;background:var(--line);}
  .badge{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;border:1px solid var(--line);color:var(--muted);padding:3px 8px;display:inline-block;}
  .badge-acid{border-color:rgba(93,69,253,0.4);color:var(--acid);}
  .badge-ok{border-color:rgba(100,255,150,0.35);color:#6feba2;}

  .btn-acid{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:var(--acid);color:var(--ink);border:none;padding:12px 22px;cursor:pointer;transition:opacity .15s;white-space:nowrap;}
  .btn-acid:hover{opacity:.88;}
  .btn-ghost{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:transparent;color:var(--muted);border:1px solid var(--line);padding:11px 20px;cursor:pointer;transition:border-color .15s,color .15s;white-space:nowrap;}
  .btn-ghost:hover{border-color:rgba(255,255,255,0.25);color:var(--text);}

  .stat-block{border:1px solid var(--line);background:var(--ink2);padding:24px;}
  .participant-row{border:1px solid var(--line);background:var(--ink2);display:flex;align-items:center;gap:12px;padding:14px 18px;transition:border-color .2s;}
  .participant-row:hover{border-color:rgba(93,69,253,0.25);}
`;

function Section({ label, delay = 'd1', children, action }: { label: string; delay?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className={`rv ${delay}`} style={{ marginBottom: 48 }}>
      <div className="flex items-center justify-between pb-5">
        <span className="sh">{label}</span>
        {action}
      </div>
      <div className="hr" />
      <div style={{ marginTop: 24 }}>{children}</div>
    </div>
  );
}

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadEvent(); }, [eventId]);

  const loadEvent = async () => {
    if (!eventId || !token) return;
    try {
      const r = await fetch(`${API}/api/events/${eventId}`, { headers: { Authorization: `Bearer ${token}` } });
      setEvent(await r.json());
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const handleJoinLeave = async () => {
    if (!token || !event) return;
    const isJoined = event.participants?.some((p: any) => p.user_id === user?.id);
    try {
      await fetch(`${API}/api/events/${eventId}/join`, {
        method: isJoined ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadEvent();
    } catch(e) { console.error(e); }
  };

  if (loading) return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{STYLES}</style>
      <span className="sh">Загрузка...</span>
    </div>
  );
  if (!event) return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{STYLES}</style>
      <span className="sh">Событие не найдено</span>
    </div>
  );

  const isJoined = event.participants?.some((p: any) => p.user_id === user?.id);
  const eventDate = new Date(event.date);

  return (
    <>
      <style>{STYLES}</style>
      <div className="ed">

        {/* ── HERO ───────────────────────────────────────── */}
        <div style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
          {event.image_url ? (
            <img src={`${API}${event.image_url}`} alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#141416' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,1) 0%, rgba(9,9,11,0.6) 40%, rgba(9,9,11,0.15) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(9,9,11,0.7) 0%, transparent 55%)' }} />

          <button className="btn-ghost rv d1"
            style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => navigate('/events')}>
            <Back /> Назад
          </button>

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 32px 32px' }}>
            <div className="rv d2">
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                {event.school?.name && <span className="badge badge-acid">{event.school.name}</span>}
                {event.visibility === 'GLOBAL' && <span className="badge">Глобальное</span>}
                {event.visibility === 'SCHOOL' && <span className="badge">Школьное</span>}
              </div>
              <h1 className="disp text-white" style={{ fontSize: 'clamp(36px,5.5vw,68px)', lineHeight: 0.95, marginBottom: 14 }}>
                {event.title}
              </h1>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <span className="mono-sm flex items-center gap-2"><SchoolIcon /> {event.school?.name}</span>
                <span className="mono-sm flex items-center gap-2"><CalendarIcon /> {eventDate.toLocaleDateString('ru-RU')}</span>
                <span className="mono-sm flex items-center gap-2"><UsersIcon /> {event._count?.participants || 0} участников</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ROW ──────────────────────────────────── */}
        <div className="rv d3" style={{ borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { label: 'Дата', val: eventDate.toLocaleDateString('ru-RU') },
              { label: 'Участников', val: event._count?.participants || 0 },
              { label: 'Место', val: event.location || 'Не указано' },
            ].map((s, i) => (
              <div key={i} className="stat-block" style={{ borderRight: i < 2 ? '1px solid var(--line)' : 'none', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>{s.val}</div>
                <div className="sh" style={{ marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BODY ───────────────────────────────────────── */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 0 80px' }}>

          {/* Description */}
          {event.description && (
            <Section label="Описание">
              <p style={{ fontFamily: 'Manrope', fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)' }}>
                {event.description}
              </p>
            </Section>
          )}

          {/* Organizer */}
          {event.creator && (
            <Section label="Организатор">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {event.creator.profile?.avatar_url ? (
                  <img src={event.creator.profile.avatar_url} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--line)' }} />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="sh">O</span>
                  </div>
                )}
                <div>
                  <div style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>
                    {event.creator.profile?.username || event.creator.email}
                  </div>
                  <div className="sh" style={{ marginTop: 3 }}>{event.creator.role === 'TEACHER' ? 'Учитель' : 'Студент'}</div>
                </div>
              </div>
            </Section>
          )}

          {/* Location */}
          {event.location && (
            <Section label="Место проведения">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LocationIcon />
                <span style={{ fontFamily: 'Manrope', fontSize: 15, color: 'var(--text)' }}>{event.location}</span>
              </div>
            </Section>
          )}

          {/* Participants */}
          {event.participants && event.participants.length > 0 && (
            <Section label={`Участники (${event.participants.length})`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {event.participants.map((p: any) => (
                  <div key={p.id} className="participant-row">
                    {p.user?.profile?.avatar_url ? (
                      <img src={p.user.profile.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--line)' }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="sh" style={{ fontSize: 9 }}>U</span>
                      </div>
                    )}
                    <div>
                      <div style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 13, color: 'var(--text)' }}>
                        {p.user?.profile?.username || p.user?.email}
                      </div>
                      <span className="badge badge-ok" style={{ marginTop: 4 }}>Участник</span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

        </div>

        {/* ── ACTION BAR (sticky) ────────────────────────── */}
        <div style={{ position: 'sticky', bottom: 0, background: 'rgba(9,9,11,0.96)', backdropFilter: 'blur(20px)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderTop: '1px solid var(--line)' }}>
          <div>
            <div className="disp text-white" style={{ fontSize: 20 }}>{event.title}</div>
            <div className="sh" style={{ marginTop: 2 }}>
              {isJoined ? 'Вы участвуете' : 'Запишитесь на событие'}
            </div>
          </div>
          {isJoined ? (
            <button className="btn-ghost" onClick={handleJoinLeave}>Отменить участие</button>
          ) : (
            <button className="btn-acid" onClick={handleJoinLeave}>Участвовать</button>
          )}
        </div>

      </div>
    </>
  );
}