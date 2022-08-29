import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { tabService } from '@app/_services/tab.service';
import { MessageService } from 'primeng/api';
import { ShareService } from '@app/_services';
import { ActionOptions, ActionScheme, Parameter, SortType } from '@app/_models';
import { NavItem } from '@app/_models/nav-item';
import { AccountInfo } from '@app/_models/account';
import { DemandService } from '@app/_services/demand.service';
import { ComponentCanDeactivate } from '@app/exit.guard';
import { Observable } from 'rxjs';
import {AccountService} from "@app/_services/account.service";

@Component({
	selector: 'app-dynamic-demand',
	templateUrl: './dynamic-demand.component.html',
	styleUrls: ['./dynamic-demand.component.less'],
	providers:[tabService, MessageService]
})
export class DynamicDemandComponent implements OnInit, ComponentCanDeactivate {

	action: ActionOptions;
	nav_item:any;
	private flagChange: boolean;
	constructor(private shareService:ShareService,private accountService:AccountService,private messageService:MessageService,private demandService:DemandService) { }
	loadingSubmit: any;
	pars: Parameter[] = new Array<Parameter>();
	//accountInfo
	account_accp: AccountInfo;
	message:string;
	loadingAction:boolean = false;

	canDeactivate() : boolean | Observable<boolean>{
		if(this.flagChange){
			return confirm("Вы хотите покинуть страницу?");
		}
		else{
			return true;
		}
	}

  ngOnInit(): void {
	  this.flagChange = false;
	  this.shareService.itemNav.subscribe((data: NavItem) => {
		  if (data) {
			  if(this.nav_item !== data){
				  this.nav_item = data;
				 // console.log("type form "+ this.nav_item.id);
				  //получаем данные полей таблиц
				  this.action = new ActionOptions( this.nav_item.id.toString(), SortType.GroupName, ActionScheme.Letter);
				  if(this.action){
					  setTimeout(()=>{
						  //получаем данные об аккаунте
						  this.accountService.accInfo.subscribe((data: AccountInfo) => {
							  if(data){
								  this.account_accp = data;
								  //устанавливаем параметры для формы
								  this.getParamForm();
							  }
						  })
					  },1000)
				  }
			  }
		  }
	  }, error => {
		 // console.log(error)
	  })
  }
	onExecute(form:NgForm) {
		if (form.valid) {
			this.getParamForm();
			if (this.pars && this.pars.length>0){
				// let parr = this.pars;
				// parr.forEach(x=>{
				// 	x.values = null;
				// })
				console.log(JSON.stringify(this.pars));
				setTimeout(()=>{
					this.loadingSubmit = true;
					this.demandService.createOrder(this.nav_item.alias,this.pars).subscribe(data=>{
						if(data){
							this.loadingSubmit = false;
							this.message = "Ваша заявка № " +data+ " принята в работу."
							this.showInfo();
							this.action.groups.forEach(element => {
								this.pars = this.pars.concat(element.parameters);
								element.parameters.forEach(el => {
									el.value = null;
								})
							});
							form.onReset();
							this.flagChange = false;
						}
					},error => {
						this.loadingSubmit = false;
						//console.log(this.loadingSubmit,form.valid)
						let errors = error.error;
						for(let item in errors){
							this.message = errors[item];
						}
						this.showError();
					})
				});
			}
		}
	}

	//получение параметров введеные в форму
	getParamForm(){
		//console.log('вызов гет парам')
		this.pars=[];
		if (this.action && this.action.groups)
			this.action.groups.forEach(element => {
				this.pars = this.pars.concat(element.parameters);

				element.parameters.forEach(el => {
					if (el.alias.toLowerCase().replace(new RegExp('_', 'g'),'') == 'accpu') {
						if(this.account_accp?.accpu && (el.value == null || el.value == "")){
							//поиск аккаунта и сохранение в сервис
							el.value = this.account_accp.accpu;
							//console.log('accp ' + this.account_accp.accpu)
						}
					}
				})
			});
	}

	onChanged(val: Parameter) {
		if (val)	this.flagChange=true;
		else this.flagChange = false;
	}

	showInfo() {
		this.messageService.add({severity:'info', summary: 'Информация', detail: this.message, life:5000});
	}

	showError() {
		this.messageService.add({severity:'error', summary: 'Ошибка', detail: this.message,life:5000});
	}

	onLoaded(value:boolean) {
		this.loadingAction = value;
	}
}
