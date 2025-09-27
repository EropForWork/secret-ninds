import type { ICard } from '@/shared/lib';

export async function updateCard(
	idCard: number,
	name: string,
	color: string,
	balance: number,
	order: number,
	updateCardApi: (
		token: string,
		idCard: number,
		name: string,
		color: string,
		balance: number,
		order: number
	) => Promise<ICard>
): Promise<ICard> {
	const token = localStorage.getItem('token');
	if (!token) {
		throw new Error('Не авторизован. Токен отсутствует.');
	}

	if (!name || name.trim() === '') {
		throw new Error('Название карточки обязательно');
	}
	if (!color || color.trim() === '') {
		throw new Error('Цвет карточки обязателен');
	}

	return await updateCardApi(token, idCard, name, color, balance, order);
}
