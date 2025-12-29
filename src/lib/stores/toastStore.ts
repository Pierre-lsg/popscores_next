import { writable } from "svelte/store";

export const toast = writable<string | null>(null);

export const showToast = (message: string, duration = 3000) => {
  toast.set(message);
  setTimeout(() => {
    toast.set(null);
  }, duration);
};
