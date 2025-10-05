import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authApi } from './authApi';
import type { ILoginForm } from '@/shared/lib/types';

describe('authApi', () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.stubGlobal('fetch', mockFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it('should be defined', () => {
		expect(authApi).toBeDefined();
	});

	it('should return a successful response on valid credentials', async () => {
		const form: ILoginForm = { username: 'testuser', password: 'password123' };
		const mockResponse = new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});

		mockFetch.mockResolvedValue(mockResponse);

		const response = await authApi(form);

		expect(mockFetch).toHaveBeenCalledWith(
			`${import.meta.env.VITE_API_URL}/api/auth/login`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form),
			}
		);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.success).toBe(true);
	});

	it('should return an error response on invalid credentials', async () => {
		const form: ILoginForm = {
			username: 'wronguser',
			password: 'wrongpassword',
		};
		const mockResponse = new Response(
			JSON.stringify({ message: 'Unauthorized' }),
			{
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			}
		);

		mockFetch.mockResolvedValue(mockResponse);

		const response = await authApi(form);

		expect(mockFetch).toHaveBeenCalledWith(
			`${import.meta.env.VITE_API_URL}/api/auth/login`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form),
			}
		);
		expect(response.status).toBe(401);
		const data = await response.json();
		expect(data.message).toBe('Unauthorized');
	});
});
