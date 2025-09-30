import type { ICard } from '@/shared/lib';

export async function createCard(
	name: string,
	color: string,
	balance: number,
	order: number | null,
	createCardApi: (
		token: string,
		name: string,
		color: string,
		balance: number,
		order: number | null
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

	return await createCardApi(token, name, color, balance, order);
}
