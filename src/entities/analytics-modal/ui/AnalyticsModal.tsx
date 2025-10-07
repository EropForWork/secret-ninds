import { useState, useMemo, type JSX } from 'react';
import type { ICard } from '@/shared/lib';
import { AnalyticsChart } from './AnalyticsChart';

interface AnalyticsModalProps {
	isOpen: boolean;
	onClose: () => void;
	card: ICard;
}

type TimeRange = 'week' | 'month' | 'custom';

interface CustomDateRange {
	start: string;
	end: string;
}

export function AnalyticsModal({
	isOpen,
	onClose,
	card,
}: AnalyticsModalProps): JSX.Element | null {
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
	const [timeRange, setTimeRange] = useState<TimeRange>('month');
	const [customRange, setCustomRange] = useState<CustomDateRange>({
		start: '',
		end: '',
	});

	// Фильтрация операций по выбранному периоду
	const filteredOperations = useMemo(() => {
		const now = new Date();
		let startDate: Date;

		switch (timeRange) {
			case 'week':
				startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				break;
			case 'month':
				startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
				break;
			case 'custom': {
				if (!customRange.start || !customRange.end) return card.operations;
				startDate = new Date(customRange.start);
				const endDate = new Date(customRange.end);
				return card.operations.filter(op => {
					const opDate = new Date(op.date);
					return opDate >= startDate && opDate <= endDate;
				});
			}
			default:
				return card.operations;
		}

		return card.operations.filter(op => new Date(op.date) >= startDate);
	}, [card.operations, timeRange, customRange]);

	// Расчет статистики
	const stats = useMemo(() => {
		const income = filteredOperations
			.filter(op => op.amount > 0)
			.reduce((sum, op) => sum + op.amount, 0);

		const expenses = filteredOperations
			.filter(op => op.amount < 0)
			.reduce((sum, op) => sum + Math.abs(op.amount), 0);

		return {
			totalIncome: income,
			totalExpenses: expenses,
			transactionCount: filteredOperations.length,
			incomeCount: filteredOperations.filter(op => op.amount > 0).length,
			expenseCount: filteredOperations.filter(op => op.amount < 0).length,
		};
	}, [filteredOperations]);

	if (!isOpen) return null;

	const handleTimeRangeChange = (range: TimeRange) => {
		setTimeRange(range);
		if (range !== 'custom') {
			setCustomRange({ start: '', end: '' });
		}
	};

	return (
		<>
			<style>{scrollbarStyles}</style>
			<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4 mb-0">
				{/* Модалка */}
				<div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-sm sm:max-w-4xl max-h-[85vh] sm:max-h-[92vh] p-4 sm:p-6 text-white overflow-y-auto custom-scrollbar">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
						{/* Заголовок */}
						<h2 className="text-lg sm:text-xl font-semibold text-purple-200 text-center sm:text-left">
							📊 Аналитика карточки "{card.name}"
						</h2>
						{/* Кнопка закрытия */}
						<button
							onClick={onClose}
							className="py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400 hover:text-gray-200 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer"
						>
							Закрыть
						</button>
					</div>

					{/* Выбор временного периода */}
					<div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
						<div className="flex flex-row items-center justify-between">
							<h3 className="text-lg font-medium text-gray-200 mb-3">Период</h3>
							<div className="flex flex-wrap gap-3 justify-center">
								<button
									onClick={() => handleTimeRangeChange('week')}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
										timeRange === 'week'
											? 'bg-purple-600 text-white'
											: 'bg-gray-600 text-gray-300 hover:bg-gray-500'
									}`}
								>
									Неделя
								</button>
								<button
									onClick={() => handleTimeRangeChange('month')}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
										timeRange === 'month'
											? 'bg-purple-600 text-white'
											: 'bg-gray-600 text-gray-300 hover:bg-gray-500'
									}`}
								>
									Месяц
								</button>
								<button
									onClick={() => handleTimeRangeChange('custom')}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
										timeRange === 'custom'
											? 'bg-purple-600 text-white'
											: 'bg-gray-600 text-gray-300 hover:bg-gray-500'
									}`}
								>
									Пользовательский
								</button>
							</div>
						</div>

						{/* Пользовательский диапазон дат */}
						{timeRange === 'custom' && (
							<div className="mt-4 flex gap-3">
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-300 mb-1">
										От
									</label>
									<input
										type="date"
										value={customRange.start}
										onChange={e =>
											setCustomRange(prev => ({
												...prev,
												start: e.target.value,
											}))
										}
										className="w-full rounded-md border border-gray-600 bg-gray-600 px-3 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
									/>
								</div>
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-300 mb-1">
										До
									</label>
									<input
										type="date"
										value={customRange.end}
										onChange={e =>
											setCustomRange(prev => ({ ...prev, end: e.target.value }))
										}
										className="w-full rounded-md border border-gray-600 bg-gray-600 px-3 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
									/>
								</div>
							</div>
						)}
					</div>

					{/* Статистика */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
						{/* Общие доходы */}
						<div className="p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
							<div className="text-sm text-green-300 mb-1">Доходы</div>
							<div className="text-xl font-bold text-green-200">
								+{stats.totalIncome.toLocaleString('ru-RU')} ₽
							</div>
							<div className="text-xs text-green-400">
								{stats.incomeCount} операций
							</div>
						</div>

						{/* Общие расходы */}
						<div className="p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
							<div className="text-sm text-red-300 mb-1">Расходы</div>
							<div className="text-xl font-bold text-red-200">
								-{stats.totalExpenses.toLocaleString('ru-RU')} ₽
							</div>
							<div className="text-xs text-red-400">
								{stats.expenseCount} операций
							</div>
						</div>

						{/* Баланс */}
						<div className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
							<div className="text-sm text-blue-300 mb-1">Баланс</div>
							<div
								className={`text-xl font-bold ${
									stats.totalIncome - stats.totalExpenses >= 0
										? 'text-green-200'
										: 'text-red-200'
								}`}
							>
								{(stats.totalIncome - stats.totalExpenses).toLocaleString(
									'ru-RU'
								)}{' '}
								₽
							</div>
							<div className="text-xs text-blue-400">за период</div>
						</div>

						{/* Всего операций */}
						<div className="p-4 bg-purple-600/20 border border-purple-600/30 rounded-lg">
							<div className="text-sm text-purple-300 mb-1">Операций</div>
							<div className="text-xl font-bold text-purple-200">
								{stats.transactionCount}
							</div>
							<div className="text-xs text-purple-400">всего</div>
						</div>
					</div>

					{/* График */}
					<div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
						<h3 className="text-lg font-medium text-gray-200 mb-4">
							График расходов и доходов
						</h3>
						<AnalyticsChart
							operations={filteredOperations}
							currentBalance={card.balance}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
