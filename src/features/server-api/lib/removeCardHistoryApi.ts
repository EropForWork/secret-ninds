import type { ICard } from '@/shared/lib';
import { ApiError } from '@/shared/lib/errors';

export async function removeCardHistoryApi(idCard: number, token: string) {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/api/cards/${idCard}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					operations: [],
					lastOperation: {
						amount: 0,
						date: new Date().toISOString(),
						description: 'История очищена',
					},
					balance: 0,
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new ApiError(errorData.message || 'Не удалось очистить историю');
		}

		const updatedCard: ICard = await response.json();
		return updatedCard;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new Error('Ошибка сети. Проверьте подключение.');
	}
}
