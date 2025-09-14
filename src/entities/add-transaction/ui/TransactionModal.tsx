import { useEffect, useState, type JSX } from "react";
import { addTransaction } from "../lib";
import type { ICard } from "../../сard";

interface ITransactionModalProps {
  isOpenParam: boolean;
  onClose: () => void;
  idCard: number;
  onCardUpdated: (updatedCard: ICard) => void;
}

export function TransactionModal({
  isOpenParam,
  onClose,
  idCard,
  onCardUpdated,
}: ITransactionModalProps): JSX.Element | null {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(isOpenParam);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsOpen(isOpenParam);
  }, [isOpenParam]);
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return null;

    setIsLoading(true);
    setError(null);

    try {
      const updatedCard = await addTransaction(idCard, numAmount, description);
      onCardUpdated(updatedCard);
      setIsOpen(false);
      onClose();
      setDescription("");
      setAmount("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          {/* Сама модалка */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-md p-6 text-white">
            {/* Заголовок */}
            <h2 className="text-xl font-semibold text-blue-200 mb-6">
              {error ? `Ошибка: ${error}` : `➕ Добавить транзакцию`}
            </h2>

            {/* Форма */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Сумма */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Сумма
                </label>
                <input
                  id="amount"
                  type="number"
                  step="1"
                  min="-100000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Например: 150.50"
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoFocus
                />
              </div>

              {/* Описание */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Описание (опционально)
                </label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Кофе, Бензин, Зарплата..."
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-4 text-sm font-medium text-gray-400 hover:text-gray-200 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Отменить
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  {isLoading ? "Добавляется..." : "Добавить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
