export interface NavItem {
	id: number;
	name: string;
	alias:string;
	route?:string;
	type:TypeItem;
	childItems?: NavItem[];
}

enum TypeItem {
	ParamActionTableDisplay = "ParamActionTableDisplay",
	ParamTableDisplay="ParamTableDisplay",
	External="External",
	Other="Other"
}
