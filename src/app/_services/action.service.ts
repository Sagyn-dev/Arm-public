import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ActionParameterGroup, SortType, Value, Parameter, ActionScheme } from "@app/_models";

@Injectable({ providedIn: 'root' })
export class ActionService {
   constructor(private http: HttpClient) { }

	getParameters(action: string, sortType: SortType, actionScheme: ActionScheme){
		const params = new HttpParams()
			.set('sort', sortType)
			.set('action', action)
			.set('scheme', actionScheme);
		return this.http.get<ActionParameterGroup[]>(`${environment.apiUrl}/api/Action/parameters`, {params});
	}
	getValues(id: number, parameters: Parameter[], action: string, scheme: ActionScheme){
		const pars = new HttpParams()
			.set('action', action)
			.set('scheme', scheme);
		return this.http.post<Value[]>(`${environment.apiUrl}/api/Action/values/${id}`, parameters, { params: pars });
	}
}
