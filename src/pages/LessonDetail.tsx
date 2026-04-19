import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function LessonDetail() {
  const { courseId, stageId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [stage, setStage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [courseId, stageId]);

  const loadLesson = async () => {
    if (!courseId || !stageId || !token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourse(data);
      const currentStage = data.stages?.find((s: any) => s.id === stageId);
      setStage(currentStage);
      setCompleted(currentStage?.progress?.[0]?.completed || false);
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!token) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/courses/stages/${stageId}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompleted(true);
      
      // Navigate to next lesson
      const stageIndex = course.stages?.findIndex((s: any) => s.id === stageId);
      const nextStage = course.stages?.[stageIndex + 1];
      if (nextStage) {
        navigate(`/courses/${courseId}/lessons/${nextStage.id}`);
      } else {
        // Course completed
        alert('Поздравляем! Вы завершили курс!');
        navigate(`/courses/${courseId}`);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  if (!stage || !course) {
    return <div className="min-h-screen flex items-center justify-center">Урок не найден</div>;
  }

  const stageIndex = course.stages?.findIndex((s: any) => s.id === stageId) || 0;
  const prevStage = course.stages?.[stageIndex - 1];
  const nextStage = course.stages?.[stageIndex + 1];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="text-blue-600 hover:text-blue-700 mb-2 inline-block"
          >
            ← Назад к курсу
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{stage.title}</h1>
          <p className="text-gray-600">{course.title}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Урок {stageIndex + 1} из {course.stages?.length || 0}
            </span>
            <span className="text-sm font-medium text-gray-600">
              Прогресс: {Math.round(((stageIndex + (completed ? 1 : 0)) / (course.stages?.length || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((stageIndex + (completed ? 1 : 0)) / (course.stages?.length || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          {stage.materials && stage.materials.length > 0 ? (
            stage.materials.map((material: any) => (
              <div key={material.id} className="mb-6 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                    {material.type}
                  </span>
                  {material.content_url && (
                    <a
                      href={material.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      🔗 {material.content_url}
                    </a>
                  )}
                </div>
                {material.content_text && (
                  <div className="prose prose-lg max-w-none text-gray-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {material.content_text}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">Материалы для этого урока пока не добавлены</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {prevStage ? (
            <button
              onClick={() => navigate(`/courses/${courseId}/lessons/${prevStage.id}`)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
            >
              ← Предыдущий урок
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleCompleteLesson}
            disabled={completed}
            className={`px-8 py-3 rounded-xl font-bold transition ${
              completed
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {completed ? '✓ Завершено' : 'Завершить урок'}
          </button>

          {nextStage ? (
            <button
              onClick={() => navigate(`/courses/${courseId}/lessons/${nextStage.id}`)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
            >
              Следующий урок →
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
