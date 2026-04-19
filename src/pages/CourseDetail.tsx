import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ─── Icons ─────────────────────────────────────────────────── */
const Back = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const Plus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const Check = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const LinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/* ─── Shared style block ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Manrope:wght@300;400;500;600;700&display=swap');
  :root { --acid:#5D45FD; --ink:#09090B; --ink2:#111113; --line:rgba(255,255,255,0.08); --muted:rgba(255,255,255,0.35); --text:rgba(255,255,255,0.88); }
  .cd * { box-sizing: border-box; }
  .cd { font-family:'Manrope',sans-serif; background:var(--ink); color:var(--text); min-height:100vh; }

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
  .badge-warn{border-color:rgba(255,200,50,0.35);color:#f5c842;}

  /* panel */
  .panel{position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);z-index:100;display:flex;align-items:center;justify-content:center;}
  .panel-box{background:var(--ink2);border:1px solid var(--line);width:100%;max-width:520px;margin:0 16px;max-height:90vh;overflow-y:auto;}

  /* inputs */
  .inp{width:100%;background:rgba(255,255,255,0.04);border:1px solid var(--line);color:var(--text);font-family:'Manrope',sans-serif;font-size:13px;padding:11px 14px;outline:none;transition:border-color .15s;}
  .inp:focus{border-color:rgba(93,69,253,0.5);}
  .inp::placeholder{color:var(--muted);}
  select.inp{cursor:pointer;}
  select.inp option{background:#1a1a1c;}

  /* buttons */
  .btn-acid{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:var(--acid);color:var(--ink);border:none;padding:12px 22px;cursor:pointer;transition:opacity .15s;white-space:nowrap;}
  .btn-acid:hover{opacity:.88;}
  .btn-acid:disabled{opacity:.35;cursor:not-allowed;}
  .btn-ghost{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:transparent;color:var(--muted);border:1px solid var(--line);padding:11px 20px;cursor:pointer;transition:border-color .15s,color .15s;white-space:nowrap;}
  .btn-ghost:hover{border-color:rgba(255,255,255,0.25);color:var(--text);}
  .btn-sm{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;background:transparent;color:var(--muted);border:1px solid var(--line);padding:7px 12px;cursor:pointer;transition:all .15s;}
  .btn-sm:hover{border-color:rgba(93,69,253,0.35);color:var(--acid);}
  .btn-sm-acid{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;background:var(--acid);color:var(--ink);border:none;padding:7px 12px;cursor:pointer;transition:opacity .15s;}
  .btn-sm-acid:hover{opacity:.85;}
  .btn-danger{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;background:transparent;color:rgba(255,80,80,0.7);border:1px solid rgba(255,80,80,0.25);padding:7px 12px;cursor:pointer;transition:all .15s;}
  .btn-danger:hover{border-color:rgba(255,80,80,0.6);color:rgba(255,80,80,1);}

  /* stage row */
  .stage-row{border:1px solid var(--line);background:var(--ink2);cursor:pointer;transition:border-color .2s,background .2s;}
  .stage-row:hover{border-color:rgba(93,69,253,0.25);background:rgba(255,255,255,0.02);}
  .stage-row:hover .stage-arrow{color:var(--acid);transform:translateX(3px);}
  .stage-arrow{color:var(--muted);transition:color .2s,transform .2s;}
  .stage-done{border-color:rgba(100,255,150,0.2);background:rgba(100,255,150,0.03);}

  /* stat block */
  .stat-block{border:1px solid var(--line);background:var(--ink2);padding:24px;}

  /* submission */
  .sub-row{border:1px solid var(--line);background:rgba(255,255,255,0.02);padding:14px;}

  /* enroll bar */
  .enroll-bar{border-top:1px solid var(--line);}

  /* markdown inside */
  .md-content { font-family:'Manrope',sans-serif; font-size:13px; line-height:1.65; color:rgba(255,255,255,0.75); }
  .md-content h1,.md-content h2,.md-content h3{font-family:'Bebas Neue',sans-serif;letter-spacing:0.04em;color:var(--text);margin:12px 0 6px;}
  .md-content h1{font-size:24px} .md-content h2{font-size:20px} .md-content h3{font-size:17px}
  .md-content p{margin:0 0 8px;}
  .md-content code{font-family:'DM Mono',monospace;font-size:11px;background:rgba(255,255,255,0.07);padding:2px 6px;color:var(--acid);}
  .md-content pre{background:rgba(255,255,255,0.04);border:1px solid var(--line);padding:14px;overflow-x:auto;margin:10px 0;}
  .md-content pre code{background:none;padding:0;color:rgba(255,255,255,0.75);}
  .md-content a{color:var(--acid);text-decoration:none;}
  .md-content ul,.md-content ol{padding-left:18px;margin:0 0 8px;}
  .md-content li{margin:3px 0;}
  .md-content blockquote{border-left:2px solid var(--acid);padding-left:12px;color:var(--muted);margin:10px 0;}
`;

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* modals */
  const [showAddStage, setShowAddStage] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showSubmitAssignment, setShowSubmitAssignment] = useState(false);

  /* selection */
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  /* form values */
  const [newStageTitle, setNewStageTitle] = useState('');
  const [newMaterial, setNewMaterial] = useState({ type: 'TEXT', content_url: '', content_text: '' });
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '' });
  const [submissionContent, setSubmissionContent] = useState('');

  useEffect(() => { loadCourse(); }, [courseId]);

  const loadCourse = async () => {
    if (!courseId || !token) return;
    try {
      const r = await fetch(`${API}/api/courses/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
      setCourse(await r.json());
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const handleEnroll = async () => {
    await fetch(`${API}/api/courses/${courseId}/enroll`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    loadCourse();
  };
  const handleEnrollmentAction = async (id: string, status: string) => {
    await fetch(`${API}/api/courses/${courseId}/enrollments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
    loadCourse();
  };
  const handleRemoveParticipant = async (id: string) => {
    await fetch(`${API}/api/courses/${courseId}/enrollments/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadCourse();
  };
  const handleCreateStage = async () => {
    if (!newStageTitle.trim()) return;
    const maxOrder = course.stages?.reduce((m: number, s: any) => Math.max(m, s.order_index), 0) || 0;
    await fetch(`${API}/api/courses/${courseId}/stages`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ title: newStageTitle, order_index: maxOrder + 1 }) });
    setNewStageTitle(''); setShowAddStage(false); loadCourse();
  };
  const handleCreateMaterial = async () => {
    if (!selectedStage) return;
    await fetch(`${API}/api/courses/stages/${selectedStage}/materials`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(newMaterial) });
    setNewMaterial({ type: 'TEXT', content_url: '', content_text: '' }); setShowAddMaterial(false); setSelectedStage(null); loadCourse();
  };
  const handleCreateAssignment = async () => {
    if (!newAssignment.title.trim()) return;
    await fetch(`${API}/api/courses/${courseId}/assignments`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(newAssignment) });
    setNewAssignment({ title: '', description: '' }); setShowAddAssignment(false); loadCourse();
  };
  const handleSubmitAssignment = async () => {
    if (!submissionContent.trim()) return;
    await fetch(`${API}/api/courses/assignments/${selectedAssignment.id}/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ content: submissionContent }) });
    setSubmissionContent(''); setShowSubmitAssignment(false); setSelectedAssignment(null); loadCourse();
  };
  const handleGradeSubmission = async (subId: string, grade: number | null, feedback: string) => {
    await fetch(`${API}/api/courses/assignments/submissions/${subId}/grade`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ grade, feedback }) });
    loadCourse();
  };

  if (loading) return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{STYLES}</style>
      <span className="sh">Загрузка...</span>
    </div>
  );
  if (!course) return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{STYLES}</style>
      <span className="sh">Курс не найден</span>
    </div>
  );

  const enrollment = course.enrollments?.find((e: any) => e.user_id === user?.id);
  const isEnrolled = enrollment?.status === 'APPROVED';
  const isPending  = enrollment?.status === 'PENDING';
  const isAdmin    = course.teacher_id === user?.id;
  const approvedCount = course.enrollments?.filter((e: any) => e.status === 'APPROVED').length || 0;
  const pendingCount  = course.enrollments?.filter((e: any) => e.status === 'PENDING').length || 0;

  return (
    <>
      <style>{STYLES}</style>
      <div className="cd">

        {/* ── HERO ───────────────────────────────────────── */}
        <div style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
          {course.image_url ? (
            <img src={`${API}${course.image_url}`} alt={course.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#141416' }} />
          )}
          {/* overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,1) 0%, rgba(9,9,11,0.6) 40%, rgba(9,9,11,0.15) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(9,9,11,0.7) 0%, transparent 55%)' }} />

          {/* back */}
          <button className="btn-ghost rv d1"
            style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => navigate('/courses')}>
            <Back /> Назад
          </button>

          {/* hero content */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 32px 32px' }}>
            <div className="rv d2">
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                {course.difficulty && <span className="badge">{course.difficulty}</span>}
                {course.school?.name && <span className="badge">{course.school.name}</span>}
                {course.school?.city && <span className="badge">{course.school.city}</span>}
              </div>
              <h1 className="disp text-white" style={{ fontSize: 'clamp(36px,5.5vw,68px)', lineHeight: 0.95, marginBottom: 14 }}>
                {course.title}
              </h1>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <span className="mono-sm">{course.teacher?.profile?.username || course.teacher?.email}</span>
                <span className="mono-sm">{course.stages?.length || 0} этапов</span>
                <span className="mono-sm">{approvedCount} студентов</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ROW ──────────────────────────────────── */}
        <div className="rv d3" style={{ borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { label: 'Этапов', val: course.stages?.length || 0 },
              { label: 'Студентов', val: approvedCount },
              { label: 'Заданий', val: course.assignments?.length || 0 },
            ].map((s, i) => (
              <div key={i} className="stat-block" style={{ borderRight: i < 2 ? '1px solid var(--line)' : 'none', textAlign: 'center' }}>
                <div className="disp text-white" style={{ fontSize: 48 }}>{s.val}</div>
                <div className="sh" style={{ marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BODY ───────────────────────────────────────── */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 0 80px' }}>

          {/* Description */}
          {course.description && (
            <Section label="Описание" delay="d3">
              <p style={{ fontFamily: 'Manrope', fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)' }}>
                {course.description}
              </p>
            </Section>
          )}

          {/* Teacher */}
          <Section label="Преподаватель" delay="d3">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {course.teacher?.profile?.avatar_url ? (
                <img src={course.teacher.profile.avatar_url} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--line)' }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="sh">T</span>
                </div>
              )}
              <div>
                <div style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>
                  {course.teacher?.profile?.username || course.teacher?.email}
                </div>
                <div className="sh" style={{ marginTop: 3 }}>Преподаватель</div>
              </div>
            </div>
          </Section>

          {/* Program */}
          {course.stages && course.stages.length > 0 && (
            <Section label="Программа курса" delay="d4">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {course.stages.map((stage: any, idx: number) => {
                  const done = stage.progress?.[0]?.completed;
                  return (
                    <div key={stage.id}
                      className={`stage-row ${done ? 'stage-done' : ''}`}
                      onClick={() => navigate(`/courses/${courseId}/lessons/${stage.id}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                      <div style={{
                        width: 32, height: 32, border: `1px solid ${done ? 'rgba(100,255,150,0.4)' : 'var(--line)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        color: done ? '#6feba2' : 'var(--muted)'
                      }}>
                        {done ? <Check /> : <span style={{ fontFamily: 'DM Mono', fontSize: 11, letterSpacing: '0.1em' }}>{String(idx + 1).padStart(2, '0')}</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 14, color: 'var(--text)' }}>{stage.title}</div>
                        <div className="mono-sm" style={{ marginTop: 3 }}>{stage.materials?.length || 0} материалов</div>
                      </div>
                      {done && <span className="badge badge-ok">Завершено</span>}
                      <span className="stage-arrow"><ArrowRight /></span>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Assignments */}
          {((course.assignments && course.assignments.length > 0) || isAdmin) && (
            <Section
              label="Практические задания"
              delay="d4"
              action={isAdmin ? <button className="btn-sm flex items-center gap-1" onClick={() => setShowAddAssignment(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus /> Добавить</button> : undefined}
            >
              {course.assignments && course.assignments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {course.assignments.map((asgn: any) => {
                    const sub = asgn.submissions?.[0];
                    return (
                      <div key={asgn.id} style={{ border: '1px solid var(--line)', background: 'var(--ink2)', padding: '18px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 8 }}>{asgn.title}</div>
                            {asgn.description && (
                              <div className="md-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{asgn.description}</ReactMarkdown>
                              </div>
                            )}
                          </div>
                          {sub?.grade !== null && sub?.grade !== undefined && (
                            <span className="badge badge-warn" style={{ flexShrink: 0 }}>Оценка: {sub.grade}</span>
                          )}
                        </div>

                        {/* student actions */}
                        {!isAdmin && (
                          <div style={{ borderTop: '1px solid var(--line)', marginTop: 14, paddingTop: 12 }}>
                            {sub ? (
                              <div>
                                <span className="mono-sm">Ответ отправлен</span>
                                {sub.grade === null || sub.grade === undefined ? (
                                  <span className="badge badge-warn" style={{ marginLeft: 12 }}>Ожидает проверки</span>
                                ) : null}
                                {sub.feedback && <p style={{ fontFamily: 'Manrope', fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{sub.feedback}</p>}
                              </div>
                            ) : (
                              <button className="btn-sm" onClick={() => { setSelectedAssignment(asgn); setShowSubmitAssignment(true); }}>
                                Отправить ответ
                              </button>
                            )}
                          </div>
                        )}

                        {/* admin submissions */}
                        {isAdmin && asgn.submissions && asgn.submissions.length > 0 && (
                          <div style={{ borderTop: '1px solid var(--line)', marginTop: 14, paddingTop: 12 }}>
                            <div className="sh" style={{ marginBottom: 10 }}>Ответы студентов ({asgn.submissions.length})</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {asgn.submissions.map((s: any) => (
                                <div key={s.id} className="sub-row">
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                                      {s.student?.profile?.username || s.student?.email}
                                    </span>
                                    {s.grade !== null && s.grade !== undefined && (
                                      <span className="badge badge-warn">{s.grade} баллов</span>
                                    )}
                                  </div>
                                  <p style={{ fontFamily: 'Manrope', fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{s.content}</p>
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <input type="number" placeholder="Оценка" defaultValue={s.grade ?? ''} id={`g-${s.id}`} className="inp" style={{ width: 90, padding: '8px 10px' }} />
                                    <input type="text" placeholder="Комментарий" defaultValue={s.feedback ?? ''} id={`f-${s.id}`} className="inp" style={{ padding: '8px 10px' }} />
                                    <button className="btn-sm-acid" onClick={() => {
                                      const g = (document.getElementById(`g-${s.id}`) as HTMLInputElement)?.value;
                                      const f = (document.getElementById(`f-${s.id}`) as HTMLInputElement)?.value;
                                      handleGradeSubmission(s.id, parseInt(g) || null, f);
                                    }}>Оценить</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mono-sm">Задания пока не добавлены</div>
              )}
            </Section>
          )}

          {/* Admin: Course Content Management */}
          {isAdmin && (
            <Section
              label="Управление содержимым"
              delay="d5"
              action={<button className="btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setShowAddStage(true)}><Plus /> Добавить урок</button>}
            >
              {showAddStage && (
                <div style={{ border: '1px solid var(--line)', padding: 16, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input className="inp" placeholder="Название урока" value={newStageTitle} onChange={e => setNewStageTitle(e.target.value)} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-acid" onClick={handleCreateStage}>Создать</button>
                    <button className="btn-ghost" onClick={() => setShowAddStage(false)}>Отмена</button>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {course.stages?.map((stage: any, idx: number) => (
                  <div key={stage.id} style={{ border: '1px solid var(--line)', background: 'var(--ink2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: stage.materials?.length ? '1px solid var(--line)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontFamily: 'DM Mono', fontSize: 10, letterSpacing: '0.15em', color: 'var(--muted)' }}>{String(idx + 1).padStart(2, '0')}</span>
                        <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 14, color: 'var(--text)' }}>{stage.title}</span>
                      </div>
                      <button className="btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }} onClick={() => { setSelectedStage(stage.id); setShowAddMaterial(true); }}>
                        <Plus /> Материал
                      </button>
                    </div>
                    {stage.materials && stage.materials.length > 0 && (
                      <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {stage.materials.map((m: any) => (
                          <div key={m.id} style={{ borderLeft: '2px solid rgba(93,69,253,0.25)', paddingLeft: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                              <span className="badge badge-acid">{m.type}</span>
                              {m.content_url && (
                                <a href={m.content_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--acid)', fontFamily: 'DM Mono', fontSize: 10, letterSpacing: '0.1em', textDecoration: 'none' }}>
                                  <LinkIcon /> {m.content_url.length > 40 ? m.content_url.substring(0, 40) + '…' : m.content_url}
                                </a>
                              )}
                            </div>
                            {m.content_text && (
                              <div className="md-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content_text}</ReactMarkdown>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Admin: Enrollments */}
          {isAdmin && course.enrollments && course.enrollments.length > 0 && (
            <Section label={`Заявки на курс (${pendingCount} ожидает)`} delay="d5">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {course.enrollments.map((enr: any) => (
                  <div key={enr.id} style={{ border: '1px solid var(--line)', background: 'var(--ink2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {enr.user?.profile?.avatar_url ? (
                        <img src={enr.user.profile.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--line)' }} />
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="sh" style={{ fontSize: 9 }}>U</span>
                        </div>
                      )}
                      <div>
                        <div style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 13, color: 'var(--text)' }}>
                          {enr.user?.profile?.username || enr.user?.email}
                        </div>
                        <span className={`badge ${enr.status === 'APPROVED' ? 'badge-ok' : enr.status === 'PENDING' ? 'badge-warn' : ''}`} style={{ marginTop: 4 }}>
                          {enr.status === 'PENDING' ? 'Ожидает' : enr.status === 'APPROVED' ? 'Принят' : 'Отклонён'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {enr.status === 'PENDING' && (
                        <>
                          <button className="btn-sm-acid" onClick={() => handleEnrollmentAction(enr.id, 'APPROVED')}>Принять</button>
                          <button className="btn-danger" onClick={() => handleEnrollmentAction(enr.id, 'REJECTED')}>Отклонить</button>
                        </>
                      )}
                      {enr.status === 'APPROVED' && (
                        <button className="btn-danger" onClick={() => handleRemoveParticipant(enr.id)}>Удалить</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* ── ENROLL BAR (sticky) ────────────────────────── */}
        {!isAdmin && (
          <div className="enroll-bar" style={{ position: 'sticky', bottom: 0, background: 'rgba(9,9,11,0.96)', backdropFilter: 'blur(20px)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div className="disp text-white" style={{ fontSize: 20 }}>{course.title}</div>
              <div className="sh" style={{ marginTop: 2 }}>
                {isEnrolled ? 'Вы записаны' : isPending ? 'Заявка на рассмотрении' : 'Запишитесь на курс'}
              </div>
            </div>
            {isEnrolled ? (
              <span className="badge badge-ok" style={{ padding: '10px 20px' }}>Зачислен</span>
            ) : isPending ? (
              <span className="badge badge-warn" style={{ padding: '10px 20px' }}>На рассмотрении</span>
            ) : (
              <button className="btn-acid" onClick={handleEnroll}>Записаться</button>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL: Submit assignment ──────────────────────── */}
      {showSubmitAssignment && selectedAssignment && (
        <div className="panel">
          <div className="panel-box">
            <ModalHeader title="Отправить ответ" sub={selectedAssignment.title} onClose={() => { setShowSubmitAssignment(false); setSelectedAssignment(null); setSubmissionContent(''); }} />
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <textarea className="inp" placeholder="Ваш ответ..." rows={6} style={{ resize: 'vertical' }}
                value={submissionContent} onChange={e => setSubmissionContent(e.target.value)} />
            </div>
            <ModalActions onConfirm={handleSubmitAssignment} confirmLabel="Отправить"
              onCancel={() => { setShowSubmitAssignment(false); setSelectedAssignment(null); setSubmissionContent(''); }} />
          </div>
        </div>
      )}

      {/* ── MODAL: Add assignment ─────────────────────────── */}
      {showAddAssignment && (
        <div className="panel">
          <div className="panel-box">
            <ModalHeader title="Добавить задание" onClose={() => setShowAddAssignment(false)} />
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="inp" placeholder="Название задания"
                value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} />
              <textarea className="inp" placeholder="Описание (Markdown)" rows={5} style={{ resize: 'vertical', fontFamily: 'DM Mono', fontSize: 12 }}
                value={newAssignment.description} onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })} />
              <div className="sh">Поддерживается Markdown</div>
            </div>
            <ModalActions onConfirm={handleCreateAssignment} confirmLabel="Добавить"
              onCancel={() => { setShowAddAssignment(false); setNewAssignment({ title: '', description: '' }); }} />
          </div>
        </div>
      )}

      {/* ── MODAL: Add material ───────────────────────────── */}
      {showAddMaterial && selectedStage && (
        <div className="panel">
          <div className="panel-box">
            <ModalHeader title="Добавить материал" onClose={() => { setShowAddMaterial(false); setSelectedStage(null); }} />
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <select className="inp" value={newMaterial.type}
                onChange={e => setNewMaterial({ ...newMaterial, type: e.target.value })}>
                <option value="TEXT">Текст</option>
                <option value="VIDEO">Видео</option>
                <option value="PDF">PDF</option>
                <option value="LINK">Ссылка</option>
                <option value="ASSIGNMENT">Практическое задание</option>
              </select>
              <input className="inp" placeholder="URL (опционально)" type="text"
                value={newMaterial.content_url} onChange={e => setNewMaterial({ ...newMaterial, content_url: e.target.value })} />
              <textarea className="inp" placeholder="Содержание лекции (Markdown)" rows={8}
                style={{ resize: 'vertical', fontFamily: 'DM Mono', fontSize: 12 }}
                value={newMaterial.content_text} onChange={e => setNewMaterial({ ...newMaterial, content_text: e.target.value })} />
              <div className="sh">Поддерживается Markdown: заголовки, списки, код и т.д.</div>
            </div>
            <ModalActions onConfirm={handleCreateMaterial} confirmLabel="Добавить"
              onCancel={() => { setShowAddMaterial(false); setSelectedStage(null); setNewMaterial({ type: 'TEXT', content_url: '', content_text: '' }); }} />
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Section wrapper ────────────────────────────────────────── */
function Section({ label, children, delay, action }: { label: string; children: React.ReactNode; delay?: string; action?: React.ReactNode }) {
  return (
    <div className={`rv ${delay || ''}`} style={{ borderBottom: '1px solid var(--line)', padding: '32px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <span className="sh">{label}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ─── Modal Header ───────────────────────────────────────────── */
function ModalHeader({ title, sub, onClose }: { title: string; sub?: string; onClose: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
      <div>
        <div className="sh" style={{ marginBottom: 4 }}>Форма</div>
        <div className="disp text-white" style={{ fontSize: 26 }}>{title}</div>
        {sub && <div className="mono-sm" style={{ marginTop: 4 }}>{sub}</div>}
      </div>
      <button className="btn-ghost" style={{ padding: '8px 10px', border: 'none', color: 'var(--muted)' }} onClick={onClose}><XIcon /></button>
    </div>
  );
}

/* ─── Modal Actions ──────────────────────────────────────────── */
function ModalActions({ onConfirm, confirmLabel, onCancel }: { onConfirm: () => void; confirmLabel: string; onCancel: () => void }) {
  return (
    <div style={{ display: 'flex', borderTop: '1px solid var(--line)' }}>
      <button className="btn-ghost" style={{ flex: 1, borderRight: '1px solid var(--line)', borderLeft: 'none', borderBottom: 'none', borderTop: 'none' }} onClick={onCancel}>Отмена</button>
      <button className="btn-acid" style={{ flex: 1 }} onClick={onConfirm}>{confirmLabel}</button>
    </div>
  );
}