import { useState } from 'react';

interface EmailVerificationProps {
  email: string;
  password: string;
  teacherCode?: string;
  schoolId?: string;
  onVerified: (token: string, user: any) => void;
  onBack: () => void;
}

export default function EmailVerification({ 
  email, 
  password, 
  teacherCode, 
  schoolId, 
  onVerified, 
  onBack 
}: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          teacher_code: teacherCode,
          school_id: schoolId,
          verification_code: verificationCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        onVerified(data.token, data.user);
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    setResendMessage('');

    try {
      const response = await fetch('/api/verification/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setResendMessage('Код отправлен повторно');
      } else {
        setError(data.error || 'Failed to resend code');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 12, 40, 0.55)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 50,
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 24px 60px rgba(93, 69, 253, 0.12), 0 4px 16px rgba(0,0,0,0.08)',
        animation: 'slideUp 0.3s ease',
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap');
          .verify-wrap * { font-family: 'Sora', sans-serif; box-sizing: border-box; }
          @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          .code-input::placeholder { color: #c4bff5; letter-spacing: 0.3em; }
          .code-input:focus { outline: none; border-color: #5D45FD; box-shadow: 0 0 0 4px rgba(93,69,253,0.1); }
          .btn-primary { background: #5D45FD; color: #fff; border: none; cursor: pointer; transition: all 0.2s; }
          .btn-primary:hover:not(:disabled) { background: #4a34e8; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(93,69,253,0.3); }
          .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
          .btn-secondary { background: #f5f3ff; color: #5D45FD; border: none; cursor: pointer; transition: all 0.2s; }
          .btn-secondary:hover:not(:disabled) { background: #ede9ff; }
          .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
          .back-btn { color: #9188d8; background: none; border: none; cursor: pointer; transition: color 0.2s; font-size: 13px; }
          .back-btn:hover { color: #5D45FD; }
        `}</style>

        <div className="verify-wrap">
          {/* Icon */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              width: '52px', height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #5D45FD 0%, #8B6FFE 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1a1730', margin: '0 0 6px' }}>
            Подтверждение email
          </h2>
          <p style={{ fontSize: '14px', color: '#7b74b0', margin: '0 0 2rem', lineHeight: 1.6 }}>
            Мы отправили код на{' '}
            <span style={{ color: '#5D45FD', fontWeight: 500 }}>{email}</span>
          </p>

          {/* Form */}
          <form onSubmit={handleVerify}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#6e68a0', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Код подтверждения
            </label>
            <input
              className="code-input"
              id="code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              placeholder="• • • • • •"
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '1.5px solid #e8e4fc',
                borderRadius: '12px',
                fontSize: '26px',
                fontWeight: 600,
                letterSpacing: '0.35em',
                textAlign: 'center',
                color: '#1a1730',
                background: '#faf9ff',
                marginBottom: '1rem',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              maxLength={6}
              required
            />

            {error && (
              <div style={{
                background: '#fff1f1', border: '1px solid #ffd6d6',
                color: '#c0392b', padding: '10px 14px', borderRadius: '10px',
                fontSize: '13px', marginBottom: '1rem',
              }}>
                {error}
              </div>
            )}

            {resendMessage && (
              <div style={{
                background: '#f0fdf5', border: '1px solid #bbf7d0',
                color: '#15803d', padding: '10px 14px', borderRadius: '10px',
                fontSize: '13px', marginBottom: '1rem',
              }}>
                {resendMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || verificationCode.length !== 6}
              style={{
                width: '100%', padding: '13px',
                borderRadius: '12px', fontSize: '15px', fontWeight: 600,
                marginBottom: '10px',
              }}
            >
              {isLoading ? 'Проверка...' : 'Подтвердить'}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleResendCode}
              disabled={isResending}
              style={{
                width: '100%', padding: '11px',
                borderRadius: '12px', fontSize: '13px', fontWeight: 500,
              }}
            >
              {isResending ? 'Отправка...' : 'Отправить код повторно'}
            </button>
          </form>

          {/* Back */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button className="back-btn" onClick={onBack}>
              ← Вернуться к регистрации
            </button>
          </div>

          {/* Tips */}
          <div style={{
            marginTop: '1.5rem',
            background: '#faf9ff',
            border: '1px solid #ede9ff',
            borderRadius: '12px',
            padding: '14px 16px',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#5D45FD', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Инструкция
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[
                'Проверьте вашу почту (включая спам)',
                'Введите 6-значный код из письма',
                'Код действителен 10 минут',
                'Если код не пришёл, проверьте email',
              ].map((tip) => (
                <li key={tip} style={{ fontSize: '13px', color: '#7b74b0', display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#5D45FD', flexShrink: 0 }}>›</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}