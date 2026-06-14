<script lang="ts">
	import { slide } from 'svelte/transition';
	import { coursesStore } from '$lib/stores/quickSession/coursesStore.svelte';
	import type { Target } from '$lib/types/targetType';
	import { targetsStore } from '$lib/stores/quickSession/targetsStore.svelte';

	let { isSelectingCourse = $bindable(true), isCourseSelected = $bindable(false) } = $props<{
		isSelectingCourse: boolean;
		isCourseSelected: boolean;
	}>();

	const loadCourse = (targets: Target[]) => {
		targets.forEach((target) => targetsStore.load(target));
		isSelectingCourse = false;
		isCourseSelected = true;
	};
</script>

<div class="step-content" in:slide>
	{#each coursesStore.list as course (course)}
		<button onclick={() => loadCourse(course.targets)}>{course.name}</button>
	{/each}
</div>

<style>
	.step-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
</style>
