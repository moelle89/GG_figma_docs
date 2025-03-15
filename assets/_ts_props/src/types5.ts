export interface Input {
	input text: string; 
	hint text: string; 
	input placeholder: string; 
	icon swap before: ReactNode; 
	label text: string; 
	icon swap after: ReactNode; 
	icon before: boolean; 
	icon after: boolean; 
	hint: boolean; 
	label: boolean; 
	state: 'Default' | 'Hover' | 'Filled' | 'Focus' | 'Disabled' | 'Error'; 
	variant: 'Default' | 'Phone number' | 'Amount' | 'Website' | 'Card'; 
}