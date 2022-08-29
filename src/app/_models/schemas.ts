export class UserSuo{
	id ?:string;
	name?:string;
	dlt ?:Date;

	constructor(id: string, name: string, dlt: Date) {
		this.id = id;
		this.name = name;
		this.dlt = dlt;
	}
}

export class TopicParameter {
	topicId:number;
	topicName : string;
	priorityId : Priorities;
	prefix : string;
	users : UserSuo[];
	dlt : Date;

	constructor(topicId: number, topicName: string, priorityId: Priorities, prefix: string, users: UserSuo[], dlt: Date) {
		this.topicId = topicId;
		this.topicName = topicName;
		this.priorityId = priorityId;
		this.prefix = prefix;
		this.users = users;
		this.dlt = dlt;
	}
}
export class Priorities{
	groupPriority ?: number
	id ?: number
	name ?: string
	whenAdd ?: Date;
	whoAdd ?: number

	constructor(groupPriority: number, id: number, name: string, whenAdd: Date, whoAdd: number) {
		this.groupPriority = groupPriority;
		this.id = id;
		this.name = name;
		this.whenAdd = whenAdd;
		this.whoAdd = whoAdd;
	}
}

export class VideoForSuo{
	//ид
	videoId: number
	// название
	name: string
	//громкость
	data: string
	// onOff
	isActive: number

	dlt: string
	// абонентский отдел
	activeOperationPoints: number[]
	whenAdd ?: Date;
	whoAdd ?: number

	constructor(videoId: number, name: string, data: string, isActive: number, dlt: string, activeOperationPoints: number[]) {
		this.videoId = videoId;
		this.name = name;
		this.data = data;
		this.isActive = isActive;
		this.dlt = dlt;
		this.activeOperationPoints = activeOperationPoints;
	}
}

//модель тем обращений
export class Topic{
	topicId: number;
	topicName: string;
	userName: string;
	userId: number;
	priority_Id: number;
	prefix: string;
	dlt: string;
	who_add:string;
	when_add:Date;

	constructor(topicId: number, topicName: string, userName: string, userId: number, priority_Id: number, prefix: string, dlt: string, who_add: string, when_add: Date) {
		this.topicId = topicId;
		this.topicName = topicName;
		this.userName = userName;
		this.userId = userId;
		this.priority_Id = priority_Id;
		this.prefix = prefix;
		this.dlt = dlt;
		this.who_add = who_add;
		this.when_add = when_add;
	}
}

export class DebitDataTable {
	// ИД ДОКУМЕНТА
	ID: number;
	// ЛС
	ACC_PU: string;
	// АВАНС
	AVANS: number;
	// ДАТА НАЧАЛА ПЕРИОДА
	DATEB: Date | string;
	//ПЕРИОД ДОКУМЕНТА
	DATEB_: Date | string;
	//ДАТА ОКОНЧАНИЯ ПЕРИОДА
	DATEE_: Date | string;
	//РАСЧЕТНАЯ ДАТА
	DATER: Date | string;
	//ДОЛГ
	DOLG: number;
	//ДАТА СОЗДАНИЯ
	ENTRIED: Date | string;
	//ПОЛУЧАТЕЛЬ ЕПД
	FIO: string;
	//ИД ОБОРОТА
	KO: number;
	//НАИМЕНОВАНИЕ ОБОРОТА
	KO_NAME: string;
	//ФИО ОПЕРАТОРА, СОЗДАВШЕГО ДОКУМЕНТ
	NAME_USER: string;
	//ОСНОВАНИЕ
	NOTE: string;
	//ОПЕРАЦИОННЫЙ МЕСЯЦ
	OPMONTH: Date | string;
	// ПЕЕНЯ
	PENY: number;
	// ПЕНЯ НАЧИСЛЕННАЯ
	PENYNACH: number;
	// НАИМЕНОВАНИЕ УСЛУГИ
	SHORTNAME: string;
	//
	SM: number;
	// СУММА АВАНАС
	SMAVANS: number;
	// СУММА ДОЛГ
	SMDOLG: number;
	// СУММА ПЕНИ
	SMPENY: number;
	//
	SRV: number;
	// СТАВКА
	STAVKA: number;
	SUPP: string;
	SUPP_ID: number;
	// ИД ПОЛЬЗОВАТЕЛЯ
	WHO_ADD: number;

	constructor(ID: number, ACC_PU: string, AVANS: number, DATEB: Date | string, DATEB_: Date | string, DATEE_: Date | string, DATER: Date | string, DOLG: number, ENTRIED: Date | string, FIO: string, KO: number, KO_NAME: string, NAME_USER: string, NOTE: string, OPMONTH: Date | string, PENY: number, PENYNACH: number, SHORTNAME: string, SM: number, SMAVANS: number, SMDOLG: number, SMPENY: number, SRV: number, STAVKA: number, SUPP: string, SUPP_ID: number, WHO_ADD: number) {
		this.ID = ID;
		this.ACC_PU = ACC_PU;
		this.AVANS = AVANS;
		this.DATEB = DATEB;
		this.DATEB_ = DATEB_;
		this.DATEE_ = DATEE_;
		this.DATER = DATER;
		this.DOLG = DOLG;
		this.ENTRIED = ENTRIED;
		this.FIO = FIO;
		this.KO = KO;
		this.KO_NAME = KO_NAME;
		this.NAME_USER = NAME_USER;
		this.NOTE = NOTE;
		this.OPMONTH = OPMONTH;
		this.PENY = PENY;
		this.PENYNACH = PENYNACH;
		this.SHORTNAME = SHORTNAME;
		this.SM = SM;
		this.SMAVANS = SMAVANS;
		this.SMDOLG = SMDOLG;
		this.SMPENY = SMPENY;
		this.SRV = SRV;
		this.STAVKA = STAVKA;
		this.SUPP = SUPP;
		this.SUPP_ID = SUPP_ID;
		this.WHO_ADD = WHO_ADD;
	}
}

export class OfficeInfo{
	address:string;
	accpu: string;
	typeAccpu: string;
	dateAdd : Date| string;
	activated : string;
	srvName : string;
	srvNum : string;
	debt : number;
	prvName : string;

	constructor(address: string, accpu: string, typeAccpu: string, dateAdd: Date | string, activated: string, srvName: string, srvNum: string, debt: number, prvName: string) {
		this.address = address;
		this.accpu = accpu;
		this.typeAccpu = typeAccpu;
		this.dateAdd = dateAdd;
		this.activated = activated;
		this.srvName = srvName;
		this.srvNum = srvNum;
		this.debt = debt;
		this.prvName = prvName;
	}
}

