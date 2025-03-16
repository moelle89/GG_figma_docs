export interface CheckboxLabel {
	label: boolean; 
	descriptionText: string; 
	labelText: string; 
	description: boolean; 
	size: 'sm' | 'md' | 'lg'; 
	state: 'Default' | 'Hover' | 'Click' | 'Focus' | 'Disabled' | 'Error'; 
	checked: 'False' | 'True'; 
	indeterminate: 'False' | 'True'; 
}