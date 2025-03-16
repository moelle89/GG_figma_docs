export interface Input {
	inputText: string; 
	hintText: string; 
	inputPlaceholder: string; 
	iconSwapBefore: ReactNode; 
	labelText: string; 
	iconSwapAfter: ReactNode; 
	iconBefore: boolean; 
	iconAfter: boolean; 
	hint: boolean; 
	label: boolean; 
	state: 'Default' | 'Hover' | 'Filled' | 'Focus' | 'Disabled' | 'Error'; 
	variant: 'Default' | 'Phone number' | 'Amount' | 'Website' | 'Card'; 
}