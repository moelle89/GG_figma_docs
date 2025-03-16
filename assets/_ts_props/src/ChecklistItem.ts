export interface ChecklistItem {
	itemTitle: string; 
	instance: ReactNode; 
	variant: 'Only icon' | 'Circle line' | 'Circle filled' | 'Custom Icon'; 
	color: 'Primary' | 'Green' | 'Black'; 
	size: 'xs' | 'sm' | 'md' | 'lg'; 
}