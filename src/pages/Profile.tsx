import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

/* ─── Icons ─────────────────────────────────────────────────── */
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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
  .pf * { box-sizing: border-box; }
  .pf { font-family:'Manrope',sans-serif; background:var(--ink); color:var(--text); min-height:100vh; }

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
  .course-row{border:1px solid var(--line);background:var(--ink2);padding:16px;border-radius:12px;display:flex;align-items:center;gap:16px;transition:border-color .2s;}
  .course-row:hover{border-color:rgba(93,69,253,0.3);}

  .inp{width:100%;background:rgba(0,0,0,0.03);border:1px solid var(--line);color:var(--text);font-family:'Manrope',sans-serif;font-size:13px;padding:11px 14px;outline:none;transition:border-color .15s;border-radius:12px;}
  .inp:focus{border-color:rgba(93,69,253,0.5);}
  .inp::placeholder{color:var(--muted);}
  textarea.inp{resize:vertical;font-family:'DM Mono',monospace;font-size:12px;}

  .panel{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(10px);z-index:100;display:flex;align-items:center;justify-content:center;}
  .panel-box{background:var(--ink2);border:1px solid var(--line);width:100%;max-width:520px;margin:0 16px;max-height:90vh;overflow-y:auto;border-radius:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.15);}
`;

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', avatar_url: '', bio: '', grade: '' });

  useEffect(() => { if (token) loadProfile(); }, [token]);

  const loadProfile = async () => {
    if (!token) return;
    try {
      const data = await api.users.getMe(token);
      setProfile(data);
      if (data.school_id) {
        const schools = await api.schools.getAll();
        setSchool(schools.find((s: any) => s.id === data.school_id) || null);
      }
      if (data.role === 'TEACHER') {
        const coursesData = await (await fetch(`${API}/api/courses`, { headers: { Authorization: `Bearer ${token}` } })).json();
        setMyCourses(Array.isArray(coursesData) ? coursesData.filter((c: any) => c.teacher_id === data.id) : []);
      }
      const coursesData = await (await fetch(`${API}/api/courses`, { headers: { Authorization: `Bearer ${token}` } })).json();
      setEnrolledCourses(Array.isArray(coursesData) ? coursesData.filter((c: any) => c.enrollments?.some((e: any) => e.user_id === data.id && e.status === 'APPROVED')) : []);
      if (data.profile) setFormData({ username: data.profile.username || '', avatar_url: data.profile.avatar_url || '', bio: data.profile.bio || '', grade: data.profile.grade || '' });
      setStats(await (await fetch(`${API}/api/users/stats`, { headers: { Authorization: `Bearer ${token}` } })).json());
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    if (!token) return;
    try {
      await api.users.updateProfile(token, formData);
      setEditing(false);
      loadProfile();
    } catch (e) { alert('Failed to save profile'); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="pf pb-20">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="rv d1" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <div className="sh mb-2">Платформа / Профиль</div>
              <h1 className="disp" style={{ fontSize: 'clamp(36px,5vw,56px)', color: 'var(--text)' }}>Профиль</h1>
            </div>
            <button className="btn-ghost flex items-center gap-2" onClick={() => setEditing(true)}>
              <EditIcon /> Редактировать
            </button>
          </div>
        </div>

        {/* ── Profile Card ─────────────────────────────── */}
        <div className="rv d2 mt-8 px-8">
          <div className="card">
            <div className="flex items-start gap-6">
              {profile?.profile?.avatar_url ? (
                <img src={profile.profile.avatar_url} alt="Avatar" style={{ width: 80, height: 80, borderRadius: 20, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: 20, background: 'var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>{profile?.profile?.username || user?.email}</h3>
                <p style={{ fontFamily: 'Manrope', fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{profile?.profile?.bio || 'Нет информации'}</p>
                <div className="flex gap-4">
                  <span className="mono-sm">Класс: {profile?.profile?.grade || 'Не указан'}</span>
                  <span className="mono-sm">Роль: {user?.role === 'TEACHER' ? 'Учитель' : 'Студент'}</span>
                </div>
                {school && (
                  <span className="mono-sm flex items-center gap-2 mt-2"><SchoolIcon /> {school.name}, {school.city}</span>
                )}
              </div>
            </div>
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

        {/* ── Teacher Courses ───────────────────────────── */}
        {user?.role === 'TEACHER' && myCourses.length > 0 && (
          <div className="rv d4 mt-8 px-8">
            <div className="flex items-center gap-6 pb-5">
              <span className="sh">Мои курсы (учитель)</span>
              <span className="mono-sm">{myCourses.length} курсов</span>
            </div>
            <div className="hr" />
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myCourses.map((course) => (
                <div key={course.id} className="course-row">
                  {course.image_url && (
                    <img src={`${API}${course.image_url}`} alt={course.title} style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{course.title}</span>
                    <span className="mono-sm" style={{ display: 'block', marginTop: 4 }}>{course.enrollments?.filter((e: any) => e.status === 'APPROVED').length || 0} участников</span>
                  </div>
                  <button className="btn-acid" onClick={() => navigate(`/courses/${course.id}`)}>Управлять</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Enrolled Courses ───────────────────────────── */}
        {enrolledCourses.length > 0 && (
          <div className="rv d5 mt-8 px-8">
            <div className="flex items-center gap-6 pb-5">
              <span className="sh">Мои курсы (ученик)</span>
              <span className="mono-sm">{enrolledCourses.length} курсов</span>
            </div>
            <div className="hr" />
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {enrolledCourses.map((course) => (
                <div key={course.id} className="course-row">
                  {course.image_url && (
                    <img src={`${API}${course.image_url}`} alt={course.title} style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{course.title}</span>
                    <span className="mono-sm" style={{ display: 'block', marginTop: 4 }}>{course.teacher?.profile?.username || course.teacher?.email}</span>
                  </div>
                  <button className="btn-acid" onClick={() => navigate(`/courses/${course.id}`)}>Открыть</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Edit Modal ─────────────────────────────────── */}
      {editing && (
        <div className="panel">
          <div className="panel-box">
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--line)' }}>
              <div>
                <div className="sh mb-1">Редактирование</div>
                <span className="disp" style={{ fontSize: 28, color: 'var(--text)' }}>Профиль</span>
              </div>
              <button className="btn-ghost" style={{ padding: '8px 10px' }} onClick={() => setEditing(false)}><XIcon /></button>
            </div>
            <div className="p-6 space-y-3">
              <input className="inp" placeholder="Имя пользователя" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
              <input className="inp" placeholder="URL аватара" value={formData.avatar_url} onChange={e => setFormData({ ...formData, avatar_url: e.target.value })} />
              <textarea className="inp" placeholder="О себе" rows={3} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
              <input className="inp" placeholder="Класс" value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} />
            </div>
            <div className="flex" style={{ borderTop: '1px solid var(--line)' }}>
              <button className="btn-ghost flex-1" style={{ borderRight: '1px solid var(--line)', borderLeft: 'none', borderBottom: 'none', borderTop: 'none' }} onClick={() => setEditing(false)}>Отмена</button>
              <button className="btn-acid flex-1" onClick={handleSave}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
