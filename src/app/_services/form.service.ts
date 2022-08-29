import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '@environments/environment';
import {
	AccountReceivableParameter,
	AccrualsIn,
	ArchSprIn,
	EditSeparator,
	QueryForm,
	Recalculation,
	RecalculationParameter,
	ReestrPost,
	ReestrParameter,
	ReturnSum,
	ReversalDocParam,
	RuleObjView,
	SrpNoDeptParameter,
	TaskPeny,
	TurnParams,
	PayUndoParam,
	CashPayUndo,
	PayCnSearch,
	PayUpdication3,
	PayUpdication,
	GrpStat,
	ReturnCnSearchParam,
	Ticket,
	Transfer,
	SetTransfer,
	PreEntryParameter,
	SetWndPreEntry,
	CallDemand,
	FileDirectum,
	UserInfo,
	ValueParameter,
	QrPayParameter,
	AccountEdit,
	AbonentsPoints,
	PreEntry,
	AvaliableRecPreEntry, DebitorDataAndDecoding,
} from '@app/_models/schemas';
import {ActionOptions, Parameter} from '@app/_models';
import {NavItem} from "@app/_models/nav-item";
import {BehaviorSubject} from "rxjs";
import {AccountInfo} from "@app/_models/account";

@Injectable({ providedIn: 'root' })
export class FormService {
	constructor(private http: HttpClient) { }
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////// Beshekenov
	//////// Statement
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	userInfo: BehaviorSubject<UserInfo> = new BehaviorSubject<UserInfo>(null);
	setUserInfo(val:UserInfo){
		this.userInfo.next(val);
	}
	//получение тарифа по услуге
	getQrTariffSrv(par:number){
		return this.http.get<number>(`${environment.statementUrl}/api/Form/qr-sum/${par}`);
	}
	qrExecute(par:QrPayParameter){
		return this.http.post(`${environment.statementUrl}/api/Form/qr-exec`,par);
	}
	//получение таблицы с данными для qr
	getQrDataTable(par:string){
		return this.http.get(`${environment.statementUrl}/api/Form/qr-search/${par}`);
	}
	//получение списка услу
	getQrSrvList(){
		return this.http.get<ValueParameter[]>(`${environment.statementUrl}/api/Form/qr-srv/`);
	}
	//получение элементов панели быстрого доступа
	getFastMenu(){
		return this.http.get<NavItem[]>(`${environment.statementUrl}/api/Form/fast-menu/`);
	}
}
