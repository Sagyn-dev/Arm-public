import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import { NavItem } from "@app/_models/nav-item";
import { StatementService} from "@app/_services/statement.service";
import { SidebarLeftComponent} from "@app/sidebar-left/sidebar-left.component";
import {tabService} from '@app/_services/tab.service';
import {DemandReg, DemandRegSupp, RuleObjView, TypeDialogForm, UserInfo} from "@app/_models/schemas";
import {FormService} from "@app/_services/form.service";
import {ShareService} from "@app/_services";
import {LocalStorageService} from "@app/_services/localstorage.service";
import {NgForm} from "@angular/forms";
import {AccountInfo} from "@app/_models/account";
import {AccountService} from "@app/_services/account.service";
import {ActionOptions, ActionScheme, Parameter, SortType} from "@app/_models";
import {ConfirmationService, MessageService} from "primeng/api";
import {error} from "protractor";



@Component({
  selector: 'app-satement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.less'],
  providers: [StatementService,tabService,LocalStorageService,MessageService,ConfirmationService]
})
//тут используется линивая загрузка компонентов в блок контент statement

export class StatementComponent implements OnInit {

  @ViewChild(SidebarLeftComponent) viewChild: SidebarLeftComponent;
  @ViewChild('container',{read: ViewContainerRef}) container: ViewContainerRef;

  navItem: NavItem[];
  headerTitle: string = "Выписка";
  loading:boolean;

  loadAbonOtdel:boolean;
  abonList:any;
  selectAbonOtdel:any;
  display: boolean;
  showReg: boolean;
  //проверка права на абоненский отдел
  formRule  :RuleObjView =  new RuleObjView('EDIT_OPERATIONPOINT','CONNECTION','YES');
  flagRuleForm:boolean = false;

  flagRulReg: boolean = false;
  flagRulRegCount: boolean = false;
  flagRulCountPoint: boolean = false;

  accountInfo:AccountInfo;
  selectItemAccpu:string;

  action: ActionOptions;
  loadingAction: boolean;
  flagChange: boolean;
  pars: Parameter[] = new Array<Parameter>();
  //1 - flagRuleRegCount Право доступа до действия - Учет звонков горячей линии - DEMANDCALLCENTERACTION
  //2 - flagRulReg Право доступа до действия - Регистрация обращений по горячей линии для ПУ - DEMANDCALLCENTERACTION_PU
  //3 - flagRulCountPoint Право доступа до действия - Учет обращений в абонентский отдел - DEMANDVISITTOABNCENTERACTION
  typeAction:number = 0;
  loadingSubmit: boolean;
  message: string;
  flagError: boolean ;
  showSavePhone: boolean;
  loadingExter: boolean;
  titleReg: string;
  phone: number;
  abonPhone:number;
  loadSavePhone:boolean;
  loadAbonPhone:boolean;
  userInfo:UserInfo;
  showAgreement: boolean;
  ck_agreement: boolean;

  constructor(private statementService: StatementService,private formService:FormService,private shareService:ShareService,
				  private localStg: LocalStorageService,private accountService:AccountService, private messageService:MessageService,
				  private confirmationService: ConfirmationService) { }

  @Input() show:boolean=true;

  ngOnInit(): void {
	  this.flagChange = false;
		setTimeout(()=>{
			this.loading=true;
			this.statementService.getNavItem().subscribe((data:NavItem[]) => {
				this.loading=false;
				this.navItem=data
			}) //получение данных об меню
		})
		this.checkRuleForm(this.formRule);

	  //получаем данные об аккаунте
	  setTimeout(()=>{
		  this.accountService.accInfo.subscribe((data: AccountInfo) => {
			  if(data){
				  this.accountInfo = data;
				  this.selectItemAccpu = this.accountInfo.accpu;
				  this.getParamForm();
			  }else {
				  this.accountInfo = null;
				  this.selectItemAccpu = null;
				  this.getParamForm();
			  }
		  })
	  },1000)

	  this.getUserInfo();
  }
	getUserInfo(){
	  setTimeout(()=>{
		  this.loading = true;
		  this.formService.getUserInfo().subscribe((data:UserInfo)=>{
			  this.loading = false;
			  this.userInfo = data;
			  this.formService.setUserInfo(this.userInfo);
			  if(!data.agreement_User){
				  this.showAgreement = true;
			  }
		  },error1 => {
			  this.loading = false;
			  this.message = error1.message;
			  this.showError();
		  })
	  })

	}

