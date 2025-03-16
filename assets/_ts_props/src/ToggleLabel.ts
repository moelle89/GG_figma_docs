export interface ToggleLabel {
	subtext: string; 
	title: string; 
	description: boolean; 
	state: 'Default' | 'Hover' | 'Disabled'; 
	pressed: 'True' | 'False'; 
	togglePosition: 'Left' | 'Right'; 
}