import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AccountInfo} from "@app/_models/account";

@Injectable({ providedIn: 'root' })

export class QueueService {
	constructor(private http: HttpClient) { }

	/// <summary>
	/// Получение очереди лицевого счета
	/// </summary>
	getQueueAccount() {
		return this.http.get<AccountInfo[]>(`${environment.apiUrl}/api/Account/queue/`);
	}
	/// <summary>
	/// Добавление лицевого счета в очередь
	/// </summary>
	setQueueAccount(accp:string){
		return this.http.post(`${environment.apiUrl}/api/Account/queue/${accp}`,'').subscribe();
	}
}
