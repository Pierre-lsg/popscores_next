export type AppStatus = 'nothing' | 'info' | 'warning' | 'alert';

export interface AppEvents {
	keyEvent: string;
	status: AppStatus;
	details: string;
}
