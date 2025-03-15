export interface Button with Icon Only {
	change icon: ReactNode; 
	size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'; 
	type: 'Primary' | 'Secondary' | 'Tertiary'; 
	state: 'Default' | 'Hover' | 'Click' | 'Focus' | 'Disabled'; 
}