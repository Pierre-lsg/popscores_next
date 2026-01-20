<script lang="ts">
	import { gameStatus } from '$lib/stores/gameStatusStore.svelte';
	import { onMount } from 'svelte';
</script>

<div class="mobile-wizard">
	<h2>Compétitions de championnat</h2>
	<p>Cette section permettra de gérer les compétitions de championnat à venir.</p>
</div>

<style>
	.mobile-wizard {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
