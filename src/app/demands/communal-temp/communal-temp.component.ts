import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AccountService} from "@app/_services/account.service";
import {FormService} from "@app/_services/form.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {AddressService} from "@app/_services/address.service";
import {DemandService} from "@app/_services/demand.service";
import {ShareService} from "@app/_services";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {DeviceDetectorService} from "ngx-device-detector";
import {InfoMessage} from "@app/_models/infoMessage";
import {Abonent, FileConfiguration, Sub} from "@app/_models/schemas";
import {Observable} from "rxjs";
import {Parameter} from "@app/_models";
import {tabService} from "@app/_services/tab.service";
import {AccountInfo} from "@app/_models/account";

@Component({
  selector: 'app-communal-temp',
  templateUrl: './communal-temp.component.html',
  styleUrls: ['./communal-temp.component.less'],
  providers:[tabService,MessageService, ConfirmationService]
})
export class CommunalTempComponent implements OnInit {
	accountInfo: AccountInfo;
	alias_progam = 'cn_recalculate';
	infoMessage = InfoMessage;
	selectKodPodr:any;
	flagChange:boolean;
	//паспорт иного госудаства
	passport_another_country: boolean = false;
	s_pasp: number;
	n_pasp: number;
	datav_ps: Date;
	kod_podr: any;
	loadingKod: boolean;
	message:string;
	sc_pasp: number;
	fileConfig: FileConfiguration;
	fio_ab: string;
	loadingSubmit: boolean;
	registerForm: FormGroup;
	selectItemAccpu: string;
	subs: Abonent[] = [];
	dateBegin: any;
	dateEnd: any;
	tel: any;
	//Сканкопия заявления на перерасчет с подписью
	scan_id: number;
	//Сканкопия акта обследования
	act_scan: number;
	//Сканкопия отстуствия
	sc_miss: number;





	constructor(private dialog: MatDialog,private accountService:AccountService,
				  private formService:FormService,private messageService: MessageService,
				  private addressService: AddressService, private demandService:DemandService,
				  private shareService:ShareService,
				  private formBuilder: FormBuilder, private deviceService: DeviceDetectorService,private confirmationService: ConfirmationService) { }


  ngOnInit(): void {
	  this.registerForm = this.formBuilder.group({
		  email: ['', [Validators.required, Validators.email,Validators.pattern('^[A-Za-zА-ЯЁа-яё0-9._%+-]+@[A-Za-zА-ЯЁа-яё0-9.-]+\.[A-Za-zА-ЯЁа-яё]{2,4}$')]]
	  });
	  //проверка устройства
	  this.checkDevice();
	  this.subs.push(new Abonent('',this.dateBegin,this.dateBegin));
	  //получаем данные об аккаунте
	  this.accountService.accInfo.subscribe((data: AccountInfo) => {
		  this.selectItemAccpu = null;
		  this.accountInfo = data;
		  if(this.accountInfo){
			  this.selectItemAccpu = this.accountInfo.accpu;
		  }
	  });



	  //* Кем выдан паспорт (код подразделения)
	  setTimeout(()=>{
		  this.loadingKod = true;
		  this.demandService.getKodPodrazdelenie().subscribe(data=>{
			  if(data){
				  this.kod_podr = data;
				  this.loadingKod = false;
				  //this.selectKodPodr = this.kod_podr[0];
			  }
		  },error => {
			  this.loadingKod = false;
			  this.message = error.message;
			  this.showError();
		  })
	  })
  }
	// добавить абонента
	addSub() {
		this.subs.push(new Abonent('',this.dateBegin,this.dateEnd));
	}
	// удаление абонента