export interface AddressType {
	city: string;
	street: string;
	house: string;
	flat: string;
}

export interface AbonentType {
	srvnum: string;
	account: string;
}

export interface LOVType {
	value: string;
	caption: string;
}
export interface ParameterType {
	name: string;
	value: string;
	readonly: string;
	lOV: LOVType[];
}

export interface PrivateOfficeAcc {
	group: string;
	id: number | null;
	hasCommission: boolean;
	type: string;
	parameters: ParameterType[];
	fineSum: string;
	commissionSum: string;
	orderSum: string;
	debt: string;
	srvName: string;
	prvName: string;
	address: AddressType;
	picture: string;
	status: number;
	abonent: AbonentType;
	activated: boolean;
	whenAdd: string | null;
}


export class FilterSource{
	field:string;
	source:ValueParameter[];

	constructor(field: string, source: ValueParameter[]) {
		this.field = field;
		this.source = source;
	}
}

export interface HistoryPreEntry {
	date_change:string | null;
	acc_old: string;
	acc_new: string;
	oper: string;
	user_name: string;
	when_block_old: string | null;
	when_block_new: string | null;
	note_blocked_old: string;
	note_blocked_new: string;
	who_blocked_old: string;
	who_blocked_new: string;
}
export interface SumDateEnov {
	summa: number;
	datePay: string;
}
export class AvaliableRecPreEntry {
	id: number;
	abonentPoint: string;
	address: string;
	recordDate: Date;
	countDemands: number;
	countWnd:number;

	constructor(id: number, abonentPoint: string, address: string, recordDate: Date, countDemands: number,countWnd:number) {
		this.id = id;
		this.abonentPoint = abonentPoint;
		this.address = address;
		this.recordDate = recordDate;
		this.countDemands = countDemands;
		this.countWnd=countWnd;
	}
}
export class PreEntry {
	abonentPoint: number;
	dateb: Date | string;
	operDay: Date| string;
	topic: number;
	demand: number | null;
	accpu: string;
	mail: string;
	phone: string;
	fIO: string;
	flagNoAccpu: number;

	constructor(abonentPoint: number, dateb: Date | string, operDay: Date | string, topic: number, demand: number | null, accpu: string, mail: string, phone: string, fIO: string, flagNoAccpu: number) {
		this.abonentPoint = abonentPoint;
		this.dateb = dateb;
		this.operDay = operDay;
		this.topic = topic;
		this.demand = demand;
		this.accpu = accpu;
		this.mail = mail;
		this.phone = phone;
		this.fIO = fIO;
		this.flagNoAccpu = flagNoAccpu;
	}
}
export class TimePreEntry {
	abonOtdel: string;
	timeRec: string;
	demand: number;

	constructor(abonOtdel: string, timeRec: string, demand: number) {
		this.abonOtdel = abonOtdel;
		this.timeRec = timeRec;
		this.demand = demand;
	}
}
export class DatePreEntry{
	day:Date;
	dayWeek:string;

	constructor(day: Date, dayWeek: string) {
		this.day = day;
		this.dayWeek = dayWeek;
	}
}
export interface AbonentsPoints {
	id: number;
	name: string;
	address: string;
}
export class AccountAction {
	account: number;
	abonent: number;
	acc_pu: string;
	list_accpu: string;

	constructor(account: number, abonent: number, acc_pu: string, list_accpu: string) {
		this.account = account;
		this.abonent = abonent;
		this.acc_pu = acc_pu;
		this.list_accpu = list_accpu;
	}
}
export class SearchFioPar{
	fio:string;
	acc_pu:string;

	constructor(fio: string, acc_pu: string) {
		this.fio = fio;
		this.acc_pu = acc_pu;
	}
}
export interface SearchFIO {
	abonent_id: string;
	acc_pu: string;
	fullname: string;
	address: string;
	status_name: string;
	typels_name: string;
	activate_acc_pu: string;
}

export interface AccountList {
	site_account: number;
	acc_pu: string;
	adr: string;
	when_add: string;
	when_blocked: string;
	demand_id: string;
	who_blocked: string;
	note_blocked: string;
	who_add: number;
	abonent: string;
	fio_abonent: string;
	user_add: string;
	user_block: string;
	type_name: string;
	telephone: string;
	status_name: string;
	el_epd: string;
	date_add_epd: string;
	note_epd: string;
	oper_add_epd: string;
	max_date_send_epd: string;
}
export  class AccountEdit
{
  login:string;
  mail :string;
  id : number;
  action :number;

	constructor(login: string, mail: string, id: number, action: number) {
		this.login = login;
		this.mail = mail;
		this.id = id;
		this.action = action;
	}
}
export  class SearchUserData{
	account_Status: string;
	id: string;
	login: string;
	mail: string;
	note_Blocked: string;
	number_Phone: string;
	user_Add: string;
	user_Blcok: string;
	when_Add:Date|string;
	when_Blocked: Date|string;
	last_Visite:Date|string;
	del_Mark:string;
}
//поиск по лс, тел, логин
export  class SearchUserParam{
	mail:string;
	login:string;
	name:string | null;
	surname:string | null;
	patronymic:string | null;
	phone:string;
	accpu:string;

	constructor(mail: string, login: string, name: string, surname: string, patronymic: string, phone: string, accpu: string) {
		this.mail = mail;
		this.login = login;
		this.name = name;
		this.surname = surname;
		this.patronymic = patronymic;
		this.phone = phone;
		this.accpu = accpu;
	}
}

export class QrReportParameter{
	linkData:string;
	result ?:number;
	accpu:string;
	address:string;
	id:number;
	srv:string;
	sum:number;

	constructor(linkData: string, result: number, accpu: string, address: string, id: number, srv: string, sum: number) {
		this.linkData = linkData;
		this.result = result;
		this.accpu = accpu;
		this.address = address;
		this.id = id;
		this.srv = srv;
		this.sum = sum;
	}
}

export class QrPayParameter{
	accpu:string;
	srv:number;
	sum:number;

	constructor(accpu: string, srv: number, sum: number) {
		this.accpu = accpu;
		this.srv = srv;
		this.sum = sum;
	}
}
export class UserInfo {
	version_Data_Base: string;
	name_Data_Base: string;
	month_Charge: string;
	userName: string;
	oracleName: string;
	edit_OperationPoint: string;
	edit_CurrCompany: string;
	userId: string;
	userOrg: string;
	password_Days: string;
	arm_Phone: string;
	agreement_User: string;

