export class ConvertType {
	constructor(public id: number,
		public name: string,
		public type: FileType,
		public description?: string,
		public action?: string,
		public processed?: boolean,
		public colNo?: number,
		public recNo?: number
		) { }
}

export enum FileType {
	Excel = "Excel",
	TXT = "TXT",
	XML = "XML",
	DBF = "DBF"
}
export enum ConvertStatus
{
	/// <summary>
	/// Принято к обработке
	/// </summary>
	Accepted = "Принято к обработке",
	/// <summary>
	/// Обработано
	/// </summary>
	Processed = "Обработано",
	/// <summary>
	/// Обработано с ошибками
	/// </summary>
	ProcessedWithErrors = "Обработано с ошибками",
	/// <summary>
	/// На обработку
	/// </summary>
	ForProcessing = "На обработку",
	/// <summary>
	/// Обрабатывается
	/// </summary>
	Processing = "Обрабатывается",
	/// <summary>
	/// Загружается
	/// </summary>
	Loading = "Загружается",
	/// <summary>
	/// Загружено с ошибками
	/// </summary>
	LoadedWithErrors = "Загружено с ошибками"
}
export enum ConvertProcessStatus
{
	/// <summary>
	/// Активен
	/// </summary>
	Active = "Активен",
	/// <summary>
	/// Завершен
	/// </summary>
	Completed = "Завершен",
}
export class ConvertRee {
	constructor(public id: number, public name: string, public whenAdd: Date, public whoAdd: string, public type: ConvertType, public status: ConvertStatus, public processStatus?:ConvertProcessStatus){}
}
export class ConvertReeStatistic {
	constructor(public attribute: string, public value: string) {}
}
export class ConvertFilter{
	constructor(public dateBegin?: Date, public dateEnd?: Date, public onlyMy?:boolean) {}
}
export class ConvertField{
	constructor(public id: number, public position: number, public name: string, public value: string, public whenAdd: Date, public status: ConvertStatus, public error?:string){}
}
export class ConvertGridColumn {
	constructor(public field: string, public header: string){}
}

export class UploadResult {
	constructor(public id: number, public count: number){}
}
