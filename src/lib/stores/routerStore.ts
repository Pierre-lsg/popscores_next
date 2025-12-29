import { writable } from "svelte/store";

// On définit les pages disponibles
export type Page = "hub" | "golf-score" | "other-service";

export const currentPage = writable<Page>("hub");
