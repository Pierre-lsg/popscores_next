import { writable } from "svelte/store";

function createNetworkStore() {
  const { subscribe, set } = writable(navigator.onLine);

  if (typeof window !== "undefined") {
    window.addEventListener("online", () => set(true));
    window.addEventListener("offline", () => set(false));
  }

  return { subscribe };
}

export const isOnline = createNetworkStore();
