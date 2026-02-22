import type { Course } from '$lib/types/courseType';
import { db, pb } from './pocketBase';

export const courseService = {
	getAll: () => db.getFullList('courses', { sort: 'created' }),

	getAllCourses: async () => {
		const courses = await db.getFullList('courses', { sort: 'created' });
		return courses.map((course) => course.data) as Course[];
	},

	getById: (id: string) => db.getOne('courses', id, {}),

	getCourseById: async (id: string) => {
		const course = await db.getOne('courses', id, {});
		return course?.data;
	},

	saveCourse: (aCourse: Course) => {
		const courseToSave = {
			id: aCourse.id,
			name: aCourse.name,
			owner: pb.authStore.record?.id,
			data: aCourse
		};
		db.save('courses', courseToSave);
	},

	saveCourses: (courses: Course[]) => {
		for (let aCourse of courses) {
			const courseToSave = {
				id: aCourse.id,
				name: aCourse.name,
				owner: pb.authStore.record?.id,
				data: aCourse
			};
			db.save('courses', courseToSave);
		}
	}
};