	constructor(version_Data_Base: string, name_Data_Base: string, month_Charge: string, userName: string, oracleName: string, edit_OperationPoint: string, edit_CurrCompany: string, userId: string, userOrg: string, password_Days: string, arm_Phone: string, agreement_User: string) {
		this.version_Data_Base = version_Data_Base;
		this.name_Data_Base = name_Data_Base;
		this.month_Charge = month_Charge;
		this.userName = userName;
		this.oracleName = oracleName;
		this.edit_OperationPoint = edit_OperationPoint;
		this.edit_CurrCompany = edit_CurrCompany;
		this.userId = userId;
		this.userOrg = userOrg;
		this.password_Days = password_Days;
		this.arm_Phone = arm_Phone;
		this.agreement_User = agreement_User;
	}
}
//класс для параметров регистрации обращений
export class DemandReg{
	accpu:string;
	typeofcall:number;

	constructor(accpu: string, typeCall: number) {
		this.accpu = accpu;
		this.typeofcall = typeCall;
	}
}
//класс наследник DemandReg на 1 поле больше
export class DemandRegSupp extends  DemandReg{
	supp:number;


	constructor(accpu: string, typeCall: number, supp: number) {
		super(accpu, typeCall);
		this.supp = supp;
	}
}

//результат возврата файла с сэд
export  class FileDirectum{
	file:string;
	ext:string;
	filename:string;
	id:number;

	constructor(file: string, ext: string, filename: string, id: number) {
		this.file = file;
		this.ext = ext;
		this.filename = filename;
		this.id = id;
	}
}
//callDemand
export class CallDemand{
	/**Абонентский отдел */
	abonOtd ?: number;
	/**Номер заявки */
	demand ?: number;
	//тип
	type :number;

	constructor(servicePoint: number, demand: number, type: number) {
		this.abonOtd = servicePoint;
		this.demand = demand;
		this.type = type;
	}
}


/// Установка окон для предварительной записи
export class SetWndPreEntry
{
	/// Отдел
	abonOtd:number;
	/// Дата
	dateWnd:string;
	/// Кол-во окон
	countWnd:number

	constructor(abonOtd: number, dateWnd: string, countWnd: number) {
		this.abonOtd = abonOtd;
		this.dateWnd = dateWnd;
		this.countWnd = countWnd;
	}
}
/**Класс параметров для получения данных предварительной записи */
export class PreEntryParameter {
	/**Абонентский отдел */
	servicePoint ?: number;
	/**Номер заявки */
	demand ?: number;
	/**Дата начала */
	dtb: Date;
	/**Дата окончания */
	dte ?: Date;

	constructor(servicePoint: number, demand: number, dtb: Date, dte: Date) {
		this.servicePoint = servicePoint;
		this.demand = demand;
		this.dtb = dtb;
		this.dte = dte;
	}
}
/**Окно завершить с переадресацией установка пакетных перемен pk_queue.wndprocesstransfer */
export class SetTransfer {
	/**Абонентский отдел */
	ServicePoint: number;
	/**Ссылка на пользователь (тот кто устанавливает) */
	User_Src: number;
	/**Пользователь на кого устанавливают */
	User_dst: number;
	/**Номер заявки */
	Demand: number;

	constructor(ServicePoint: number, User_Src: number, User_dst: number, Demand: number) {
		this.ServicePoint = ServicePoint;
		this.User_Src = User_Src;
		this.User_dst = User_dst;
		this.Demand = Demand;
	}
}
//модель параметры для отправки на сервер и получения списка операторов для передресации
export class Transfer {
	/**Абонентский отдел */
	ServicePoint: number;
	/**День установки */
	OperDay: Date | string;
	/**оператор соответствующей компетенции */
	RelevantOp: number;
	/**Активным операторам */
	ActiveOp: number;
	/**Возврат к предыдущему окну */
	ReturnWind: number;
	/**Тип темы  */
	Topic: number;
	/**Заявка */
	Demand: number;

	constructor(ServicePoint: number, OperDay: Date | string, RelevantOp: number, ActiveOp: number, ReturnWind: number, Topic: number, Demand: number) {
		this.ServicePoint = ServicePoint;
		this.OperDay = OperDay;
		this.RelevantOp = RelevantOp;
		this.ActiveOp = ActiveOp;
		this.ReturnWind = ReturnWind;
		this.Topic = Topic;
		this.Demand = Demand;
	}
}

/**Модель pk_queue.setlimittickets */
export class Ticket {
	/**Абонентский отдел */
	ServicePoint: number;
	/**День установки */
	OperDay: Date | string;
	/**Тема  */
	Topic: number;
	/**Значение лимита */
	Limit: number;

	constructor(ServicePoint: number, OperDay: Date | string, Topic: number, Limit: number) {
		this.ServicePoint = ServicePoint;
		this.OperDay = OperDay;
		this.Topic = Topic;
		this.Limit = Limit;
	}
}
/**Модель для пакета cn.make.korrectirovka_ins */
export class KorrektirovkaIns {
	Acc_pu_: string;
	FlagSrv: number | null;
	Dateb: Date | string | null;
	Note: string;
	ListCor: string;

	constructor(Acc_pu_: string, FlagSrv: number | null, Dateb: Date | string | null, Note: string, ListCor: string) {
		this.Acc_pu_ = Acc_pu_;
		this.FlagSrv = FlagSrv;
		this.Dateb = Dateb;
		this.Note = Note;
		this.ListCor = ListCor;
	}
}
/**Модель для пакета  cn.make.addtovip */
export class AddToVip {
	Acc_pu: string;
	/**Не обработанные ошибки */
	Notcheck: number;
	/**Поставщик */
	Supplier: number;
	/**Период */
	De: Date;
	/**Операция */
	Operation: number;
	/**Основание */
	Note: string;
	/**Подтвержадающий документ */
	ScanId ?: number;
	ListCor:string;


	constructor(Acc_pu: string, Notcheck: number, Supplier: number, De: Date, Operation: number, Note: string, ScanId: number, ListCor: string) {
		this.Acc_pu = Acc_pu;
		this.Notcheck = Notcheck;
		this.Supplier = Supplier;
		this.De = De;
		this.Operation = Operation;
		this.Note = Note;
		this.ScanId = ScanId;
		this.ListCor = ListCor;
	}
}
/// <summary>
/// Модель для пакета  cn.make.paywithkorrsumm$action
/// </summary>
export class PayWithKorrsumm {

