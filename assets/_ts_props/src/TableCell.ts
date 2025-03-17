export interface Table Cell {
	title: boolean; 
	caption: boolean; 
	text: string; 
	subtext: string; 
	type: 'Text' | 'Lead avatar' | 'Lead avatar checkbox' | 'Lead avatar radio' | 'Lead checkbox' | 'Lead radio' | 'Lead toggle' | 'Action dropdown' | 'Check' | 'Checkbox only' | 'Radio only' | 'Toggle only' | 'Button group' | 'Badge' | 'Badge group' | 'Avatar only' | 'Avatar group' | 'Lead logo checkbox' | 'Lead logo radio' | 'Lead file checkbox' | 'Lead file radio'; 
}