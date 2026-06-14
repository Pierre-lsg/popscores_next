import type { Course } from '$lib/types/courseType';
import { db, pb } from './pocketBase';

export const courseService = {
	getAll: () => db.getFullList<{ data: Course }>('courses', { sort: 'created' }),

	getAllCourses: async () => {
		const courses = await db.getFullList<{ data: Course }>('courses', { sort: 'created' });
		return courses.map((course) => course.data) as Course[];
	},

	getById: (id: string) => db.getOne('courses', id, {}),

	getCourseById: async (id: string) => {
		const course = await db.getOne<{ data: Course }>('courses', id, {});
		return course?.data;
	},

	saveCourse: async (aCourse: Course) => {
		const courseToSave = {
			id: aCourse.id,
			name: aCourse.name,
			owner: pb.authStore.record?.id,
			data: aCourse
		};
		return await db.save('courses', courseToSave);
	},

	saveCourses: async (courses: Course[]) => {
		const promises = courses.map((aCourse) => {
			const courseToSave = {
				id: aCourse.id,
				name: aCourse.name,
				owner: pb.authStore.record?.id,
				data: aCourse
			};
			return db.save('courses', courseToSave);
		});
		return await Promise.all(promises);
	}
};
