import {Component, OnInit, ViewChild} from '@angular/core';
import {AccountService} from "@app/_services/account.service";
import {FormService} from "@app/_services/form.service";
import {ShareService} from "@app/_services";
import {MessageService, SelectItem} from "primeng/api";
import {AccountInfo} from "@app/_models/account";
import {
	Field,
	Group,
	GrpStat,
	HeaderTable,
	PayCnSearch,
	PayUpdication,
	PayUpdication3,
	QueryForm,
	RuleObjView
} from '@app/_models/schemas';
import {formatDate} from "@angular/common";
import {ActionOptions, ActionScheme, Parameter, SortType, Value} from "@app/_models";
import {tabService} from "@app/_services/tab.service";
import {LocalStorageService} from "@app/_services/localstorage.service";


@Component({
  selector: 'app-pay-cn',
  templateUrl: './pay-cn.component.html',
  styleUrls: ['./pay-cn.component.less'],
  providers:[tabService,MessageService]
})

export class PayCnComponent implements OnInit {
	constructor(public accountService:AccountService, public formService:FormService, public shareService: ShareService,
					private messageService:MessageService,private localStg: LocalStorageService) { }

	loading: boolean;
	accountInfo:AccountInfo;
	accountFlataccs:AccountInfo[];
	selectItemAccpu:string;
	selectAction:boolean = false;
	loadingTable:boolean;
	loadTable:boolean;
	dateOp  :string;
	dateBux :string;
	dateReal:string;
	//тип операции
	listActions:any;
	//основание
	note: string;
	//флаг учета
	flagCalc: any;
	loadingFlagcalc: boolean;
	flag: any;
	//выбранная запись из таблицы
	select_record:any;
	//фильтр
	matchModeOptions 	: SelectItem[];
	//тип действия
	type_action: any;
	action_id:any;

	loadingAction:boolean;
	action:ActionOptions;
	actionLoaded: boolean;

	//флаги для видимости кнопок
	b_exec:boolean = false;
	b_delete:boolean = false;
	b_update:boolean = false;
	b_name:string = 'Сохранить';

	//параметры формы
	pars: Parameter[] = new Array<Parameter>();
	loadingExp: boolean;
	flagFilter: boolean = false;
	@ViewChild('dt2') dt:any;
	message:string;
	groups:Group[]
	fields:Field[]=new Array<Field>();
	haveGroup:boolean;
	//флаг ошибок
	flagError:boolean = false;
	data_table:any;
	header_table: HeaderTable[] = [];
	//queryForm объект хранит поля таблицы
	private queryForm: QueryForm;

