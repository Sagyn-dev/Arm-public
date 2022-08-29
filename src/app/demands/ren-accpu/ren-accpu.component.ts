import { Component, OnInit } from '@angular/core';
import {tabService} from "@app/_services/tab.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {MatDialog} from "@angular/material/dialog";
import {AccountService} from "@app/_services/account.service";
import {FormService} from "@app/_services/form.service";
import {AddressService} from "@app/_services/address.service";
import {DemandService} from "@app/_services/demand.service";
import {ShareService} from "@app/_services";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {DeviceDetectorService} from "ngx-device-detector";
import {FileConfiguration} from "@app/_models/schemas";
import {Observable} from "rxjs";
import {Parameter} from "@app/_models";
import {AccountInfo} from "@app/_models/account";
import {InfoMessage} from "@app/_models/infoMessage"

@Component({
  selector: 'app-ren-accpu',
  templateUrl: './ren-accpu.component.html',
  styleUrls: ['./ren-accpu.component.css'],
  providers:[tabService,MessageService, ConfirmationService]
})
export class RenAccpuComponent implements OnInit {

  constructor(private dialog: MatDialog,private accountService:AccountService,
				  private formService:FormService,private messageService: MessageService,
				  private addressService: AddressService, private demandService:DemandService,
				  private shareService:ShareService,
				  private formBuilder: FormBuilder, private deviceService: DeviceDetectorService,
				  private confirmationService: ConfirmationService) { }
    infoMessage = InfoMessage;
   //@typeDocReg - 	Тип документа основания регистрации права собственности
	typeDocReg: any;
   loadTypeDocReg:boolean;
   selectTypeDocReg:any;

	//@typeDoc - Тип правоустанавливающего документа
	typeDoc:any;
	loadingDoc:boolean;
	selectDoc:any;
	//@serial_doc - серия документа
	serial_doc: string;
	num_doc: string;
	num_reg:string;
	//@data_v датав выдачи документа
	data_v:Date;
	//@inst - Учреждение
	inst: any;
	loadingInst: boolean;
	selectInst:any;
	scan_id: number;
	s_pasp: number;
	n_pasp:number;
	//@data_ps - дата выдачи паспорта
	datav_ps:Date;

	kod_podr:any;
	selectKodPodr:any;
	loadingKod:boolean;
	sc_pasp:number;
	//@fio_ab  - * Ф.И.О. собственника
	fio_ab:string;
	s_room:number;
	forma_sobst:any;
	selectForms:any;
	loadingForms:boolean;

	//Сканкопия документа основания
	sc_doc_bas: any;

	flagSobst: boolean = false;
	s_dolya:number;
	registerForm: FormGroup;

	get f() { return this.registerForm.controls; }

	tel: string;
	accpu_kvt: string='';
	accpu_vkr: string='';


	fileConfig: FileConfiguration;
	loadingSubmit: any;
	message: string;
	flagChange:boolean;
	alias_progam = 'cn_repair';

	accountFlataccs: any;
	loadingAccpu: boolean;
	selectItemAccpu: string;
	accountInfo:AccountInfo;

	vkrAccpu:any;
	loadVkr:boolean;
	selectVkr:any;
	statement_scan: any;
	//паспорт иного госудаства
	passport_another_country: boolean;

