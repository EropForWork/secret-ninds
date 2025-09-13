import { useEffect, useState, type JSX } from "react";
import { Card, type ICard } from "../entities/Card";

export default function Cards(): JSX.Element {
  const [cards, setCards] = useState<ICard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    const fetchCards = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/cards`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ICard[] = await response.json();
        setCards(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Не удалось загрузить карточки");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
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
              🔄 Загрузка...
            </h1>
            <p className="mt-2 text-sm text-gray-400">Получаем твои карточки</p>
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
              Не удалось загрузить карточки
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
            💳 Мои карточки
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Управляй своими расходами
          </p>
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

        {/* Список карточек */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-3">
          {cards.length === 0 ? (
            <p className="text-gray-400 text-center py-4 italic">
              У тебя пока нет карточек.
            </p>
          ) : (
            cards.map((card, index) => <Card key={index} card={card} />)
          )}
        </div>

        {/* Тень под формой */}
        <div className="h-1 bg-gray-800"></div>
      </div>
    </div>
  );
}
