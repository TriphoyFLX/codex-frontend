import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/* ─── Shared style block ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Manrope:wght@300;400;500;600;700&display=swap');
  :root { --acid:#5D45FD; --ink:#FAFAFA; --ink2:#FFFFFF; --line:rgba(0,0,0,0.08); --muted:rgba(0,0,0,0.45); --text:rgba(0,0,0,0.82); }
  .ev * { box-sizing: border-box; }
  .ev { font-family:'Manrope',sans-serif; background:var(--ink); color:var(--text); min-height:100vh; }

  @keyframes reveal { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  .rv{opacity:0;animation:reveal 0.6s cubic-bezier(0.22,1,0.36,1) forwards;}
  .d1{animation-delay:.04s}.d2{animation-delay:.1s}.d3{animation-delay:.17s}.d4{animation-delay:.25s}.d5{animation-delay:.33s}

  .sh{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted);}
  .disp{font-family:'Bebas Neue',sans-serif;letter-spacing:0.03em;}
  .mono-sm{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:0.06em;}
  .hr{height:1px;background:var(--line);}
  .badge{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;border:1px solid var(--line);color:var(--muted);padding:3px 8px;display:inline-block;}
  .badge-acid{border-color:rgba(93,69,253,0.4);color:var(--acid);}

  .btn-acid{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:var(--acid);color:#FFFFFF;border:none;padding:12px 22px;cursor:pointer;transition:opacity .15s;white-space:nowrap;border-radius:12px;}
  .btn-acid:hover{opacity:.88;}
  .btn-acid:disabled{opacity:.35;cursor:not-allowed;}
  .btn-ghost{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:transparent;color:var(--muted);border:1px solid var(--line);padding:11px 20px;cursor:pointer;transition:border-color .15s,color .15s;white-space:nowrap;border-radius:12px;}
  .btn-ghost:hover{border-color:rgba(0,0,0,0.25);color:var(--text);}

  .card{border:1px solid var(--line);background:var(--ink2);padding:20px;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.05);}
  .event-card{border:1px solid var(--line);background:var(--ink2);cursor:pointer;transition:border-color .2s,background .2s;border-radius:16px;overflow:hidden;}
  .event-card:hover{border-color:rgba(93,69,253,0.3);background:rgba(93,69,253,0.02);}

  .inp{width:100%;background:rgba(0,0,0,0.03);border:1px solid var(--line);color:var(--text);font-family:'Manrope',sans-serif;font-size:13px;padding:11px 14px;outline:none;transition:border-color .15s;border-radius:12px;}
  .inp:focus{border-color:rgba(93,69,253,0.5);}
  .inp::placeholder{color:var(--muted);}
  textarea.inp{resize:vertical;font-family:'DM Mono',monospace;font-size:12px;}

  .panel{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(10px);z-index:100;display:flex;align-items:center;justify-content:center;}
  .panel-box{background:var(--ink2);border:1px solid var(--line);width:100%;max-width:520px;margin:0 16px;max-height:90vh;overflow-y:auto;border-radius:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.15);}

  .file-zone{border:1px dashed var(--line);padding:20px;text-align:center;cursor:pointer;transition:border-color .15s;border-radius:12px;background:rgba(0,0,0,0.02);}
  .file-zone:hover{border-color:rgba(93,69,253,0.5);}
  .file-zone input{position:absolute;inset:0;opacity:0;cursor:pointer;}
`;

export default function Events() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [schoolEvents, setSchoolEvents] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', visibility: 'SCHOOL' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { if (token) loadEvents(); }, [token]);

  const loadEvents = async () => {
    try {
      const [schoolRes, allRes] = await Promise.all([
        fetch(`${API}/api/events?scope=school`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/events?scope=all`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const schoolJson = await schoolRes.json();
      const allJson = await allRes.json();
      setSchoolEvents(Array.isArray(schoolJson) ? schoolJson : []);
      setAllEvents(Array.isArray(allJson) ? allJson : []);
    } catch (e) { console.error(e); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile || !token) return null;
    const fd = new FormData(); fd.append('file', selectedFile);
    try {
      const r = await fetch(`${API}/api/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      return (await r.json()).url;
    } catch (e) { return null; }
  };

  const handleCreate = async () => {
    if (!token || (user?.role !== 'TEACHER' && user?.role !== 'ADMIN')) return;
    setUploading(true);
    try {
      let imageUrl = selectedFile ? await uploadImage() : null;
      await fetch(`${API}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, image_url: imageUrl || undefined }),
      });
      setShowCreate(false);
      setFormData({ title: '', description: '', date: '', visibility: 'SCHOOL' });
      setSelectedFile(null);
      loadEvents();
    } catch (e) { console.error(e); } finally { setUploading(false); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="ev pb-20">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="rv d1" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <div className="sh mb-2">Платформа / События</div>
              <h1 className="disp" style={{ fontSize: 'clamp(36px,5vw,56px)', color: 'var(--text)' }}>События</h1>
            </div>
            {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
              <button className="btn-acid flex items-center gap-2" onClick={() => setShowCreate(true)}>
                <Plus /> Создать событие
              </button>
            )}
          </div>
        </div>

        {/* ── School Events ─────────────────────────────── */}
        {schoolEvents.length > 0 && (
          <div className="rv d2 mt-8 px-8">
            <div className="flex items-center gap-6 pb-5">
              <span className="sh">События моей школы</span>
              <span className="mono-sm">{schoolEvents.length} событий</span>
            </div>
            <div className="hr" />
            <div style={{ marginTop: 20, display: 'grid', gap: 16 }}>
              {schoolEvents.map((event) => (
                <div key={event.id} className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
                  {event.image_url && (
                    <img src={`${API}${event.image_url}`} alt={event.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: 20 }}>
                    <div className="flex items-start justify-between gap-4">
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="badge badge-acid">{event.school?.name}</span>
                        </div>
                        <h3 style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 16, color: 'var(--text)', marginBottom: 8 }}>{event.title}</h3>
                        <p style={{ fontFamily: 'Manrope', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{event.description}</p>
                        <div className="flex gap-4 mt-4">
                          <span className="mono-sm flex items-center gap-2"><CalendarIcon /> {new Date(event.date).toLocaleDateString('ru-RU')}</span>
                          <span className="mono-sm flex items-center gap-2"><UsersIcon /> {event._count?.participants || 0} участников</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── All Events ─────────────────────────────────── */}
        {allEvents.length > 0 && (
          <div className="rv d3 mt-8 px-8">
            <div className="flex items-center gap-6 pb-5">
              <span className="sh">Все события</span>
              <span className="mono-sm">{allEvents.length} событий</span>
            </div>
            <div className="hr" />
            <div style={{ marginTop: 20, display: 'grid', gap: 16 }}>
              {allEvents.map((event) => (
                <div key={event.id} className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
                  {event.image_url && (
                    <img src={`${API}${event.image_url}`} alt={event.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: 20 }}>
                    <div className="flex items-start justify-between gap-4">
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="badge">{event.school?.name}</span>
                        </div>
                        <h3 style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 16, color: 'var(--text)', marginBottom: 8 }}>{event.title}</h3>
                        <p style={{ fontFamily: 'Manrope', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{event.description}</p>
                        <div className="flex gap-4 mt-4">
                          <span className="mono-sm flex items-center gap-2"><CalendarIcon /> {new Date(event.date).toLocaleDateString('ru-RU')}</span>
                          <span className="mono-sm flex items-center gap-2"><UsersIcon /> {event._count?.participants || 0} участников</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Empty State ─────────────────────────────────── */}
        {schoolEvents.length === 0 && allEvents.length === 0 && (
          <div className="rv d2 px-8 py-20 text-center">
            <span className="mono-sm">Событий пока нет</span>
          </div>
        )}

      </div>

      {/* ── Create Modal ─────────────────────────────────── */}
      {showCreate && (
        <div className="panel">
          <div className="panel-box">
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--line)' }}>
              <div>
                <div className="sh mb-1">Новое</div>
                <span className="disp" style={{ fontSize: 28, color: 'var(--text)' }}>Создать событие</span>
              </div>
              <button className="btn-ghost" style={{ padding: '8px 10px' }} onClick={() => setShowCreate(false)}><XIcon /></button>
            </div>
            <div className="p-6 space-y-3">
              <input className="inp" placeholder="Название события" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              <textarea className="inp" placeholder="Описание" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              <input className="inp" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
              <select className="inp" value={formData.visibility} onChange={e => setFormData({ ...formData, visibility: e.target.value })}>
                <option value="SCHOOL">Только для моей школы</option>
                <option value="GLOBAL">Для всех школ</option>
              </select>
              <div className="file-zone" style={{ position: 'relative' }}>
                <input type="file" accept="image/*" onChange={handleFileSelect} />
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <UploadIcon /> <span className="mono-sm">{selectedFile.name}</span>
                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <UploadIcon /> <span className="mono-sm">Загрузить обложку</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex" style={{ borderTop: '1px solid var(--line)' }}>
              <button className="btn-ghost flex-1" style={{ borderRight: '1px solid var(--line)', borderLeft: 'none', borderBottom: 'none', borderTop: 'none' }} onClick={() => setShowCreate(false)}>Отмена</button>
              <button className="btn-acid flex-1" onClick={handleCreate} disabled={uploading}>{uploading ? 'Загрузка...' : 'Создать'}</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
