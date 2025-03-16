export interface BaseBadge {
	icon: ReactNode; 
	text: string; 
	size: 'lg' | 'md' | 'sm'; 
	type: 'Simple' | 'icon + Label' | 'Just icon' | 'Avatar'; 
	cancel: 'Yes' | 'No'; 
}