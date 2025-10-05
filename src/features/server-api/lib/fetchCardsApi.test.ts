import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCardsApi } from './fetchCardsApi';
import type { ICard } from '@/shared/lib';

describe('fetchCardsApi', () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.stubGlobal('fetch', mockFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it('should be defined', () => {
		expect(fetchCardsApi).toBeDefined();
	});

	it('should fetch cards successfully and return them', async () => {
		const token = 'test-token';
		const mockCards: ICard[] = [
			{
				_id: 1,
				name: 'Card 1',
				color: '#ff0000',
				balance: 100,
				order: 1,
				lastOperation: {
					amount: 10,
					date: new Date().toISOString(),
					description: 'op 1',
				},
				operations: [],
			},
			{
				_id: 2,
				name: 'Card 2',
				color: '#00ff00',
				balance: 200,
				order: 2,
				lastOperation: {
					amount: 20,
					date: new Date().toISOString(),
					description: 'op 2',
				},
				operations: [],
			},
		];

		mockFetch.mockResolvedValue(
			new Response(JSON.stringify(mockCards), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})
		);

		const cards = await fetchCardsApi(token);

		expect(mockFetch).toHaveBeenCalledWith(
			`${import.meta.env.VITE_API_URL}/api/cards`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		expect(cards).toEqual(mockCards);
	});

	it('should throw an error if the API returns a non-ok response', async () => {
		const token = 'test-token';
		const status = 500;

		mockFetch.mockResolvedValue(new Response(null, { status }));

		await expect(fetchCardsApi(token)).rejects.toThrow(
			`HTTP error! status: ${status}`
		);
	});
});
