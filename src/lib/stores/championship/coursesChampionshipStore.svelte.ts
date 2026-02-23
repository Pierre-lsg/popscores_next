import type { Course } from '$lib/types/courseType';
import type { Target } from '$lib/types/targetType';

// Constant for storage key
const STORAGE_KEY = 'cs-courses-data';

/**
 * Class to encapsulate the state and methods of the courses championship store.
 */
class CoursesChampionshipStore {
	list = $state<Course[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const savedData = localStorage.getItem(STORAGE_KEY);
			this.list = savedData ? JSON.parse(savedData) : [];

			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
				});
			});
		}
	}

	/**
	 * Add a Course
	 * @param name - The name of the Course
	 * @param targets - The list of the targets
	 */
	add(name: string, targets: Target[]): Course {
		const aCourse: Course = {
			id: crypto.randomUUID(),
			name,
			targets
		};

		this.list.push(aCourse);
		return aCourse;
	}

	/**
	 * Create a new blank Course
	 */
	new(): Course {
		const aCourse: Course = {
			id: crypto.randomUUID(),
			name: '',
			targets: []
		};

		this.list.push(aCourse);
		return aCourse;
	}

	/**
	 * Remove a Course from the championship list.
	 * @param id - The ID of the Course to remove
	 */
	remove(id: string) {
		this.list = this.list.filter((t) => t.id !== id);
	}

	/**
	 * Loads an external Course to the list.
	 *
	 * @param aCourse - Course
	 */
	load(aCourse: Course) {
		this.list.push(aCourse);
	}

	/**
	 * Find a Course from the list.
	 *
	 * @param id - ID of the Course to remove
	 */
	find(id: string): Course | undefined {
		return this.list.find((t) => t.id === id);
	}

	/**
	 * Reset the championship list and remove data from localStorage.
	 */
	reset() {
		this.list = [];
		if (typeof window !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}

// Export a unique instance of the store (Singleton)
export const coursesChampionshipStore = new CoursesChampionshipStore();
