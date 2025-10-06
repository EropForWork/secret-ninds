import { useState, type JSX } from 'react';
import type { ICard } from '@/shared/lib';
import { createCard } from '../lib';

interface CardModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCardCreated: (newCard: ICard) => void;
	createCardApi: (
		token: string,
		name: string,
		color: string,
		balance: number,
		order: number | null
	) => Promise<ICard>;
}

export function CardModal({
	isOpen,
	onClose,
	onCardCreated,
	createCardApi,
}: CardModalProps): JSX.Element | null {
	const [name, setName] = useState('');
	const [color, setColor] = useState('#64b5f6');
	const [balance, setBalance] = useState('');
	const [order, setOrder] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		setError(null);

		try {
			const newCard = await createCard(
				name.trim(),
				color.trim(),
				parseFloat(balance),
				order ? parseInt(order) : null,
				createCardApi
			);
			onCardCreated(newCard);

			onClose();
			setName('');
			setColor('#64b5f6');
			setBalance('');
			setOrder('');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsSaving(false);
		}
	};

	const handleClose = () => {
		setName('');
		setColor('#64b5f6');
		setBalance('');
		setOrder('');
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 mb-0">
			<div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-md p-6 text-white">
				{/* Заголовок */}
				<h2 className="text-xl font-semibold text-blue-200 mb-6">
					➕ Добавить карточку
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
							Начальный баланс
						</label>
						<input
							id="balance"
							type="number"
							step="0.01"
							min="-999999"
							value={balance}
							onChange={e => setBalance(e.target.value)}
							placeholder="Например: 1000.00"
							className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					{/* Порядок */}
					<div>
						<label
							htmlFor="balance"
							className="block text-sm font-medium text-gray-300 mb-1"
						>
							Порядок карточки
						</label>
						<input
							id="order"
							type="number"
							step="1"
							min="0"
							value={order}
							onChange={e => setOrder(e.target.value)}
							placeholder="Порядок отображения карточки"
							className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					{/* Кнопки управления */}
					<div className="flex gap-3 pt-4 border-t border-gray-700">
						<button
							type="button"
							onClick={handleClose}
							className="flex-1 py-2 px-4 text-sm font-medium text-gray-400 hover:text-gray-200 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer"
						>
							Отмена
						</button>
						<button
							type="submit"
							disabled={isSaving}
							className="flex-1 py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer"
						>
							{isSaving ? 'Создаётся...' : 'Добавить'}
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
