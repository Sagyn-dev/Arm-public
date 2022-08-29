import { Parameter } from './report';
export enum SortType {
	GroupName = "GroupName",
	Position = "Position"
}
export enum ActionScheme
	{
		/// <summary>
		/// Параметры из таблицы action$parameter
		/// </summary>
		Action = "Action",
		/// <summary>
		/// Параметры из arm_v$params
		/// </summary>
		Statement = "Statement",
		/// <summary>
		/// Параметры из report$params
		/// </summary>
		Report = "Report",
		/// <summary>
		/// Параметры из letter$type_fields
		/// </summary>
		Letter = "Letter"
	}
export class ActionParameterGroup {
	constructor(
		public name?: string,
		public position?: number,
		public parameters?: Parameter[],
	){};
}
export class ActionOptions {
	constructor(
		public action: string,
		public sortType: SortType,
		public actionScheme: ActionScheme,
		public groups?:ActionParameterGroup[]
	){};
}
