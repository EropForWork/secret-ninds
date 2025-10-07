import { type JSX } from 'react';
import type { IOperation } from '@/shared/lib';

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

	// CSS стили для кастомного скроллбара
	const scrollbarStyles = `
		.custom-scrollbar::-webkit-scrollbar {
			width: 8px;
		}
		.custom-scrollbar::-webkit-scrollbar-track {
			background: #374151;
			border-radius: 4px;
		}
		.custom-scrollbar::-webkit-scrollbar-thumb {
			background: #6B7280;
			border-radius: 4px;
		}
		.custom-scrollbar::-webkit-scrollbar-thumb:hover {
			background: #9CA3AF;
		}
	`;

	return (
		<>
			<style>{scrollbarStyles}</style>
			<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4 mb-0">
				{/* Модалка */}
				<div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-sm sm:max-w-md max-h-[85vh] sm:max-h-[80vh] p-4 sm:p-6 text-white overflow-y-auto custom-scrollbar">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-center mb-4 sm:mb-6 gap-3 sm:gap-0">
						{/* Заголовок */}
						<h2 className="text-lg sm:text-xl font-semibold text-blue-200 w-full sm:w-[80%] text-center sm:text-left">
							📜 История транзакций
						</h2>
						{/* Кнопка закрытия */}
						<button
							onClick={onClose}
							className="py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400 hover:text-gray-200 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer"
						>
							Закрыть
						</button>
					</div>

					{/* Список транзакций */}
					<div className="space-y-2 sm:space-y-3 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
						{operations.length === 0 ? (
							<p className="text-gray-400 text-center py-4 italic text-sm">
								Нет записей.
							</p>
						) : (
							operations
								.slice()
								.reverse()
								.map((op, index) => (
									<div
										key={index}
										className="p-2 sm:p-3 bg-gray-700 rounded-lg border border-gray-600 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0"
									>
										<div className="flex-1">
											<p className="text-xs sm:text-sm text-gray-300 mb-1 truncate">
												{op.description || '—'}
											</p>
											<time className="text-xs text-gray-400">
												{new Date(op.date).toLocaleString('ru-RU', {
													day: 'numeric',
													month: 'short',
													hour: '2-digit',
													minute: '2-digit',
												})}
											</time>
										</div>
										<span
											className={`px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap self-start sm:self-auto ${
												op.amount >= 0 ? 'bg-green-600' : 'bg-red-600'
											}`}
										>
											{op.amount >= 0 ? '+' : ''}
											{op.amount.toLocaleString('ru-RU')} ₽
										</span>
									</div>
								))
						)}
					</div>
				</div>
			</div>
		</>
	);
}
