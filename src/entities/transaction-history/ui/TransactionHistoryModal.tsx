// src/entities/transaction-history/ui/TransactionHistoryModal.tsx
import { type JSX } from "react";
import type { IOperation } from "../../сard";

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  operations: IOperation[];
}

export function TransactionHistoryModal({
  isOpen,
  onClose,
  operations,
}: TransactionHistoryModalProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {/* Модалка */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6 text-white">
        <div className="flex flex-row items-center justify-center mb-6">
          {/* Заголовок */}
          <h2 className="text-xl font-semibold text-blue-200 w-[80%]">
            📜 История транзакций
          </h2>
          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="py-2 px-4 text-sm font-medium text-gray-400 hover:text-gray-200 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Закрыть
          </button>
        </div>

        {/* Список транзакций */}
        <div className="space-y-3">
          {operations.length === 0 ? (
            <p className="text-gray-400 text-center py-4 italic">
              Нет записей.
            </p>
          ) : (
            operations.map((op, index) => (
              <div
                key={index}
                className="p-3 bg-gray-700 rounded-lg border border-gray-600 flex justify-between items-center"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-300 mb-1">
                    {op.description || "—"}
                  </p>
                  <time className="text-xs text-gray-400">
                    {new Date(op.date).toLocaleString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    op.amount >= 0 ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {op.amount >= 0 ? "+" : ""}
                  {op.amount.toFixed(2)} ₽
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
