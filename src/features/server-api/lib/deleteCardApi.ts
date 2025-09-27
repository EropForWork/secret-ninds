export async function deleteCardApi(_id: number): Promise<void> {
	const token = localStorage.getItem('token');
	if (!token) {
		throw new Error('Не авторизован');
	}

	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/api/cards/${_id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || 'Не удалось удалить карточку');
	}
}