	//получения списка абонентских отделов
	getAbonOtdel(){
		setTimeout(()=>{
			this.loadAbonOtdel =true;
			if(this.flagRuleForm){
				this.formService.getAbonOtdel(TypeDialogForm.OperationPoint).subscribe(data=>{
					if(data){
						this.abonList = data;
						this.loadAbonOtdel = false;
						this.display = true;
					}
				},error => {
					this.loadAbonOtdel = false;
				})
			}else {
				this.loadAbonOtdel = false;
			}
		})
	}
	//проверка доступности полей
	checkRuleForm(parameter: RuleObjView){
		this.formService.getRuleObjView(parameter).subscribe((data:boolean )=>{
			this.flagRuleForm = data;
			if(this.flagRuleForm){
				//получение абон отд из кэша
				if(this.localStg.get('abonOtdel')){
					this.selectAbonOtdel = this.localStg.get('abonOtdel');
					this.shareService.setAbonOtdel(this.selectAbonOtdel);
				}else{
					this.getAbonOtdel();
				}
			}
		},error => {
			this.flagRuleForm = false;
			console.log(error);
		})
	}
	//выбранный отдел
	onSelectOtdel() {
		console.log(this.selectAbonOtdel);
		this.shareService.setAbonOtdel(this.selectAbonOtdel);
		//сохранить в кэш
		this.localStg.set('abonOtdel',JSON.stringify(this.selectAbonOtdel));
		this.display = false;
	}
	//процедура изменения header title
	changeTitle(event: string) {
		this.headerTitle = event;
	}
	onChange(show: boolean) {
		this.show = show;
	}
	onShowOtd(dispay:boolean){
		this.formService.getRuleObjView(this.formRule).subscribe((data:boolean )=>{
			this.flagRuleForm = data;
			if(this.flagRuleForm){
				//получение абон отд из кэша
				this.getAbonOtdel();
			}
		},error => {
			this.flagRuleForm = false;
			console.log(error);
		})
	  this.display = dispay;

	}

	onShowReg(show: boolean) {
		this.showReg = show;
		console.log(this.flagRulReg,this.flagRulRegCount,this.flagRulCountPoint);
		if(this.flagRulReg){
			this.action = new ActionOptions( 'DEMANDCALLCENTERACTION_PU', SortType.GroupName, ActionScheme.Action);
			this.titleReg = "Регистрация обращений по горячей линии для ПУ";
		}
		if(this.flagRulCountPoint){
			this.action = new ActionOptions( 'DEMANDVISITTOABNCENTERACTION', SortType.GroupName, ActionScheme.Action);
			this.titleReg = "Регистрация обращений в абонентский отдел";
		}
		if(this.flagRulRegCount){
			this.action = new ActionOptions( 'DEMANDCALLCENTERACTION', SortType.GroupName, ActionScheme.Action);
			this.titleReg = "Регистрация обращений по горячей линии";
		}
	}

