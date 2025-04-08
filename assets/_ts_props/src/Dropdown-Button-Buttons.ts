export interface Dropdown Button # Button {
	showArrow: boolean; 
	icon: ReactNode; 
	showIcon: boolean; 
	buttonText: string; 
	variant: 'Primary' | 'Secondary' | 'Tertiary'; 
	state: 'Default' | 'Hover' | 'Selected'; 
}