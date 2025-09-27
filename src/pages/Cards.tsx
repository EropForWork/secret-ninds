import { CreateCardModal } from '@/entities/add_card';
import { createCardApi, fetchCardsApi } from '@/features/server-api';
import type { ICard } from '@/shared/lib';
import { Card } from '@/widgets/сard';
import { useEffect, useState, type JSX } from 'react';

export function Cards(): JSX.Element {
	const [cards, setCards] = useState<ICard[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const handleOpenCreateModal = () => setIsCreateModalOpen(true);
	const handleCloseCreateModal = () => setIsCreateModalOpen(false);

	const handleCardCreated = (newCard: ICard) => {
		setCards(prev => [newCard, ...prev]);
	};

	const handleDeleteCard = (cardId: number) => {
		setCards(prev => prev.filter(card => card._id !== cardId));
	};

	const handleCardUpdated = (updatedCard: ICard) => {
		setCards(prev =>
			prev.map(card => (card._id === updatedCard._id ? updatedCard : card))
		);
	};

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			window.location.href = '/';
			return;
		}

		const fetchCards = async () => {
			try {
				const data: ICard[] = await fetchCardsApi(token);
				setCards(data);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				setError(err.message || 'Не удалось загрузить карточки');
			} finally {
				setLoading(false);
			}
		};

		fetchCards();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem('token');
		window.location.href = '/';
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
					<div className="flex flex-row justify-end">
						<button
							onClick={handleLogout}
							className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
						>
							Выйти
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="min-h-screen min-w-screen bg-gray-900 flex items-center justify-center p-4">
				<div className="w-full max-w-md space-y-8">
					{/* Заголовок */}
					<div className="text-center">
						<h1 className="text-3xl font-semibold text-blue-200">
							💳 Балансиаго
						</h1>
						<p className="mt-2 text-sm text-gray-400">
							Управляй своими расходами
						</p>
					</div>

					{/* Список карточек */}
					<div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-3">
						{cards.length === 0 ? (
							<p className="text-gray-400 text-center py-4 italic">
								У тебя пока нет карточек.
							</p>
						) : (
							cards
								.sort((a, b) => a.order - b.order)
								.map(card => (
									<Card
										key={card._id}
										card={card}
										onDelete={handleDeleteCard}
										onUpdate={handleCardUpdated}
									/>
								))
						)}
					</div>
					{/* Тень под формой */}
					<div className="h-1 bg-gray-800"></div>

					{/* Кнопка выхода */}
					<div className="flex flex-row justify-between">
						{/* 🔹 Кнопка “Добавить карточку” — сверху */}
						<div className="flex justify-end">
							<button
								type="button"
								onClick={handleOpenCreateModal}
								className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
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
								Добавить карточку
							</button>
						</div>
						<button
							onClick={handleLogout}
							className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
						>
							Выйти
						</button>
					</div>
				</div>
			</div>
			{/* 🔹 Модальное окно “Создать карточку” */}
			<CreateCardModal
				isOpen={isCreateModalOpen}
				onClose={handleCloseCreateModal}
				onCardCreated={handleCardCreated}
				createCardApi={createCardApi}
			/>
		</>
	);
}
