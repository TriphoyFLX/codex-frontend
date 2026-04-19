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
const FileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const API = "";

/* ─── Shared style block ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Manrope:wght@300;400;500;600;700&display=swap');
  :root { --acid:#5D45FD; --ink:#FAFAFA; --ink2:#FFFFFF; --line:rgba(0,0,0,0.08); --muted:rgba(0,0,0,0.45); --text:rgba(0,0,0,0.82); }
  .as * { box-sizing: border-box; }
  .as { font-family:'Manrope',sans-serif; background:var(--ink); color:var(--text); min-height:100vh; }

  @keyframes reveal { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  .rv{opacity:0;animation:reveal 0.6s cubic-bezier(0.22,1,0.36,1) forwards;}
  .d1{animation-delay:.04s}.d2{animation-delay:.1s}.d3{animation-delay:.17s}.d4{animation-delay:.25s}.d5{animation-delay:.33s}

  .sh{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted);}
  .disp{font-family:'Bebas Neue',sans-serif;letter-spacing:0.03em;}
  .mono-sm{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:0.06em;}
  .hr{height:1px;background:var(--line);}
  .badge{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;border:1px solid var(--line);color:var(--muted);padding:3px 8px;display:inline-block;}
  .badge-acid{border-color:rgba(93,69,253,0.4);color:var(--acid);}
  .badge-ok{border-color:rgba(16,185,129,0.35);color:#10b981;}
  .badge-warn{border-color:rgba(245,158,11,0.35);color:#f59e0b;}

  .panel{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(10px);z-index:100;display:flex;align-items:center;justify-content:center;}
  .panel-box{background:var(--ink2);border:1px solid var(--line);width:100%;max-width:520px;margin:0 16px;max-height:90vh;overflow-y:auto;border-radius:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.15);}

  .inp{width:100%;background:rgba(0,0,0,0.03);border:1px solid var(--line);color:var(--text);font-family:'Manrope',sans-serif;font-size:13px;padding:11px 14px;outline:none;transition:border-color .15s;border-radius:12px;}
  .inp:focus{border-color:rgba(93,69,253,0.5);}
  .inp::placeholder{color:var(--muted);}
  textarea.inp{resize:vertical;font-family:'DM Mono',monospace;font-size:12px;}

  .btn-acid{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:var(--acid);color:#FFFFFF;border:none;padding:12px 22px;cursor:pointer;transition:opacity .15s;white-space:nowrap;border-radius:12px;}
  .btn-acid:hover{opacity:.88;}
  .btn-acid:disabled{opacity:.35;cursor:not-allowed;}
  .btn-ghost{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:transparent;color:var(--muted);border:1px solid var(--line);padding:11px 20px;cursor:pointer;transition:border-color .15s,color .15s;white-space:nowrap;border-radius:12px;}
  .btn-ghost:hover{border-color:rgba(0,0,0,0.25);color:var(--text);}

  .assign-card{border:1px solid var(--line);background:var(--ink2);cursor:pointer;transition:border-color .2s,background .2s;padding:20px;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.05);}
  .assign-card:hover{border-color:rgba(93,69,253,0.3);background:rgba(93,69,253,0.02);}
  .assign-card.done{border-color:rgba(16,185,129,0.2);background:rgba(16,185,129,0.03);}

  .sub-row{border:1px solid var(--line);background:rgba(0,0,0,0.02);padding:14px;border-radius:12px;}

  .file-zone{border:1px dashed var(--line);padding:20px;text-align:center;cursor:pointer;transition:border-color .15s;border-radius:12px;background:rgba(0,0,0,0.02);}
  .file-zone:hover{border-color:rgba(93,69,253,0.5);}
  .file-zone input{position:absolute;inset:0;opacity:0;cursor:pointer;}
`;

export default function Assignments() {
  const { token, user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [courseAssignments, setCourseAssignments] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => { if (token) { loadAssignments(); loadCourseAssignments(); } }, [token]);

  const loadAssignments = async () => {
    try {
      const data = await fetch(`${API}/api/assignments`, { headers: { Authorization: `Bearer ${token}` } });
      setAssignments(await data.json());
    } catch (e) { console.error(e); }
  };

  const loadCourseAssignments = async () => {
    try {
      const courses = await (await fetch(`${API}/api/courses`, { headers: { Authorization: `Bearer ${token}` } })).json();
      const all: any[] = [];
      courses.forEach((c: any) => {
        const isEnrolled = c.enrollments?.some((e: any) => e.user_id === user?.id && e.status === 'APPROVED');
        if (isEnrolled && c.assignments?.length) {
          c.assignments.forEach((a: any) => all.push({ ...a, course_title: c.title, course_id: c.id }));
        }
      });
      setCourseAssignments(all);
    } catch (e) { console.error(e); }
  };

  const handleCreate = async () => {
    if (!token || user?.role !== 'TEACHER') return;
    await fetch(`${API}/api/assignments`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formData) });
    setShowCreate(false); setFormData({ title: '', description: '' }); loadAssignments();
  };

  const handleSubmit = async () => {
    if (!token) return;
    let fileUrl = '';
    if (selectedFile) {
      setUploading(true);
      const fd = new FormData(); fd.append('file', selectedFile);
      const r = await fetch(`${API}/api/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      fileUrl = (await r.json()).filePath;
      setUploading(false);
    }
    const content = submissionContent + (fileUrl ? `\n\nФайл: ${fileUrl}` : '');
    const submitUrl = selectedAssignment.course_id
      ? `${API}/api/courses/assignments/${selectedAssignment.id}/submit`
      : `${API}/api/assignments/${selectedAssignment.id}/submit`;
    await fetch(submitUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ content }) });
    setSubmissionContent(''); setSelectedFile(null); setShowSubmit(false); setSelectedAssignment(null); loadCourseAssignments(); loadAssignments();
  };

  const handleGrade = async (subId: string, grade: number | null, feedback: string) => {
    if (!token) return;
    const gradeUrl = selectedAssignment.course_id
      ? `${API}/api/courses/assignments/submissions/${subId}/grade`
      : `${API}/api/assignments/submissions/${subId}/grade`;
    await fetch(gradeUrl, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ grade: grade ? Math.min(grade, 10) : null, feedback }) });
    loadAssignments();
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="as pb-20">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="rv d1" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <div className="sh mb-2">Платформа / Обучение</div>
              <h1 className="disp" style={{ fontSize: 'clamp(36px,5vw,56px)', color: 'var(--text)' }}>Задания</h1>
            </div>
            {user?.role === 'TEACHER' && (
              <button className="btn-acid flex items-center gap-2" onClick={() => setShowCreate(true)}>
                <Plus /> Создать задание
              </button>
            )}
          </div>
        </div>

        {/* ── Course Assignments ─────────────────────────── */}
        {courseAssignments.length > 0 && (
          <div className="rv d2 mt-12">
            <div className="flex items-center gap-6 px-8 pb-5">
              <span className="sh">Задания по курсам</span>
              <span className="mono-sm">{courseAssignments.length} заданий</span>
            </div>
            <div className="hr mx-8" />
            <div className="grid px-8 pt-6 gap-4">
              {courseAssignments.map((a) => {
                const hasSubmitted = a.submissions?.length > 0;
                const sub = a.submissions?.[0];
                return (
                  <div key={a.id} className={`assign-card ${hasSubmitted ? 'done' : ''}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="badge badge-acid">{a.course_title}</span>
                          {hasSubmitted && <span className="badge badge-ok">Отправлено</span>}
                          {sub?.grade !== null && <span className="badge badge-warn">{sub.grade} баллов</span>}
                        </div>
                        <h3 style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 8 }}>{a.title}</h3>
                        {a.description && <p style={{ fontFamily: 'Manrope', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{a.description}</p>}
                      </div>
                    </div>
                    {!hasSubmitted && (
                      <button className="btn-acid mt-4" onClick={() => { setSelectedAssignment(a); setShowSubmit(true); }}>Отправить ответ</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── School Assignments ─────────────────────────── */}
        {assignments.length > 0 && (
          <div className="rv d3 mt-12">
            <div className="flex items-center gap-6 px-8 pb-5">
              <span className="sh">Школьные задания</span>
              <span className="mono-sm">{assignments.length} заданий</span>
            </div>
            <div className="hr mx-8" />
            <div className="grid px-8 pt-6 gap-4">
              {assignments.map((a) => {
                const hasSubmitted = a.submissions?.some((s: any) => s.student_id === user?.id);
                const isCreator = a.created_by === user?.id;
                return (
                  <div key={a.id} className="assign-card">
                    <div className="flex items-start justify-between gap-4">
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="badge">{a.school?.name || 'Общее задание'}</span>
                          {hasSubmitted && !isCreator && <span className="badge badge-ok">Отправлено</span>}
                        </div>
                        <h3 style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 8 }}>{a.title}</h3>
                        {a.description && <p style={{ fontFamily: 'Manrope', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{a.description}</p>}
                        <div className="flex items-center gap-4 mt-4">
                          <span className="mono-sm flex items-center gap-2"><UsersIcon /> {a.creator?.profile?.username || a.creator?.email}</span>
                          <span className="mono-sm">{a.submissions?.length || 0} отправок</span>
                        </div>
                      </div>
                    </div>
                    {!hasSubmitted && !isCreator && (
                      <button className="btn-acid mt-4" onClick={() => { setSelectedAssignment(a); setShowSubmit(true); }}>Отправить ответ</button>
                    )}
                    {isCreator && (
                      <button className="btn-ghost mt-4" onClick={() => { setSelectedAssignment(a); setShowSubmissions(true); }}>Смотреть отправки</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Empty State ─────────────────────────────────── */}
        {courseAssignments.length === 0 && assignments.length === 0 && (
          <div className="rv d2 px-8 py-20 text-center">
            <span className="sh">Задания пока не добавлены</span>
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
                <span className="disp" style={{ fontSize: 28, color: 'var(--text)' }}>Создать задание</span>
              </div>
              <button className="btn-ghost" style={{ padding: '8px 10px' }} onClick={() => setShowCreate(false)}><XIcon /></button>
            </div>
            <div className="p-6 space-y-3">
              <input className="inp" placeholder="Название задания" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              <textarea className="inp" placeholder="Описание" rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="flex" style={{ borderTop: '1px solid var(--line)' }}>
              <button className="btn-ghost flex-1" style={{ borderRight: '1px solid var(--line)', borderLeft: 'none', borderBottom: 'none', borderTop: 'none' }} onClick={() => setShowCreate(false)}>Отмена</button>
              <button className="btn-acid flex-1" onClick={handleCreate}>Создать</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Submit Modal ─────────────────────────────────── */}
      {showSubmit && selectedAssignment && (
        <div className="panel">
          <div className="panel-box">
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--line)' }}>
              <div>
                <div className="sh mb-1">Ответ</div>
                <span className="disp" style={{ fontSize: 28, color: 'var(--text)' }}>{selectedAssignment.title}</span>
              </div>
              <button className="btn-ghost" style={{ padding: '8px 10px' }} onClick={() => { setShowSubmit(false); setSelectedAssignment(null); setSubmissionContent(''); setSelectedFile(null); }}><XIcon /></button>
            </div>
            <div className="p-6 space-y-4">
              <textarea className="inp" placeholder="Ваш ответ..." rows={6} value={submissionContent} onChange={e => setSubmissionContent(e.target.value)} />
              <div className="file-zone" style={{ position: 'relative' }}>
                <input type="file" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                {selectedFile ? (
                  <div className="flex items-center gap-2 justify-center">
                    <FileIcon /> <span className="mono-sm">{selectedFile.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <UploadIcon /> <span className="mono-sm">Прикрепить файл</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex" style={{ borderTop: '1px solid var(--line)' }}>
              <button className="btn-ghost flex-1" style={{ borderRight: '1px solid var(--line)', borderLeft: 'none', borderBottom: 'none', borderTop: 'none' }} onClick={() => { setShowSubmit(false); setSelectedAssignment(null); setSubmissionContent(''); setSelectedFile(null); }}>Отмена</button>
              <button className="btn-acid flex-1" onClick={handleSubmit} disabled={uploading}>{uploading ? 'Загрузка...' : 'Отправить'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Submissions Modal ─────────────────────────────── */}
      {showSubmissions && selectedAssignment && (
        <div className="panel">
          <div className="panel-box" style={{ maxWidth: '680px' }}>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--line)' }}>
              <div>
                <div className="sh mb-1">Отправки</div>
                <span className="disp" style={{ fontSize: 28, color: 'var(--text)' }}>{selectedAssignment.title}</span>
              </div>
              <button className="btn-ghost" style={{ padding: '8px 10px' }} onClick={() => { setShowSubmissions(false); setSelectedAssignment(null); }}><XIcon /></button>
            </div>
            <div className="p-6 space-y-3">
              {selectedAssignment.submissions?.length ? (
                selectedAssignment.submissions.map((sub: any) => (
                  <div key={sub.id} className="sub-row">
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{sub.student?.profile?.username || sub.student?.email}</span>
                      {sub.grade !== null && <span className="badge badge-warn">{sub.grade} баллов</span>}
                    </div>
                    <p style={{ fontFamily: 'Manrope', fontSize: 12, color: 'var(--muted)', marginBottom: 12, whiteSpace: 'pre-wrap' }}>{sub.content}</p>
                    {sub.feedback && <p style={{ fontFamily: 'Manrope', fontSize: 12, color: 'var(--acid)', marginBottom: 12 }}>Комментарий: {sub.feedback}</p>}
                    {sub.grade === null && (
                      <div className="flex gap-2">
                        <input type="number" min="0" max="10" placeholder="Баллы" id={`g-${sub.id}`} className="inp" style={{ width: 80, padding: '8px 10px' }} />
                        <input type="text" placeholder="Комментарий" id={`f-${sub.id}`} className="inp" style={{ padding: '8px 10px' }} />
                        <button className="btn-acid" onClick={() => {
                          const g = (document.getElementById(`g-${sub.id}`) as HTMLInputElement)?.value;
                          const f = (document.getElementById(`f-${sub.id}`) as HTMLInputElement)?.value;
                          handleGrade(sub.id, parseInt(g) || null, f);
                        }}>Оценить</button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <span className="mono-sm text-center">Пока нет отправок</span>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
}
