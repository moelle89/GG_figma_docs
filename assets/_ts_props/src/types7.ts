export interface Checkbox Label {
	label: boolean; 
	description text: string; 
	label text: string; 
	description: boolean; 
	size: 'sm' | 'md' | 'lg'; 
	state: 'Default' | 'Hover' | 'Click' | 'Focus' | 'Disabled' | 'Error'; 
	checked: 'False' | 'True'; 
	indeterminate: 'False' | 'True'; 
}