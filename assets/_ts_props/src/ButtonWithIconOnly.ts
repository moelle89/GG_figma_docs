export interface ButtonWithIconOnly {
	changeIcon: ReactNode; 
	size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'; 
	type: 'Primary' | 'Secondary' | 'Tertiary'; 
	state: 'Default' | 'Hover' | 'Click' | 'Focus' | 'Disabled'; 
}