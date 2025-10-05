import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { removeCardHistoryApi } from './removeCardHistoryApi';
import type { ICard } from '@/shared/lib';

describe('removeCardHistoryApi', () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.stubGlobal('fetch', mockFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it('should be defined', () => {
		expect(removeCardHistoryApi).toBeDefined();
	});

	it('should clear card history successfully and return the updated card', async () => {
		const cardId = 1;
		const token = 'test-token';
		const date = new Date();
		vi.useFakeTimers();
		vi.setSystemTime(date);

		const mockUpdatedCard: ICard = {
			_id: cardId,
			name: 'Test Card',
			color: '#123456',
			balance: 0,
			order: 1,
			lastOperation: {
				amount: 0,
				date: date.toISOString(),
				description: 'История очищена',
			},
			operations: [],
		};

		mockFetch.mockResolvedValue(
			new Response(JSON.stringify(mockUpdatedCard), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})
		);

		const updatedCard = await removeCardHistoryApi(cardId, token);

		expect(mockFetch).toHaveBeenCalledWith(
			`${import.meta.env.VITE_API_URL}/api/cards/${cardId}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					operations: [],
					lastOperation: {
						amount: 0,
						date: date.toISOString(),
						description: 'История очищена',
					},
					balance: 0,
				}),
			}
		);
		expect(updatedCard).toEqual(mockUpdatedCard);
		vi.useRealTimers();
	});

	it('should throw an error if the API returns a non-ok response', async () => {
		const cardId = 1;
		const token = 'test-token';
		const errorMessage = 'Не удалось очистить историю';

		mockFetch.mockResolvedValue(
			new Response(JSON.stringify({ message: errorMessage }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		);

		await expect(removeCardHistoryApi(cardId, token)).rejects.toThrow(
			errorMessage
		);
	});

	it('should throw a network error if fetch fails', async () => {
		const cardId = 1;
		const token = 'test-token';
		const networkErrorMessage = 'Ошибка сети. Проверьте подключение.';

		mockFetch.mockRejectedValue(new Error('Network error'));

		await expect(removeCardHistoryApi(cardId, token)).rejects.toThrow(
			networkErrorMessage
		);
	});
});