	constructor(acc_pu_: string, newdb: Date, newde: Date, srv: number, note: string, listcor: string) {
		this.acc_pu_ = acc_pu_;
		this.newdb = newdb;
		this.newde = newde;
		this.srv = srv;
		this.note = note;
		this.listcor = listcor;
	}

	acc_pu_: string;
	newdb ?: Date ;
	newde ?: Date ;
	srv ?: number;
	note: string;
	listcor:string;
}
// тип диалога при запуске приложения
export enum TypeDialogForm {
	Company, /*выбор компании*/
	OperationPoint, /*выбор абонентского отдела*/
	WndQuene    /*выбор окна электронной очереди*/
}

//Модель для компонент Возвраты ЦН поиск
export class ReturnCnSearchParam {
	accpu: string;
	datee ?: Date ;
	dateb ?: Date ;
	dateofpay ?: Date ;
	ko ?: number | null;
	srv ?: number | null;

	constructor(accpu: string, datee: Date, dateb: Date, opmonth: Date, ko: number, srv: number) {
		this.accpu = accpu;
		this.datee = datee;
		this.dateb = dateb;
		this.dateofpay = opmonth;
		this.ko = ko;
		this.srv = srv;
	}
}


//Модель для пакета cashless_pay.cashless$pay_updaction3
export class PayUpdication3 {
	koname: number;
	idr: string;
	srv: string;
	acc_pu_: string;
	dateb : Date | string;
	summ: number;
	opmonth: Date | string;
	note : string;
	agname: number;
	supp_: number;
	unp_oper_: string;
	flag_: number;
	datee: Date | string;
	scanid_: number;
	apply_duty_: number;
	law_num_: string;

	constructor(koname: number, idr: string, srv: string, acc_pu_: string, dateb: Date | string, summ: number, opmonth: Date | string, note: string, agname: number, supp_: number, unp_oper_: string, flag_: number, datee: Date | string, scanid_: number, apply_duty_: number, law_num_: string) {
		this.koname = koname;
		this.idr = idr;
		this.srv = srv;
		this.acc_pu_ = acc_pu_;
		this.dateb = dateb;
		this.summ = summ;
		this.opmonth = opmonth;
		this.note = note;
		this.agname = agname;
		this.supp_ = supp_;
		this.unp_oper_ = unp_oper_;
		this.flag_ = flag_;
		this.datee = datee;
		this.scanid_ = scanid_;
		this.apply_duty_ = apply_duty_;
		this.law_num_ = law_num_;
	}
}
// модель для пакета cashless_pay.cashless$pay_updaction
export class PayUpdication extends  PayUpdication3{
	ch:string;
	bank:number;
	extract_date_:Date;

	constructor(koname: number, idr: string, srv: string, acc_pu_: string, dateb: Date | string, summ: number, opmonth: Date | string, note: string, agname: number, supp_: number, unp_oper_: string, flag_: number, datee: Date | string, scanid_: number, apply_duty_: number, law_num_: string, ch: string, bank: number, extract_date_: Date) {
		super(koname, idr, srv, acc_pu_, dateb, summ, opmonth, note, agname, supp_, unp_oper_, flag_, datee, scanid_, apply_duty_, law_num_);
		this.ch = ch;
		this.bank = bank;
		this.extract_date_ = extract_date_;
	}
}
//класс модель для пакета cashless_pay.cashpay_grpstat
export class GrpStat{
	ko:string;
	extract_date_:Date;
	status_:number;

	constructor(ko: string, extract_date_: Date, status_: number) {
		this.ko = ko;
		this.extract_date_ = extract_date_;
		this.status_ = status_;
	}
}
//класс параметров формы платежи цн
export class PayCnSearch{
	accpu:string;
	flag:string;
	note:string;
	dateBux?:Date;
	dateOp?: Date
	dateReal?: Date;

	constructor(accpu: string, flag: string, note: string, dateBux: Date, dateOp: Date, dateReal: Date) {
		this.accpu = accpu;
		this.flag = flag;
		this.note = note;
		this.dateBux = dateBux;
		this.dateOp = dateOp;
		this.dateReal = dateReal;
	}
}



//класс для параметров пакета cn.make.payundo_cash
export class CashPayUndo{
	IDAGENT_ :number
	NOTE_ : string
	FLAG_ : number
	ACC_PU_2_ :string
	SRV_ :number
	UNLOCK_ACCPU_ :number
	AGREED_PU_ :number
	SCANID_ :number
	DOC_ID_ :string

	constructor(IDAGENT_: number, NOTE_: string, FLAG_: number, ACC_PU_2_: string, SRV_: number, UNLOCK_ACCPU_: number, AGREED_PU_: number, SCANID_: number, DOC_ID_: string) {
		this.IDAGENT_ = IDAGENT_;
		this.NOTE_ = NOTE_;
		this.FLAG_ = FLAG_;
		this.ACC_PU_2_ = ACC_PU_2_;
		this.SRV_ = SRV_;
		this.UNLOCK_ACCPU_ = UNLOCK_ACCPU_;
		this.AGREED_PU_ = AGREED_PU_;
		this.SCANID_ = SCANID_;
		this.DOC_ID_ = DOC_ID_;
	}
}

export class PayUndoParam{
	DOCID_:number
	ACC_PU_:string
	DOCSUM_:number
	DOCDATEB_:Date
	DOCSRV_:number
	NOTE_:string
	PDOC_:number
	FULL_:number
	IDAGENT_:number
	UNLOCK_ACCPU_:number
	UNDOSUM_:number
	FINEFIRST_:number
	DOCDATEE_:Date
	AGREED_PU_:number
	SCANID_ :number

