export interface AccordionItem {
	instance: ReactNode; 
	accordionSubtext: string; 
	accordionTitle: string; 
	property: 'Default' | 'Hover'; 
	icon: 'True' | 'False'; 
	expanded: 'True' | 'False'; 
}