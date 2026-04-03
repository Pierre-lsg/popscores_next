<script lang="ts">
	import { coursesStore } from '$lib/stores/quickSession/coursesStore.svelte';
	import type { Course } from '$lib/types/courseType';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import { courseService } from '$lib/utils/pocketbase/courses2Cloud';
	import { shareService } from '$lib/utils/shareService';
	import { onMount } from 'svelte';
	import QRCode from '$lib/ui/QRCode.svelte';

	let allCourses: Course[] = $state([]);
	let loading = $state(true);
	let knownCoursesId: string[] = $derived(coursesStore.list.map((course) => course.id));
	let filteredCourses: Course[] = $derived(
		allCourses.filter((course) => !knownCoursesId.includes(course.id))
	);
	let qrDataCourse: string = $state('');

	let { title = '', currentCourse = $bindable('') } = $props<{
		title?: string;
		currentCourse: string;
	}>();

	onMount(async () => {
		allCourses = await courseService.getAllCourses();
		allCourses = allCourses.filter((c) => c.name !== '');
		loading = false;
	});

	const removeCourse = (id: string) => {
		coursesStore.remove(id);
	};

	const loadCoursefromCloud = (index: number) => {
		const aCourse = coursesStore.list.filter((c) => c.id === filteredCourses[index].id);
		if (aCourse.length == 0) {
			if (confirm('Voulez-vous importer le parcours ?')) {
				const newCourse = filteredCourses[index];
				coursesStore.load(newCourse);
			}
		}
	};

	const copyShareLink = async (course: Course) => {
		try {
			const link = shareService.generateCourseLink(course);
			await navigator.clipboard.writeText(link);
			qrDataCourse = link;

			// On déclenche le toast !
			toastStore.show('🔗 Lien de partage copié !');
		} catch (err) {
			toastStore.show('❌ Erreur lors de la copie');
		}
	};
</script>

<div class="course-list">
	<h2>{title}</h2>
	{#if qrDataCourse !== ''}
		<div role="none" onclick={() => (qrDataCourse = '')}>
			<QRCode data={qrDataCourse} size={400} />
		</div>
	{/if}
	{#each coursesStore.list as course, i}
		<button class="course-card" onclick={() => (currentCourse = course.id)}>
			<div class="details">
				{course.name}
			</div>
			<div class="icon">⛳</div>
		</button>
		<div class="action">
			<button onclick={() => removeCourse(course.id)}> 🗑️ </button>
			<button onclick={() => copyShareLink(course)}>🔗 Partager</button>
		</div>
	{:else}
		<p>Aucune parcours archivé pour le moment. ⛳</p>
	{/each}

	<h3>Parcours disponibles dans le Cloud</h3>

	{#if loading}
		<p>Chargement ...</p>
	{:else}
		{#each filteredCourses as course, i}
			<button class="course-card" onclick={() => loadCoursefromCloud(i)}>
				<div>{course.name}</div>
			</button>
		{/each}
	{/if}
</div>

<style>
	.course-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		margin: 0 auto;
	}

	.course-card {
		display: flex;
		align-items: center;
		background: var(--bg-card);
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 15px;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		width: 100%;
		color: inherit;
		font-family: inherit;
	}

	.course-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border-color: var(--border-color);
	}

	.course-card:active {
		transform: translateY(0);
		background-color: #f8f9fa;
	}

	.details {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	.icon {
		font-size: 1.5rem;
		margin-left: 10px;
		filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
	}

	/* Effet "vide" */
	p {
		text-align: center;
		color: #95a5a6;
		margin-top: 40px;
		font-style: italic;
	}
</style>
