import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import EmailVerification from '../components/EmailVerification';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [teacherCode, setTeacherCode] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const [registerStep, setRegisterStep] = useState<'school' | 'details'>('school');
  const [showVerification, setShowVerification] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (isRegister) {
      loadSchools();
    }
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
        if (!selectedSchool) {
          alert('Пожалуйста, выберите школу');
          return;
        }
        
        const response = await fetch('/api/auth/register-with-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            teacher_code: teacherCode || undefined,
            school_id: selectedSchool
          })
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

  const handleBackToRegister = () => {
    setShowVerification(false);
  };

  const handleRegisterStep = () => {
    if (registerStep === 'school') {
      setRegisterStep('details');
    } else {
      handleSubmit(new Event('submit') as any);
    }
  };

  const resetRegisterForm = () => {
    setRegisterStep('school');
    setSelectedSchool('');
    setEmail('');
    setPassword('');
    setTeacherCode('');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        .auth-root * { font-family: 'Sora', sans-serif; box-sizing: border-box; }

        .auth-root {
          min-height: 100vh;
          background: #f7f6fe;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        /* Decorative blobs */
        .auth-blob-1 {
          position: fixed; top: -120px; right: -120px;
          width: 420px; height: 420px; border-radius: 50%;
          background: radial-gradient(circle, rgba(93,69,253,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .auth-blob-2 {
          position: fixed; bottom: -100px; left: -80px;
          width: 360px; height: 360px; border-radius: 50%;
          background: radial-gradient(circle, rgba(139,111,254,0.10) 0%, transparent 70%);
          pointer-events: none;
        }

        .auth-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 2.5rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 2px 4px rgba(93,69,253,0.06), 0 16px 48px rgba(93,69,253,0.1);
          position: relative;
          z-index: 1;
          animation: cardIn 0.35s ease;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-logo {
          display: flex; align-items: center; gap: 10px; margin-bottom: 2rem;
        }
        .auth-logo-mark {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #5D45FD 0%, #8B6FFE 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .auth-logo-name {
          font-size: 16px; font-weight: 600; color: #1a1730;
        }

        .auth-heading {
          font-size: 24px; font-weight: 700; color: #1a1730;
          margin: 0 0 6px;
        }
        .auth-subheading {
          font-size: 14px; color: #7b74b0; margin: 0 0 2rem;
        }

        /* Step indicator */
        .step-bar {
          display: flex; gap: 6px; margin-bottom: 1.75rem;
        }
        .step-dot {
          height: 4px; border-radius: 2px; flex: 1;
          background: #ede9ff;
          transition: background 0.3s;
        }
        .step-dot.active { background: #5D45FD; }

        /* Field */
        .field-label {
          display: block; font-size: 12px; font-weight: 500;
          color: #6e68a0; margin-bottom: 7px;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .field-input {
          width: 100%; padding: 13px 16px;
          border: 1.5px solid #e8e4fc;
          border-radius: 12px;
          font-size: 14px; font-weight: 400;
          color: #1a1730;
          background: #faf9ff;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .field-input::placeholder { color: #c4bff5; }
        .field-input:focus {
          border-color: #5D45FD;
          box-shadow: 0 0 0 4px rgba(93,69,253,0.1);
          background: #fff;
        }
        .field-wrap { margin-bottom: 1rem; }

        /* Optional badge on label */
        .field-optional {
          font-size: 11px; color: #b0aad4; font-weight: 400;
          margin-left: 6px; text-transform: none; letter-spacing: 0;
        }

        /* Buttons */
        .btn-main {
          width: 100%; padding: 14px;
          background: #5D45FD; color: #fff;
          border: none; border-radius: 12px;
          font-size: 15px; font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.01em;
          margin-top: 4px;
        }
        .btn-main:hover:not(:disabled) {
          background: #4a34e8;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(93,69,253,0.3);
        }
        .btn-main:disabled { opacity: 0.4; cursor: not-allowed; }

        .btn-ghost {
          width: 100%; padding: 12px;
          background: transparent; color: #9188d8;
          border: none; border-radius: 12px;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: color 0.2s;
          margin-top: 4px;
        }
        .btn-ghost:hover { color: #5D45FD; }

        /* Divider */
        .auth-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 1.5rem 0;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: ''; flex: 1; height: 1px; background: #ede9ff;
        }
        .auth-divider span {
          font-size: 12px; color: #b0aad4;
        }

        .toggle-link {
          color: #5D45FD; font-weight: 500; text-decoration: none; cursor: pointer;
          transition: opacity 0.2s;
        }
        .toggle-link:hover { opacity: 0.75; }

        /* School selector */
        .school-list {
          display: flex; flex-direction: column; gap: 6px;
          max-height: 240px; overflow-y: auto;
          padding-right: 4px;
          margin-bottom: 1rem;
          scrollbar-width: thin;
          scrollbar-color: #c4bff5 transparent;
        }
        .school-item {
          padding: 12px 14px;
          border: 1.5px solid #e8e4fc;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          background: #faf9ff;
        }
        .school-item:hover {
          border-color: #5D45FD;
          background: #f5f3ff;
        }
        .school-item.selected {
          border-color: #5D45FD;
          background: #f0edff;
        }
        .school-name {
          font-size: 14px; font-weight: 500; color: #1a1730;
          display: block;
        }
        .school-city {
          font-size: 12px; color: #9188d8; display: block; margin-top: 2px;
        }
        .school-item.selected .school-name { color: #5D45FD; }
      `}</style>

      <div className="auth-root">
        <div className="auth-blob-1" />
        <div className="auth-blob-2" />

        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-mark">
              <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="auth-logo-name">EduPortal</span>
          </div>

          {/* Heading */}
          <h1 className="auth-heading">
            {isRegister ? 'Создать аккаунт' : 'Добро пожаловать'}
          </h1>
          <p className="auth-subheading">
            {isRegister
              ? 'Зарегистрируйтесь, чтобы начать'
              : 'Войдите в свой аккаунт'}
          </p>

          {/* Step indicator for registration */}
          {isRegister && (
            <div className="step-bar">
              <div className={`step-dot${registerStep === 'school' || registerStep === 'details' ? ' active' : ''}`} />
              <div className={`step-dot${registerStep === 'details' ? ' active' : ''}`} />
            </div>
          )}

          {/* — LOGIN FORM — */}
          {!isRegister && (
            <form onSubmit={handleSubmit}>
              <div className="field-wrap">
                <label className="field-label">Email</label>
                <input
                  className="field-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="field-wrap">
                <label className="field-label">Пароль</label>
                <input
                  className="field-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="btn-main">
                Войти
              </button>
            </form>
          )}

          {/* — REGISTER: STEP 1 — */}
          {isRegister && registerStep === 'school' && (
            <div>
              <label className="field-label" style={{ display: 'block', marginBottom: '10px' }}>
                Выберите школу
              </label>
              <div className="school-list">
                {schools.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => setSelectedSchool(school.id)}
                    className={`school-item${selectedSchool === school.id ? ' selected' : ''}`}
                  >
                    <span className="school-name">{school.name}</span>
                    <span className="school-city">{school.city}</span>
                  </button>
                ))}
              </div>
              <button
                className="btn-main"
                onClick={handleRegisterStep}
                disabled={!selectedSchool}
              >
                Далее →
              </button>
            </div>
          )}

          {/* — REGISTER: STEP 2 — */}
          {isRegister && registerStep === 'details' && (
            <form onSubmit={handleSubmit}>
              <div className="field-wrap">
                <label className="field-label">Email</label>
                <input
                  className="field-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="field-wrap">
                <label className="field-label">Пароль</label>
                <input
                  className="field-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="field-wrap">
                <label className="field-label">
                  Код учителя
                  <span className="field-optional">опционально</span>
                </label>
                <input
                  className="field-input"
                  type="text"
                  value={teacherCode}
                  onChange={(e) => setTeacherCode(e.target.value)}
                  placeholder="Введите код, если есть"
                />
              </div>
              <button type="submit" className="btn-main">
                Зарегистрироваться
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setRegisterStep('school')}
              >
                ← Назад
              </button>
            </form>
          )}

          {/* Toggle login/register */}
          <div className="auth-divider"><span>или</span></div>
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#7b74b0', margin: 0 }}>
            {isRegister ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
            <span
              className="toggle-link"
              onClick={() => {
                setIsRegister(!isRegister);
                if (!isRegister) resetRegisterForm();
              }}
            >
              {isRegister ? 'Войти' : 'Зарегистрироваться'}
            </span>
          </p>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showVerification && (
        <EmailVerification
          email={email}
          password={password}
          teacherCode={teacherCode || undefined}
          schoolId={selectedSchool}
          onVerified={handleVerified}
          onBack={handleBackToRegister}
        />
      )}
    </>
  );
}