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
        
        // Send verification code first
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
    // Store token and user in auth context
    localStorage.setItem('token', token);
    window.location.reload(); // Simple way to trigger auth context update
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">{isRegister ? 'Регистрация' : 'Вход'}</h1>
        
        {!isRegister ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Войти
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {registerStep === 'school' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Выберите школу</label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {schools.map((school) => (
                    <button
                      key={school.id}
                      onClick={() => setSelectedSchool(school.id)}
                      className={`w-full p-3 text-left rounded-lg border ${
                        selectedSchool === school.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <p className="font-medium">{school.name}</p>
                      <p className="text-sm text-gray-500">{school.city}</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleRegisterStep}
                  disabled={!selectedSchool}
                  className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300"
                >
                  Далее
                </button>
              </div>
            )}
            
            {registerStep === 'details' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Код учителя (опционально)</label>
                  <input
                    type="text"
                    value={teacherCode}
                    onChange={(e) => setTeacherCode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Зарегистрироваться
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterStep('school')}
                  className="w-full mt-2 text-gray-500 hover:text-gray-700"
                >
                  Назад
                </button>
              </form>
            )}
          </div>
        )}
        
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            if (!isRegister) resetRegisterForm();
          }}
          className="mt-4 text-blue-500 hover:underline w-full text-center"
        >
          {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </button>
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
    </div>
  );
}