	delSub(){
		if(this.subs.length > 1){
			this.subs.pop();
		}
	}
	onExecute(form: NgForm) {
		if(form.valid) {
			const parameter: Parameter[] = [];
			//* Серия паспорта
			parameter.push(new Parameter(0,'', 'serial_passport','TCHAR','', this.s_pasp));
			//* Номера паспорта
			parameter.push(new Parameter(0,'', 'num_passport','TCHAR','', this.n_pasp));
			//дата выдачи паспорта
			parameter.push(new Parameter(0,'', 'date_passport','TDATE', '',this.datav_ps));
			//* Кем выдан паспорт (код подразделения)
			parameter.push(new Parameter(0,'', 'org_passport','TCHAR', '',this.selectKodPodr.ID));
			//* Сканкопия паспорта
			parameter.push(new Parameter(0,'', 'passport_scan','TCHAR', '',this.sc_pasp));
			//* Паспорт иного государства
			parameter.push(new Parameter(0,'', 'passport_another_country','TCHECK', '',this.passport_another_country));
			//* Ф.И.О. заявителя
			parameter.push(new Parameter(0,'', 'declarant_name','TCHAR', '',this.fio_ab));
			//* Лицевой счет
			parameter.push(new Parameter(0,'', 'acc_pu','TCHAR', '',this.selectItemAccpu));
			//* Номер телефона
			parameter.push(new Parameter(0,'', 'phone','TCHAR','',this.tel));
			//* Ваш Email-адрес
			parameter.push(new Parameter(0,'', 'email','TCHAR', '',this.registerForm.value.email));
			//Сканкопия заявления на перерасчет с подписью
			parameter.push(new Parameter(0,'', 'recalculation_statement_scan','TCHAR','', this.scan_id));
			//Сканкопия акта обследования
			parameter.push(new Parameter(0,'', 'scan_act_inspection','TCHAR','', this.act_scan));
			//* Сканкопия документа, подтверждающая временное отсутствие
			parameter.push(new Parameter(0,'', 'timeout_scan','TCHAR','', this.sc_miss));
			//* Список временно отсутствующих абонентов    список абонентов
			parameter.push(new Parameter(0,'', 'timeout_list_initial','TCHAR','', this.parseStrSubs(this.subs)));
			console.log(parameter);


			setTimeout(()=>{
				this.loadingSubmit = true;
				this.demandService.createOrder(this.alias_progam,parameter).subscribe(data=>{
					if(data){
						this.loadingSubmit = false;
						this.message = 'Ваша заявка № ' +data+ ' принята в работу.'
						this.showInfo();
						setTimeout(()=>{
							this.onCleanForm();
							this.ngOnInit();
							form.onReset();
						},1500);

						//this.onCleanForm();
					}
				},error => {
					this.loadingSubmit = false;
					if(error.error){
						let err = error.error;
						let arr = [];

						Object.keys(err).map(function (key) {
							arr.push(err[key]);
							return arr;
						})

						for (let ms of arr){
							ms.forEach(x=>{
								this.message  = x;
								this.showError();
							})
						}
					}else{
						this.message = error.message;
						this.showError();
					}
				})
			})
		}
	}
	onCleanForm(){

		this.selectKodPodr = this.kod_podr[0];
		this.s_pasp = null;
		this.n_pasp = null;
		this.datav_ps = null;
		this.sc_pasp = null;
		this.fio_ab = null;
		this.subs = [];
		this.selectItemAccpu = null;
		this.tel = null;
		this.passport_another_country = false;
		this.registerForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email,Validators.pattern('^[A-za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
		});
		this.scan_id = null;
		this.act_scan = null;
		this.sc_miss = null;

	}
	parseStrSubs(value:Abonent[]):string{
		console.log(value);
		let str:string='';
		for(let sub of value){
			str+='fio='.concat(sub.fio).concat(',d_in=').concat((sub.d_in !== undefined) ? this.getFormattedDate(sub.d_in) : 'null')
				.concat(',d_out=').concat((sub.d_out !== undefined) ? this.getFormattedDate(sub.d_out) : 'null')
				.concat('~');
		}
		console.log(str);
		return str;
	}
	getFormattedDate(val) {
		let date = new Date(val)
		let year = date.getFullYear();
		let month = (1 + date.getMonth()).toString().padStart(2, '0');
		let day = date.getDate().toString().padStart(2, '0');

		return day + '.' + month + '.' + year;
	}
	//проверка устройства
	checkDevice() {
		const isMobile = this.deviceService.isMobile();
		const isTablet = this.deviceService.isTablet();
		const isDesktopDevice = this.deviceService.isDesktop();
		if(isTablet || isMobile){
			this.fileConfig = new FileConfiguration(false,false,true,true,true);
		}
		if(isDesktopDevice){
			this.fileConfig = new FileConfiguration(true,false,true,true,true);
		}
	}

	canDeactivate() : boolean | Observable<boolean>{

		if(this.flagChange){
			return confirm('Вы хотите покинуть страницу?');
		}
		else{
			return true;
		}
	}
	//searchItem поиск по первому вхождению

	searchNAME(term: string, item: any) {
		term = term.toLocaleLowerCase();
		return item.NAME.toLocaleLowerCase().startsWith(term);
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
	onSelectKod(selectKodPodr: any) {
		this.selectKodPodr=selectKodPodr;
	}
	change(){ this.flagChange = true; }
	get f() { return this.registerForm.controls; }
	showInfo() {
		this.messageService.add({severity:'info', summary: 'Информация', detail: this.message, life:5000});
	}

	showError() {
		this.messageService.add({severity:'error', summary: 'Ошибка', detail: this.message,life:5000});
	}
}
