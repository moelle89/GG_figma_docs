export interface ButtonGroupButton {
	text: string; 
	icon: ReactNode; 
	size: 'sm' | 'md' | 'lg'; 
	type: 'Icon only' | 'Text only' | 'Icon before' | 'Icon after'; 
	state: 'Default' | 'Hover' | 'Click' | 'Focus' | 'Disabled'; 
}