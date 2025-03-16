export interface PaginationItem {
	changeIcon: ReactNode; 
	state: 'Default' | 'Selected' | 'Focussed'; 
	color: 'Gray' | 'Primary'; 
	shape: 'Square' | 'Circle'; 
	type: 'Number' | 'Icon'; 
}