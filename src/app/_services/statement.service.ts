import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { NavItem } from "@app/_models/nav-item";


@Injectable({ providedIn: 'root' })
export class StatementService {
	constructor(private http: HttpClient) { }
	getNavItem() {
		let application:string = "Statement";
		return this.http.get<NavItem[]>(`${environment.apiUrl}/api/Menu/items/Statement`);
	}
}
