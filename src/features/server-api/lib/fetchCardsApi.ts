import type { ICard } from '@/shared/lib';

export const fetchCardsApi = async (token: string): Promise<ICard[]> => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cards`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
};