	//право
	rule:RuleObjView =  new RuleObjView('ACTION$ACTION','PROG_NAME','CASHLESS_PAYCASHPAY_GRPSTAT');
  //получает список имен колон для фильтрации
	getShortName(value:string):any[]{
		const setResult = new Set();
		let index=0;
		let result=[];
		if(this.data_table) {
			for (let item of this.data_table) {
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

  ngOnInit(): void {
	  this.getDataFromLocalStore();
	  this.matchModeOptions = this.shareService.onFilter();
	  // получаем данные об аккаунте
	  setTimeout(()=>{
		  this.loading = true;
		  this.accountService.accInfo.subscribe((data: AccountInfo) => {
				  if (data) {
					  this.accountInfo = data;
					  this.selectItemAccpu = this.accountInfo.accpu;
					  this.loading = false;
					  this.pars = this.getParamForm(this.action);
				  }
			  }
		  )})

	  //получаем флаг учета
	  setTimeout(()=>{
	  	this.loadingFlagcalc = true;
	  	this.formService.getFlagCalc().subscribe(data=>{
			if(data){
				this.loadingFlagcalc = false;
				this.flagCalc = data;
			}
		},error => {
	  		console.log(error);
	  		this.loadingFlagcalc = false;
		})
	  })
	  //проверить право у пользователя
	  //получение права
	  setTimeout(()=>{
		  this.formService.getRuleObjView(this.rule).subscribe((data:boolean )=>{
			  if(data){
					  this.type_action =[{id:"8487",name:"Добавление/Редактирование/Удаление платежа",progName:"CASHLESS_PAYCASHLESS$PAY_UPDACTION3",tag:"3"},
						  {id:"6463",name:"Добавление/Редактирование/Удаление безналичного платежа для Фонда",progName:"CASHLESS_PAYCASHLESS$PAY_UPDACTIONFOND",tag:"1"},
						  {id:"4485",name:"Изменение статуса группе платежей",progName:"CASHLESS_PAYCASHPAY_GRPSTAT",tag:"1"}];
				  }else{
					  this.type_action =[{id:"8487",name:"Добавление/Редактирование/Удаление платежа",progName:"CASHLESS_PAYCASHLESS$PAY_UPDACTION3",tag:"3"},
						  {id:"6463",name:"Добавление/Редактирование/Удаление безналичного платежа для Фонда",progName:"CASHLESS_PAYCASHLESS$PAY_UPDACTIONFOND",tag:"1"}];
				  }
		  },error => {
			  console.log(error);
		  })
	  })

	}
	//сохранение в хранилище
	saveLocalStore(){
		this.localStg.set('pay-cn-action',JSON.stringify(this.action));
		//Добавление/Редактирование/Удаление платежа
		if(this.action_id.id == '8487'){
			let p:Parameter[] = this.pars;
			p.forEach(par=>{
				switch (par.alias){
					case 'koname':
						break;
					case 'AGNAME':
						break;
					case 'SUPP_':
						break;
					case 'FLAG_':
						break;
					default:
						par.value = null;
						break;
				}
			})
			this.localStg.set('pay-cn-parameter',JSON.stringify(p));
		}
		//Добавление/Редактирование/Удаление безналичного платежа для Фонда
		if(this.action_id.id == '6463'){
			let p:Parameter[] = this.pars;
			p.forEach(par=>{
				switch (par.alias){
					case 'BANK':
						break;
					case 'SUPP_':
						break;
					case 'FLAG_':
						break;
					default:
						par.value = null;
						break;
				}
			})
			this.localStg.set('pay-cn-parameter',JSON.stringify(p));
		}

		this.localStg.set('pay-cn-type-action',JSON.stringify(this.type_action));
		this.localStg.set('pay-cn-action_id',JSON.stringify(this.action_id));
	}
	// восстановление данных из хранилища
	getDataFromLocalStore(){
		if(this.localStg.get('pay-cn-type-action')){
			this.type_action = this.localStg.get('pay-cn-type-action');
		}
		if(this.localStg.get('pay-cn-action_id')){
			this.action_id =this.localStg.get('pay-cn-action_id');
			this.onSelectAction(this.action_id)
		}

		if(this.localStg.get('pay-cn-action')){
			this.action = this.localStg.get('pay-cn-action');
			let p:Parameter[] =  this.localStg.get('pay-cn-parameter') ? this.localStg.get('pay-cn-parameter') : [];
			setTimeout(()=>{
				if(this.action && this.action.groups){
					this.action.groups.forEach(value => {
						value.parameters.forEach(el=>{
							p.forEach(dd=>{
								if(el.alias === dd.alias){
									el.value = dd.value;
								}
							})
						})
					})
				}
			},2000)
		}

	}
	//поиск
	onSearch() {
		if(this.selectAction) {
			let parm: PayCnSearch = new PayCnSearch(this.selectItemAccpu, this.flag?.toString(), this.note,
				this.parseDate(this.dateBux), this.parseDate(this.dateOp), this.parseDate(this.dateReal));
			   this.pars = this.getParamForm(this.action);

			setTimeout(() => {
				this.loadingTable = true;
				this.formService.getSearchDataPayCn(parm, this.pars, this.action_id).subscribe(data => {
					if (data) {
						let main_source: any = data;
						//для получения queryForm
						this.queryForm = main_source.query;
						//для группы
						this.groups = this.queryForm.groups;
						//основной источник данных таблица и поля и поля с типами
						let source = main_source.tableHeaderType;
						//источник данных
						this.data_table = main_source.tabDapper;
						//заговки таблицы
						this.header_table = source.header;
						this.getFields();
						//удаление колонки IDR так как она скрыта
						//this.deleteIDR();


							this.getHeaderType(this.header_table);


						console.log(this.header_table);
						console.log(this.fields);
						this.loadTable = true;
						this.loadingTable = false;
						this.matchModeOptions = this.shareService.onFilter(); //для фильтра

					}
				}, error => {
					this.loadTable = false;
					console.log(error);
				})
			})
		}else {
			this.message = 'Выберите действие';
			this.showInfo();
		}
	}

	//удаление строки
	deleteIDR(){
		this.fields.reverse();
		this.fields.pop();
		this.fields.reverse();
	}

	//конвертирует строку в дату
	parseDate(dateString: string): Date {
		if (dateString) {
			return new Date(dateString);
		}
		return null;
	}

	//получение параметров введеные в форму
	getParamForm(action:ActionOptions,accpuHave:boolean = true):Parameter[]{
		let pars:Parameter[] = [];
		if (action && action.groups)
				action.groups.forEach(element => {
					pars = pars.concat(element.parameters);
					element.parameters.forEach(el => {
						if (el.alias.toLowerCase().replace(new RegExp('_', 'g'), '') == 'accpu' && accpuHave) {
							if (this.selectItemAccpu) {
								//поиск аккаунта и сохранение в сервис
								el.value = this.selectItemAccpu;
							}
						}
					})
				});
		return pars;
	}

	// получение шапки для таблицы
	getFields(){
		this.fields=[];
		//заполняем массив полей таблицы
		this.queryForm.groups.forEach(element=>{
			this.fields=this.fields.concat(element.fields);
		})
		//Удаление поля IDR
		this.deleteIDR();
	}

	//кнопка выполнить
	onExecute(action:number) {
		console.log(this.pars);
		this.flagError = false;
		if(this.action){
			//upd3
			if(this.action_id.id == '8487'){
				let pars:PayUpdication3 = new PayUpdication3(null,null,null,null,null,
					null,null,null,null,null,null,null,null,null,
					null,null);
				pars= this.parseModel(pars);

				if(!this.flagError){
					setTimeout(()=>{
						this.loadingExp = true;
						this.formService.setPayCnUpd3Action(action,pars).subscribe(data=>{
							console.log(data);
							this.onSearch();
							//this.onRefresh();
							this.saveLocalStore();
							this.loadingExp = false;
						},error => {
							this.loadingExp = false;
							console.log(error);
							this.message = error.error;
							this.showError();
						})
					})
				}

			}
			//upd
			if(this.action_id.id == '6463'){
				let pars:PayUpdication = new PayUpdication(null, null,null,null,null,null,
				null,null,null,null,null,null,null,null,null,
					null,null,null,null);
				pars= this.parseModel(pars);
				if(!this.flagError) {
					setTimeout(() => {
						this.loadingExp = true;
						this.formService.setPayCnUpdAction(action, pars).subscribe(data => {
							console.log(data);
							this.loadingExp = false;
							this.saveLocalStore();
							this.onSearch();
							//this.onRefresh();
						}, error => {
							this.loadingExp = false;
							console.log(error.error);
							this.message = error.error;
							this.showError();
						})
					})
				}
			}
			//gpr
			if(this.action_id.id == '4485'){
				let pars:GrpStat = new GrpStat(null,null,null);
				pars= this.parseModel(pars);
				if(pars.extract_date_ && pars.ko && pars.status_){
					setTimeout(()=>{
						this.loadingExp = true;
						this.formService.setPayCnGrpStatus(pars).subscribe(data=>{
							console.log(data);
							this.saveLocalStore();
							this.onSearch();
							this.onRefresh();
							this.loadingExp = false;
						},error => {
							this.loadingExp = false;
							console.log(error.error);
							this.message = error.error;
							this.showError();
						})
					})
				}else {
					this.message = 'Заполните все параметры !';
					this.showError();
				}
			}
		}else {
			this.message = 'Выберите действие';
			this.showInfo();
		}
	}

	// переводим типы из C# в js для шапки таблицы
	getHeaderType(header:any){
		for(let item of header){
			for(let obj of this.fields){
				if(item.field === obj.field){
					let type:string = item.type.split('.')[1];
					obj.type = type;
				}
			}
		}
	}

	//загрузка action
	onLoaded(value: boolean) {
		this.loadingAction = value;
	}

	//выбор действия
	onSelectAction(val: any) {
		this.action = new ActionOptions(val.progName, SortType.GroupName, ActionScheme.Action);
		this.selectAction = true;
		this.data_table = null;
		if(!this.loadingAction){
			this.pars=this.getParamForm(this.action);
		}
		//скрытие кнопок и возврат в исходное состояние
		if(this.action_id.id == '4485'){
			this.b_name = 'Выполнить';
			this.b_delete = false;
			this.b_update = false;
			this.b_exec = true;
		}else {
			this.b_name = 'Сохранить';
			this.b_delete = true;
			this.b_update = true;
			this.b_exec = true;
		}
	}

	onChangedContent(param: Parameter) {
		this.pars = this.getParamForm(this.action);
	}
	//очистка формы
	onRefresh() {
		this.pars.forEach(value => {
			value.value = null;
		})
		this.pars=this.getParamForm(this.action);
	}

	onFilter() {
		this.flagFilter = this.dt.filteredValue != undefined;
	}
	//выбранная запись из таблицы
	selectRecord(column: any) {
		this.select_record = column;
		this.pars = this.getParamForm(this.action);
		let locator = (p:string,key:string)=>p.toUpperCase().replace(new RegExp('_', 'g'),'') == key.toUpperCase().replace(new RegExp('_', 'g'),'');
		if(this.action){
			for(let key in this.select_record) {
				let par = this.pars.find(p => locator(p.alias, key))
				if (par) {
					//console.log('выбранная запись',key,this.select_record[key]);
					if(par.type == "TLIST"){
						par.values.forEach(value => {
							if(value.id == this.select_record[key] || value.name == this.select_record[key]){
								if(this.select_record[key] !== null){
									par.value = value;
								}else {
									par.value = null;
								}

							}
						})
					}
					if(par.type == "TLISTCH"){
						let arrayL = [];
						par.values.forEach(value => {
							if(value.id == this.select_record[key] || value.name == this.select_record[key] && this.select_record[key] !== null){
								arrayL.push(value);
							}
						})
						par.value = arrayL;
					}
					if(par.type == "TDATE"  ){
						if(this.select_record[key] != null){
							par.value =  formatDate(this.parseDate(this.select_record[key]), 'yyyy-MM-dd', 'en_US')
						}else {
							par.value = null;
						}
					}
					if(par.type == "TCHAR" || par.type == "TNUMBER" || par.type == "TCHECK" || par.type == "TFILE"){
						if(this.select_record[key] !== null){
							par.value = this.select_record[key];
						}
						else {
							par.value = null;
						}
					}
				}
			}
		}
	}
	//конверт под модель пакета
	parseModel(result:any):any{
		this.pars=this.getParamForm(this.action,false);

			if(this.pars){
				let locator = (p:string,key:string)=>p.toUpperCase().replace(new RegExp('_', 'g'),'') == key.toUpperCase().replace(new RegExp('_', 'g'),'');
				if(this.action){
					for(let key in result) {
						let par = this.pars.find(p => locator(p.alias, key))
						if (par) {
							//console.log(par);
							if(par.required && par.value == null){
								this.flagError = true;
								this.message = 'Ошибка необходимо заполнить поле '+par.name + '!';
								this.loadingExp = false;
								this.showError();
							}else {
								if(par.type == "TLIST" && par.value != null){
									result[key] = par.value.id;
								}
								if(par.type == "TLISTCH" && par.value){
									//result[key] = par.value?.id;
									let str:any[]=[];
									par.value.forEach(x=>{
										str.push(x.id);
									})
									result[key] = str.toString();
								}
								if(par.type == "TDATE" && par.value){
									result[key]  = par.value;
									//	par.value =  formatDate(this.parseDate(this.record[key]), 'yyyy-MM-dd', 'en_US')
								}
								if(par.type == "TCHAR" ||par.type == "TNUMBER" || par.type == "TCHECK" ||par.type == "TFILE"   && par.value){
									result[key]  = par.value;
								}
							}
						}
					}
				}
				return result;
			}

	}

	//getSum итог по полям
	getSum(field:Field):number{
		let summa:number=0;
		if(field.totalSum){
			summa=0;
			if(!this.flagFilter){
				this.data_table.forEach(
					el=>{summa+=el[field.field];})
				return summa;
			}else {
				this.dt.filteredValue.forEach(
					el=>{summa+=el[field.field];})
				return summa;
			}

		} else return 0;
	}

	showInfo() {
		this.messageService.add({severity:'info', summary: 'Информация', detail: this.message});
	}

	showError() {
		this.messageService.add({severity:'error', summary: 'Ошибка', detail: this.message});
	}

}
