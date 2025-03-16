export interface Button {
	buttonLabel: string; 
	iconAfterSwap: ReactNode; 
	iconBeforeSwap: ReactNode; 
	iconAfter: boolean; 
	iconBefore: boolean; 
	size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'; 
	type: 'Primary' | 'Secondary' | 'Tertiary' | 'Link 01' | 'Link 02'; 
	state: 'Default' | 'Hover' | 'Click' | 'Focus' | 'Disabled'; 
	cornerRadius: 'Default' | 'Pill'; 
}