import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCardApi } from './createCardApi';
import type { ICard } from '@/shared/lib';

describe('createCardApi', () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.stubGlobal('fetch', mockFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it('should be defined', () => {
		expect(createCardApi).toBeDefined();
	});

	it('should create a card successfully and return the new card', async () => {
		const token = 'test-token';
		const name = 'New Card';
		const color = '#123456';
		const balance = 500;
		const order = 1;
		const mockNewCard: ICard = {
			id: '1',
			name,
			color,
			balance,
			order,
			userId: '1',
			transactions: [],
		};

		mockFetch.mockResolvedValue(
			new Response(JSON.stringify(mockNewCard), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})
		);

		const newCard = await createCardApi(token, name, color, balance, order);

		expect(mockFetch).toHaveBeenCalledWith(
			`${import.meta.env.VITE_API_URL}/api/cards`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					name: name.trim(),
					color: color.trim(),
					balance: parseFloat(balance.toFixed(0)),
					order: order,
				}),
			}
		);

		expect(newCard).toEqual(mockNewCard);
	});

	it('should throw an error if the API returns a non-ok response', async () => {
		const token = 'test-token';
		const name = 'New Card';
		const color = '#123456';
		const balance = 500;
		const order = 1;
		const errorMessage = 'Не удалось создать карточку';

		mockFetch.mockResolvedValue(
			new Response(JSON.stringify({ message: errorMessage }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		);

		await expect(
			createCardApi(token, name, color, balance, order)
		).rejects.toThrow(errorMessage);
	});

	it('should throw a network error if fetch fails', async () => {
		const token = 'test-token';
		const name = 'New Card';
		const color = '#123456';
		const balance = 500;
		const order = 1;
		const networkErrorMessage = 'Ошибка сети. Проверьте подключение.';

		mockFetch.mockRejectedValue(new Error('Network error'));

		await expect(
			createCardApi(token, name, color, balance, order)
		).rejects.toThrow(networkErrorMessage);
	});
});
