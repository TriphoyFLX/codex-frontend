import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Admin() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    loadUsers();
  }, [user]);

  const loadUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    if (!token) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    if (!token) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      loadUsers();
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  if (user?.role !== 'ADMIN') {
    return <div className="p-6">Доступ запрещен</div>;
  }

  if (loading) {
    return <div className="p-6">Загрузка...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4">Пользователи</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Имя</th>
                <th className="text-left p-3">Роль</th>
                <th className="text-left p-3">Школа</th>
                <th className="text-left p-3">XP</th>
                <th className="text-left p-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{userItem.email}</td>
                  <td className="p-3">{userItem.profile?.username || '-'}</td>
                  <td className="p-3">
                    <select
                      value={userItem.role}
                      onChange={(e) => handleChangeRole(userItem.id, e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="STUDENT">Студент</option>
                      <option value="TEACHER">Учитель</option>
                      <option value="ADMIN">Админ</option>
                    </select>
                  </td>
                  <td className="p-3">{userItem.school?.name || '-'}</td>
                  <td className="p-3">{userItem.stats?.xp || 0}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteUser(userItem.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-yellow-800 mb-2">⚠️ Внимание</h3>
        <p className="text-yellow-700">
          Вы администратор. У вас есть полные права на управление системой. Будьте осторожны при удалении пользователей и изменении ролей.
        </p>
      </div>
    </div>
  );
}
