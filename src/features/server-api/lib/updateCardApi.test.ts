import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { updateCardApi } from './updateCardApi';
import type { ICard } from '@/shared/lib';

describe('updateCardApi', () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.stubGlobal('fetch', mockFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it('should be defined', () => {
		expect(updateCardApi).toBeDefined();
	});

	it('should update a card successfully and return the updated card', async () => {
		const token = 'test-token';
		const cardId = 1;
		const name = 'Updated Card';
		const color = '#654321';
		const balance = 1500;
		const order = 0;
		const mockUpdatedCard: ICard = {
			_id: cardId,
			name,
			color,
			balance,
			order,
			lastOperation: {
				amount: 100,
				date: new Date().toISOString(),
				description: 'update',
			},
			operations: [],
		};

		mockFetch.mockResolvedValue(
			new Response(JSON.stringify(mockUpdatedCard), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})
		);

		const updatedCard = await updateCardApi(
			token,
			cardId,
			name,
			color,
			balance,
			order
		);

		expect(mockFetch).toHaveBeenCalledWith(
			`${import.meta.env.VITE_API_URL}/api/cards/${cardId}`,
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
					order,
				}),
			}
		);

		expect(updatedCard).toEqual(mockUpdatedCard);
	});

	it('should throw an error if the API returns a non-ok response', async () => {
		const token = 'test-token';
		const cardId = 1;
		const name = 'Updated Card';
		const color = '#654321';
		const balance = 1500;
		const order = 0;
		const errorMessage = 'Не удалось обновить карточку';

		mockFetch.mockResolvedValue(
			new Response(JSON.stringify({ message: errorMessage }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		);

		await expect(
			updateCardApi(token, cardId, name, color, balance, order)
		).rejects.toThrow(errorMessage);
	});

	it('should throw a network error if fetch fails', async () => {
		const token = 'test-token';
		const cardId = 1;
		const name = 'Updated Card';
		const color = '#654321';
		const balance = 1500;
		const order = 0;
		const networkErrorMessage = 'Ошибка сети. Проверьте подключение.';

		mockFetch.mockRejectedValue(new Error('Network error'));

		await expect(
			updateCardApi(token, cardId, name, color, balance, order)
		).rejects.toThrow(networkErrorMessage);
	});
});
