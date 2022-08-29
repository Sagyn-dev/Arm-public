/**адрес ид */
export class AddressId {
	/**Ид типа населения  */
	idTypeCity: number;
	/**Ид  населения  */
	idCity: number;
	/**Ид типа улицы  */
	idTypeStreet: number;
	/**Ид улицы  */
	idStreet: number;
	/**Ид дома */
	idHouse: number;
	/**Ид квартиры */
	idflat: number;


	constructor(idTypeCity: number, idCity: number, idTypeStreet: number, idStreet: number, idHouse: number, idflat: number) {
		this.idTypeCity = idTypeCity;
		this.idCity = idCity;
		this.idTypeStreet = idTypeStreet;
		this.idStreet = idStreet;
		this.idHouse = idHouse;
		this.idflat = idflat;
	}
}

/// <summary>
/// Типы населённых пунктов
/// </summary>
export interface CityType {
	/// <summary>
	/// Идентификатор типа
	/// </summary>
	id: number;
	/// <summary>
	/// Название типа
	/// </summary>
	name: string;
}

/// <summary>
/// Населенный пункт
/// </summary>
export interface City {
	/// <summary>
	/// Идентификатор населённого пункта
	/// </summary>
	id: number;
	/// <summary>
	/// Название населённого пункта
	/// </summary>
	name: string;
	/// <summary>
	/// Тип населённого пункта
	/// </summary>
	type: CityType;
}

/// <summary>
/// Типы улиц
/// </summary>
export interface StreetType {
	/// <summary>
	/// Идентификатор типа
	/// </summary>
	id: number;
	/// <summary>
	/// Название типа
	/// </summary>
	name: string;
}

/// <summary>
/// Улица
/// </summary>
export interface Street {
	/// <summary>
	/// Идентификатор улицы
	/// </summary>
	id: number;
	/// <summary>
	/// Название улицы
	/// </summary>
	name: string;
	/// <summary>
	/// Тип улицы
	/// </summary>
	type: StreetType;
	/// <summary>
	/// Населенный пункт
	/// </summary>
	city: City;
}
/// <summary>
/// Адрес дома
/// </summary>
export interface House {
	/// <summary>
	/// Улица
	/// </summary>
	street: Street;
	/// <summary>
	/// Номер дома
	/// </summary>
	house: string;
	/// <summary>
	/// Идентификатор дома
	/// </summary>
	id: number;
}
/// <summary>
/// Адрес в упрощенном варианте
/// </summary>
export interface FlatsByHouse {
	/// <summary>
	/// Дом
	/// </summary>
	house: House;
	/// <summary>
	/// Номер квартиры
	/// </summary>
	flat: string;
	/// <summary>
	/// Идентификатор квартиры
	/// </summary>
	id: number;
}