	constructor(DOCID_: number, ACC_PU_: string, DOCSUM_: number, DOCDATEB_: Date, DOCSRV_: number, NOTE_: string, PDOC_: number, FULL_: number, IDAGENT_: number, UNLOCK_ACCPU_: number, UNDOSUM_: number, FINEFIRST_: number, DOCDATEE_: Date, AGREED_PU_: number, SCANID_: number) {
		this.DOCID_ = DOCID_;
		this.ACC_PU_ = ACC_PU_;
		this.DOCSUM_ = DOCSUM_;
		this.DOCDATEB_ = DOCDATEB_;
		this.DOCSRV_ = DOCSRV_;
		this.NOTE_ = NOTE_;
		this.PDOC_ = PDOC_;
		this.FULL_ = FULL_;
		this.IDAGENT_ = IDAGENT_;
		this.UNLOCK_ACCPU_ = UNLOCK_ACCPU_;
		this.UNDOSUM_ = UNDOSUM_;
		this.FINEFIRST_ = FINEFIRST_;
		this.DOCDATEE_ = DOCDATEE_;
		this.AGREED_PU_ = AGREED_PU_;
		this.SCANID_ = SCANID_;
	}
}

export interface ReturnCnData {
	DOCSRV_: number;
	SRV_NAME_: string;
	DATEOP: Date | string;
	DOCDATEB_: any;
	DATEE: any;
	DOCSUM_: number;
	ACCPU_: string;
	IDSRV_: number;
	KO_: number;
	KO_NAME_: string;
	ORGNAME: string;
	KASSA: string;
	KASSIR: string;
	KVIT: number;
	DOCID_: number;
	PDOC_: number;
	STATUS: any;
	SUM_VOZV: any;
	T_PAY: number;
	UNP_OPER_: any;
	AGENT: any;
	ACC_PU_: string;
}

export class ReestrRecord {
	ACC_PU: string
	AGENT: string
	CONTRACT: string
	CONTRACTOR: string
	COUNT_CASH_PAY: number
	COUNT_DOCUMENTS: any
	DATE_PAY: string
	NAME_STATUS: string
	NUM_DOC: number
	PAID: number
	PAY_ID: number
	POSITION: number
	REE_ID: string
	STATUS_RECORD: number
	SUMM: number
	SUMM_CASH_PAY: any
	TARGET_PAY: string
}
export class ReestrParameter{
		/// <summary>
		/// Табличные значения, данные берется с клиента при клике на запись
		/// </summary>
	  	recRegId:string;
	   recAccpu:string;
	   recSumm:number;
	   recPosRecord:number;
	   recStatus:number;
	   recNumDoc:number;
	   recPayId:number;
	   recAgent:string;

	constructor(recRegId: string, recAccpu: string, recSumm: number, recPosRecord: number, recStatus: number, recNumDoc: number, recPayId: number, recAgent: string) {
		this.recRegId = recRegId;
		this.recAccpu = recAccpu;
		this.recSumm = recSumm;
		this.recPosRecord = recPosRecord;
		this.recStatus = recStatus;
		this.recNumDoc = recNumDoc;
		this.recPayId = recPayId;
		this.recAgent = recAgent;
	}
}
/// <summary>
/// Класс параметров с формы редактирования платежей
/// </summary>
export class ReestrPost {
	/**Ид строки */
	IdRow: string;
	/**Лицевой счет */
	Accpu: string;
	/**Услуга */
	Srv: string;
	/**Тип операции */
	Koname: string;
	/**Провести платеж */
	Flag: boolean;
	/**Оплата по судебному приказу (учитывать госпошлину) */
	ApplyDuty: boolean;
	/**Енов */
	Enov: string;
	/**Дата платежа */
	Opmonth: Date | string;
	/**Сумма платежа */
	Summ: number;
	/**Нач. дата периода платежа */
	Dateb: Date | string;
	/**Конечная дата периода платежа */
	Datee: Date | string;
	/**Поставщик */
	Supp: string;
	/**Основание */
	Note: string;
	/**Агент */
	Agent: string;
	/**Скан копия */
	Scan: number;
	/**Номер судебного приказа */
	LawNum: number;

	constructor(IdRow: string, Accpu: string, Srv: string, Koname: string, Flag: boolean, ApplyDuty: boolean, Enov: string, Opmonth: Date | string, Summ: number, Dateb: Date | string, Datee: Date | string, Supp: string, Note: string, Agent: string, Scan: number, LawNum: number) {
		this.IdRow = IdRow;
		this.Accpu = Accpu;
		this.Srv = Srv;
		this.Koname = Koname;
		this.Flag = Flag;
		this.ApplyDuty = ApplyDuty;
		this.Enov = Enov;
		this.Opmonth = Opmonth;
		this.Summ = Summ;
		this.Dateb = Dateb;
		this.Datee = Datee;
		this.Supp = Supp;
		this.Note = Note;
		this.Agent = Agent;
		this.Scan = Scan;
		this.LawNum = LawNum;
	}
}

//интерфейс для добавления абонента
//класс для пдф шапки таблицы отличие в том что добавляется группа колонки
export class HeaderPDF{
	title:string;
	field:string;
	type:string;
	header:string;
	group:string;

	constructor(title:string,field: string, type: string, header: string,group:string) {
		this.title = title;
		this.field = field;
		this.type = type;
		this.header = header;
		this.group = group;
	}
}
//параметры для субсидии расширенная
export class SubsidParameters {
	constructor(accpuList: string, dateBegin: string, recipient: string) {
		this.accpuList = accpuList;
		this.dateBegin = dateBegin;
		this.recipient = recipient;
	}
	accpuList: string;
	dateBegin ?: string;
	recipient ?: string;
}
// параметры для субсиди за период
export class SumpayParameters {
	constructor(accpu: string, d_in: string, d_out: string, recipient: number) {
		this.accpuList = accpu;
		this.dateBegin = d_in;
		this.dateEnd = d_out;
		this.recipient = recipient;
	}
	accpuList: string;
	dateBegin ?: string;
	dateEnd ?: string;
	recipient ?:number;
}

// класс для параметров удаления докуменов
export class ReversalDocParam{
	constructor(srv_list: string, note: string) {
		this.srv_list = srv_list;
		this.note = note;
	}
	srv_list:string;
	note:string;
}


// класс используется для получения шапки таблицы
export class HeaderTable{
	field:string;
	type:string;
	header:string;

	constructor(field: string, type: string, header: string) {
		this.field = field;
		this.type = type;
		this.header = header;
	}
}
export class Ipu{
	//услуга
	srv:string;
	//заводской номер
	ipuNum:string;
	//дата ввода в эксплатацию
	dateIpu:string;
	//тип прибора
	typeIpu:string;
	//показания на момент допуска
	indicationIpu:number;
	//место установки
	localIpu:string;
	//дата очередной проверки
	dateNextCheck:string;
	//произведена замена прибора
	isReplaced:boolean;
	//заводской номер снятый
	ipuNumTakeOf?:string;
	indicationIpuTakeOf?:number;

