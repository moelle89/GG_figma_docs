export interface ❖ Badge {
	icon: ReactNode; 
	text: string; 
	size: 'lg' | 'md' | 'sm'; 
	type: 'Simple' | 'icon + Label' | 'Just icon' | 'Avatar'; 
	stroke: 'No' | 'Yes'; 
	cancel: 'Yes' | 'No'; 
	color: 'Gray' | 'Success' | 'Primary' | 'Warning' | 'Error' | 'Clear'; 
}