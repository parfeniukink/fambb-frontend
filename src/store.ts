import type { User } from "$lib/types/user"

export const user: User | null = $state(null)
export const error: string | null = $state(null)
