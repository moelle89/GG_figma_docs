export interface ModalHeader {
	featuredIcon: boolean; 
	instance: ReactNode; 
	closeButton: boolean; 
	supportingText: boolean; 
	subtitle: string; 
	spacer: boolean; 
	titel: string; 
	variant: 'Left align 01' | 'Left align 02' | 'Center align'; 
	mobile: 'True' | 'False'; 
}