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
    align-items: center;
    justify-content: center;
    background: #faf9ff;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  /* ambient background */
  .ps-bg {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(93,69,253,0.06) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .ps-orb {
    position: absolute; border-radius: 50%; pointer-events: none;
  }
  .ps-orb1 {
    width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(93,69,253,0.12) 0%, transparent 60%);
    top: -100px; right: -100px;
    animation: psOrb1 10s ease-in-out infinite;
  }
  .ps-orb2 {
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(139,111,254,0.09) 0%, transparent 60%);
    bottom: -80px; left: -80px;
    animation: psOrb2 13s ease-in-out infinite;
  }
  @keyframes psOrb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,25px)} }
  @keyframes psOrb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,-20px)} }

  /* card */
  .ps-card {
    position: relative; z-index: 1;
    background: #fff;
    border-radius: 24px;
    padding: 2.5rem 2.25rem;
    width: 100%;
    max-width: 440px;
    box-shadow:
      0 1px 3px rgba(0,0,0,0.04),
      0 8px 30px rgba(93,69,253,0.08),
      0 20px 60px rgba(93,69,253,0.05);
    border: 1px solid rgba(93,69,253,0.06);
    animation: cardIn 0.5s cubic-bezier(0.34,1.2,0.64,1);
  }
  @keyframes cardIn {
    from { opacity:0; transform:translateY(28px) scale(0.98); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  /* header */
  .ps-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 20px;
    background: #f0edff;
    color: #5D45FD;
    font-size: 11px; font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 1.25rem;
  }
  .ps-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #5D45FD;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .ps-title {
    font-family: 'Fraunces', serif;
    font-size: 30px; font-weight: 700;
    color: #1a1730; letter-spacing: -0.03em;
    line-height: 1.15; margin-bottom: 6px;
  }
  .ps-title em { color: #5D45FD; font-style: italic; }
  .ps-subtitle {
    font-size: 14px; color: #a09acc;
    line-height: 1.6; margin-bottom: 2rem;
  }

  /* progress bar */
  .ps-progress-wrap {
    margin-bottom: 2rem;
  }
  .ps-progress-info {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 8px;
  }
  .ps-progress-label {
    font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.08em;
    color: #7b74b0;
  }
  .ps-progress-perc {
    font-size: 13px; font-weight: 700; color: #5D45FD;
  }
  .ps-progress-bar {
    height: 4px; background: #f0edff;
    border-radius: 2px; overflow: hidden;
  }
  .ps-progress-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, #5D45FD, #9B7FFF);
    transition: width 0.5s cubic-bezier(0.34,1.2,0.64,1);
  }

  /* field */
  .ps-field { margin-bottom: 16px; }
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
  .ps-lbl-req {
    font-size: 10px; color: #ff6b6b; font-weight: 400;
    text-transform: none; letter-spacing: 0;
  }
  .ps-iw { position: relative; }
  .ps-ico {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    color: #c4bff5; pointer-events: none;
    transition: color 0.2s;
    display: flex; align-items: center;
  }
  .ps-field:focus-within .ps-ico { color: #5D45FD; }

  .ps-input, .ps-textarea {
    width: 100%;
    padding: 13px 16px 13px 42px;
    border: 1.5px solid #ede9ff;
    border-radius: 12px;
    font-size: 14px; color: #1a1730;
    background: #faf9ff;
    font-family: 'Outfit', sans-serif;
    transition: all 0.2s;
    outline: none;
  }
  .ps-textarea {
    resize: vertical;
    min-height: 90px;
    padding-top: 13px;
  }
  .ps-input::placeholder, .ps-textarea::placeholder { color: #d0cbf5; }
  .ps-input:focus, .ps-textarea:focus {
    border-color: #5D45FD;
    box-shadow: 0 0 0 4px rgba(93,69,253,0.08);
    background: #fff;
  }

  .ps-char-count {
    text-align: right; font-size: 10.5px; color: #c4bff5;
    margin-top: 5px;
    transition: color 0.2s;
  }
  .ps-char-count.warn { color: #ffb86c; }

  /* buttons */
  .ps-btn {
    width: 100%; padding: 14px;
    background: #5D45FD; color: #fff;
    border: none; border-radius: 13px;
    font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: 'Outfit', sans-serif;
    transition: all 0.2s;
    letter-spacing: 0.01em;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 6px;
  }
  .ps-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(93,69,253,0.35);
    background: #4e3ae0;
  }
  .ps-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
  .ps-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .ps-btn-ghost {
    width: 100%; padding: 11px; background: none;
    color: #a09acc; border: none; border-radius: 12px;
    font-size: 13px; font-weight: 500; cursor: pointer;
    font-family: 'Outfit', sans-serif;
    transition: color 0.2s; margin-top: 4px;
  }
  .ps-btn-ghost:hover { color: #5D45FD; }

  /* spinner */
  .ps-spinner {
    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff; border-radius: 50%;
    animation: psSpin 0.6s linear infinite;
  }
  @keyframes psSpin { to { transform: rotate(360deg); } }

  /* success checkmark */
  .ps-success {
    display: flex; flex-direction: column; align-items: center; gap: 16px;
    padding: 1rem 0;
  }
  .ps-check {
    width: 64px; height: 64px; border-radius: 50%;
    background: #e8f5e9;
    display: flex; align-items: center; justify-content: center;
    animation: popIn 0.4s cubic-bezier(0.34,1.2,0.64,1);
  }
  @keyframes popIn {
    from { transform:scale(0); opacity:0; }
    to   { transform:scale(1); opacity:1; }
  }

  /* mobile */
  @media (max-width: 500px) {
    .ps { padding: 0; align-items: flex-start; }
    .ps-card {
      border-radius: 0; padding: 2rem 1.5rem;
      min-height: 100vh; max-width: 100%;
      box-shadow: none; border: none;
    }
    .ps-title { font-size: 26px; }
  }
`;

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const { token } = useAuth();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);

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

  const completionPercent = Math.min(
    ((username ? 50 : 0) + (bio ? 25 : 0) + (grade ? 25 : 0)),
    100
  );
  const charsLeft = 250 - bio.length;

  return (
    <>
      <style>{STYLES}</style>
      <div className="ps">
        <div className="ps-bg" />
        <div className="ps-orb ps-orb1" />
        <div className="ps-orb ps-orb2" />

        <div className="ps-card">
          {/* Badge */}
          <div className="ps-badge">
            <span className="ps-badge-dot" />
            Настройка профиля
          </div>

          {/* Title */}
          <h1 className="ps-title">
            Давай <em>познакомимся</em>
          </h1>
          <p className="ps-subtitle">
            Расскажи немного о себе — это поможет нам сделать обучение персональным.
          </p>

          {/* Progress */}
          <div className="ps-progress-wrap">
            <div className="ps-progress-info">
              <span className="ps-progress-label">Заполнено</span>
              <span className="ps-progress-perc">{completionPercent}%</span>
            </div>
            <div className="ps-progress-bar">
              <div
                className="ps-progress-fill"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="ps-field">
              <div className="ps-lbl">
                Имя пользователя
                <span className="ps-lbl-req">*обязательно</span>
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
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Grade */}
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

            {/* Bio */}
            <div className="ps-field">
              <div className="ps-lbl">
                О себе
                <span className="ps-lbl-opt">опционально</span>
              </div>
              <div className="ps-iw">
                <span className="ps-ico" style={{ top: '16px', transform: 'none' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </span>
                <textarea
                  className="ps-textarea"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Расскажи о своих интересах, целях в учёбе..."
                  rows={3}
                  maxLength={250}
                />
              </div>
              {bio.length > 0 && (
                <div className={`ps-char-count${charsLeft < 30 ? ' warn' : ''}`}>
                  {charsLeft} символов осталось
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="ps-btn"
            >
              {loading ? (
                <>
                  <span className="ps-spinner" />
                  Сохраняем...
                </>
              ) : (
                <>
                  Сохранить и продолжить
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

            <button
              type="button"
              className="ps-btn-ghost"
              onClick={onComplete}
            >
              Пропустить — заполню позже
            </button>
          </form>
        </div>
      </div>
    </>
  );
}