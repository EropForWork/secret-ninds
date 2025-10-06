import { useMemo, type JSX } from 'react';
import {
	ComposedChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine,
} from 'recharts';
import type { IOperation } from '@/shared/lib';

interface AnalyticsChartProps {
	operations: IOperation[];
	currentBalance: number;
}

interface TooltipProps {
	active?: boolean;
	payload?: Array<{
		payload: {
			date: string;
			income: number;
			expenses: number;
			net: number;
			operations: IOperation[];
		};
	}>;
	label?: string;
}

export function AnalyticsChart({
	operations,
	currentBalance,
}: AnalyticsChartProps): JSX.Element {
	// Группировка операций по дням и расчет баланса
	const chartData = useMemo(() => {
		// Сортируем операции по дате (от старых к новым)
		const sortedOperations = [...operations].sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);

		// Группируем операции по дням
		const groupedByDate = sortedOperations.reduce(
			(acc, operation) => {
				const date = new Date(operation.date).toLocaleDateString('ru-RU', {
					day: '2-digit',
					month: '2-digit',
				});

				if (!acc[date]) {
					acc[date] = {
						income: 0,
						expenses: 0,
						operations: [],
					};
				}

				if (operation.amount > 0) {
					acc[date].income += operation.amount;
				} else {
					acc[date].expenses += Math.abs(operation.amount);
				}

				acc[date].operations.push(operation);

				return acc;
			},
			{} as Record<
				string,
				{ income: number; expenses: number; operations: IOperation[] }
			>
		);

		// Рассчитываем баланс на каждый день, начиная с текущего баланса
		let runningBalance = currentBalance;
		const dates = Object.keys(groupedByDate).sort((a, b) => {
			const dateA = new Date(a.split('.').reverse().join('-'));
			const dateB = new Date(b.split('.').reverse().join('-'));
			return dateB.getTime() - dateA.getTime(); // От новых к старым
		});

		// Проходим от самой последней операции к самой первой
		const balanceByDate: Record<string, number> = {};
		for (const date of dates) {
			const dayOperations = groupedByDate[date];
			// Вычитаем операции этого дня из текущего баланса
			runningBalance -= dayOperations.income - dayOperations.expenses;
			// Сохраняем баланс ПОСЛЕ операций этого дня
			balanceByDate[date] =
				runningBalance + dayOperations.income - dayOperations.expenses;
		}

		// Преобразование в массив для графика
		return Object.entries(groupedByDate)
			.map(([date, data]) => ({
				date,
				income: data.income,
				expenses: -data.expenses, // Отрицательные значения для отображения вниз
				net: balanceByDate[date] || 0, // Реальный баланс на этот день
				operations: data.operations,
			}))
			.sort((a, b) => {
				// Сортировка по дате (от старых к новым для отображения)
				const dateA = new Date(a.date.split('.').reverse().join('-'));
				const dateB = new Date(b.date.split('.').reverse().join('-'));
				return dateA.getTime() - dateB.getTime();
			});
	}, [operations, currentBalance]);

	// Кастомный tooltip
	const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
					<p className="text-white font-medium mb-2">{label}</p>
					<div className="space-y-1">
						{data.income > 0 && (
							<p className="text-green-400 text-sm">
								Доходы: +{data.income.toLocaleString('ru-RU')} ₽
							</p>
						)}
						{data.expenses < 0 && (
							<p className="text-red-400 text-sm">
								Расходы: {data.expenses.toLocaleString('ru-RU')} ₽
							</p>
						)}
						<p
							className={`text-sm font-medium ${
								data.net >= 0 ? 'text-green-300' : 'text-red-300'
							}`}
						>
							Баланс: {data.net >= 0 ? '+' : ''}
							{data.net.toLocaleString('ru-RU')} ₽
						</p>
						{data.operations.length > 0 && (
							<div className="mt-2 pt-2 border-t border-gray-600">
								<p className="text-gray-300 text-xs mb-1">Операции:</p>
								{data.operations
									.slice(0, 3)
									.map((op: IOperation, index: number) => (
										<p key={index} className="text-gray-400 text-xs">
											{op.description || 'Без описания'}:{' '}
											{op.amount >= 0 ? '+' : ''}
											{op.amount.toLocaleString('ru-RU')} ₽
										</p>
									))}
								{data.operations.length > 3 && (
									<p className="text-gray-500 text-xs">
										...и еще {data.operations.length - 3}
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			);
		}
		return null;
	};

	if (chartData.length === 0) {
		return (
			<div className="h-64 flex items-center justify-center text-gray-400">
				Нет данных для отображения
			</div>
		);
	}

	return (
		<div className="h-64 w-full border-0">
			<style>{`
				.recharts-tooltip-cursor {
					display: none !important;
				}
				.recharts-bar-rectangle:hover {
					opacity: 0.9 !important;
					transition: all 0.2s ease !important;
					filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) !important;
				}
				.recharts-surface:focus {
					outline: none !important;
				}
				.recharts-surface {
					outline: none !important;
				}
			`}</style>
			<ResponsiveContainer width="100%" height="100%">
				<ComposedChart
					data={chartData}
					margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
					style={{ cursor: 'pointer' }}
				>
					<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
					<XAxis
						dataKey="date"
						stroke="#9CA3AF"
						fontSize={12}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						stroke="#9CA3AF"
						fontSize={12}
						tickLine={false}
						axisLine={false}
						tickFormatter={value => `${value}₽`}
					/>
					<Tooltip content={<CustomTooltip />} />

					{/* Нулевая линия */}
					<ReferenceLine y={0} stroke="#6B7280" strokeWidth={2} />

					{/* Столбцы доходов (зеленые, вверх от нуля) */}
					<Bar
						dataKey="income"
						fill="#10B981"
						radius={[2, 2, 0, 0]}
						name="Доходы"
					/>

					{/* Столбцы расходов (красные, вниз от нуля) - отрицательные значения */}
					<Bar
						dataKey="expenses"
						fill="#EF4444"
						radius={[0, 0, 2, 2]}
						name="Расходы"
					/>
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	);
}
