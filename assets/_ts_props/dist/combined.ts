 {
 Button {
	button label: string; 
	icon after swap: ReactNode; 
	icon before swap: ReactNode; 
	icon after: boolean; 
	icon before: boolean; 
	size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'; 
	type: 'Primary' | 'Secondary' | 'Tertiary' | 'Link 01' | 'Link 02'; 
	state: 'Default' | 'Hover' | 'Click' | 'Focus' | 'Disabled'; 
	corner radius: 'Default' | 'Pill'; 
}, 
Social Button {
	social: 'Google' | 'Facebook' | 'Apple'; 
	style: 'Filled' | 'Outline color' | 'Outline gray'; 
	state: 'Default' | 'Hover' | 'Click' | 'Focus'; 
	text: 'True' | 'False'; 
}, 
Toggle Switch {
	size: 'sm' | 'md'; 
	state: 'Default' | 'Hover' | 'Disabled'; 
	pressed: 'True' | 'False'; 
}, 
Toggle Label {
	subtext: string; 
	title: string; 
	description: boolean; 
	state: 'Default' | 'Hover' | 'Disabled'; 
	pressed: 'True' | 'False'; 
	toggle position: 'Left' | 'Right'; 
}, 
Dropdown Menu {
	show header when opened: boolean; 
	title: string; 
	state: 'Closed' | 'Opened'; 
	items: '2' | '3' | '4' | '5' | '6' | '7'; 
}, 
Dropdown Box {
	state: 'Opened' | 'Closed' | 'Closed-L1' | 'Closed-L2' | 'Closed-L3' | 'Closed-L4' | 'Closed-L5' | 'Opened-L1' | 'Opened-L2' | 'Opened-L3' | 'Opened-L4' | 'Opened-L5'; 
}, 
Horizontal Tabs {
	variant: '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09'; 
	size: 'md' | 'sm'; 
}, 
Vertical Tabs {
	variant: '01' | '02' | '03' | '04' | '05' | '06' | '07'; 
	size: 'sm' | 'md'; 
}, 
Tab Button {
	icon: boolean; 
	badge: boolean; 
	size: 'sm' | 'md'; 
	variant: '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09'; 
	state: 'Default' | 'Hover' | 'Active'; 
}, 
Store Badges {
	store: 'Google play' | 'App store' | 'Galaxy store' | 'Microsoft' | 'App gallery' | 'F-droid'; 
	style: 'Brand' | 'White outline' | 'Black outline'; 
}, 
Button Close {
	size: 'xs' | 'sm' | 'md' | 'lg'; 
	color: 'Primary' | 'Gray'; 
	state: 'Default' | 'Hover' | 'Focus'; 
}, 
Button with Icon Only {
	change icon: ReactNode; 
	size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'; 
	type: 'Primary' | 'Secondary' | 'Tertiary'; 
	state: 'Default' | 'Hover' | 'Click' | 'Focus' | 'Disabled'; 
}, 
Input {
	input text: string; 
	hint text: string; 
	input placeholder: string; 
	icon swap before: ReactNode; 
	label text: string; 
	icon swap after: ReactNode; 
	icon before: boolean; 
	icon after: boolean; 
	hint: boolean; 
	label: boolean; 
	state: 'Default' | 'Hover' | 'Filled' | 'Focus' | 'Disabled' | 'Error'; 
	variant: 'Default' | 'Phone number' | 'Amount' | 'Website' | 'Card'; 
}, 
Checkbox {
	checked: 'False' | 'True'; 
	size: 'sm' | 'md' | 'lg'; 
	state: 'Default' | 'Hover' | 'Click' | 'Focus' | 'Disabled' | 'Error'; 
	indeterminate: 'False' | 'True'; 
}, 
Checkbox Label {
	label: boolean; 
	description text: string; 
	label text: string; 
	description: boolean; 
	size: 'sm' | 'md' | 'lg'; 
	state: 'Default' | 'Hover' | 'Click' | 'Focus' | 'Disabled' | 'Error'; 
	checked: 'False' | 'True'; 
	indeterminate: 'False' | 'True'; 
}, 
Radio Button {
	size: 'sm' | 'md'; 
	state: 'Default' | 'Hover' | 'Click' | 'Focus' | 'Disabled' | 'Error'; 
	checked: 'True' | 'False'; 
}, 
Radio Button Group {
	info 1: string; 
	icon: ReactNode; 
	info 2: string; 
	subtext 1: string; 
	option 3: string; 
	extra 2: string; 
	option 1: string; 
	info 3: string; 
	extra 1: string; 
	extra 3: string; 
	option 2: string; 
	subtext 3: string; 
	subtext 2: string; 
	text 2: string; 
	text 3: string; 
	text 1: string; 
	variant: 'List with description' | 'List verticle' | 'List horizontal' | 'List with inline description' | 'List with radio on right' | 'Simple list with radio on right' | 'Stacked cards 01' | 'Stacked cards 02' | 'Cards'; 
	size: 'sm' | 'md'; 
}
} 
