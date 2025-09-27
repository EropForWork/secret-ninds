import type { ILoginForm } from '@/shared/lib/types';

export async function authApi(form: ILoginForm): Promise<Response> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/api/auth/login`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(form),
		}
	);
	return response;
}
