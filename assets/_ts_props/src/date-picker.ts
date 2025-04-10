export interface Datepicker {
	type: 'Single' | 'Single with help buttons' | 'Dual' | 'Dual with help buttons';
	actions: boolean;
	month: string;
	showRange: 'False' | 'True';
}