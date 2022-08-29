import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConvertType, ConvertRee, ConvertFilter, ConvertReeStatistic, ConvertField, ConvertGridColumn } from '@app/_models';
import { environment } from '@environments/environment';
import { LazyLoadEvent } from 'primeng/api';



@Injectable({ providedIn: 'root' })
export class UploadService {
   constructor(private http: HttpClient) { }

	getTypes() {
		return this.http.get<ConvertType[]>(`${environment.uploadUrl}/convert/types`);
	}
	getRees(filter: ConvertFilter){
		return this.http.post<ConvertRee[]>(`${environment.uploadUrl}/convert/rees`, filter);
	}
	getReeStatistic(id: number) {
		return this.http.get<ConvertReeStatistic[]>(`${environment.uploadUrl}/convert/reestatistic/${id}`);
	}
	process(id: number){
		return this.http.post(`${environment.uploadUrl}/convert/process/${id}`, null);
	}
	delete(id: number){
		return this.http.delete(`${environment.uploadUrl}/convert/${id}`);
	}
	getFields(id: number) {
		return this.http.get<ConvertField[]>(`${environment.uploadUrl}/convert/fields/${id}`);
	}
	getFieldsLazy(id: number, filter: LazyLoadEvent) {
		return this.http.post<ConvertField[]>(`${environment.uploadUrl}/convert/fieldslazy/${id}`, filter);
	}
	getCountRecordsFileds(id: number){
		return this.http.get(`${environment.uploadUrl}/convert/countfields/${id}`, {responseType: 'text'});
	}
	getConvertGridColumns(id: number){
		return this.http.get<ConvertGridColumn[]>(`${environment.uploadUrl}/convert/gridcolums/${id}`);
	}
	getCountPositions(id: number, filter: LazyLoadEvent){
		return this.http.post(`${environment.uploadUrl}/convert/countpositions/${id}`, filter==null ? {} : filter , {responseType: 'text'});
	}
	getPositions(id: number, filter: LazyLoadEvent) {
		return this.http.post<any[]>(`${environment.uploadUrl}/convert/positions/${id}`, filter);
	}
	getAllPositions(id: number, filter: LazyLoadEvent) {
		return this.http.post<any[]>(`${environment.uploadUrl}/convert/allpositions/${id}`, filter==null ? "{}" : filter);
	}

}
