import type { ICard } from '@/shared/lib';
import { ApiError } from '@/shared/lib/errors';

export async function updateCardApi(
	token: string,
	idCard: number,
	name: string,
	color: string,
	balance: number,
	order: number
) {
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
					name: name.trim(),
					color: color.trim(),
					balance: parseFloat(balance.toFixed(0)),
					order: order,
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new ApiError(errorData.message || 'Не удалось обновить карточку');
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