	//основая функция кнопки адрес цн
	basicAdrCN(){
		console.log(this.typeAction,this.pars);
		this.flagError = false;
		this.getParamForm();
		let pars : any;
		if(this.action.action == 'DEMANDCALLCENTERACTION'){
			this.typeAction = 1;
			pars = new DemandReg(null,null);
			pars = this.parseModel(pars);
		}else if(this.action.action == 'DEMANDVISITTOABNCENTERACTION'){
			this.typeAction = 2;
			pars = new DemandReg(null,null);
			pars = this.parseModel(pars);
			if(!this.selectAbonOtdel){
				this.flagError = true;
				this.message = 'Абонентский отдел не выбран !';
				this.showError();
			}
		}else if(this.action.action == 'DEMANDCALLCENTERACTION_PU'){
			this.typeAction = 3;
			pars = new DemandRegSupp(null,null, null);
			pars = this.parseModel(pars);
		}

		console.log(this.action.action,this.typeAction,pars,this.pars);

		if (!this.flagError || pars){
			setTimeout(()=>{
				this.loadingSubmit = true;
				this.formService.regAction(this.typeAction,this.selectAbonOtdel?.ID,pars).subscribe(data=>{
					if(data){
						console.log(data);
						this.loadingSubmit = false;

						this.action.groups.forEach(element => {
							this.pars = this.pars.concat(element.parameters);
							element.parameters.forEach(el => {
								el.value = null;
							})

						});

						//this.flagChange = false;
					}
				},error => {
					this.loadingSubmit = false;
					this.message = error.error.toString().split("\n");
					this.showError();
				})
			});
		}
	}
	//кнопка адрес цн
	addressCN(form:NgForm) {
	  if(form.valid) {
		  setTimeout(() => {
			  this.loadingSubmit = true;
			  this.formService.checkRegAccpu(this.selectItemAccpu).subscribe((data: number) => {
				  this.loadingSubmit = false;
				  if (data > 0) {
					  this.confirmationService.confirm({
						  message: 'По этому лицевому счету зарегистрированы обращения на текущий день. Продолжить?',
						  accept: () => {
							  this.basicAdrCN();
							  form.onReset();
						  },
						  reject: () => {
							  return;
						  }
					  });
				  } else {
					  this.basicAdrCN();
					  form.onReset();
				  }
			  }, error => {
				  this.message = error;
				  this.showError();
				  this.loadingSubmit = false;
			  })
		  })
	  }
	}
	//Внешний
	onExternal() {
		console.log(this.typeAction,this.pars);
		this.flagError = false;
		this.getParamForm();
		let pars : any;
		if(this.action.action == 'DEMANDCALLCENTERACTION'){
			this.typeAction = 1;
			pars = new DemandReg(null,null);
			pars = this.parseModel(pars);
		}else if(this.action.action == 'DEMANDVISITTOABNCENTERACTION'){
			this.typeAction = 2;
			pars = new DemandReg(null,null);
			pars = this.parseModel(pars);
			if(!this.selectAbonOtdel){
				this.flagError = true;
				this.message = 'Абонентский отдел не выбран !';
				this.showError();
			}
		}else if(this.action.action == 'DEMANDCALLCENTERACTION_PU'){
			this.typeAction = 3;
			pars = new DemandRegSupp(null,null, null);
			pars = this.parseModel(pars);
		}

		if (!this.flagError || pars){
			setTimeout(()=>{
				this.loadingExter = true;
				this.formService.regExternalAction(this.typeAction,this.selectAbonOtdel?.ID,pars).subscribe(data=>{
					if(data){
						console.log(data);
						this.loadingExter = false;

						this.action.groups.forEach(element => {
							this.pars = this.pars.concat(element.parameters);
							element.parameters.forEach(el => {
								el.value = null;
							})

						});

						//this.flagChange = false;
					}
				},error => {
					this.loadingExter = false;
					this.message = error.error.toString().split("\n");
					this.showError();
				})
			});
		}
	}
	//конверт под модель пакета
	parseModel(result:any):any{
		//this.pars=this.getParamForm(this.action,false);

		if(this.pars){
			let locator = (p:string,key:string)=>p.toUpperCase().replace(new RegExp('_', 'g'),'') == key.toUpperCase().replace(new RegExp('_', 'g'),'');
			if(this.action){
				for(let key in result) {
					let par = this.pars.find(p => locator(p.alias, key))
					if (par) {
						////console.log(par);
						if(par.required && par.value == null){
							this.flagError = true;
							this.message = 'Ошибка необходимо заполнить поле '+par.name + '!';
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
	//получение параметров введеные в форму
	loadAgreement: boolean;
	getParamForm(){
		//console.log('вызов гет парам')
		this.pars=[];
		if (this.action && this.action.groups)
			this.action.groups.forEach(element => {
				this.pars = this.pars.concat(element.parameters);
				element.parameters.forEach(el => {
					if (el.alias.toLowerCase() == 'acc_pu_' || el.alias.toLowerCase() == 'acc_pu') {
						if(this.accountInfo?.accpu){
							//поиск аккаунта и сохранение в сервис
							el.value = this.accountInfo.accpu;
						}
					}
					if (el.alias.toLowerCase() == 'email') {

					}
				})
			});
	}

	getRuleCountPoint(val: boolean) {
		this.flagRulCountPoint = val;
	}

	getRuleRegCount(val: boolean) {
		this.flagRulRegCount = val;
	}

	getRuleReg(val: boolean) {
		this.flagRulReg = val;
	}

	onLoaded(value: boolean) {
		this.loadingAction = value;
	}

	onChanged(val: Parameter) {
		this.flagChange = !!val;
	}
	showInfo() {
		this.messageService.add({severity:'info', summary: 'Информация', detail: this.message});
	}
	showError() {
		this.messageService.add({severity:'error', summary: 'Ошибка', detail: this.message});
	}

	onShowSavePhone(val: boolean) {
	  console.log(this.selectItemAccpu);
		if(this.selectItemAccpu){
			//отправка на сервер и получение номера звонящего
			setTimeout(()=>{
				this.loadAbonPhone = true;
				this.formService.getAbonPhone(this.phone).subscribe((data:number)=>{
					if(data){
						this.loadAbonPhone = false;
						this.showSavePhone = val;
						this.abonPhone = data;
					}
					console.log(data);
				},error=>{
					this.loadAbonPhone = false;
					this.message = error.message;
					this.showError();
				})
			})

		}else {
			this.message = 'Не выбран лицевой счет.'
			this.showError();
		}

	}

	getPhone( val: string) {
		this.phone = Number(val);
	}

	onSavePhone(val: boolean) {
		if(val){
			if(this.selectItemAccpu){
				//действие сохранения
				setTimeout(()=>{
					this.loadSavePhone = true;
					this.formService.saveAbonPhoneAccpu(this.selectItemAccpu,this.abonPhone).subscribe(data=>{
						if(data){
							this.loadSavePhone = false;
							this.showSavePhone = false;
							this.message = 'Номер успешно добавлен';
							this.showInfo();
						}
					},error =>{
						this.loadSavePhone = false;
						this.message = error.message;
						this.showError();
					})
				})
			}
			else {
				this.message = 'Не выбран лицевой счет.'
				this.showError();
			}
		}else {
			this.showSavePhone = false;
			return;
		}
	}
	//сохранить выбор
	onAcceptAgreement() {
		if(this.ck_agreement){
			setTimeout(()=>{
				this.loadAgreement = true;
				this.formService.setAgreement().subscribe(data=>{
					console.log(data);
					this.loadAgreement = false;
					this.showAgreement = false;
					this.getParamForm();
					this.ngOnInit();
				},error=>{
					this.loadAgreement = false;
					this.showAgreement = false;
					this.message = error.error;
					this.showError();
				})

			})
		}
	}

}
