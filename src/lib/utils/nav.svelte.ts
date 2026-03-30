import { type Snippet } from 'svelte';

class NavState {
	// On stocke le snippet ici
	headerAction = $state<Snippet | null>(null);
	title = $state<string>('');
}

export const navContext = new NavState();
