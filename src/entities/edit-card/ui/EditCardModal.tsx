import type { ICard } from '@/shared/lib';
import { useState, type JSX } from 'react';
import { clearCardHistory, updateCard } from '../lib';

interface EditCardModalProps {
	isOpen: boolean;
	onClose: () => void;
	card: ICard;
	onCardUpdated: (updatedCard: ICard) => void;
	onDelete: (cardId: number) => void;
	deleteCardApi: (_id: number) => Promise<void>;
	updateCardApi: (
		token: string,
		idCard: number,
		name: string,
		color: string,
		balance: number,
		order: number
	) => Promise<ICard>;
	removeCardHistoryApi: (idCard: number, token: string) => Promise<ICard>;
}

export function EditCardModal({
	isOpen,
	onClose,
	card,
	onCardUpdated,
	onDelete,
	deleteCardApi,
	updateCardApi,
	removeCardHistoryApi,
}: EditCardModalProps): JSX.Element | null {
	const [name, setName] = useState(card.name);
	const [color, setColor] = useState(card.color);
	const [balance, setBalance] = useState(card.balance.toString());
	const [order, setOrder] = useState(card.order);
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const [showConfirmClear, setShowConfirmClear] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		setError(null);

		try {
			const updatedCard = await updateCard(
				card._id,
				name.trim(),
				color.trim(),
				parseFloat(balance),
				order,
				updateCardApi
			);
			onCardUpdated(updatedCard);
			onClose();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsSaving(false);
		}
	};

	const handleClearHistory = async () => {
		setIsSaving(true);
		setError(null);

		try {
			const updatedCard = await clearCardHistory(
				card._id,
				removeCardHistoryApi
			);
			onCardUpdated(updatedCard);
			onClose();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async () => {
		setIsSaving(true);
		setError(null);

		try {
			await deleteCardApi(card._id);
			onDelete(card._id);
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
		} finally {
			setIsSaving(false);
			setShowConfirmDelete(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 mb-0">
			<div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-md p-6 text-white">
				{/* Заголовок */}
				<h2 className="text-xl font-semibold text-blue-200 mb-6">
					✏️ Редактировать карточку
				</h2>

				{/* Форма */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Название */}
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-300 mb-1"
						>
							Название
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder="Например: Продукты"
							className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					{/* Цвет */}
					<div>
						<label
							htmlFor="color"
							className="block text-sm font-medium text-gray-300 mb-1"
						>
							Цвет фона
						</label>
						<input
							id="color"
							type="color"
							value={color}
							onChange={e => setColor(e.target.value)}
							className="w-full h-10 rounded-md border border-gray-600 bg-gray-700 cursor-pointer"
						/>
						<p className="mt-1 text-xs text-gray-400">Выберите цвет</p>
					</div>

					{/* Баланс */}
					<div>
						<label
							htmlFor="balance"
							className="block text-sm font-medium text-gray-300 mb-1"
						>
							Баланс
						</label>
						<input
							id="balance"
							type="number"
							step="0.01"
							min="-999999"
							value={balance}
							onChange={e => setBalance(e.target.value)}
							placeholder="Например: 500.00"
							className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					{/* Порядок */}
					<div>
						<label
							htmlFor="order"
							className="block text-sm font-medium text-gray-300 mb-1"
						>
							Порядок
						</label>
						<input
							id="order"
							type="number"
							step="1"
							min="0"
							value={order}
							onChange={e => setOrder(parseInt(e.target.value))}
							placeholder="новый порядок"
							className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					{/* Кнопки действий */}
					<div className="flex gap-3 pt-4 border-t border-gray-700">
						{/* Очистить историю */}
						<button
							type="button"
							onClick={() => setShowConfirmClear(true)}
							className="flex-1 py-2 px-4 text-sm font-medium text-red-400 hover:text-red-300 bg-transparent border border-red-600 rounded-lg hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
						>
							Очистить историю
						</button>

						{/* Удалить карточку */}
						<button
							type="button"
							onClick={() => setShowConfirmDelete(true)}
							className="flex-1 py-2 px-4 text-sm font-medium text-red-400 hover:text-red-300 bg-transparent border border-red-600 rounded-lg hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
						>
							Удалить
						</button>
					</div>

					{/* Подтверждение очистки */}
					{showConfirmClear && (
						<div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
							<p className="text-red-300 mb-3">
								Вы уверены, что хотите удалить всю историю транзакций?
								<br />
								<strong>Баланс будет обнулен.</strong>
							</p>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={handleClearHistory}
									className="flex-1 py-2 px-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
								>
									Да, очистить
								</button>
								<button
									type="button"
									onClick={() => setShowConfirmClear(false)}
									className="flex-1 py-2 px-4 text-sm font-medium text-gray-400 hover:text-gray-200 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
								>
									Отмена
								</button>
							</div>
						</div>
					)}

					{/* Подтверждение удаления */}
					{showConfirmDelete && (
						<div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
							<p className="text-red-300 mb-3">
								Вы уверены, что хотите удалить эту карточку?
								<br />
								<strong>Это действие нельзя отменить.</strong>
							</p>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={handleDelete}
									className="flex-1 py-2 px-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
								>
									Да, удалить
								</button>
								<button
									type="button"
									onClick={() => setShowConfirmDelete(false)}
									className="flex-1 py-2 px-4 text-sm font-medium text-gray-400 hover:text-gray-200 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
								>
									Отмена
								</button>
							</div>
						</div>
					)}

					{/* Кнопки управления */}
					<div className="flex gap-3 pt-4 border-t border-gray-700">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 py-2 px-4 text-sm font-medium text-gray-400 hover:text-gray-200 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
						>
							Отмена
						</button>
						<button
							type="submit"
							disabled={isSaving}
							className="flex-1 py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
						>
							{isSaving ? 'Сохраняется...' : 'Сохранить'}
						</button>
					</div>

					{/* Сообщение об ошибке */}
					{error && (
						<div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
							<p className="text-red-300 text-sm">{error}</p>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
