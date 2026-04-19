import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const API = "";

export default function Courses() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [schoolCourses, setSchoolCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', visibility: 'SCHOOL' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { if (token) loadCourses(); }, [token]);

  const loadCourses = async () => {
    try {
      const [schoolRes, allRes] = await Promise.all([
        fetch(`${API}/api/courses?scope=school`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/courses?scope=all`,    { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setSchoolCourses(Array.isArray(await schoolRes.json()) ? await (await fetch(`${API}/api/courses?scope=school`, { headers: { Authorization: `Bearer ${token}` } })).json() : []);
      setAllCourses(Array.isArray(await allRes.json())    ? await (await fetch(`${API}/api/courses?scope=all`,    { headers: { Authorization: `Bearer ${token}` } })).json() : []);
    } catch (e) { console.error(e); }
  };

  // simpler load
  const reload = async () => {
    try {
      const [s, a] = await Promise.all([
        fetch(`${API}/api/courses?scope=school`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()),
        fetch(`${API}/api/courses?scope=all`,    { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()),
      ]);
      setSchoolCourses(Array.isArray(s) ? s : []);
      setAllCourses(Array.isArray(a) ? a : []);
    } catch(e) { console.error(e); }
  };
  useEffect(() => { if (token) reload(); }, [token]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setSelectedFile(f); setPreviewUrl(URL.createObjectURL(f)); }
  };

  const handleCreate = async () => {
    if (!token || (user?.role !== 'TEACHER' && user?.role !== 'ADMIN')) return;
    setUploading(true);
    try {
      let imageUrl: string | null = null;
      if (selectedFile) {
        const fd = new FormData();
        fd.append('file', selectedFile);
        const r = await fetch(`${API}/api/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
        imageUrl = (await r.json()).url;
      }
      await fetch(`${API}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, image_url: imageUrl || undefined }),
      });
      setShowCreate(false);
      setFormData({ title: '', description: '', visibility: 'SCHOOL' });
      setSelectedFile(null);
      setPreviewUrl(null);
      reload();
    } catch(e) { console.error(e); } finally { setUploading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Manrope:wght@300;400;500;600;700&display=swap');
        :root {
          --acid: #10b981; --bg: #f8fafc; --bg2: #ffffff;
          --line: rgba(0,0,0,0.08); --muted: #64748b; --text: #1e293b;
        }
        .cr * { box-sizing: border-box; }
        .cr { font-family: 'Manrope', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
        @keyframes reveal { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .rv { opacity:0; animation: reveal 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
        .d1{animation-delay:.05s} .d2{animation-delay:.12s} .d3{animation-delay:.2s} .d4{animation-delay:.28s}

        /* course card */
        .course-card { border: 1px solid var(--line); background: var(--bg2); cursor: pointer; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; overflow: hidden; border-radius: 16px; }
        .course-card:hover { border-color: rgba(16,185,129,0.3); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .course-card:hover .card-arrow { color: var(--acid); transform: translate(2px,-2px); }
        .card-arrow { color: var(--muted); transition: color 0.2s, transform 0.2s; }
        .course-card:hover .card-img { transform: scale(1.04); }
        .card-img { transition: transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .card-img-wrap { overflow: hidden; }

        /* section heading */
        .sh { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--acid); }

        /* h-rule */
        .hr { height: 1px; background: var(--line); }

        /* badge */
        .badge { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; border: 1px solid var(--line); color: var(--muted); padding: 3px 8px; display: inline-block; }

        /* mono small */
        .mono-sm { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 0.06em; }

        /* display num */
        .disp { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.03em; }

        /* panel overlay */
        .panel { position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; }
        .panel-box { background: var(--bg2); border: 1px solid var(--line); width: 100%; max-width: 480px; margin: 0 16px; border-radius: 20px; }

        /* input */
        .inp { width: 100%; background: #ffffff; border: 1px solid var(--line); color: var(--text); font-family: 'Manrope', sans-serif; font-size: 14px; padding: 12px 14px; outline: none; transition: border-color 0.15s; border-radius: 12px; }
        .inp:focus { border-color: rgba(16,185,129,0.5); }
        .inp::placeholder { color: #94a3b8; }
        select.inp { cursor: pointer; }
        select.inp option { background: #ffffff; color: var(--text); }

        /* btn */
        .btn-acid { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; background: var(--acid); color: white; border: none; padding: 12px 22px; cursor: pointer; transition: opacity 0.15s; border-radius: 12px; }
        .btn-acid:hover { opacity: 0.88; }
        .btn-acid:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-ghost { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; background: transparent; color: var(--muted); border: 1px solid var(--line); padding: 12px 22px; cursor: pointer; transition: border-color 0.15s, color 0.15s; border-radius: 12px; }
        .btn-ghost:hover { border-color: rgba(0,0,0,0.15); color: var(--text); }

        /* file drop */
        .file-zone { border: 1px dashed var(--line); padding: 20px; text-align: center; cursor: pointer; transition: border-color 0.15s; position: relative; border-radius: 12px; background: #fafafa; }
        .file-zone:hover { border-color: rgba(16,185,129,0.5); }
        .file-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        /* tab underline */
        .tab-active { border-bottom: 1px solid var(--acid); color: var(--text); }
        .tab { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); padding-bottom: 10px; cursor: pointer; border-bottom: 1px solid transparent; transition: color 0.15s, border-color 0.15s; }
        .tab:hover { color: var(--text); }
      `}</style>

      <div className="cr pb-20">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="rv d1" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <div className="sh mb-2">Платформа / Обучение</div>
              <h1 className="disp" style={{ fontSize: 'clamp(36px,5vw,56px)', color: 'var(--text)' }}>Курсы</h1>
            </div>
            {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
              <button className="btn-acid flex items-center gap-2" onClick={() => setShowCreate(true)}>
                <PlusIcon />
                Создать курс
              </button>
            )}
          </div>
        </div>

        {/* ── My School ──────────────────────────────────── */}
        <div className="rv d2">
          <div className="flex items-center gap-6 px-8 pt-8 pb-5">
            <span className="sh">Курсы моей школы</span>
            <span className="mono-sm">{schoolCourses.length} курсов</span>
          </div>
          <div className="hr mx-8" />

          {schoolCourses.length === 0 ? (
            <div className="px-8 py-10 mono-sm">Нет курсов от вашей школы</div>
          ) : (
            <div className="grid px-8 pt-6 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {schoolCourses.map((c) => (
                <CourseCard key={c.id} course={c} onClick={() => navigate(`/courses/${c.id}`)} />
              ))}
            </div>
          )}
        </div>

        {/* ── All Courses ────────────────────────────────── */}
        <div className="rv d3 mt-12">
          <div className="flex items-center gap-6 px-8 pb-5">
            <span className="sh">Все курсы</span>
            <span className="mono-sm">{allCourses.length} курсов</span>
          </div>
          <div className="hr mx-8" />

          {allCourses.length === 0 ? (
            <div className="px-8 py-10 mono-sm">Нет курсов</div>
          ) : (
            <div className="grid px-8 pt-6 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {allCourses.map((c) => (
                <CourseCard key={c.id} course={c} showSchool onClick={() => navigate(`/courses/${c.id}`)} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Create Modal ──────────────────────────────────── */}
      {showCreate && (
        <div className="panel">
          <div className="panel-box">
            {/* header */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--line)' }}>
              <div>
                <div className="sh mb-1">Новый</div>
                <span className="disp" style={{ fontSize: 28, color: 'var(--text)' }}>Создать курс</span>
              </div>
              <button className="btn-ghost" style={{ padding: '8px 10px' }} onClick={() => setShowCreate(false)}>
                <XIcon />
              </button>
            </div>

            {/* form */}
            <div className="p-6 space-y-3">
              <input className="inp" type="text" placeholder="Название курса"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })} />

              <textarea className="inp" placeholder="Описание курса" rows={3} style={{ resize: 'none' }}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })} />

              <select className="inp" value={formData.visibility}
                onChange={e => setFormData({ ...formData, visibility: e.target.value })}>
                <option value="SCHOOL">Только для моей школы</option>
                <option value="GLOBAL">Для всех школ</option>
              </select>

              {/* file upload */}
              <div className="file-zone">
                <input type="file" accept="image/*" onChange={handleFileSelect} />
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block', borderRadius: 8 }} />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <ImageIcon />
                    <span className="mono-sm">Выберите обложку</span>
                  </div>
                )}
              </div>
              {selectedFile && <div className="mono-sm">{selectedFile.name}</div>}
            </div>

            {/* actions */}
            <div className="flex" style={{ borderTop: '1px solid var(--line)' }}>
              <button className="btn-ghost flex-1" style={{ borderRight: '1px solid var(--line)', borderLeft: 'none', borderBottom: 'none', borderTop: 'none' }}
                onClick={() => { setShowCreate(false); setSelectedFile(null); setPreviewUrl(null); }}>
                Отмена
              </button>
              <button className="btn-acid flex-1" onClick={handleCreate} disabled={uploading || !formData.title.trim()}>
                {uploading ? 'Загрузка...' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Course Card ─────────────────────────────────────────── */
function CourseCard({ course, onClick, showSchool }: { course: any; onClick: () => void; showSchool?: boolean }) {
  const API = "";
  return (
    <div className="course-card" onClick={onClick}>
      {/* image */}
      <div className="card-img-wrap" style={{ height: 160, background: '#f1f5f9' }}>
        {course.image_url ? (
          <img className="card-img" src={`${API}${course.image_url}`} alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>No Image</span>
          </div>
        )}
      </div>

      {/* content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)', lineHeight: 1.35 }}>{course.title}</h3>
          <span className="card-arrow flex-shrink-0 mt-0.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></span>
        </div>

        {course.description && (
          <p style={{ fontFamily: 'Manrope', fontSize: 12, color: '#64748b', lineHeight: 1.5, marginTop: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.description}
          </p>
        )}

        <div style={{ borderTop: '1px solid var(--line)', marginTop: 14, paddingTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span className="mono-sm">{course.teacher?.profile?.username || course.teacher?.email}</span>
          {showSchool && course.school?.name && <span className="mono-sm">{course.school.name}</span>}
          <span className="mono-sm">{course.stages?.length || 0} этапов</span>
        </div>
      </div>
    </div>
  );
}