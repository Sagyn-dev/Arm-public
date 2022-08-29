export class Template {
	constructor(public id?: number, public title?: string, public report?: number) {}
}

export class Report {
	constructor(public id?: number, public title?: string, public templates?: Template[]) { }
}

export class Parameter {
	constructor(
		public id: number,
		public name: string,
		public alias: string,
		public type: string,
		public helptext:string,
		public value?: any,
		public position?: number,
		public visible?: boolean,
		public enable?: boolean,
		public required?: boolean,
		public values?: Value[],
		public dependParams?: number[],
		public loading?: boolean,
	){
		this.loading = false;
		this.visible = true;
		this.enable = true;
		this.required = false;
	}
}

export class Value {
	constructor(public id?: any, public name?: any){}
}

export class ReportVar {
	constructor(public name?: string, public value?: string, public canModify?:boolean){};
}

export class UserParam {
	constructor(public editVars?: boolean, public sendDirectum?: boolean, public directumAddress?:string){};
}

export class ReportOrder {
	constructor(
		public id?: number,
		public report?: number,
		public template?: number,
		public parameters?: Parameter[],
		public formats?: string[],
		public note?: string,
		public filename?: string,
		public emails?: string,
		public startDate?: Date,
		public notify?: boolean,
		public directumLink?: string,
		public reportVars?: ReportVar[],
		public userParams?: UserParam
	){};
}
