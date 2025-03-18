import { PUBLIC_BASE_URL } from '$env/static/public';

const BASE_URL = PUBLIC_BASE_URL;

export async function makeRequest(
	url: string,
	method: string = 'GET',
	secret: string | null = null,
	body: Record<string, any> | null = null
): Promise<Record<string, any>> {
	if (!secret) {
		throw new Error('User is not authenticated');
	}

	let headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${secret}`
	};

	const response = await fetch(`${BASE_URL}${url}`, {
		method: method,
		headers: { ...headers },
		body: body && ['POST', 'PATCH'].find((item) => item == method) ? JSON.stringify(body) : null
	});

	if (response.status === 204) {
		return {};
	} else if (response.status >= 200 && response.status < 300) {
		const data = await response.json();
		return data;
	} else if (response.status == 401) {
		// clear data after unauthorized
		localStorage.clear();
		throw new Error('user is not authorized');
	} else if (response.status == 400 || response.status == 422) {
		const results = (await response.json()) as { result: { message: string }[] };
		if (results.result) {
			throw new Error(results.result.join(', '));
		} else {
			console.error('can not get error message from response');
		}
	}

	throw new Error(`UNHANDLED ERROR. Status code: ${response.status}}`);
}
