import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { safeJsonParse } from '../lib/fetchWrapper';

export default function Schools() {
  const { token, user } = useAuth();
  const [schools, setSchools] = useState<any[]>([]);
  const [teacherCodes, setTeacherCodes] = useState<any[]>([]);
  const [showCreateSchool, setShowCreateSchool] = useState(false);
  const [showCreateCode, setShowCreateCode] = useState(false);
  const [schoolForm, setSchoolForm] = useState({ name: '', city: '' });
  const [codeForm, setCodeForm] = useState({ school_id: '', expires_in_days: '30' });

  useEffect(() => {
    if (token && user?.role === 'ADMIN') {
      loadSchools();
      loadTeacherCodes();
    }
  }, [token, user]);

  const loadSchools = async () => {
    try {
      const json = await api.schools.getAll();
      setSchools(json);
    } catch (error) {
      console.error('Error loading schools:', error);
    }
  };

  const loadTeacherCodes = async () => {
    try {
      const data = await fetch(`/api/schools/teacher-codes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await safeJsonParse(data);
      setTeacherCodes(Array.isArray(json) ? json : []);
    } catch (error) {
      console.error('Error loading teacher codes:', error);
      setTeacherCodes([]);
    }
  };

  const createSchool = async () => {
    try {
      await fetch(`/api/schools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(schoolForm),
      });
      setShowCreateSchool(false);
      setSchoolForm({ name: '', city: '' });
      loadSchools();
    } catch (error) {
      console.error('Error creating school:', error);
    }
  };

  const createTeacherCode = async () => {
    try {
      await fetch(`/api/schools/teacher-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(codeForm),
      });
      setShowCreateCode(false);
      setCodeForm({ school_id: '', expires_in_days: '30' });
      loadTeacherCodes();
    } catch (error) {
      console.error('Error creating teacher code:', error);
    }
  };

  if (user?.role !== 'ADMIN') {
    return <div className="text-center text-gray-500 mt-10">Только для администраторов</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Управление школами</h2>

      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Школы</h3>
            <button
              onClick={() => setShowCreateSchool(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Создать школу
            </button>
          </div>

          {showCreateSchool && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-4 space-y-4">
              <input
                type="text"
                placeholder="Название школы"
                value={schoolForm.name}
                onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Город"
                value={schoolForm.city}
                onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={createSchool}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Создать
                </button>
                <button
                  onClick={() => setShowCreateSchool(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {schools.map((school) => (
              <div key={school.id} className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold">{school.name}</h4>
                <p className="text-gray-600">{school.city}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Коды учителей</h3>
            <button
              onClick={() => setShowCreateCode(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Сгенерировать код
            </button>
          </div>

          {showCreateCode && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-4 space-y-4">
              <select
                value={codeForm.school_id}
                onChange={(e) => setCodeForm({ ...codeForm, school_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите школу</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Срок действия (дней)"
                value={codeForm.expires_in_days}
                onChange={(e) => setCodeForm({ ...codeForm, expires_in_days: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={createTeacherCode}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Сгенерировать
                </button>
                <button
                  onClick={() => setShowCreateCode(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {Array.isArray(teacherCodes) && teacherCodes.map((code) => (
              <div key={code.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-mono text-lg font-bold">{code.code}</p>
                    <p className="text-gray-600">{code.school?.name}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    Истекает: {new Date(code.expires_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
