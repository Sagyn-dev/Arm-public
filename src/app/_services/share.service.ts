import {ReportOrder, Report, Template, Value} from "@app/_models";
import { Injectable } from "@angular/core";
import { AccountInfo } from "@app/_models/account";
import { BehaviorSubject } from "rxjs";
import { NavItem } from "@app/_models/nav-item";
import { Recalculation } from '@app/_models/schemas';
import {FilterService, SelectItem} from 'primeng/api';
import {formatDate} from '@angular/common';
import {Table} from "primeng/table";

export enum STATE{
	NEW, BACK
}

@Injectable({ providedIn: 'root' })
export class ShareService {
	constructor(private filterService: FilterService) {
	}
	private reportOrder: ReportOrder;
	private report: Report;
	private template: Template;
	private state: STATE = STATE.NEW;
	private accountInfo: AccountInfo;
	private _recalculation: Recalculation[];
   private _togle:boolean=false;

	//выбранный элемент меню
	itemNav: BehaviorSubject<NavItem> = new BehaviorSubject<NavItem>(null);
	setItemNav(value: NavItem) {
		this.itemNav.next(value)
	}
	//Абоненский отдел
	abonOtdel:BehaviorSubject<any> = new BehaviorSubject<any>(null);
	window:BehaviorSubject<any> = new BehaviorSubject<any>(null);
	blockContent:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	setBlock(value:boolean){
		this.blockContent.next(value);
	}

	setAbonOtdel(value:any){
		this.abonOtdel.next(value);
	}
	setWindow(value:any){
		this.window.next(value);
	}

	public set State(state: STATE){
		this.state=state;
	}
	public get State(){
		return this.state;
	}

	public set ReportOrder(order: ReportOrder){
	  this.reportOrder = order;
	}
	public get ReportOrder(): ReportOrder{
		return this.reportOrder;
	}
	public set Report(report: Report){
		this.report = report;
	}
	public get Report(): Report{
		return this.report;
	}
	public set Template(template: Template){
		this.template = template;
	}
	public get Template(): Template{
		return this.template;
	}
	public get AccountInfo():AccountInfo{
		return this.accountInfo;
	}

	get recalculation(): Recalculation[] {
		return this._recalculation;
	}

	set recalculation(value: Recalculation[]) {
		this._recalculation = value;
	}

	get togle(): boolean {
		return this._togle;
	}

	set togle(value: boolean) {
		this._togle = value;
	}

	onFilter(){
		let matchModeOptions: SelectItem[];
		const customFilterName = "Равно";
		const dateFilterNotContains = "Не равно";
		const dateFilterBefore = "Меньше или равно";
		const dateFilterAfter = "Больше или равно";
		const dateFilterMore = "Больше";
		const dateFilterLess = "Меньше";


		this.filterService.register(
			customFilterName,
			(value, filter): boolean => {
				//console.log(value,'|',filter, typeof filter);
				let str_value : string = formatDate(this.parseDate(value),'yyyy-MM-dd', 'en_US'); //значение
				if (str_value === undefined || str_value === null) {
					return false;
				}
				if (filter === undefined || filter === null || filter === '') {
					return true;
				}else{
					let str_filter : string = formatDate(this.parseDate(filter),'yyyy-MM-dd', 'en_US'); //фильтр
					return str_value.toString() === str_filter.toString();
				}
			}
		);
		this.filterService.register(
			dateFilterNotContains,
			(value, filter): boolean => {
				let str_value : string = formatDate(this.parseDate(value),'yyyy-MM-dd', 'en_US'); //значение
				if (str_value === undefined || str_value === null) {
					return false;
				}
				if (filter === undefined || filter === null || filter.trim() === '') {
					return true;
				}else{
					let str_filter : string = formatDate(this.parseDate(filter),'yyyy-MM-dd', 'en_US'); //фильтр
					return str_value.toString() !== str_filter.toString();
				}
			}
		);

		this.filterService.register(
			dateFilterBefore,
			(value, filter): boolean => {
				let str_filter : Date = this.parseDate(filter); //фильтр
				let str_value : Date = this.parseDate(value); //значение
				if (str_filter === undefined || str_filter === null) {
					return true;
				}
				if (str_value === undefined || str_value === null) {
					return false;
				}
				return str_value <= str_filter;
			}
		);

		this.filterService.register(
			dateFilterMore,
			(value, filter): boolean => {
				let str_filter : Date = this.parseDate(filter); //фильтр
				let str_value : Date = this.parseDate(value); //значение
				if (str_filter === undefined || str_filter === null ) {
					return true;
				}
				if (str_value === undefined || str_value === null) {
					return false;
				}
				return str_filter > str_value;
			}
		);

		this.filterService.register(
			dateFilterAfter,
			(value, filter): boolean => {
				let str_filter : Date = this.parseDate(filter); //фильтр
				let str_value : Date = this.parseDate(value); //значение
				if (str_filter === undefined || str_filter === null) {
					return true;
				}
				if (str_value === undefined || str_value === null) {
					return false;
				}
				return str_value >= str_filter;
			}
		);
		this.filterService.register(
			dateFilterLess,
			(value, filter): boolean => {
				let str_filter : Date = this.parseDate(filter); //фильтр
				let str_value : Date = this.parseDate(value); //значение
				if (str_filter === undefined || str_filter === null) {
					return true;
				}
				if (str_value === undefined || str_value === null) {
					return false;
				}
				return str_value > str_filter;
			}
		);

		matchModeOptions = [
			{ label: "Равно", value: customFilterName },
			{ label: "Не Равно", value: dateFilterNotContains },
			{ label: "Меньше", value: dateFilterMore },
			{ label: "Больше", value: dateFilterLess },
			{ label: "Больше или равно", value: dateFilterAfter },
			{ label: "Меньше или равно", value: dateFilterBefore },
		];

		return matchModeOptions;
	}

	parseDate(dateString: string): Date {
		if (dateString) {
			return new Date(dateString);
		}
		return null;
	}

	getFilterSource(data:any[]):any{
		if(data.length>0){
			let op = Object.keys(data[0]);
			let arr = new Map()
			op.forEach(value => {
				arr.set(value,this.getShortName(value,data));
			})
			return arr;
		}
		return null;
	}

	getShortName(value:string,data:any[]):any[]{
		const setResult = new Set();
		let index=0;
		let result=[];
		if(data) {
			for (let item of data) {
				if (item[value]) {
					setResult.add(item[value]);
				}
			}
		}
		for (let item of setResult){
			result.push(new Value(index,item));
			index++;
		}
		return result;
	}

}
