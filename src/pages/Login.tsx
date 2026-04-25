import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import EmailVerification from '../components/EmailVerification';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,600&display=swap');

  .cl * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Outfit', sans-serif; }

  .cl {
    min-height: 100vh;
    display: flex;
  }

  /* ─── LEFT PANEL ─────────────────────────────────── */
  .cl-left {
    width: 46%;
    background: #0c0820;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 2.5rem 3rem;
    flex-shrink: 0;
  }

  .cl-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(93,69,253,0.09) 1px, transparent 1px),
      linear-gradient(90deg, rgba(93,69,253,0.09) 1px, transparent 1px);
    background-size: 44px 44px;
  }

  .cl-orb {
    position: absolute; border-radius: 50%; pointer-events: none;
  }
  .cl-orb1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(93,69,253,0.38) 0%, transparent 65%);
    top: -160px; left: -160px;
    animation: ob1 9s ease-in-out infinite;
  }
  .cl-orb2 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, rgba(139,111,254,0.22) 0%, transparent 65%);
    bottom: -100px; right: -60px;
    animation: ob2 12s ease-in-out infinite;
  }
  .cl-orb3 {
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(93,69,253,0.18) 0%, transparent 65%);
    top: 42%; left: 55%;
    animation: ob3 7s ease-in-out infinite;
  }
  @keyframes ob1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,40px)} }
  @keyframes ob2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-22px,-28px)} }
  @keyframes ob3 { 0%,100%{transform:translate(-50%,0)} 50%{transform:translate(-50%,-18px)} }

  .cl-bubble {
    position: absolute; pointer-events: none;
    border-radius: 16px;
    border: 1px solid rgba(93,69,253,0.28);
    background: rgba(15,8,40,0.65);
    backdrop-filter: blur(12px);
    padding: 14px 18px;
    font-size: 12px;
    line-height: 1.7;
  }
  .cl-bubble1 {
    top: 17%; right: 7%;
    animation: bub1 10s ease-in-out infinite;
  }
  .cl-bubble2 {
    bottom: 16%; left: 4%;
    animation: bub2 13s ease-in-out infinite;
  }
  @keyframes bub1 { 0%,100%{transform:translateY(0) rotate(-1.5deg)} 50%{transform:translateY(-12px) rotate(-1.5deg)} }
  @keyframes bub2 { 0%,100%{transform:translateY(0) rotate(1deg)} 50%{transform:translateY(-10px) rotate(1deg)} }

  .cl-code-kw  { color: #8B6FFE; }
  .cl-code-str { color: #6ec6ff; }
  .cl-code-num { color: #7fe99e; }
  .cl-code-fn  { color: #ffb86c; }
  .cl-code-dim { color: rgba(255,255,255,0.35); }

  /* brand */
  .cl-brand {
    position: relative; z-index: 2;
    display: flex; align-items: center; gap: 12px;
  }
  .cl-brand-mark {
    width: 42px; height: 42px; border-radius: 11px;
    background: linear-gradient(135deg, #5D45FD 0%, #9B7FFF 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px rgba(93,69,253,0.45);
  }
  .cl-brand-name {
    font-size: 19px; font-weight: 700; color: #fff;
    letter-spacing: -0.03em;
  }
  .cl-brand-name b { color: #9B7FFF; font-weight: 800; }

  /* hero text */
  .cl-hero {
    position: relative; z-index: 2;
    margin-top: auto;
  }
  .cl-hero-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: #5D45FD;
    margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .cl-hero-eyebrow::before {
    content: ''; display: block;
    width: 24px; height: 2px; background: #5D45FD;
    border-radius: 1px;
  }
  .cl-hero-h {
    font-family: 'Fraunces', serif;
    font-size: 46px; font-weight: 700; line-height: 1.12;
    color: #fff; letter-spacing: -0.03em;
    margin-bottom: 18px;
  }
  .cl-hero-h em { color: #9B7FFF; font-style: italic; }
  .cl-hero-p {
    font-size: 14px; color: rgba(255,255,255,0.45);
    line-height: 1.75; max-width: 320px;
    margin-bottom: 2.25rem;
  }
  .cl-perks {
    display: flex; flex-direction: column; gap: 12px;
  }
  .cl-perk {
    display: flex; align-items: center; gap: 12px;
  }
  .cl-perk-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(93,69,253,0.18);
    border: 1px solid rgba(93,69,253,0.3);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 13px;
  }
  .cl-perk-text {
    font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.4;
  }
  .cl-perk-text strong { color: rgba(255,255,255,0.82); font-weight: 500; }

  /* ─── RIGHT PANEL ────────────────────────────────── */
  .cl-right {
    flex: 1;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    overflow-y: auto;
    position: relative;
  }
  .cl-right::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(93,69,253,0.065) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse at 80% 15%, black 5%, transparent 65%);
    -webkit-mask-image: radial-gradient(ellipse at 80% 15%, black 5%, transparent 65%);
  }

  .cl-form-box {
    width: 100%; max-width: 390px;
    position: relative; z-index: 1;
    animation: formSlide 0.4s cubic-bezier(0.34,1.2,0.64,1);
  }
  @keyframes formSlide {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .cl-form-title {
    font-size: 27px; font-weight: 800;
    color: #1a1730; letter-spacing: -0.03em;
    margin-bottom: 5px;
  }
  .cl-form-sub {
    font-size: 14px; color: #a09acc; margin-bottom: 2rem; line-height: 1.6;
  }
  .cl-form-sub a {
    color: #5D45FD; font-weight: 600; cursor: pointer; text-decoration: none;
  }
  .cl-form-sub a:hover { text-decoration: underline; }

  /* progress steps */
  .cl-progress {
    display: flex; align-items: center; gap: 6px; margin-bottom: 1.75rem;
  }
  .cl-prog-step { display: flex; align-items: center; gap: 6px; }
  .cl-prog-dot {
    width: 26px; height: 26px; border-radius: 50%;
    border: 2px solid #ede9ff;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #c4bff5;
    transition: all 0.3s; flex-shrink: 0;
  }
  .cl-prog-dot.done { background: #5D45FD; border-color: #5D45FD; color: #fff; }
  .cl-prog-dot.active { border-color: #5D45FD; color: #5D45FD; }
  .cl-prog-line {
    flex: 1; height: 2px; border-radius: 1px;
    background: #ede9ff; transition: background 0.3s; width: 60px;
  }
  .cl-prog-line.done { background: #5D45FD; }
  .cl-prog-lbl {
    font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
    text-transform: uppercase; color: #c4bff5; transition: color 0.3s;
  }
  .cl-prog-lbl.active { color: #5D45FD; }
  .cl-prog-lbl.done { color: #9188d8; }

  /* field */
  .cl-field { margin-bottom: 14px; }
  .cl-lbl {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 11.5px; font-weight: 600; color: #7b74b0;
    margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.08em;
  }
  .cl-lbl-opt {
    font-size: 11px; color: #c4bff5; font-weight: 400;
    text-transform: none; letter-spacing: 0;
    background: #f5f3ff; padding: 2px 9px; border-radius: 20px;
  }
  .cl-iw { position: relative; }
  .cl-ico {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    color: #c4bff5; pointer-events: none;
    display: flex; align-items: center; transition: color 0.2s;
  }
  .cl-iw:focus-within .cl-ico { color: #5D45FD; }
  .cl-input {
    width: 100%; padding: 13px 16px 13px 42px;
    border: 1.5px solid #ede9ff; border-radius: 12px;
    font-size: 14px; color: #1a1730; background: #faf9ff;
    font-family: 'Outfit', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
  }
  .cl-input::placeholder { color: #d0cbf5; }
  .cl-input:focus {
    border-color: #5D45FD;
    box-shadow: 0 0 0 4px rgba(93,69,253,0.1);
    background: #fff;
  }

  /* school list */
  .cl-s-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px;
  }
  .cl-s-count { font-size: 12px; color: #c4bff5; }
  .cl-schools {
    max-height: 210px; overflow-y: auto;
    display: flex; flex-direction: column; gap: 6px;
    padding-right: 3px; margin-bottom: 14px;
    scrollbar-width: thin; scrollbar-color: #d0cbf5 transparent;
  }
  .cl-sitem {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border: 1.5px solid #ede9ff;
    border-radius: 12px; cursor: pointer; background: #faf9ff;
    transition: all 0.17s; text-align: left; font-family: 'Outfit', sans-serif;
  }
  .cl-sitem:hover { border-color: #c4bff5; background: #f5f3ff; }
  .cl-sitem.sel { border-color: #5D45FD; background: #f0edff; }
  .cl-radio {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid #ddd8f8; flex-shrink: 0;
    transition: all 0.17s; display: flex; align-items: center; justify-content: center;
  }
  .cl-sitem.sel .cl-radio { border-color: #5D45FD; background: #5D45FD; }
  .cl-radio-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #fff; opacity: 0; transition: opacity 0.17s;
  }
  .cl-sitem.sel .cl-radio-dot { opacity: 1; }
  .cl-sn { font-size: 13px; font-weight: 500; color: #1a1730; }
  .cl-sitem.sel .cl-sn { color: #5D45FD; }
  .cl-sc { font-size: 12px; color: #a09acc; margin-top: 1px; }

  /* CTA button */
  .cl-btn {
    width: 100%; padding: 15px;
    background: #5D45FD; color: #fff;
    border: none; border-radius: 13px;
    font-size: 15px; font-weight: 700;
    cursor: pointer; font-family: 'Outfit', sans-serif;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    letter-spacing: 0.01em; margin-top: 6px;
  }
  .cl-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(93,69,253,0.38);
    background: #4e3ae0;
  }
  .cl-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
  .cl-btn:disabled { opacity: 0.38; cursor: not-allowed; }

  .cl-btn-ghost {
    width: 100%; padding: 12px; background: none;
    color: #a09acc; border: none; border-radius: 12px;
    font-size: 13px; font-weight: 500; cursor: pointer;
    font-family: 'Outfit', sans-serif; transition: color 0.2s; margin-top: 4px;
  }
  .cl-btn-ghost:hover { color: #5D45FD; }

  .cl-divider {
    display: flex; align-items: center; gap: 12px; margin: 1.5rem 0;
  }
  .cl-divider::before, .cl-divider::after {
    content: ''; flex: 1; height: 1px; background: #f0edff;
  }
  .cl-divider span { font-size: 12px; color: #c4bff5; }

  /* strength bar */
  .cl-strength { display: flex; gap: 5px; align-items: center; margin-top: 8px; }
  .cl-strength-bar {
    height: 3px; flex: 1; border-radius: 2px;
    transition: background 0.3s;
  }
  .cl-strength-lbl { font-size: 11px; color: #a09acc; margin-left: 4px; white-space: nowrap; }

  /* MOBILE */
  @media (max-width: 800px) {
    .cl { flex-direction: column; }
    .cl-left {
      width: 100%; min-height: 0;
      padding: 1.75rem 1.5rem 1.5rem;
    }
    .cl-desktop-only { display: none !important; }
    .cl-orb2 { display: none; }
    .cl-orb3 { display: none; }
    .cl-bubble1, .cl-bubble2 { display: none; }
    .cl-hero { margin-top: 1.5rem; }
    .cl-hero-h { font-size: 28px !important; margin-bottom: 0 !important; }
    .cl-right { padding: 2rem 1.25rem; justify-content: flex-start; }
    .cl-form-box { max-width: 100%; }
    .cl-form-title { font-size: 23px; }
  }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [teacherCode, setTeacherCode] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [registerStep, setRegisterStep] = useState<'school' | 'details'>('school');
  const [showVerification, setShowVerification] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (isRegister) loadSchools();
  }, [isRegister]);

  const loadSchools = async () => {
    try {
      const data = await api.schools.getAll();
      setSchools(data);
    } catch (error) {
      console.error('Error loading schools:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        if (!selectedSchool) { alert('Пожалуйста, выберите школу'); return; }
        const response = await fetch('/api/auth/register-with-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, teacher_code: teacherCode || undefined, school_id: selectedSchool })
        });
        const data = await response.json();
        if (response.ok && data.requiresVerification) {
          setShowVerification(true);
        } else {
          alert(data.error || 'Registration failed');
        }
      } else {
        await login(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed');
    }
  };

  const handleVerified = (token: string) => {
    localStorage.setItem('token', token);
    window.location.reload();
  };

  const handleBackToRegister = () => setShowVerification(false);

  const handleRegisterStep = () => {
    if (registerStep === 'school') setRegisterStep('details');
    else handleSubmit(new Event('submit') as any);
  };

  const resetRegisterForm = () => {
    setRegisterStep('school');
    setSelectedSchool('');
    setEmail(''); setPassword('');
    setTeacherCode(''); setSchoolSearch('');
  };

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.city?.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const pwStrength = password.length === 0 ? 0
    : password.length < 4 ? 1
    : password.length < 7 ? 2
    : password.length < 10 ? 3 : 4;

  const strengthColor = ['#ede9ff','#e55c5c','#f0a030','#5D45FD','#22c55e'];
  const strengthLabel = ['','Слабый','Средний','Хороший','Сильный'];

  return (
    <>
      <style>{STYLES}</style>
      <div className="cl">

        {/* ═══ LEFT ═══ */}
        <div className="cl-left">
          <div className="cl-grid" />
          <div className="cl-orb cl-orb1" />
          <div className="cl-orb cl-orb2" />
          <div className="cl-orb cl-orb3" />

          {/* floating code card */}
          <div className="cl-bubble cl-bubble1">
            <span className="cl-code-kw">const </span>
            <span className="cl-code-fn">lesson</span>
            <span className="cl-code-dim"> = {'{'}</span><br />
            <span className="cl-code-dim">&nbsp;&nbsp;topic: </span>
            <span className="cl-code-str">"Алгоритмы"</span>
            <span className="cl-code-dim">,</span><br />
            <span className="cl-code-dim">&nbsp;&nbsp;progress: </span>
            <span className="cl-code-num">87</span>
            <span className="cl-code-dim">%,</span><br />
            <span className="cl-code-dim">&nbsp;&nbsp;streak: </span>
            <span className="cl-code-num">14</span>
            <span className="cl-code-dim"> days</span><br />
            <span className="cl-code-dim">{'}'}</span>
          </div>

          {/* floating streak card */}
          <div className="cl-bubble cl-bubble2">
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#7fe99e', boxShadow:'0 0 8px #7fe99e' }} />
              <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'12px', fontWeight:600 }}>14-дневная серия</span>
            </div>
            <div style={{ display:'flex', gap:'4px' }}>
              {Array.from({length:14}).map((_,i) => (
                <div key={i} style={{
                  width:'13px', height:'26px', borderRadius:'4px',
                  background: i < 11 ? `rgba(93,69,253,${0.5 + i*0.04})` : 'rgba(255,255,255,0.08)',
                }} />
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="cl-brand">
            <div className="cl-brand-mark">
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                <path d="M9 7h6M9 11h4" strokeOpacity="0.6"/>
              </svg>
            </div>
            <span className="cl-brand-name">Codex <b>Learn</b></span>
          </div>

          {/* Hero — desktop */}
          <div className="cl-hero cl-desktop-only">
            <div className="cl-hero-eyebrow">Образовательная платформа</div>
            <h2 className="cl-hero-h">
              Учись.<br /><em>Думай.</em><br />Развивайся.
            </h2>
            <p className="cl-hero-p">
              Персонализированные курсы, живая аналитика и сообщество — всё в одном месте.
            </p>
            <div className="cl-perks">
              {[
                { icon: '🧠', title: 'AI-адаптация', desc: 'курс подстраивается под тебя' },
                { icon: '📈', title: 'Живой прогресс', desc: 'видь рост каждый день' },
                { icon: '🤝', title: 'Сообщество', desc: 'учись вместе с другими' },
              ].map(p => (
                <div className="cl-perk" key={p.title}>
                  <div className="cl-perk-icon">{p.icon}</div>
                  <span className="cl-perk-text">
                    <strong>{p.title}</strong> — {p.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero — mobile only short version */}
          <div className="cl-hero" style={{ marginTop:'1.5rem' }}>
            <h2 className="cl-hero-h" style={{ fontSize:'28px', marginBottom:0 }}>
              Учись. <em>Думай.</em>
            </h2>
          </div>
        </div>

        {/* ═══ RIGHT ═══ */}
        <div className="cl-right">
          <div className="cl-form-box">

            <h1 className="cl-form-title">
              {isRegister ? 'Создать аккаунт' : 'С возвращением'}
            </h1>
            <p className="cl-form-sub">
              {isRegister ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
              <a onClick={() => { setIsRegister(!isRegister); if (!isRegister) resetRegisterForm(); }}>
                {isRegister ? 'Войти' : 'Зарегистрироваться'}
              </a>
            </p>

            {/* Step progress */}
            {isRegister && (
              <div className="cl-progress">
                <div className="cl-prog-step">
                  <div className={`cl-prog-dot ${registerStep === 'details' ? 'done' : 'active'}`}>
                    {registerStep === 'details' ? '✓' : '1'}
                  </div>
                  <span className={`cl-prog-lbl ${registerStep === 'school' ? 'active' : 'done'}`}>Школа</span>
                </div>
                <div className={`cl-prog-line${registerStep === 'details' ? ' done' : ''}`} />
                <div className="cl-prog-step">
                  <div className={`cl-prog-dot${registerStep === 'details' ? ' active' : ''}`}>2</div>
                  <span className={`cl-prog-lbl${registerStep === 'details' ? ' active' : ''}`}>Данные</span>
                </div>
              </div>
            )}

            {/* ── LOGIN ── */}
            {!isRegister && (
              <form onSubmit={handleSubmit}>
                <div className="cl-field">
                  <div className="cl-lbl">Email</div>
                  <div className="cl-iw">
                    <span className="cl-ico">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </span>
                    <input className="cl-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="cl-field">
                  <div className="cl-lbl">Пароль</div>
                  <div className="cl-iw">
                    <span className="cl-ico">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                    </span>
                    <input className="cl-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                  </div>
                </div>
                <button type="submit" className="cl-btn">Войти →</button>
              </form>
            )}

            {/* ── REGISTER STEP 1 ── */}
            {isRegister && registerStep === 'school' && (
              <div>
                <div className="cl-s-head">
                  <div className="cl-lbl" style={{ margin:0 }}>Ваша школа</div>
                  <span className="cl-s-count">{filteredSchools.length} результатов</span>
                </div>
                <div className="cl-field">
                  <div className="cl-iw" style={{ marginBottom:'10px' }}>
                    <span className="cl-ico">
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/>
                      </svg>
                    </span>
                    <input className="cl-input" type="text" value={schoolSearch} onChange={e => setSchoolSearch(e.target.value)} placeholder="Поиск школы или города..." />
                  </div>
                  <div className="cl-schools">
                    {filteredSchools.map(school => (
                      <button key={school.id} className={`cl-sitem${selectedSchool === school.id ? ' sel' : ''}`} onClick={() => setSelectedSchool(school.id)}>
                        <div className="cl-radio"><div className="cl-radio-dot" /></div>
                        <div>
                          <div className="cl-sn">{school.name}</div>
                          {school.city && <div className="cl-sc">{school.city}</div>}
                        </div>
                      </button>
                    ))}
                    {filteredSchools.length === 0 && (
                      <div style={{ textAlign:'center', padding:'2rem 0', color:'#c4bff5', fontSize:'13px' }}>
                        Ничего не найдено
                      </div>
                    )}
                  </div>
                </div>
                <button className="cl-btn" onClick={handleRegisterStep} disabled={!selectedSchool}>
                  Далее →
                </button>
              </div>
            )}

            {/* ── REGISTER STEP 2 ── */}
            {isRegister && registerStep === 'details' && (
              <form onSubmit={handleSubmit}>
                <div className="cl-field">
                  <div className="cl-lbl">Email</div>
                  <div className="cl-iw">
                    <span className="cl-ico">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </span>
                    <input className="cl-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="cl-field">
                  <div className="cl-lbl">Пароль</div>
                  <div className="cl-iw">
                    <span className="cl-ico">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                    </span>
                    <input className="cl-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Минимум 8 символов" required />
                  </div>
                  {password.length > 0 && (
                    <div className="cl-strength">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="cl-strength-bar" style={{ background: i <= pwStrength ? strengthColor[pwStrength] : '#ede9ff' }} />
                      ))}
                      <span className="cl-strength-lbl">{strengthLabel[pwStrength]}</span>
                    </div>
                  )}
                </div>
                <div className="cl-field">
                  <div className="cl-lbl">
                    Код учителя
                    <span className="cl-lbl-opt">опционально</span>
                  </div>
                  <div className="cl-iw">
                    <span className="cl-ico">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                      </svg>
                    </span>
                    <input className="cl-input" type="text" value={teacherCode} onChange={e => setTeacherCode(e.target.value)} placeholder="Введите код, если есть" />
                  </div>
                </div>
                <button type="submit" className="cl-btn">Зарегистрироваться →</button>
                <button type="button" className="cl-btn-ghost" onClick={() => setRegisterStep('school')}>
                  ← Назад к выбору школы
                </button>
              </form>
            )}

            {!isRegister && (
              <>
                <div className="cl-divider"><span>или</span></div>
                <p style={{ textAlign:'center', fontSize:'13px', color:'#a09acc' }}>
                  Нет аккаунта?{' '}
                  <span onClick={() => { setIsRegister(true); resetRegisterForm(); }}
                    style={{ color:'#5D45FD', fontWeight:600, cursor:'pointer' }}>
                    Создать
                  </span>
                </p>
              </>
            )}

            <p style={{ marginTop:'2rem', textAlign:'center', fontSize:'11.5px', color:'#c4bff5', lineHeight:1.7 }}>
              Нажимая кнопку, вы соглашаетесь с{' '}
              <span style={{ color:'#9188d8', cursor:'pointer' }}>условиями</span> и{' '}
              <span style={{ color:'#9188d8', cursor:'pointer' }}>политикой конфиденциальности</span>
            </p>
          </div>
        </div>
      </div>

      {showVerification && (
        <EmailVerification
          email={email} password={password}
          teacherCode={teacherCode || undefined}
          schoolId={selectedSchool}
          onVerified={handleVerified}
          onBack={handleBackToRegister}
        />
      )}
    </>
  );
}