	constructor(srv: string, ipuNum: string, dateIpu: string, typeIpu: string, indicationIpu: number, localIpu: string, dateNextCheck: string, isReplaced: boolean, ipuNumTakeOf: string, indicationIpuTakeOf: number) {
		this.srv = srv;
		this.ipuNum = ipuNum;
		this.dateIpu = dateIpu;
		this.typeIpu = typeIpu;
		this.indicationIpu = indicationIpu;
		this.localIpu = localIpu;
		this.dateNextCheck = dateNextCheck;
		this.isReplaced = isReplaced;
		this.ipuNumTakeOf = ipuNumTakeOf;
		this.indicationIpuTakeOf = indicationIpuTakeOf;
	}
}

export class Sub {
	fio: string;
	reg: number;
	d_in: Date;
	d_out ?: Date;

	constructor(fio: string, reg: number, d_in: Date, d_out: Date) {
		this.fio = fio;
		this.reg = reg;
		this.d_in = d_in;
		this.d_out = d_out;
	}
}
export class Abonent {
	fio: string;
	d_in: Date;
	d_out ?: Date;

	constructor(fio: string, d_in: Date, d_out: Date) {
		this.fio = fio;
		this.d_in = d_in;
		this.d_out = d_out;
	}
}

export class FileConfiguration {
	more:boolean;
	add:boolean;
	camera:boolean;
	preview:boolean;
	cancel:boolean;

	constructor(more: boolean, add: boolean, camera: boolean, preview: boolean, cancel: boolean) {
		this.more = more;
		this.add = add;
		this.camera = camera;
		this.preview = preview;
		this.cancel = cancel;
	}
}

//Тип заявок/писем
export class LetterType {
	id:number;
	name?:string;
	alias?:string;
	Letter:boolean;
}

enum Orientation{
	horizontal = 'Horizontal',
	vertical = 'Vertical'
}
export interface Group {
	id:number;
	title?:string;
	fields:Field[];
}

export interface Field {
	// Название
	field?:string;
	// Заголовок
	header?:string;
	// Номер по порядку
	position:number;
	// Ориентация
	orientation:Orientation;
	// Флаг, указывающий что по полю надо посчитать сумму итога
	totalSum:boolean;
	//Тип колонки
	type?:string;
}

export interface QueryForm {
	// Флаг, указывающий наличие итоговой строки
	totalString:boolean;
	groups:Group[]
}
// Значения списковых параметров
export interface ValueParameter {
	id?:string;
	name?:string;
}
//Параметр действия
export interface ActionParameter {
	//Флаг редактируемости
	enable:boolean;
	//Флаг обязательности заполнения
	required:boolean;
	//Идентификатор
	id:number;
	//Название
	name?:string;
	//Алиас
	alias?:string;
	//Тип
	type?:string;
	//Позиция по порядку
	position:number;
	//Флаг видимости
	visible:boolean;
	//Значение
	value:any;
	//Список значений
	values?:ValueParameter[];
	//Список зависимых параметров
	dependParam?:number[];
}
// Основные параметры для ограничения выборок в выписке формы обороты развернуты
export class TurnParams {
	/// Лицевой счет
	accpu: string;
	/// Начальная дата
	dateBegin ?: Date;
	/// Конечная дата
	dateEnd ?: Date;
	/// Расчетная дата
	dateCalculate ?: Date;

	constructor(accpu: string, dateBegin: Date, dateEnd: Date, dateCalculate: Date) {
		this.accpu = accpu;
		this.dateBegin = dateBegin;
		this.dateEnd = dateEnd;
		this.dateCalculate = dateCalculate;
	}
}
// Основные параметры для ограничения выборок в выписке формы обороты развернуты с доп. атрибутами
export class TurnParsChild extends TurnParams{
	idMainSQL:number;
	idMainKO:number;

	constructor(accpu: string, dateBegin: Date, dateEnd: Date, dateCalculate: Date, idMainSQL: number, idMainKO: number) {
		super(accpu, dateBegin, dateEnd, dateCalculate);
		this.idMainSQL = idMainSQL;
		this.idMainKO = idMainKO;
	}
}
//Заголвки таблицы для основной выписки
export class FieldMainStatement
{
	/// номер поля
	private _field:string;
	/// текст поля
	private _header:string;
	/// тип поля
	private _type:string;

	get field(): string {
		return this._field;
	}

	set field(value: string) {
		this._field = value;
	}

	get header(): string {
		return this._header;
	}

	set header(value: string) {
		this._header = value;
	}

	get type(): string {
		return this._type;
	}

	set type(value: string) {
		this._type = value;
	}

	constructor(field: string, header: string, type: string) {
		this._field = field;
		this._header = header;
		this._type = type;
	}
}
///класс перерасчета за период
export class Recalculation{

	constructor(Idtarif: number, Tarif: number, docchargeid_: number, Acc_pu_: string, Summ: number, Ko: number, Opmonth: Date, Dateb: Date, Datee: Date, Note: string, Typeko: string, Err: string, Parval: number, Koname: string, Srvname: string, Srv: number, Supp: number, Supp_name: string, charge_ok: string, Status: string, Whoadd: string, Whenadd: Date) {
		this._Idtarif = Idtarif;
		this._Tarif = Tarif;
		this._docchargeid_ = docchargeid_;
		this._Accpu = Acc_pu_;
		this._Summ = Summ;
		this._Ko = Ko;
		this._Opmonth = Opmonth;
		this._Dateb = Dateb;
		this._Datee = Datee;
		this._Note = Note;
		this._Typeko = Typeko;
		this._Err = Err;
		this._Parval = Parval;
		this._Koname = Koname;
		this._Srvname = Srvname;
		this._Srv = Srv;
		this._Supp = Supp;
		this._Supp_name = Supp_name;
		this._charge_ok = charge_ok;
		this._Status = Status;
		this._Whoadd = Whoadd;
		this._Whenadd = Whenadd;
	}

	get Idtarif(): number {
		return this._Idtarif;
	}

	set Idtarif(value: number) {
		this._Idtarif = value;
	}

	get Tarif(): number {
		return this._Tarif;
	}

	set Tarif(value: number) {
		this._Tarif = value;
	}

	get docchargeid_(): number {
		return this._docchargeid_;
	}

	set docchargeid_(value: number) {
		this._docchargeid_ = value;
	}