	ngOnInit(): void {
	  this.checkDevice();

	  //получаем данные об аккаунте
	  this.accountService.accInfo.subscribe((data: AccountInfo) =>
		  {
			  this.accountFlataccs=[];
			  this.selectItemAccpu=null;
			  this.selectVkr = null;
			  this.accountInfo = data;


			  setTimeout(()=>{
				  //получаем связанные лц
				  if(this.accountInfo){
					  this.loadingAccpu=true;
					  this.accountService.getKvtAccpu(this.accountInfo.accpu).subscribe((data:any)=>{
						  if(data){
								this.accountFlataccs = data;
								this.accountFlataccs.forEach(x=>{
									if(x.ACC_PU === this.accountInfo.accpu){
										this.selectItemAccpu = x.ACC_PU;
									}
								})
								this.loadingAccpu=false;
							  //получаем вкр
							  this.getVkrAccpu();
						  }

					  },error => {
						  console.log(error);
						  this.loadingAccpu=false;

					  })
				  }else console.log('accpu is null')
			  })
		  },
		  error => {
			  console.log(error)
		  })


	  //* Тип правоустанавливающего документа
	  setTimeout(()=>{
		  this.loadingDoc = true;
		  this.demandService.getTypeRuleDoc().subscribe(data=>{
			  if(data){
				  this.typeDoc = data;
				  this.loadingDoc = false;
				  this.selectDoc = this.typeDoc[0];
			  }
		  },error => {
			  this.loadingDoc = false;
			  this.message = error.message;
			  this.showError();
			  console.log(error);
		  })
	  })

	  //* Учреждение, выдавшее правоустанавливающий документ
	  setTimeout(()=>{
		  this.loadingInst = true;
		  this.demandService.getInst().subscribe(data=>{
			  if(data){
				  this.inst = data;
				  this.loadingInst = false;
				  this.selectInst = this.inst[0];

			  }
		  },error => {
			  this.loadingInst = false;
			  this.message = error.message;
			  this.showError();
			  console.log(error);
		  })
	  })

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

	  //* Форма собственности
	  setTimeout(()=>{
		  this.loadingForms = true;
		  this.demandService.getFormaSobs().subscribe(data=>{
			  if(data){
				  this.forma_sobst = data;
				  this.loadingForms = false;
				  this.selectForms = this.forma_sobst[0];

			  }
		  },error => {
			  this.loadingForms = false;
			  this.message = error.message;
			  this.showError();
			  console.log(error);
		  })
	  })

	  //Тип документа основания регистрации права собственности
	  setTimeout(()=>{
		  this.loadTypeDocReg = true;
		  this.demandService.getBaseTypeDoc().subscribe(data=>{
			  if(data){
				  this.typeDocReg = data;
				  this.loadTypeDocReg = false;
				  this.selectTypeDocReg = this.typeDocReg[1];

			  }
		  },error => {
			  this.loadTypeDocReg = false;
			  this.message = error.message;
			  this.showError();
			  console.log(error);
		  })
	  })

	  this.registerForm = this.formBuilder.group({
		  email: ['', [Validators.required, Validators.email,Validators.pattern('^[A-Za-zА-ЯЁа-яё0-9._%+-]+@[A-Za-zА-ЯЁа-яё0-9.-]+\\.[A-Za-zА-ЯЁа-яё]{2,4}$')]],
	  });
  }
   //получаем вкр по лс
	getVkrAccpu(){
		setTimeout(()=>{
			this.loadVkr = true;
			this.accountService.getVkrAccpu(this.accountInfo.accpu).subscribe(data=>{
				if(data){
					this.vkrAccpu = data;
					this.loadVkr = false;
					this.vkrAccpu.forEach(x=>{

						if(x.ACC_PU === this.accountInfo.accpu){
							this.selectVkr = x.ACC_PU;
						}
					})

					console.log(data);
				}
			},error => {
				this.loadVkr = false;
				this.message = error.message;
				this.showError();
				console.log(error);
			})
		})
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
	onExecute(form: NgForm) {
		if(form.valid) {
			const parameter: Parameter[] = [];
			//* Тип правоустанавливающего документа
			parameter.push(new Parameter(0,'', 'doc_type','TCHAR','', this.selectDoc.ID));
			//Серия правоустанавливающего документа
			parameter.push(new Parameter(0,'', 'doc_serial','TCHAR','', this.serial_doc));
			//Номер правоустанавливающего документа
			parameter.push(new Parameter(0,'', 'doc_number','TCHAR','', this.num_doc));
			//Номер записи регистрации
			parameter.push(new Parameter(0,'', 'num_record_reg','TCHAR','', this.num_reg));
			//Дата выдачи правоустанавлиющего документа
			parameter.push(new Parameter(0,'', 'doc_date','TDATE','', this.data_v));
			//* Учреждение, выдавшее правоустанавливающий документ
			parameter.push(new Parameter(0,'', 'doc_institution','TCHAR','', this.selectInst.ID));
			//* Сканкопия правоустанавливающего документа
			parameter.push(new Parameter(0,'', 'doc_scan','TCHAR','', this.scan_id));
			//Тип документа основания регистрации права собственности
			parameter.push(new Parameter(0,'', 'base_doc_type','TCHAR','', this.selectTypeDocReg.ID));
			//Сканкопия документа основания
			parameter.push(new Parameter(0,'', 'base_doc_scan','TCHAR','', this.sc_doc_bas));
			//Квартплатный лицевой счет
			parameter.push(new Parameter(0,'', 'accpu_kvt','TCHAR', '',this.selectItemAccpu));
			//Лицевой счет взносов на капитальный ремонт
			parameter.push(new Parameter(0,'', 'accpu_vkr','TCHAR', '',this.selectVkr));
			//* Серия паспорта
			parameter.push(new Parameter(0,'', 'serial_passport','TCHAR', '',this.s_pasp));
			//* Номера паспорта
			parameter.push(new Parameter(0,'', 'num_passport','TCHAR','', this.n_pasp));
			//дата выдачи паспорта
			parameter.push(new Parameter(0,'', 'date_passport','TDATE','', this.datav_ps));
			//* Кем выдан паспорт (код подразделения)
			parameter.push(new Parameter(0,'', 'org_passport','TCHAR','', this.selectKodPodr.ID));
			//* Сканкопия паспорта
			parameter.push(new Parameter(0,'', 'passport_scan','TCHAR', '',this.sc_pasp));
			//* Ф.И.О. собственника
			parameter.push(new Parameter(0,'', 'owner_name','TCHAR', '',this.fio_ab));
			//* Общая площадь жилого (нежилого) помещения
			parameter.push(new Parameter(0,'', 'room_space','TNUMBER', '',this.s_room));
			//* Форма собственности
			parameter.push(new Parameter(0,'', 'ownership_type','TCHAR','', this.selectForms.ID));
			//* Размер доли в праве общей собственности
			parameter.push(new Parameter(0,'', 'share_size','TCHAR','', this.s_dolya));
			//	Общая совместная собственность
			parameter.push(new Parameter(0,'', 'shared_ownership','TCHECK','', this.flagSobst));
			//* Номер телефона
			parameter.push(new Parameter(0,'', 'phone','TCHAR', '',this.tel));
			//Сканкопия заявления с подписью
			parameter.push(new Parameter(0,'', 'statement_scan','TCHAR', '',this.statement_scan));
			//* Ваш Email-адрес
			parameter.push(new Parameter(0,'', 'email','TCHAR','', this.registerForm.value.email));
			//Паспорт иного государства
			parameter.push(new Parameter(0,'', 'passport_another_country','TCHECK', '',this.passport_another_country));
			console.log(JSON.stringify(parameter));

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
						console.log(arr);
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

		this.selectForms = this.forma_sobst[0];
		this.selectKodPodr = this.kod_podr[0];
		this.selectInst = this.inst[0];
		this.selectDoc = this.typeDoc[0];
		this.selectTypeDocReg = this.typeDocReg[1];
		this.statement_scan = null;
		this.accpu_vkr = null;
		this.accpu_kvt = null;
		this.selectVkr = null;
		this.selectItemAccpu = null;
		this.serial_doc = null;
		this.num_doc = null;
		this.num_reg = null;
		this.data_v = null;
		this.scan_id = null;
		this.s_pasp = null;
		this.n_pasp = null;
		this.datav_ps = null;
		this.sc_pasp = null;
		this.fio_ab = null;
		this.s_room = null;
		this.s_dolya = null;
		this.tel = null;

		this.registerForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email,Validators.pattern('^[A-za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
		});

	}
	// @searchItem поиск по первому вхождению
	searchItem(term: string, item: any) {
		term = term.toLocaleLowerCase();
		return item.name.toLocaleLowerCase().startsWith(term);
	}

	// @searchItem поиск по первому вхождению
	searchNAME(term: string, item: any) {
		term = term.toLocaleLowerCase();
		return item.NAME.toLocaleLowerCase().startsWith(term);
	}

	showInfo() {
		this.messageService.add({severity:'info', summary: 'Информация', detail: this.message, life:5000});
	}

	showError() {
		this.messageService.add({severity:'error', summary: 'Ошибка', detail: this.message,life:5000});
	}

	change(){ this.flagChange = true; }

	onSelectInst(selectInst: any) {
		this.selectInst = selectInst;
	}

	onSelectKod(selectKodPodr: any) {
		this.selectKodPodr=selectKodPodr;
	}

	onSelectFormSobst(selectForms: any) {
		this.selectForms  = selectForms;
	}

	onChangeFlagSobst(flagSobst: boolean) {
		if (flagSobst){
			this.s_dolya = null;
		}
	}
	onSelectDoc(value: any) {
		this.selectDoc = value;
	}

	onSelectTypeDocReg(selectTypeDocReg: any) {
		this.selectTypeDocReg= selectTypeDocReg;
	}

	onSelectVkr(selectVkr: any) {
		this.selectVkr = selectVkr.ACC_PU;
	}

	onSelectKvt(selectItemAccpu: string) {
		this.selectItemAccpu = selectItemAccpu;
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
}
