export enum applicationType
	{
		/// <summary>
		/// Форма, не действующая в АРМ Выписка
		/// </summary>
		DisableSatement = 'DisableSatement',
		/// <summary>
		/// АРМ Выписка
		/// </summary>
		Statement = 'Statement',
		/// <summary>
		/// Центр начислений - История изменений
		/// </summary>
		History = 'History',
		/// <summary>
		/// АРМ Администратор
		/// </summary>
		Admin = 'Admin',
		/// <summary>
		/// АРМ Центр начислений
		/// </summary>
		CN = 'CN',
		/// <summary>
		/// Субсидии
		/// </summary>
		Subsidies = "Subsidies",
		/// <summary>
		/// АРМ Образование
		/// </summary>
		Education = 'Education',
		/// <summary>
		/// ИС "Защита" - Главное меню
		/// </summary>
		ProtectionMain = 'ProtectionMain',
		/// <summary>
		/// ИС "Защита" - Древовидное меню
		/// </summary>
		ProtectionTreelike = 'ProtectionTreelike',
		/// <summary>
		/// Не действующая форма
		/// </summary>
		Disable = 'Disable',
		/// <summary>
		/// АРМ "Информационная система"
		/// </summary>
		IS = 'IS',
		/// <summary>
		/// Арм "Архивы"
		/// </summary>
		Archive = 'Archive',
		/// <summary>
		/// АРМ "Претензионная работа"
		/// </summary>
		Claim = 'Claim',
		/// <summary>
		/// АРМ "Отчёты"
		/// </summary>
		Report = 'Report'
	}

/// <summary>
/// АРМ
/// </summary>
export class ARM
{
	constructor(
		public name: string,
		public type: applicationType,
		public route: string
	){};
}
