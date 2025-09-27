import type { ICard } from '@/shared/lib';

export async function addTransaction(
	idCard: number,
	amount: number,
	description: string,
	addTransactionApi: (
		idCard: number,
		amount: number,
		description: string,
		token: string
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	) => Promise<any>
): Promise<ICard> {
	// Валидация входных данных
	if (!Number.isFinite(amount)) {
		throw new Error('Сумма должна быть числом');
	}
	if (!description || description.trim() === '') {
		throw new Error('Описание обязательно');
	}

	const token = localStorage.getItem('token');
	if (!token) {
		throw new Error('Не авторизован. Токен отсутствует.');
	}

	const updatedCard: ICard = await addTransactionApi(
		idCard,
		amount,
		description,
		token
	);
	return updatedCard;
}
