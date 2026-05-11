<script lang="ts">
	import { courseService } from '$lib/utils/pocketbase/courses2Cloud';
	import { toastStore } from '$lib/stores/toastStore.svelte';

	import type { Course } from '$lib/types/courseType';

	import { userStore } from '$lib/stores/userStore.svelte';
	import { coursesStore } from '$lib/stores/quickSession/coursesStore.svelte';
	import TargetBox from '../TargetBox.svelte';
	import Param from '$lib/ui/Param.svelte';

	let { title = '', currentCourse = $bindable('') } = $props<{
		title?: string;
		currentCourse: string;
	}>();

	let course: Course | undefined = $derived(coursesStore.find(currentCourse));
	let showTargetDetails: boolean[] = $state([]);
	let newCourseName: string = $state('');
	let isRenaming: boolean = $state(false);

	const saveCourseToCloud = async () => {
		if (course) {
			try {
				const record = courseService.saveCourse(course);
				toastStore.show('💾 Sauvegarde effectuée ...', 'success');
			} catch (err) {
				toastStore.show("💾 Echec à l'enregistrement ...", 'failure');
			}
		}
	};

	const showDetails = (idx: number) => {
		//
		showTargetDetails[idx] = !showTargetDetails[idx];
	};

	const changeName = () => {
		//
		let tmpCourse = coursesStore.find(currentCourse);

		if (tmpCourse) tmpCourse.name = newCourseName;
		isRenaming = false;
		alert('Corriger/Simplifier cet écran en passant directemnt la currentCourse et non son id');
	};
</script>

<div>
	<div class="action">
		{#if userStore.current}
			<button onclick={() => saveCourseToCloud()}>Enregistrer dans le Cloud</button>
		{/if}
	</div>
	<h2>{title}</h2>
	{#if course}
		<div>
			<!-- Détails du parcours -->
			<div class="action">
				<h3>{course.name}</h3>
				<button onclick={() => (isRenaming = true)}>Changer le nom</button>
			</div>
			{#if isRenaming}
				<Param
					label="⛳ Nom du parcours"
					type="text"
					bind:value={newCourseName}
					placeholder="Nom du parcours"
					focus={true}
				/>
				<button onclick={() => changeName()}>Valider</button>
			{/if}

			<ul>
				{#each course.targets as target, i}
					<li>
						<div>{target.name} - {target.par} - {target.rule}</div>
						<button onclick={() => showDetails(i)}>Détails</button>
						{#if showTargetDetails[i]}
							<TargetBox {target} bind:showDetails={showTargetDetails[i]} />
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{:else}
		<p>Aucune donnée de parcours trouvée.</p>
	{/if}
</div>
