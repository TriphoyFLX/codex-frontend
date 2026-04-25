import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

interface ProfileSetupProps {
  onComplete: () => void;
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,600&display=swap');

  .ps * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Outfit', sans-serif; }

  .ps {
    min-height: 100vh;
    display: flex;
  }

  /* ─── LEFT PANEL ─────────────────────────────────── */
  .ps-left {
    width: 46%;
    background: #0c0820;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 2.5rem 3rem;
    flex-shrink: 0;
  }

  .ps-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(93,69,253,0.09) 1px, transparent 1px),
      linear-gradient(90deg, rgba(93,69,253,0.09) 1px, transparent 1px);
    background-size: 44px 44px;
  }

  .ps-orb {
    position: absolute; border-radius: 50%; pointer-events: none;
  }
  .ps-orb1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(93,69,253,0.38) 0%, transparent 65%);
    top: -160px; left: -160px;
    animation: ps-ob1 9s ease-in-out infinite;
  }
  .ps-orb2 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, rgba(139,111,254,0.22) 0%, transparent 65%);
    bottom: -100px; right: -60px;
    animation: ps-ob2 12s ease-in-out infinite;
  }
  .ps-orb3 {
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(93,69,253,0.18) 0%, transparent 65%);
    top: 42%; left: 55%;
    animation: ps-ob3 7s ease-in-out infinite;
  }
  @keyframes ps-ob1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,40px)} }
  @keyframes ps-ob2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-22px,-28px)} }
  @keyframes ps-ob3 { 0%,100%{transform:translate(-50%,0)} 50%{transform:translate(-50%,-18px)} }

  .ps-bubble {
    position: absolute; pointer-events: none;
    border-radius: 16px;
    border: 1px solid rgba(93,69,253,0.28);
    background: rgba(15,8,40,0.65);
    backdrop-filter: blur(12px);
    padding: 14px 18px;
    font-size: 12px;
    line-height: 1.7;
  }
  .ps-bubble1 {
    top: 17%; right: 7%;
    animation: ps-bub1 10s ease-in-out infinite;
  }
  .ps-bubble2 {
    bottom: 16%; left: 4%;
    animation: ps-bub2 13s ease-in-out infinite;
  }
  @keyframes ps-bub1 { 0%,100%{transform:translateY(0) rotate(-1.5deg)} 50%{transform:translateY(-12px) rotate(-1.5deg)} }
  @keyframes ps-bub2 { 0%,100%{transform:translateY(0) rotate(1deg)} 50%{transform:translateY(-10px) rotate(1deg)} }

  .ps-code-kw  { color: #8B6FFE; }
  .ps-code-str { color: #6ec6ff; }
  .ps-code-num { color: #7fe99e; }
  .ps-code-dim { color: rgba(255,255,255,0.35); }

  /* brand */
  .ps-brand {
    position: relative; z-index: 2;
    display: flex; align-items: center; gap: 12px;
  }
  .ps-brand-mark {
    width: 42px; height: 42px; border-radius: 11px;
    background: linear-gradient(135deg, #5D45FD 0%, #9B7FFF 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px rgba(93,69,253,0.45);
  }
  .ps-brand-name {
    font-size: 19px; font-weight: 700; color: #fff;
    letter-spacing: -0.03em;
  }
  .ps-brand-name b { color: #9B7FFF; font-weight: 800; }

  /* hero text */
  .ps-hero {
    position: relative; z-index: 2;
    margin-top: auto;
  }
  .ps-hero-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: #5D45FD;
    margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .ps-hero-eyebrow::before {
    content: ''; display: block;
    width: 24px; height: 2px; background: #5D45FD;
    border-radius: 1px;
  }
  .ps-hero-h {
    font-family: 'Fraunces', serif;
    font-size: 46px; font-weight: 700; line-height: 1.12;
    color: #fff; letter-spacing: -0.03em;
    margin-bottom: 18px;
  }
  .ps-hero-h em { color: #7FE99E; font-style: italic; }
  .ps-hero-p {
    font-size: 14px; color: rgba(255,255,255,0.45);
    line-height: 1.75; max-width: 320px;
    margin-bottom: 2.25rem;
  }
  .ps-perks {
    display: flex; flex-direction: column; gap: 12px;
  }
  .ps-perk {
    display: flex; align-items: center; gap: 12px;
  }
  .ps-perk-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(93,69,253,0.18);
    border: 1px solid rgba(93,69,253,0.3);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 13px;
  }
  .ps-perk-text {
    font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.4;
  }
  .ps-perk-text strong { color: rgba(255,255,255,0.82); font-weight: 500; }

  /* ─── RIGHT PANEL ────────────────────────────────── */
  .ps-right {
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
  .ps-right::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(93,69,253,0.065) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse at 80% 15%, black 5%, transparent 65%);
    -webkit-mask-image: radial-gradient(ellipse at 80% 15%, black 5%, transparent 65%);
  }

  .ps-form-box {
    width: 100%; max-width: 390px;
    position: relative; z-index: 1;
    animation: psFormSlide 0.4s cubic-bezier(0.34,1.2,0.64,1);
  }
  @keyframes psFormSlide {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .ps-form-title {
    font-size: 27px; font-weight: 800;
    color: #1a1730; letter-spacing: -0.03em;
    margin-bottom: 5px;
  }
  .ps-form-sub {
    font-size: 14px; color: #a09acc; margin-bottom: 2rem; line-height: 1.6;
  }

  /* avatar upload */
  .ps-avatar-area {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 2rem;
  }
  .ps-avatar {
    width: 72px; height: 72px; border-radius: 18px;
    background: linear-gradient(135deg, #5D45FD 0%, #9B7FFF 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; font-weight: 700; color: #fff;
    flex-shrink: 0;
    position: relative; overflow: hidden;
  }
  .ps-avatar-edit {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.45); display: flex;
    align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.2s;
    cursor: pointer;
    color: #fff; font-size: 11px; font-weight: 600;
  }
  .ps-avatar:hover .ps-avatar-edit { opacity: 1; }
  .ps-avatar-info {
    font-size: 12px; color: #a09acc; line-height: 1.6;
    display: flex; flex-direction: column; gap: 4px;
  }
  .ps-avatar-info strong { color: #5D45FD; font-weight: 600; cursor: pointer; }
  .ps-avatar-info strong:hover { text-decoration: underline; }

  /* field */
  .ps-field { margin-bottom: 18px; }
  .ps-lbl {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 11.5px; font-weight: 600; color: #7b74b0;
    margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.08em;
  }
  .ps-lbl-opt {
    font-size: 11px; color: #c4bff5; font-weight: 400;
    text-transform: none; letter-spacing: 0;
    background: #f5f3ff; padding: 2px 9px; border-radius: 20px;
  }
  .ps-iw { position: relative; }
  .ps-ico {
    position: absolute; left: 14px; top: 18px;
    color: #c4bff5; pointer-events: none;
    transition: color 0.2s;
  }
  .ps-ico-texarea {
    position: absolute; left: 14px; top: 16px;
    color: #c4bff5; pointer-events: none;
    transition: color 0.2s;
  }
  .ps-iw:focus-within .ps-ico,
  .ps-iw:focus-within .ps-ico-texarea { color: #5D45FD; }

  .ps-input {
    width: 100%; padding: 13px 16px 13px 42px;
    border: 1.5px solid #ede9ff; border-radius: 12px;
    font-size: 14px; color: #1a1730; background: #faf9ff;
    font-family: 'Outfit', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
  }
  .ps-input::placeholder { color: #d0cbf5; }
  .ps-input:focus {
    border-color: #5D45FD;
    box-shadow: 0 0 0 4px rgba(93,69,253,0.1);
    background: #fff;
  }

  .ps-textarea {
    width: 100%; padding: 13px 16px 13px 42px;
    border: 1.5px solid #ede9ff; border-radius: 12px;
    font-size: 14px; color: #1a1730; background: #faf9ff;
    font-family: 'Outfit', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none; resize: vertical; min-height: 90px;
  }
  .ps-textarea::placeholder { color: #d0cbf5; }
  .ps-textarea:focus {
    border-color: #5D45FD;
    box-shadow: 0 0 0 4px rgba(93,69,253,0.1);
    background: #fff;
  }

  /* char counter */
  .ps-char-count {
    text-align: right; font-size: 11px; color: #c4bff5;
    margin-top: 4px;
  }

  /* CTA button */
  .ps-btn {
    width: 100%; padding: 15px;
    background: #5D45FD; color: #fff;
    border: none; border-radius: 13px;
    font-size: 15px; font-weight: 700;
    cursor: pointer; font-family: 'Outfit', sans-serif;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    letter-spacing: 0.01em; margin-top: 8px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .ps-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(93,69,253,0.38);
    background: #4e3ae0;
  }
  .ps-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
  .ps-btn:disabled { opacity: 0.38; cursor: not-allowed; }

  /* spinner */
  .ps-spinner {
    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff; border-radius: 50%;
    animation: psSpin 0.6s linear infinite;
  }
  @keyframes psSpin { to { transform: rotate(360deg); } }

  /* MOBILE */
  @media (max-width: 800px) {
    .ps { flex-direction: column; }
    .ps-left {
      width: 100%; min-height: 0;
      padding: 1.75rem 1.5rem 1.5rem;
    }
    .ps-desktop-only { display: none !important; }
    .ps-orb2, .ps-orb3 { display: none; }
    .ps-bubble1, .ps-bubble2 { display: none; }
    .ps-hero { margin-top: 1.5rem; }
    .ps-hero-h { font-size: 28px !important; margin-bottom: 0 !important; }
    .ps-right { padding: 2rem 1.25rem; justify-content: flex-start; }
    .ps-form-box { max-width: 100%; }
    .ps-form-title { font-size: 23px; }
  }
`;

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const { token } = useAuth();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      await api.users.updateProfile(token, { username, bio, grade });
      onComplete();
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Ошибка при создании профиля');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (username) return username.charAt(0).toUpperCase();
    return '?';
  };

  const bioCharsLeft = 200 - bio.length;

  return (
    <>
      <style>{STYLES}</style>
      <div className="ps">

        {/* ═══ LEFT ═══ */}
        <div className="ps-left">
          <div className="ps-grid" />
          <div className="ps-orb ps-orb1" />
          <div className="ps-orb ps-orb2" />
          <div className="ps-orb ps-orb3" />

          {/* floating code card */}
          <div className="ps-bubble ps-bubble1">
            <span className="ps-code-kw">const </span>
            <span className="ps-code-str">profile</span>
            <span className="ps-code-dim"> = {'{'}</span><br />
            <span className="ps-code-dim">&nbsp;&nbsp;level: </span>
            <span className="ps-code-num">42</span>
            <span className="ps-code-dim">,</span><br />
            <span className="ps-code-dim">&nbsp;&nbsp;xp: </span>
            <span className="ps-code-num">2840</span>
            <span className="ps-code-dim">,</span><br />
            <span className="ps-code-dim">&nbsp;&nbsp;achievements: </span>
            <span className="ps-code-num">12</span><br />
            <span className="ps-code-dim">{'}'}</span>
          </div>

          {/* Profile completion card */}
          <div className="ps-bubble ps-bubble2">
            <span className="ps-code-dim">// Прогресс профиля</span><br />
            <span className="ps-code-kw">let </span>
            <span className="ps-code-fn">completion</span>
            <span className="ps-code-dim"> = </span>
            <span className="ps-code-num">{(username ? 33 : 0) + (bio ? 33 : 0) + (grade ? 34 : 0)}%</span>
          </div>

          {/* Brand */}
          <div className="ps-brand">
            <div className="ps-brand-mark">
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                <path d="M9 7h6M9 11h4" strokeOpacity="0.6"/>
              </svg>
            </div>
            <span className="ps-brand-name">Codex <b>Learn</b></span>
          </div>

          {/* Hero — desktop */}
          <div className="ps-hero ps-desktop-only">
            <div className="ps-hero-eyebrow">Настройка профиля</div>
            <h2 className="ps-hero-h">
              Твой путь<br />начинается <em>здесь.</em>
            </h2>
            <p className="ps-hero-p">
              Расскажи о себе, чтобы мы могли персонализировать твой опыт обучения.
            </p>
            <div className="ps-perks">
              {[
                { icon: '🎯', title: 'Персонализация', desc: 'контент под твой уровень' },
                { icon: '🏆', title: 'Достижения', desc: 'отслеживай свой прогресс' },
                { icon: '👥', title: 'Сообщество', desc: 'найди единомышленников' },
              ].map(p => (
                <div className="ps-perk" key={p.title}>
                  <div className="ps-perk-icon">{p.icon}</div>
                  <span className="ps-perk-text">
                    <strong>{p.title}</strong> — {p.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero — mobile only short version */}
          <div className="ps-hero" style={{ marginTop:'1.5rem' }}>
            <h2 className="ps-hero-h" style={{ fontSize:'28px', marginBottom:0 }}>
              Твой путь. <em>Твой стиль.</em>
            </h2>
          </div>
        </div>

        {/* ═══ RIGHT ═══ */}
        <div className="ps-right">
          <div className="ps-form-box">
            <h1 className="ps-form-title">Создать профиль</h1>
            <p className="ps-form-sub">
              Шаг {step} из 2 — {step === 1 ? 'Основная информация' : 'Детали'}
            </p>

            {/* Avatar preview */}
            <div className="ps-avatar-area">
              <div className="ps-avatar">
                {getInitials()}
                <div className="ps-avatar-edit">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              </div>
              <div className="ps-avatar-info">
                <span>Добавь аватар</span>
                <strong>Загрузить фото</strong>
                <span style={{ fontSize:'10px' }}>JPG, PNG до 5MB</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Username & Grade */}
              {step === 1 && (
                <>
                  <div className="ps-field">
                    <div className="ps-lbl">
                      Имя пользователя
                      <span className="ps-lbl-opt">обязательно</span>
                    </div>
                    <div className="ps-iw">
                      <span className="ps-ico">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </span>
                      <input
                        className="ps-input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Как тебя называть?"
                        required
                      />
                    </div>
                  </div>

                  <div className="ps-field">
                    <div className="ps-lbl">
                      Класс
                      <span className="ps-lbl-opt">опционально</span>
                    </div>
                    <div className="ps-iw">
                      <span className="ps-ico">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
                        </svg>
                      </span>
                      <input
                        className="ps-input"
                        type="text"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="Например: 10А"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="ps-btn"
                    onClick={() => setStep(2)}
                    disabled={!username.trim()}
                  >
                    Далее →
                  </button>
                </>
              )}

              {/* Step 2: Bio & Submit */}
              {step === 2 && (
                <>
                  <div className="ps-field">
                    <div className="ps-lbl">
                      О себе
                      <span className="ps-lbl-opt">опционально</span>
                    </div>
                    <div className="ps-iw">
                      <span className="ps-ico-texarea">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </span>
                      <textarea
                        className="ps-textarea"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Расскажи о своих интересах, целях в учёбе..."
                        rows={4}
                        maxLength={200}
                      />
                    </div>
                    <div className="ps-char-count">
                      {bioCharsLeft} символов осталось
                    </div>
                  </div>

                  {/* Review info */}
                  <div style={{
                    background: '#faf9ff',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    marginBottom: '16px',
                    border: '1.5px solid #ede9ff'
                  }}>
                    <div style={{ fontSize:'11px', fontWeight:600, color:'#7b74b0', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                      Проверь данные
                    </div>
                    <div style={{ fontSize:'13px', color:'#1a1730', display:'flex', flexDirection:'column', gap:'6px' }}>
                      <div>
                        <span style={{ color:'#a09acc' }}>Имя: </span>
                        <strong>{username}</strong>
                      </div>
                      {grade && (
                        <div>
                          <span style={{ color:'#a09acc' }}>Класс: </span>
                          <strong>{grade}</strong>
                        </div>
                      )}
                      {bio && (
                        <div>
                          <span style={{ color:'#a09acc' }}>О себе: </span>
                          <span style={{ fontSize:'12px' }}>{bio.length > 50 ? bio.slice(0,50) + '...' : bio}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display:'flex', gap:'8px' }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        padding: '15px 20px',
                        background: 'none',
                        color: '#a09acc',
                        border: '1.5px solid #ede9ff',
                        borderRadius: '13px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'Outfit, sans-serif',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#c4bff5';
                        e.currentTarget.style.color = '#5D45FD';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#ede9ff';
                        e.currentTarget.style.color = '#a09acc';
                      }}
                    >
                      ← Назад
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !username.trim()}
                      className="ps-btn"
                      style={{ flex:1, margin:0 }}
                    >
                      {loading ? (
                        <>
                          <span className="ps-spinner" />
                          Сохранение...
                        </>
                      ) : (
                        'Сохранить и продолжить →'
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>

            {step === 1 && (
              <button
                type="button"
                onClick={onComplete}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'none',
                  color: '#a09acc',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  marginTop: '8px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#5D45FD'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#a09acc'; }}
              >
                Пропустить и заполнить позже
              </button>
            )}

            <p style={{
              marginTop:'2rem',
              textAlign:'center',
              fontSize:'11.5px',
              color:'#c4bff5',
              lineHeight:1.7
            }}>
              Все данные можно будет изменить позже в настройках профиля
            </p>
          </div>
        </div>
      </div>
    </>
  );
}