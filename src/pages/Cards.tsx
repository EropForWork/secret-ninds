// src/pages/Cards.tsx
import { useEffect, useState, type JSX } from "react";

interface Note {
  _id: string;
  text: string;
  createdAt: string;
}

export default function Cards(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Проверка: если токена нет — вернуть на /login
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    // Загрузка заметок
    const fetchNotes = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/notes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Note[] = await response.json();
        setNotes(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Не удалось загрузить заметки");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen min-w-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-blue-200">
              📝 Загрузка...
            </h1>
            <p className="mt-2 text-sm text-gray-400">Получаем твои заметки</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
          <div className="h-1 bg-gray-800"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen min-w-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-blue-200">⚠️ Ошибка</h1>
            <p className="mt-2 text-sm text-gray-400">
              Не удалось загрузить заметки
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              Попробовать снова
            </button>
          </div>
          <div className="h-1 bg-gray-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Заголовок */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-blue-200">
            📝 Мои заметки
          </h1>
          <p className="mt-2 text-sm text-gray-400">Все твои записи здесь</p>
        </div>

        {/* Кнопка выхода */}
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
          >
            Выйти
          </button>
        </div>

        {/* Список заметок */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-3">
          {notes.length === 0 ? (
            <p className="text-gray-400 text-center py-4 italic">
              У тебя пока нет заметок.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="p-3 bg-gray-700 rounded-md border border-gray-600 text-white"
              >
                <p className="whitespace-pre-wrap">{note.text}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Тень под формой */}
        <div className="h-1 bg-gray-800"></div>
      </div>
    </div>
  );
}
