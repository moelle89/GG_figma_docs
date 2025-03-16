export interface Avatar {
	initials: string; 
	size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'; 
	type: 'Default' | 'With line' | 'Online' | 'Offline'; 
	variant: 'Image' | 'Initial subtle' | 'Initial filled' | 'User subtle' | 'User filled'; 
}