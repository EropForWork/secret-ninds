import { useState, type JSX } from "react";
import type { ICard } from "../lib";
import { TransactionModal } from "../../add-transaction";
import { TransactionHistoryModal } from "../../transaction-history";
import { EditCardModal } from "../../edit-card";

interface CardProps {
  card: ICard;
}

export function Card({ card }: CardProps): JSX.Element {
  // 🔹 Состояние для модалки
  const [isModalTransactionOpen, setIsModalTransactionOpen] = useState(false);
  const [isHistoryTransactionOpen, setIsHistoryTransactionOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // 🔹 Храним карточку в состоянии — чтобы можно было обновить
  const [currentCard, setCurrentCard] = useState<ICard>(card);

  // 🔹 Функция открытия модалки
  const handleOpenTransactionModal = () => setIsModalTransactionOpen(true);
  const handleOpenHistoryModal = () => setIsHistoryTransactionOpen(true);
  const handleCloseHistoryModal = () => setIsHistoryTransactionOpen(false);
  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  // 🔹 Функция закрытия модалки
  const handleCloseModal = () => setIsModalTransactionOpen(false);

  // 🔹 Функция обновления карточки после добавления транзакции
  const handleCardUpdate = (updatedCard: ICard) => {
    setCurrentCard(updatedCard);
  };
  const handleDeleteCard = (cardId: number) => {
    console.log("Deleting card:", cardId);

    // В будущем: отправить DELETE на сервер
    // Сейчас просто удаляем из UI
    // setCurrentCard({ ...currentCard, _id: -1 } as any); // Это заглушка — заменим позже
    // onClose(); // Закрываем родительскую карточку (если нужно)
  };

  console.log(currentCard);

  return (
    <>
      <div
        className="p-5 bg-gray-800 rounded-xl border border-gray-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl transform"
        style={{ backgroundColor: `${currentCard.color}30` }}
      >
        {/* Название и баланс */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleOpenEditModal}
            type="button"
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium cursor-pointer text-blue-300 hover:bg-blue-900/15 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white">
              {currentCard.name}
            </h3>
          </button>
          <div className="h-full flex flex-row justify-center items-center gap-2">
            <span className={`text-sm font-medium`}>Баланс:</span>
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                currentCard.balance >= 0 ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {currentCard.balance >= 0 ? "+" : ""}
              {currentCard.balance.toFixed(2)} ₽
            </span>
          </div>
        </div>

        {/* Последняя операция — описание слева, сумма по центру, кнопка справа */}
        <div className="flex flex-row items-center justify-between">
          <div
            className="p-3 w-[85%] bg-gray-700 rounded-lg border cursor-pointer border-gray-600 flex items-center justify-between hover:bg-blue-900 transition-colors"
            onClick={handleOpenHistoryModal}
          >
            {/* Слева: описание и дата */}
            <div className="flex-1">
              <p className="text-sm text-gray-300 mb-1">
                {currentCard.lastOperation.description || "—"}
              </p>
              <time className="text-xs text-gray-400">
                {new Date(currentCard.lastOperation.date).toLocaleString(
                  "ru-RU",
                  {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </time>
            </div>

            {/* Сумма — по центру, но не мешает кнопке */}
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap mr-2 ${
                currentCard.lastOperation.amount >= 0
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
            >
              {currentCard.lastOperation.amount >= 0 ? "+" : "-"}
              {Math.abs(currentCard.lastOperation.amount).toFixed(2)} ₽
            </span>
          </div>
          {/* Кнопка "Добавить транзакцию" — справа, миниатюрная, как в MUI */}
          <button
            type="button"
            onClick={handleOpenTransactionModal}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            aria-label="Добавить транзакцию"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* 🔹 Модальное окно “Добавить транзакцию” */}
      <TransactionModal
        isOpenParam={isModalTransactionOpen}
        onClose={handleCloseModal}
        idCard={currentCard._id}
        onCardUpdated={handleCardUpdate}
      />
      {/* 🔹 Модальное окно “История транзакций” */}
      <TransactionHistoryModal
        isOpen={isHistoryTransactionOpen}
        onClose={handleCloseHistoryModal}
        operations={currentCard.operations}
      />
      {/* 🔹 Модальное окно “Редактировать карточку” */}
      <EditCardModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        card={currentCard}
        onCardUpdated={handleCardUpdate}
        onDelete={handleDeleteCard}
      />
    </>
  );
}
