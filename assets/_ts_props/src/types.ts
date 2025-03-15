export interface Button {
	button label: string; 
	icon after swap: ReactNode; 
	icon before swap: ReactNode; 
	icon after: boolean; 
	icon before: boolean; 
	size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'; 
	type: 'Primary' | 'Secondary' | 'Tertiary' | 'Link 01' | 'Link 02'; 
	state: 'Default' | 'Hover' | 'Click' | 'Focus' | 'Disabled'; 
	corner radius: 'Default' | 'Pill'; 
}