export interface AccountInfo {
	accpu?: string;
	address?: string;
	fio?: string;
	status?: string;
	type?: AccpuType;
}

enum AccpuType {
		DEAD ='Удаленный',
		SERVICES = 'служебный',
		CHST3 = 'Частный сектор теплоснабжение',
		KVT = 'Квартплатный',
		GARAG= 'Гаражный',
		DOMOFON = 'Домофонный',
		GARDEN = 'Садовый участок',
		KVT2 = 'квартплатный2',
		CSV = 'Для субсидий по квартплате',
		FOOD_SCHOOL = 'Школьное питание',
		KVT_DBT = 'Задолженость квартплатная',
		KAP_REM = 'счет взноса на капитальный ремонт',
		HOUSE = 'Лицевой счет дома',
		LS_NORM_UP2 = 'Повышающий коэффициент ХВС для иного собственника',
		GOSPOSH = 'Госпошлина',
		NOT_SETTLED_DEBT = 'Счет неурегулированной  задолженности',
		ОКТК = 'Лицевой счет ОКТК - теплоснабжение',
		KVT_POLIV  = 'полив',
		RIC = 'Для модуля РИЦ',
		NO_LIFE = 'Нежилое помещение',
		PROTECT = 'Лицевой счет ИС "Защита"',
}


