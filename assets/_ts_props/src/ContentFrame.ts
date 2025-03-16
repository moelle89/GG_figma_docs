export interface ContentFrame {
	swapSlot: ReactNode; 
	contentRight: ReactNode; 
	contentCenter: ReactNode; 
	contentLeft: ReactNode; 
	contentDimm: boolean; 
	contentHeader: boolean; 
	grid: '1 Cell' | '2 Cells' | '3 Cells' | '4 Cells' | '2 Rows' | '2 Rows | 2 Cells each' | '2 Rows | 2 Cells 3 Cells' | '2 Rows | 3 Cells each' | '3 Rows'; 
}