	get Accpu(): string {
		return this._Accpu;
	}

	set Accpu(value: string) {
		this._Accpu = value;
	}

	get Summ(): number {
		return this._Summ;
	}

	set Summ(value: number) {
		this._Summ = value;
	}

	get Ko(): number {
		return this._Ko;
	}

	set Ko(value: number) {
		this._Ko = value;
	}

	get Opmonth(): Date {
		return this._Opmonth;
	}

	set Opmonth(value: Date) {
		this._Opmonth = value;
	}

	get Dateb(): Date {
		return this._Dateb;
	}

	set Dateb(value: Date) {
		this._Dateb = value;
	}

	get Datee(): Date {
		return this._Datee;
	}

	set Datee(value: Date) {
		this._Datee = value;
	}

	get Note(): string {
		return this._Note;
	}

	set Note(value: string) {
		this._Note = value;
	}

	get Typeko(): string {
		return this._Typeko;
	}

	set Typeko(value: string) {
		this._Typeko = value;
	}

	get Err(): string {
		return this._Err;
	}

	set Err(value: string) {
		this._Err = value;
	}

	get Parval(): number {
		return this._Parval;
	}

	set Parval(value: number) {
		this._Parval = value;
	}

	get Koname(): string {
		return this._Koname;
	}

	set Koname(value: string) {
		this._Koname = value;
	}

	get Srvname(): string {
		return this._Srvname;
	}

	set Srvname(value: string) {
		this._Srvname = value;
	}

	get Srv(): number {
		return this._Srv;
	}

	set Srv(value: number) {
		this._Srv = value;
	}

	get Supp(): number {
		return this._Supp;
	}

	set Supp(value: number) {
		this._Supp = value;
	}

	get Supp_name(): string {
		return this._Supp_name;
	}

	set Supp_name(value: string) {
		this._Supp_name = value;
	}

	get charge_ok(): string {
		return this._charge_ok;
	}

	set charge_ok(value: string) {
		this._charge_ok = value;
	}

	get Status(): string {
		return this._Status;
	}

	set Status(value: string) {
		this._Status = value;
	}

	get Whoadd(): string {
		return this._Whoadd;
	}

	set Whoadd(value: string) {
		this._Whoadd = value;
	}

	get Whenadd(): Date {
		return this._Whenadd;
	}

	set Whenadd(value: Date) {
		this._Whenadd = value;
	}

	private _Idtarif:number;
	private _Tarif:number;
	private _docchargeid_:number;
	private _Accpu:string;
	private _Summ:number;
	private _Ko :number;
	private _Opmonth :Date;
	private _Dateb :Date;
	private _Datee :Date;
	private _Note:string
	private _Typeko :string;
	private _Err :string
	private _Parval:number;
	private _Koname : string;
	private _Srvname :string;
	private _Srv:number;
	private _Supp :number;
	private _Supp_name :string;
	private _charge_ok :string
	private _Status :string;
	private _Whoadd :string;
	private _Whenadd :Date;

}

/// <summary>
/// Дебиторский счет задолженность
/// </summary>
export interface AccountReceivable
{
	Acc_pu:string;
	Koname:string;
	Dateb:Date;
	Opmonth : Date;
	ID:number;
	Summ : number;
}

export class AccountReceivableParameter
{
	constructor(Accpusrc: string, Accpudst: string, Actualdate: Date, Dolgdateb: Date, Dolgdatee: Date, Srv: number, Supp: number, Note: string, Scanid: number, Printkvt: any) {
		this.Accpusrc = Accpusrc;
		this.Accpudst = Accpudst;
		this.Actualdate = Actualdate;
		this.Dolgdateb = Dolgdateb;
		this.Dolgdatee = Dolgdatee;
		this.Srv = Srv;
		this.Supp = Supp;
		this.Note = Note;
		this.Scanid = Scanid;
		this.Printkvt = Printkvt;
	}
	// Лицевой счет
	Accpusrc:string;
	//Дебиторский лицевой счет
	Accpudst:string;
	Actualdate:Date;
	Dolgdateb:Date;
	Dolgdatee:Date;
	//Услуга  передается id услуги
	Srv:number;
	//Поставщик
	Supp:number;
	Note:string;
	Scanid:number;
	Printkvt:any;
}
//форма действие -> перерасчет лц
export class RecalculationParameter {
	constructor(accpu: string, dateBegin: Date, dateEnd: Date) {
		this.accpu = accpu;
		this.dateBegin = dateBegin;
		this.dateEnd = dateEnd;
	}
	accpu:string;
	dateBegin:Date;
	dateEnd:Date;
}

/// <summary>
/// параметры начисления для получения таблицы субтарифа
/// </summary>
export class AccrualsIn
{
	constructor(Accpu: string, Id: number, Srv: number, Dateb: Date) {
		this.Accpu = Accpu;
		this.Id = Id;
		this.Srv = Srv;
		this.Dateb = Dateb;
	}

	/// <summary>
	/// Передается TARIF_ID
	/// </summary>
	Accpu:string;
	/// <summary>
	/// Передается TARIF_ID
	/// </summary>
	Id :number;
	/// <summary>
	/// SRV услуга
	/// </summary>
	Srv:number;
	/// <summary>
	/// Data Begin
	/// </summary>
	Dateb:Date;
}

export  class ArchSprIn {
	accpu:string;
	dateBegin?:Date;
	dateEnd?:Date;
	idSpr ?:number;

	constructor(accpu: string, dateBegin: Date, dateEnd: Date, idSpr: number) {
		this.accpu = accpu;
		this.dateBegin = dateBegin;
		this.dateEnd = dateEnd;
		this.idSpr = idSpr;
	}
}

export class TaskPeny{
	codeRule ?:number;
	accpu:string;
	dateB:Date;
	dateE?:Date;
	summa:number;
	note:string;
	srv ?:string;
	dateEndRule:Date;
	supp ?:string;
	scanId:number;
	status:number;

	constructor(codeRule: number, accpu: string, dateBegin: Date, dateEnd: Date, summa: number, note: string, srv: string, dataEndRule: Date, supp: string, scanid: number, status: number) {
		this.codeRule = codeRule;
		this.accpu = accpu;
		this.dateB = dateBegin;
		this.dateE = dateEnd;
		this.summa = summa;
		this.note = note;
		this.srv = srv;
		this.dateEndRule = dataEndRule;
		this.supp = supp;
		this.scanId = scanid;
		this.status = status;
	}

}

