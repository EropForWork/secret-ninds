import type { ICard } from '@/shared/lib';

class ApiError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ApiError';
	}
}

export async function addTransactionApi(
	idCard: number,
	amount: number,
	description: string,
	token: string
) {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/api/cards/${idCard}/transactions`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					amount,
					description: description.trim(),
				}),
			}
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new ApiError(errorData.message || 'Не удалось добавить транзакцию');
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
