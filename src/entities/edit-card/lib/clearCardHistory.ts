import type { ICard } from '@/shared/lib';

export async function clearCardHistory(
	idCard: number,
	removeCardHistoryApi: (idCard: number, token: string) => Promise<ICard>
): Promise<ICard> {
	const token = localStorage.getItem('token');
	if (!token) {
		throw new Error('Не авторизован. Токен отсутствует.');
	}

	return await removeCardHistoryApi(idCard, token);
}
