import { writable } from 'svelte/store';

export const selectedBudgetId = writable<string | null>(null);
