import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NgSelectConfig } from '@ng-select/ng-select';
import { ActionParameterGroup, ActionOptions, Parameter, ActionScheme, Value } from '@app/_models';
import { ActionService } from '@app/_services/action.service';
import {AccountService} from "@app/_services/account.service";
import {FormService} from '@app/_services/form.service';
import { HttpEventType, HttpClient } from '@angular/common/http';
import {tabService} from '@app/_services/tab.service';
import {AccountInfo} from '@app/_models/account';
import {FileConfiguration, SumDateEnov} from '@app/_models/schemas';
import {ControlContainer, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {DeviceDetectorService} from "ngx-device-detector";
import emailMask from 'text-mask-addons/dist/emailMask';
import {ConfirmationService} from "primeng/api";
import {formatDate} from "@angular/common";

@Component({
	selector: 'action-component',
	templateUrl: './action.component.html',
	styleUrls: ['./action.component.css'],
	providers:[tabService,ConfirmationService],
	viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ActionComponent implements OnInit {
	private _action: ActionOptions;
	//groups: ActionParameterGroup[];
	loading: boolean;
	error = '';
	account: AccountInfo;
	//настройка для компонента файла
	fileConfig: FileConfiguration;
	//mask = ['^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\\\.[a-z]{2,4}$'];
	public mask: Array<string | RegExp>
	//registerForm: FormGroup;
	//get f() { return this.registerForm.controls; }
	pars:Parameter;
	//параметр влияет на списки позволяет выводить их поверх body
	appendToList: boolean = false;
	get action(): ActionOptions {
		return this._action;
	}
	@Input("action")
	set action(val: ActionOptions) {
		if (this._action != val){
			this._action = val;
			this.account = null;
			this.onChanged.emit(this.pars);
			this.loadParams();
		}
	}
	@Output() onChanged = new EventEmitter<Parameter>();

	change($event: Event, param: Parameter){
		this.onChanged.emit(param);
	}

	@Output() onLoaded = new EventEmitter<boolean>();

	@Input("appendTo")
	set appendTo(val: boolean) {
		if (this.appendToList != val){
			this.appendToList = val;
		}
	}


	constructor(private actionService: ActionService, private config: NgSelectConfig,
					public accountService: AccountService,private formService:FormService,
					private http:HttpClient,
					private deviceService: DeviceDetectorService,
					private formBuilder: FormBuilder,private confirmationService: ConfirmationService) {
		this.config.notFoundText = 'Не найден';
		this.config.clearAllText = "Очистить";
		this.config.loadingText = "Загрузка...";
	}

	ngOnInit() {
		// this.registerForm = this.formBuilder.group({
		// 	email: ['', [Validators.required, Validators.email,Validators.pattern('^[A-za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
		// });
		this.mask = emailMask;
		this.loading = false;
		this._action.groups = new Array<ActionParameterGroup>();
		this.checkDevice();
	}

	//проверка устройства
	checkDevice() {
		//this.deviceInfo = this.deviceService.getDeviceInfo();
		const isMobile = this.deviceService.isMobile();
		const isTablet = this.deviceService.isTablet();
		const isDesktopDevice = this.deviceService.isDesktop();
		if(isTablet || isMobile){
			this.fileConfig = new FileConfiguration(false,false,true,true,true);
		}
		if(isDesktopDevice){
			this.fileConfig = new FileConfiguration(true,true,true,true,true);
		}
	}

	loadParams(){
		this._action.groups = null;
		//console.log(this._action);
		if (this._action && this._action.action && this._action.action.length > 0) {
			setTimeout(() => {
				this.loading = true;
				this.onLoaded.emit(this.loading);
				this.actionService.getParameters(this._action.action, this._action.sortType, this._action.actionScheme).subscribe(
					data=>{
						this._action.groups = data;
						this.loading = false;
						this.onLoaded.emit(this.loading);
						this.loadAccount();
					},
					error=>{
						this.error = error.error.message;
						this.loading = false;
						this.onLoaded.emit(this.loading);
					}
				);
			});

		} else this.loading = false;
	}

	loadAccount(){
		this.accountService.accInfo.subscribe((data: AccountInfo) => {
			if (this.account!=data){
				this.account = data;
				if(this.account){

					if (this._action && this._action.groups) {

						this.action.groups.forEach(element => {

							element.parameters.forEach(el => {
								//очистка выбора в ng-select при смене лс
								el.value = null;
								//console.log(el);
								if (el.alias.toLowerCase().replace(new RegExp('_', 'g'),'') == 'accpu') {
									if(this.account?.accpu){
										//console.log(el);
										el.value = this.account.accpu;
										//console.log('dddddd',el)
										this.getValues(el);

										//конец
										if (el.type=='TLIST') {
											//console.log('Загрузка списка');
											let pars: Parameter[] = new Array<Parameter>();

											this._action.groups.forEach(element => {
												pars = pars.concat(element.parameters);
											});

											setTimeout(() => {
												el.loading = true;
												this.actionService.getValues(el.id, pars, this._action.action, this._action.actionScheme).subscribe(
													data => {
														el.values = data;
														el.value = null;
														for(let i=0; i<el.values.length; i++){
															if(el.values[i].id == this.account.accpu){
																el.value = this.account.accpu;
																break;
															}else {
																el.value = el.values[i].id;
															}
														}


														el.loading = false;
														let locator = (p: Value, id: string) => p.id == id;
														let par = data.find(p => locator(p, el.value));
														if (par) {
															el.value = par;
														}
													},
													error => {
														this.error = error.error.message || error.statusText;
														el.loading = false;
													}
												);
											});
										}
										//добавить установку даты оплаты, суммы по енов, енов получать по лс
									}
								}
							})
						});
					}
				}
			}
		});
	}

	onChange($event: Event, param: Parameter){
		this.getValues(param);
		this.onChanged.emit(param);
		if(param.alias == 'UNP_OPER_'){
			//получить дату и сумму
			this.getSumDateEnov(param);
		}
	}
	// получение суммы енов
	getSumDateEnov(param: Parameter){
		if(param.value){
			//получаем данные для суммы платежа
			this.action.groups.forEach(element => {
				element.parameters.forEach(el => {
					if(el.alias == 'summ'){
						el.loading = true;
						this.formService.getSumEnov(param.value?.id).subscribe(data=>{
							el.loading = false;
							if(data){
								el.value = data;
							}
						},error=>{
							this.error = error.error.message || error.statusText;
							el.loading = false;
						})
					}

					if(el.alias == 'opmonth'){
						el.loading = true;
						//получаем данные для даты платежа
						this.formService.getDateEnov(param.value?.id).subscribe(data=>{
							el.loading = false;
							if(data){
								el.value =  formatDate(new Date(this.parseDate(data?.toString())), 'yyyy-MM-dd', 'en_US');
							}
						},error => {
							this.error = error.error.message || error.statusText;
							el.loading = false;
						})
					}

				})
			});


		}
	}
	getValues(param: Parameter){
		this.pars = param;
		if (param.dependParams!=null && param.dependParams.length>0) {
			let pars: Parameter[] = new Array<Parameter>();
			this._action.groups.forEach(element => {
				pars = pars.concat(element.parameters);
			});
			let locator = (p: Parameter, id: number) => p.id == id;
			let service = this.actionService;
			let action = this._action;
			param.dependParams.forEach(function(element) {
				let par = pars.find(p => locator(p, element));
				if (par)
				{
					setTimeout(() => {
						par.loading = true;
						if (par.type=='TCHAR') {
							service.getValue(element, pars, action.action, action.actionScheme).subscribe(
								data => {
									par.value = data;
									par.loading = false;
								},
								error => {
									this.error = error.error.message || error.statusText;
									par.loading = false;
								}
							);

						} else if (par.type=='TDATE') {
							service.getDateValue(element, pars, action.action, action.actionScheme).subscribe(
								data => {
									par.value = data;
									par.loading = false;
								},
								error => {
									this.error = error.error.message || error.statusText;
									par.loading = false;
								}
							);
						} else if (par.type=='TNUMBER') {
							service.getNumberValue(element, pars, action.action, action.actionScheme).subscribe(
								data => {
									par.value = data;
									par.loading = false;
								},
								error => {
									this.error = error.error.message || error.statusText;
									par.loading = false;
								}
							);
						} else {
							service.getValues(element, pars, action.action, action.actionScheme).subscribe(
								data => {
									par.values = data;
									par.loading = false;
								},
								error => {
									this.error = error.error.message || error.statusText;
									par.loading = false;
								}
							);
						}
					});
				}
			});
		}
	}

	parseDate(dateString: string): Date {
		if (dateString) {
			 return new Date(dateString);
		}
		return null;
	}
	info(event: Event,message:string) {
		this.confirmationService.confirm({
			target: event.target,
			message: message,
			icon:'pi pi-info-circle',
			rejectVisible:false,
			acceptVisible:true,
			acceptLabel:'OK',
			accept:()=>{ }
		});
	}

	getNote(alias: string):boolean {
		return alias.toLowerCase().replace(new RegExp('_', 'g'), '') == 'note';
	}
}
