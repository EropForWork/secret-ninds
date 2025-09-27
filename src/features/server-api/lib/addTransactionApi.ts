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
			throw new Error(errorData.message || 'Не удалось добавить транзакцию');
		}
		const updatedCard = await response.json();
		return updatedCard;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		// Перехватываем и оборачиваем ошибку для ясности
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('Ошибка сети. Проверьте подключение.');
	}
}
