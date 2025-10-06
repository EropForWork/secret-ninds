import { useEffect, useState, type JSX } from 'react';
import type { ICard } from '@/shared/lib';
import { TransactionModal } from '@/entities/add-transaction';
import { TransactionHistoryModal } from '@/entities/transaction-history';
import { EditCardModal } from '@/entities/edit-card';
import { AnalyticsModal } from '@/entities/analytics-modal';
import {
	deleteCardApi,
	updateCardApi,
	removeCardHistoryApi,
	addTransactionApi,
} from '@/features/server-api';

interface CardProps {
	card: ICard;
	onDelete: (cardId: number) => void;
	onUpdate: (order: ICard) => void;
}

export function Card({ card, onDelete, onUpdate }: CardProps): JSX.Element {
	// 🔹 Состояние для модалки
	const [isModalTransactionOpen, setIsModalTransactionOpen] = useState(false);
	const [isHistoryTransactionOpen, setIsHistoryTransactionOpen] =
		useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
	// 🔹 Храним карточку в состоянии — чтобы можно было обновить
	const [currentCard, setCurrentCard] = useState<ICard>(card);

	// 🔹 Функция открытия модалки
	const handleOpenTransactionModal = () => setIsModalTransactionOpen(true);
	const handleOpenHistoryModal = () => setIsHistoryTransactionOpen(true);
	const handleCloseHistoryModal = () => setIsHistoryTransactionOpen(false);
	const handleOpenEditModal = () => setIsEditModalOpen(true);
	const handleCloseEditModal = () => setIsEditModalOpen(false);
	const handleOpenAnalyticsModal = () => setIsAnalyticsModalOpen(true);
	const handleCloseAnalyticsModal = () => setIsAnalyticsModalOpen(false);

	// 🔹 Функция закрытия модалки
	const handleCloseModal = () => setIsModalTransactionOpen(false);

	// 🔹 Функция обновления карточки после добавления транзакции
	const handleCardUpdate = (updatedCard: ICard) => {
		setCurrentCard(updatedCard);
		onUpdate(updatedCard);
	};

	useEffect(() => {
		setCurrentCard(card);
	}, [card]);

	return (
		<>
			<style>{`
				@keyframes shimmer {
					0% { transform: translateX(-100%); }
					100% { transform: translateX(100%); }
				}
			`}</style>
			<div
				className="group relative p-5 bg-gray-800 rounded-xl border border-gray-700 text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] transform overflow-hidden"
				style={{
					background: `linear-gradient(135deg, ${currentCard.color}15 0%, ${currentCard.color}25 50%, ${currentCard.color}15 100%)`,
					boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px ${currentCard.color}20`,
				}}
			>
				{/* Декоративный градиентный оверлей */}
				<div
					className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
					style={{
						background: `radial-gradient(circle at 50% 0%, ${currentCard.color}20 0%, transparent 70%)`,
					}}
				/>

				{/* Блестящий эффект при наведении */}
				<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
					<div
						className="absolute top-0 left-0 w-full h-full"
						style={{
							background: `linear-gradient(45deg, transparent 30%, ${currentCard.color}10 50%, transparent 70%)`,
							transform: 'translateX(-100%)',
							animation: 'shimmer 1.5s ease-in-out',
						}}
					/>
				</div>
				{/* Название и баланс */}
				<div className="flex justify-between items-center mb-4">
					<button
						onClick={handleOpenEditModal}
						type="button"
						className="group/btn flex items-center max-w-[60%] overflow-hidden gap-1 px-3 py-2 text-xs font-medium cursor-pointer text-blue-300 hover:text-blue-200 hover:bg-blue-900/20 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent backdrop-blur-sm cursor-pointer"
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
						<h3 className="text-xl font-semibold text-white group-hover/btn:text-blue-100 transition-colors duration-200">
							{currentCard.name}
						</h3>
					</button>
					<div className="h-full flex flex-row justify-center items-center gap-3">
						<span className={`text-sm font-medium text-gray-300`}>Баланс:</span>
						<span
							className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all duration-200 hover:shadow-xl ${
								currentCard.balance >= 0
									? 'bg-gradient-to-r from-green-500 to-green-600 text-white '
									: 'bg-gradient-to-r from-red-500 to-red-600 text-white '
							}`}
						>
							{currentCard.balance.toLocaleString('ru-RU')} ₽
						</span>
						{/* Кнопка аналитики */}
						<button
							type="button"
							onClick={handleOpenAnalyticsModal}
							className="group/analytics flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white cursor-pointer hover:from-purple-400 hover:to-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg hover:shadow-xl hover:scale-110 transform cursor-pointer"
							aria-label="Аналитика"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 group-hover/analytics:rotate-12 transition-transform duration-200"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Последняя операция — описание слева, сумма по центру, кнопка справа */}
				<div className="relative flex flex-row items-center justify-between z-10">
					<div
						className="group/operation p-4 w-[85%] bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl border cursor-pointer border-gray-600 flex items-center justify-between hover:from-blue-900/30 hover:to-blue-800/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform backdrop-blur-sm"
						onClick={handleOpenHistoryModal}
					>
						{/* Слева: описание и дата */}
						<div className="flex-1">
							<p className="text-sm text-gray-300 mb-1">
								{currentCard.lastOperation.description || '—'}
							</p>
							<time className="text-xs text-gray-400">
								{new Date(currentCard.lastOperation.date).toLocaleString(
									'ru-RU',
									{
										day: 'numeric',
										month: 'short',
										hour: '2-digit',
										minute: '2-digit',
									}
								)}
							</time>
						</div>

						{/* Сумма — по центру, но не мешает кнопке */}
						<span
							className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap mr-2 ${
								currentCard.lastOperation.amount >= 0
									? 'bg-green-600'
									: 'bg-red-600'
							}`}
						>
							{currentCard.lastOperation.amount >= 0 ? '+' : '-'}
							{Math.abs(currentCard.lastOperation.amount).toLocaleString(
								'ru-RU'
							)}{' '}
							₽
						</span>
					</div>
					{/* Кнопка "Добавить транзакцию" — справа, миниатюрная, как в MUI */}
					<button
						type="button"
						onClick={handleOpenTransactionModal}
						className="group/add flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer hover:from-blue-400 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg hover:shadow-xl hover:scale-110 transform"
						aria-label="Добавить транзакцию"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 group-hover/add:rotate-90 transition-transform duration-200"
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
				addTransactionApi={addTransactionApi}
			/>
			{/* 🔹 Модальное окно “История транзакций” */}
			<TransactionHistoryModal
				isOpen={isHistoryTransactionOpen}
				onClose={handleCloseHistoryModal}
				operations={currentCard.operations}
			/>
			{/* 🔹 Модальное окно "Редактировать карточку" */}
			<EditCardModal
				isOpen={isEditModalOpen}
				onClose={handleCloseEditModal}
				card={currentCard}
				onCardUpdated={handleCardUpdate}
				onDelete={onDelete}
				deleteCardApi={deleteCardApi}
				updateCardApi={updateCardApi}
				removeCardHistoryApi={removeCardHistoryApi}
			/>
			{/* 🔹 Модальное окно "Аналитика" */}
			<AnalyticsModal
				isOpen={isAnalyticsModalOpen}
				onClose={handleCloseAnalyticsModal}
				card={currentCard}
			/>
		</>
	);
}