export class ReturnSum{
	accpu:string;
	summ:number;
	srv:number;
	dateBegin:Date;
	agent:number;
	note:string;
	agreed:number;
	scanid:number;

	constructor(accpu: string, summ: number, srv: number, dateBegin: Date, agent: number, note: string, agreed: number, scanid: number) {
		this.accpu = accpu;
		this.summ = summ;
		this.srv = srv;
		this.dateBegin = dateBegin;
		this.agent = agent;
		this.note = note;
		this.agreed = agreed;
		this.scanid = scanid;
	}
}
//класс проверки права доступа
export class RuleObjView {
	sub:string;
	subType:string;
	subValue:string;

	constructor(sub: string, subType: string, value: string) {
		this.sub = sub;
		this.subType = subType;
		this.subValue = value;
	}
}

//класс редактирования разделителей
export class EditSeparator {
	bk_house : string ;
	ek_house : string ;
	bl_house : string ;
	el_house : string ;

	constructor(bk_house: string, ek_house: string, bl_house: string, el_house: string) {
		this.bk_house = bk_house;
		this.ek_house = ek_house;
		this.bl_house = bl_house;
		this.el_house = el_house;
	}
}
export class SrpNoDeptParameter{
	accpu :string;
	abon_id:number;
	dateb:Date;
	date:Date;
	srv : string;
	status ?:number;
	fio_d ?:string;
	vkr ?:string;

	constructor(accpu: string, abon_id: number, dateb: Date, date: Date, srv: string, status: number, fio_d: string, vkr: string) {
		this.accpu = accpu;
		this.abon_id = abon_id;
		this.dateb = dateb;
		this.date = date;
		this.srv = srv;
		this.status = status;
		this.fio_d = fio_d;
		this.vkr = vkr;
	}
}
//Модель для отображения таблицы корректировки
export class KorrektHeader extends HeaderTable{
	isVisible:boolean;

	constructor(field: string, type: string, header: string, isVisible: boolean) {
		super(field, type, header);
		this.isVisible = isVisible;
	}
}
export class DebitorDataAndDecoding {
	dataBasic: any[];
	headerBasic: HeaderTable[];
	dataDecoding: any[];
	headerDecoding: HeaderTable[];

	constructor(dataBasic: any[], headerBasic: HeaderTable[], dataDecoding: any[], headerDecoding: HeaderTable[]) {
		this.dataBasic = dataBasic;
		this.headerBasic = headerBasic;
		this.dataDecoding = dataDecoding;
		this.headerDecoding = headerDecoding;
	}
}
/// для основной таблицы дебиторской выписки
export class DebitorBasicData {
	KO: number;
	SUPP_ID: number;
	SUPP: string;
	SMDOLG: number;
	SMAVANS: number;
	SMPENY: number;
	SHORTNAME: string;
	DATER: string;
	STAVKA: number;
	ADR: string;
	FIO: string;
	USERFIO: string;
	ACC_PU: string;
	DATEB_: string;
	DATEE_: string;
	SRV: number;
	DATEB: string;
	OPMONTH: string;
	DOLG: number;
	AVANS: number;
	SM: number;
	PENYNACH: number;
	PENY: number;
	NOTE: string;

	constructor(KO: number, SUPP_ID: number, SUPP: string, SMDOLG: number, SMAVANS: number, SMPENY: number, SHORTNAME: string, DATER: string, STAVKA: number, ADR: string, FIO: string, USERFIO: string, ACC_PU: string, DATEB_: string, DATEE_: string, SRV: number, DATEB: string, OPMONTH: string, DOLG: number, AVANS: number, SM: number, PENYNACH: number, PENY: number, NOTE: string) {
		this.KO = KO;
		this.SUPP_ID = SUPP_ID;
		this.SUPP = SUPP;
		this.SMDOLG = SMDOLG;
		this.SMAVANS = SMAVANS;
		this.SMPENY = SMPENY;
		this.SHORTNAME = SHORTNAME;
		this.DATER = DATER;
		this.STAVKA = STAVKA;
		this.ADR = ADR;
		this.FIO = FIO;
		this.USERFIO = USERFIO;
		this.ACC_PU = ACC_PU;
		this.DATEB_ = DATEB_;
		this.DATEE_ = DATEE_;
		this.SRV = SRV;
		this.DATEB = DATEB;
		this.OPMONTH = OPMONTH;
		this.DOLG = DOLG;
		this.AVANS = AVANS;
		this.SM = SM;
		this.PENYNACH = PENYNACH;
		this.PENY = PENY;
		this.NOTE = NOTE;
	}
}
// для расшифровки дебиторской выписки
export class DebitorDecoding {
	ID: number;
	KO: number;
	KO_NAME: string;
	ENTRIED: string;
	WHO_ADD: string;
	SUMM: number;
	NOTE_DOC: string;
	SRV: number;
	DATEB: string;
	OPMONTH: string;

	constructor(ID: number, KO: number, KO_NAME: string, ENTRIED: string, WHO_ADD: string, SUMM: number, NOTE_DOC: string, SRV: number, DATEB: string, OPMONTH: string) {
		this.ID = ID;
		this.KO = KO;
		this.KO_NAME = KO_NAME;
		this.ENTRIED = ENTRIED;
		this.WHO_ADD = WHO_ADD;
		this.SUMM = SUMM;
		this.NOTE_DOC = NOTE_DOC;
		this.SRV = SRV;
		this.DATEB = DATEB;
		this.OPMONTH = OPMONTH;
	}
}
/// для отображения на форме
export class DebitorTableData {
	DATEB:Date;
	OPMONTH:Date;
	SHORTNAME : string
	DOLG : number;
	AVANS : number;
	PENYNACH : number;
	PENY : number;
	NOTE : string;
	SUPP : string;
	DECODING : DebitorDecoding[];

	constructor(DATEB: Date, OPMONTH: Date, SHORTNAME: string, DOLG: number, AVANS: number, PENYNACH: number, PENY: number, NOTE: string, SUPP: string, DECODING: DebitorDecoding[]) {
		this.DATEB = DATEB;
		this.OPMONTH = OPMONTH;
		this.SHORTNAME = SHORTNAME;
		this.DOLG = DOLG;
		this.AVANS = AVANS;
		this.PENYNACH = PENYNACH;
		this.PENY = PENY;
		this.NOTE = NOTE;
		this.SUPP = SUPP;
		this.DECODING = DECODING;
	}
}
