export interface Toggle Label {
	subtext: string; 
	title: string; 
	description: boolean; 
	state: 'Default' | 'Hover' | 'Disabled'; 
	pressed: 'True' | 'False'; 
	toggle position: 'Left' | 'Right'; 
}