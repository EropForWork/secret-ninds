import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addTransactionApi } from './addTransactionApi';
import type { ICard } from '@/shared/lib';

describe('addTransactionApi', () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.stubGlobal('fetch', mockFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it('should be defined', () => {
		expect(addTransactionApi).toBeDefined();
	});

	it('should add a transaction successfully and return the updated card', async () => {
		const cardId = 1;
		const amount = 100;
		const description = 'Test Transaction';
		const token = 'test-token';
		const mockUpdatedCard: ICard = {
			id: String(cardId),
			name: 'Test Card',
			color: '#123456',
			balance: 900,
			order: 1,
			userId: '1',
			transactions: [
				{
					id: 't1',
					amount,
					description,
					cardId: String(cardId),
					timestamp: new Date().toISOString(),
				},
			],
		};

		mockFetch.mockResolvedValue(
			new Response(JSON.stringify(mockUpdatedCard), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})
		);

		const updatedCard = await addTransactionApi(
			cardId,
			amount,
			description,
			token
		);

		expect(mockFetch).toHaveBeenCalledWith(
			`${import.meta.env.VITE_API_URL}/api/cards/${cardId}/transactions`,
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
		expect(updatedCard).toEqual(mockUpdatedCard);
	});

	it('should throw an error if the API returns a non-ok response', async () => {
		const cardId = 1;
		const amount = 100;
		const description = 'Test Transaction';
		const token = 'test-token';
		const errorMessage = 'Не удалось добавить транзакцию';

		mockFetch.mockResolvedValue(
			new Response(JSON.stringify({ message: errorMessage }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		);

		await expect(
			addTransactionApi(cardId, amount, description, token)
		).rejects.toThrow(errorMessage);
	});

	it('should throw a network error if fetch fails', async () => {
		const cardId = 1;
		const amount = 100;
		const description = 'Test Transaction';
		const token = 'test-token';
		const networkErrorMessage = 'Ошибка сети. Проверьте подключение.';

		mockFetch.mockRejectedValue(new Error('Network error'));

		await expect(
			addTransactionApi(cardId, amount, description, token)
		).rejects.toThrow(networkErrorMessage);
	});
});
