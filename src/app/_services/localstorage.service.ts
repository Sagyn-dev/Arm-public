import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageService{
	constructor() {}

	set(key: string, data: any): void {
		try {
			localStorage.setItem(key, data);
		} catch (e) {
			console.error('Error saving to localStorage', e);
		}
	}

	get(key: string) {
		try {
			let json = JSON.parse(localStorage.getItem(key));
			//console.log(json);
			return json;
		} catch (e) {
			console.error('Error getting data from localStorage', e);
			return null;
		}
	}
}
