export function set<T>(key: string, value: T): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem(key, JSON.stringify(value));
	} else {
		throw Error(`local storage is not supported`);
	}
}

export function get<T>(key: string): T | null {
	if (typeof window !== 'undefined') {
		const item = localStorage.getItem(key);
		return item ? (JSON.parse(item) as T) : null;
	} else {
		throw Error(`local storage is not supported`);
	}
}

export function remove(key: string): void {
	if (typeof window !== 'undefined') {
		localStorage.removeItem(key);
	} else {
		throw Error(`local storage is not supported`);
	}
}
