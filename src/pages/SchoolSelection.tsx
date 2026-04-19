import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

interface SchoolSelectionProps {
  onComplete: () => void;
}

export default function SchoolSelection({ onComplete }: SchoolSelectionProps) {
  const { token } = useAuth();
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const data = await api.schools.getAll();
      setSchools(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading schools:', error);
      setSchools([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSchool || !token) return;

    setLoading(true);
    try {
      await api.users.updateProfile(token, { school_id: selectedSchool });
      onComplete();
    } catch (error) {
      console.error('Error selecting school:', error);
      alert('Ошибка при выборе школы');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Выберите школу</h1>
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
          onClick={handleSubmit}
          disabled={!selectedSchool || loading}
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300"
        >
          {loading ? 'Сохранение...' : 'Продолжить'}
        </button>
      </div>
    </div>
  );
}
