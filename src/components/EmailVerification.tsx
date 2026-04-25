import { useState } from 'react';

interface EmailVerificationProps {
  email: string;
  password: string;
  teacherCode?: string;
  schoolId?: string;
  onVerified: (token: string, user: any) => void;
  onBack: () => void;
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

  .ev * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Outfit', sans-serif; }

  .ev-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(12, 8, 32, 0.72);
    backdrop-filter: blur(10px);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
    animation: evFadeIn 0.25s ease;
  }
  @keyframes evFadeIn { from{opacity:0} to{opacity:1} }

  .ev-card {
    background: #fff; border-radius: 24px;
    padding: 2.5rem; width: 100%; max-width: 420px;
    box-shadow: 0 32px 80px rgba(93,69,253,0.18), 0 4px 20px rgba(0,0,0,0.1);
    animation: evSlideUp 0.35s cubic-bezier(0.34,1.2,0.64,1);
    position: relative; overflow: hidden;
  }
  @keyframes evSlideUp {
    from { opacity:0; transform:translateY(28px) scale(0.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  /* decorative top strip */
  .ev-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #5D45FD 0%, #9B7FFF 50%, #6ec6ff 100%);
  }

  .ev-icon-wrap {
    width: 54px; height: 54px; border-radius: 15px;
    background: linear-gradient(135deg, #5D45FD 0%, #9B7FFF 100%);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.25rem;
    box-shadow: 0 8px 24px rgba(93,69,253,0.35);
  }

  .ev-title {
    font-size: 22px; font-weight: 800; color: #1a1730;
    letter-spacing: -0.03em; margin-bottom: 6px;
  }
  .ev-desc {
    font-size: 14px; color: #a09acc; line-height: 1.65; margin-bottom: 2rem;
  }
  .ev-desc strong { color: #5D45FD; font-weight: 600; }

  /* OTP input */
  .ev-lbl {
    font-size: 11.5px; font-weight: 600; color: #7b74b0;
    text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;
    display: block;
  }
  .ev-otp-wrap {
    display: flex; gap: 10px; margin-bottom: 16px;
  }
  .ev-otp-char {
    flex: 1; height: 56px;
    border: 1.5px solid #ede9ff; border-radius: 13px;
    text-align: center; font-size: 22px; font-weight: 700; color: #1a1730;
    background: #faf9ff; font-family: 'Outfit', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none; caret-color: #5D45FD;
  }
  .ev-otp-char:focus {
    border-color: #5D45FD;
    box-shadow: 0 0 0 4px rgba(93,69,253,0.1);
    background: #fff;
  }
  .ev-otp-char.filled { border-color: #c4bff5; }

  /* hidden real input for mobile convenience */
  .ev-hidden-input {
    position: absolute; opacity: 0; width: 1px; height: 1px;
  }

  .ev-error {
    background: #fff1f1; border: 1px solid #ffd6d6;
    color: #c0392b; padding: 10px 14px; border-radius: 11px;
    font-size: 13px; margin-bottom: 14px;
  }
  .ev-success {
    background: #f0fdf5; border: 1px solid #bbf7d0;
    color: #15803d; padding: 10px 14px; border-radius: 11px;
    font-size: 13px; margin-bottom: 14px;
  }

  .ev-btn {
    width: 100%; padding: 15px;
    background: #5D45FD; color: #fff; border: none;
    border-radius: 13px; font-size: 15px; font-weight: 700;
    cursor: pointer; font-family: 'Outfit', sans-serif;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    margin-bottom: 10px;
  }
  .ev-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(93,69,253,0.38);
    background: #4e3ae0;
  }
  .ev-btn:disabled { opacity: 0.38; cursor: not-allowed; }

  .ev-btn-ghost {
    width: 100%; padding: 12px; background: #f5f3ff;
    color: #5D45FD; border: none; border-radius: 12px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    font-family: 'Outfit', sans-serif; transition: background 0.2s;
  }
  .ev-btn-ghost:hover:not(:disabled) { background: #ede9ff; }
  .ev-btn-ghost:disabled { opacity: 0.5; cursor: not-allowed; }

  .ev-back {
    display: block; text-align: center; margin-top: 1rem;
    color: #a09acc; font-size: 13px; cursor: pointer;
    background: none; border: none; font-family: 'Outfit', sans-serif;
    transition: color 0.2s;
  }
  .ev-back:hover { color: #5D45FD; }

  /* tips */
  .ev-tips {
    margin-top: 1.5rem; padding: 14px 16px;
    background: #faf9ff; border: 1px solid #ede9ff; border-radius: 13px;
  }
  .ev-tips-title {
    font-size: 11px; font-weight: 700; color: #5D45FD;
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 9px;
  }
  .ev-tip {
    display: flex; gap: 9px; align-items: flex-start;
    font-size: 13px; color: #9188d8; line-height: 1.5;
    margin-bottom: 5px;
  }
  .ev-tip:last-child { margin-bottom: 0; }
  .ev-tip-dot { color: #5D45FD; flex-shrink: 0; font-weight: 700; margin-top: 1px; }

  @media (max-width: 480px) {
    .ev-card { padding: 2rem 1.5rem; border-radius: 20px; }
    .ev-otp-char { height: 50px; font-size: 20px; border-radius: 11px; }
  }
`;

export default function EmailVerification({
  email, password, teacherCode, schoolId, onVerified, onBack
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
          email, password,
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
    } catch {
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
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Build visual OTP boxes from the verificationCode string
  const chars = Array.from({ length: 6 }, (_, i) => verificationCode[i] || '');

  return (
    <>
      <style>{STYLES}</style>
      <div className="ev">
        <div className="ev-overlay">
          <div className="ev-card">
            <div className="ev-icon-wrap">
              <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>

            <h2 className="ev-title">Проверьте почту</h2>
            <p className="ev-desc">
              Мы отправили 6-значный код на{' '}
              <strong>{email}</strong>. Введите его ниже.
            </p>

            <form onSubmit={handleVerify}>
              <label className="ev-lbl">Код подтверждения</label>

              {/* Visual OTP boxes */}
              <div className="ev-otp-wrap" onClick={() => (document.getElementById('ev-real-input') as HTMLInputElement)?.focus()}>
                {chars.map((ch, i) => (
                  <div
                    key={i}
                    className={`ev-otp-char${ch ? ' filled' : ''}`}
                    style={{
                      borderColor: i === verificationCode.length && verificationCode.length < 6
                        ? '#5D45FD' : ch ? '#c4bff5' : '#ede9ff',
                      boxShadow: i === verificationCode.length && verificationCode.length < 6
                        ? '0 0 0 4px rgba(93,69,253,0.1)' : 'none',
                    }}
                  >
                    {ch || (i === verificationCode.length ? (
                      <span style={{ width:'2px', height:'22px', background:'#5D45FD', display:'inline-block', borderRadius:'1px', animation:'evBlink 1s steps(1) infinite' }} />
                    ) : '')}
                  </div>
                ))}
                <input
                  id="ev-real-input"
                  className="ev-hidden-input"
                  type="text" inputMode="numeric" autoComplete="one-time-code"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  autoFocus
                  required
                />
              </div>
              <style>{`@keyframes evBlink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

              {error && <div className="ev-error">{error}</div>}
              {resendMessage && <div className="ev-success">{resendMessage}</div>}

              <button type="submit" className="ev-btn" disabled={isLoading || verificationCode.length !== 6}>
                {isLoading ? 'Проверка...' : 'Подтвердить →'}
              </button>
              <button type="button" className="ev-btn-ghost" onClick={handleResendCode} disabled={isResending}>
                {isResending ? 'Отправка...' : 'Отправить код повторно'}
              </button>
            </form>

            <button className="ev-back" onClick={onBack}>← Вернуться к регистрации</button>

            <div className="ev-tips">
              <div className="ev-tips-title">Подсказка</div>
              {[
                'Проверьте папку «Спам», если письмо не пришло',
                'Код действителен 10 минут',
                'При проблемах проверьте правильность email',
              ].map(tip => (
                <div className="ev-tip" key={tip}>
                  <span className="ev-tip-dot">›</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}