import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ARM } from "@app/_models/menu";
import { NavItem } from "@app/_models/nav-item";

@Injectable({ providedIn: 'root' })
export class MenuService {
	constructor(private http: HttpClient) { }
	getApplications() {
		return this.http.get<ARM[]>(`${environment.apiUrl}/api/Menu/arms`);
	}
	getNavItem(application: string) {
		return this.http.get<NavItem[]>(`${environment.apiUrl}/api/Menu/items/${application}`);
	}
}
