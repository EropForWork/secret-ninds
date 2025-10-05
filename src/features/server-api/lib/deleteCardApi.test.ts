import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { deleteCardApi } from './deleteCardApi';

describe('deleteCardApi', () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.stubGlobal('fetch', mockFetch);
		vi.stubGlobal('localStorage', {
			getItem: vi.fn(),
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it('should be defined', () => {
		expect(deleteCardApi).toBeDefined();
	});

	it('should delete a card successfully when authenticated', async () => {
		const cardId = 123;
		const token = 'test-token';
		(localStorage.getItem as vi.Mock).mockReturnValue(token);
		mockFetch.mockResolvedValue(new Response(null, { status: 204 }));

		await expect(deleteCardApi(cardId)).resolves.toBeUndefined();

		expect(localStorage.getItem).toHaveBeenCalledWith('token');
		expect(mockFetch).toHaveBeenCalledWith(
			`${import.meta.env.VITE_API_URL}/api/cards/${cardId}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
	});

	it('should throw an error if not authenticated', async () => {
		const cardId = 123;
		(localStorage.getItem as vi.Mock).mockReturnValue(null);

		await expect(deleteCardApi(cardId)).rejects.toThrow('Не авторизован');
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('should throw an error if the API returns a non-ok response', async () => {
		const cardId = 123;
		const token = 'test-token';
		const errorMessage = 'Не удалось удалить карточку';
		(localStorage.getItem as vi.Mock).mockReturnValue(token);
		mockFetch.mockResolvedValue(
			new Response(JSON.stringify({ message: errorMessage }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		);

		await expect(deleteCardApi(cardId)).rejects.toThrow(errorMessage);
	});
});
