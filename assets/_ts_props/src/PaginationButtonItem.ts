export interface PaginationButtonItem {
	icon: boolean; 
	button: 'Previous' | 'Next' | 'Number' | 'Icon only'; 
	state: 'Default' | 'Selected' | 'Focussed'; 
	color: 'Primary' | 'Gray'; 
}