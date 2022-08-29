import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { environment } from "@environments/environment";
import { PrimeNGConfig } from 'primeng/api';
import { AuthorizeService } from './api-authorization/authorize.service';
import { Observable } from 'rxjs';
import { MenuService } from './_services/menu.service';
import { ARM } from './_models/menu';
import {FormService} from "@app/_services/form.service";
import { NavItem } from "@app/_models/nav-item";
import {RuleObjView, TypeDialogForm, UserInfo} from "@app/_models/schemas";
import {tabService} from "@app/_services/tab.service";
import {ShareService} from "@app/_services";
import {ActionOptions} from "@app/_models";
import {DeviceDetectorService} from "ngx-device-detector";
import {LocalStorageService} from "@app/_services/localstorage.service";
import {Title} from "@angular/platform-browser";

@Component({
	selector: 'app',
	templateUrl: 'app.component.html',
	styleUrls:['./app.component.css'],
	providers:[tabService,LocalStorageService]

})


export class AppComponent implements OnInit{
	prod: boolean = environment.production;
	isNavbarCollapsed = true;
	public isAuthenticated: Observable<boolean>;
	public arms: ARM[];
	loadmenu: boolean;
	//Выбранный отдел
	selectAbonOtdel: string;
	//выбранное окно
	selectWnd: string;
	loading: boolean;
	userInfo: UserInfo;
	showAgreement: boolean;

	@Input("otdel")
	set abonOtdel(val: string) {
		if (this.selectAbonOtdel != val){
			this.selectAbonOtdel = val;
		}
	}
	isMobile: boolean;
	isPc:boolean;
	blockContent:boolean = false;
	constructor(private primengConfig: PrimeNGConfig, private authorizeService: AuthorizeService, private menuService: MenuService,
					private formService:FormService, private shareService:ShareService,private deviceService: DeviceDetectorService,private localStg: LocalStorageService,	private titleService: Title) {
	}

	ngOnInit(): void {
		this.checkDevice();
		this.arms = new Array<ARM>();
		this.loadmenu = false;
		this.isAuthenticated = this.authorizeService.isAuthenticated();
		this.isAuthenticated.subscribe(data => {
			let auth:boolean;
			auth = data;
			if (auth && !this.loadmenu){
				this.loadmenu = true;
				this.menuService.getApplications().subscribe( data =>{
					this.arms = data;
					//console.log(this.ARM);
				},
				error=>{},
				() => this.loadmenu = false
				);
			}
		}, error=>{},() => this.loadmenu = false);

		this.primengConfig.setTranslation({
			startsWith:'Начинается с',
			contains: "Содержит",
			notContains: "Не содержит",
			endsWith: "Оканчивается на",
			equals: "Равно",
			notEquals: "Не равно",
			lt: "Меньше",
			lte: "Меньше или равно",
			gt: "Больше",
			gte: "Больше или равно",
			is: "Является",
			isNot: "Не является",
			before: "Перед",
			after: "После",
			clear: "Очистить",
			apply: "Применить",
			matchAll: "Все соответствия",
			matchAny: "Любое совпадение",
			addRule: "Добавить правило",
			removeRule: "Удалить правило",
			accept: "Да",
			reject: "Нет",
			choose: "Выберите",
			upload: "Загрузить",
			cancel: "Отменить",
			dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
			dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
			dayNamesMin: ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],
			monthNames: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
			monthNamesShort: ["Янв", "Фев", "Март", "Апр", "Май", "Июнь","Июль", "Авг", "Сент", "Окт", "Нояб", "Дек"],
			today: "Сегодня",
			emptyMessage:"Не найдено",
			emptyFilterMessage:"Результаты не найдены",

		})

		setTimeout(()=>{
			this.shareService.abonOtdel.subscribe(data=> {
				if (data) {
					this.selectAbonOtdel = data.NAME;
				}
			})
		})
		setTimeout(()=>{
			this.shareService.window.subscribe(data=> {
				if (data) {
					this.selectWnd = data.NAME;
				}
			})
		})

		this.shareService.blockContent.subscribe(data=>{
			this.blockContent = data;
		},error => {
			console.log(error);
		})

	}
	getUserInfo() {
		setTimeout(() => {
			this.loading = true;
			this.formService.getUserInfo().subscribe((data: UserInfo) => {
				this.loading = false;
				this.userInfo = data;
				console.log(data);
				if (!data.agreement_User) {
					this.showAgreement = true;
				}
			}, error1 => {
				this.loading = false;
			})
		})
	}

	//проверка устройства
	checkDevice() {
		const isMobile_ = this.deviceService.isMobile();
		const isTablet = this.deviceService.isTablet();
		const isDesktopDevice = this.deviceService.isDesktop();
		if(isTablet || isMobile_){
			this.isMobile = true;
		}
		if(isDesktopDevice){
			this.isPc = true;
		}
	}

	test() {
		console.log('ff');
		alert( 20e-1['toString'](2));
	}
	//выбранное приложени
	setApplication(arm: ARM) {
		this.localStg.set('menuItem',JSON.stringify(arm));
		//для изменения Title вкладке сайта <title>
		this.titleService.setTitle(arm.name);
	}
}

