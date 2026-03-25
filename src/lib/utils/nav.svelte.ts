import { type Snippet } from 'svelte';

class NavState {
	// On stocke le snippet ici
	headerAction = $state<Snippet | null>(null);
}

export const navContext = new NavState();
