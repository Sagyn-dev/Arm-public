import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AccountInfo} from "@app/_models/account";
import { BehaviorSubject } from "rxjs";
import { QueueService } from '@app/_services/queue.service';
import {ValueParameter} from "@app/_models/schemas";



@Injectable({ providedIn: 'root' })
export class AccountService {
	   //@chSelectSave переменная для отслеживания сохранения
		private chSelectSave: boolean;
		//получаем массив аккаунтов из search-address
		private _account: AccountInfo[];
		//выбранный лицевой счет
		accInfo: BehaviorSubject<AccountInfo> = new BehaviorSubject<AccountInfo>(null);
		//сохранение в сервис
		setaccInfo(accountInfo: AccountInfo) {
			this.accInfo.next(accountInfo);
			//сохранение в очереди
			if(accountInfo != null){
				this.queueAccountService.setQueueAccount(accountInfo.accpu);
			}
		}

	constructor(private http: HttpClient, public queueAccountService: QueueService) { }

		get account(): AccountInfo[] {
			return this._account;
		}

		set account(value: AccountInfo[]) {
			this._account = value;
		}


	 getChSelectSave():boolean{
		if(this.chSelectSave != undefined){
			return this.chSelectSave;
		}else {
			return true;
		}
	}

	 setChSelectSave(value:boolean){
		this.chSelectSave =value;
	}

	/// <summary>
	/// Получение информации о лицевом счете
	/// </summary>
	getAccountInfo(value:string) {
		if(value !== null){
			return this.http.get<AccountInfo>(`${environment.apiUrl}/api/Account/info/${value}`);
		}
	}
	/// <summary>
	/// Получение списка лицевых счетов по квартире
	/// </summary>
	getSearchByFlat(flatId:number) {
		return this.http.get<AccountInfo[]>(`${environment.apiUrl}/api/Account/searchbyflat/${flatId}`);
	}
	// <summary>
	/// Получение списка лицевых счетов по дому
	/// </summary>
	getSearchByHouse(houseId:number) {
		return this.http.get<AccountInfo[]>(`${environment.apiUrl}/api/Account/searchbyhouse/${houseId}`);
	}
	/// <summary>
	///Получение списка всех лицевых счетов из квартиры определенного лицевого счета
	/// </summary>
	getFlatAccs(accp:string) {
		return this.http.get<ValueParameter[]>(`${environment.apiUrl}/api/Account/flataccs/${accp}`);
	}

	/// <summary>
	///Получение списка вкр по лс
	/// </summary>
	getVkrAccpu(accpu:string) {
		return this.http.get<AccountInfo[]>(`${environment.apiUrl}/api/Account/get-accpu-vkr/${accpu}`);
	}
	/// <summary>
	///Получение списка вкр по лс
	/// </summary>
	getKvtAccpu(accpu:string) {
		return this.http.get<AccountInfo[]>(`${environment.apiUrl}/api/Account/get-accpu-kvt/${accpu}`);
	}
}
