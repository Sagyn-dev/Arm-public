import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {tabService} from "@app/_services/tab.service";
import {InfoMessage} from "@app/_models/infoMessage";
import {FileConfiguration, Ipu, Sub} from "@app/_models/schemas";
import {DeviceDetectorService} from "ngx-device-detector";
import {DemandService} from "@app/_services/demand.service";
import {Parameter} from "@app/_models";
import {AccountInfo} from "@app/_models/account";
import {AccountService} from "@app/_services/account.service";

@Component({
  selector: 'app-ipu-enter',
  templateUrl: './ipu-enter.component.html',
  styleUrls: ['./ipu-enter.component.less'],
  providers:[MessageService,tabService,ConfirmationService]
})
export class IpuEnterComponent implements OnInit {
	srv: any;
	loadSrv: boolean;
	selectSrv: any;
	message:string;
	infoMessage = InfoMessage;
	ipus:Ipu[]=[];
	flagChange:boolean;
	alias_program = 'cn_beg_exploitation_pu';
	registerForm: FormGroup;
	typeIpu: any;
	loadIpu: boolean;
	locationIpu: any;
	loadLocationIpu: boolean;
	fio_st: string;
	accpu: string;
	tel: any;
	statement_scan: number;
	fileConfig: FileConfiguration;
	deviceInfo = null;
	act_scan: number;
	scan_id: number;
	loadingSubmit: boolean;
  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,private formBuilder: FormBuilder,private deviceService: DeviceDetectorService, private demandService: DemandService,
				  private accountService:AccountService) { }

  ngOnInit(): void {
	  //получаем данные об аккаунте
	  this.accountService.accInfo.subscribe((data: AccountInfo) => {
		  if(data){
			  this.accpu = data.accpu;
		  }
	  })

	  this.registerForm = this.formBuilder.group({
		  email: ['', [Validators.required, Validators.email,Validators.pattern('^[A-Za-zА-ЯЁа-яё0-9._%+-]+@[A-Za-zА-ЯЁа-яё0-9.-]+\.[A-Za-zА-ЯЁа-яё]{2,4}$')]]
	  });
	  this.checkDevice();
	  this.getSrv();
	  this.addIpu();
	  this.getTypeIpu();
	  this.getLocationIpu();


  }
   getLocationIpu(){
		setTimeout(()=>{
			this.loadLocationIpu = true;
			this.demandService.getLocationIpu().subscribe(data=>{
				this.locationIpu = data;
				this.loadLocationIpu = false;
				console.log(data);
			},error => {
				this.loadLocationIpu = false;
				this.message = error.error.message;
				this.showError();
			})
		})
	}
   getTypeIpu(){
		setTimeout(()=>{
			this.loadIpu = true;
			this.demandService.getTypeIpu().subscribe(data=>{
				this.typeIpu = data;
				this.loadIpu = false;
				console.log(data);
			},error => {
				this.loadIpu = false;
				this.message = error.error.message;
				this.showError();
			})
		})
	}
	getSrv(){
		// получение услуг
		setTimeout(()=>{
			this.loadSrv = true;
			this.demandService.getSrv().subscribe(data=>{
				this.srv = data;
				this.loadSrv = false;
				console.log(data);
			},error => {
				this.loadSrv = false;
				this.message = error.error.message;
				this.showError();
			})
		})
	}
	parseStrIpu(value:Ipu[]):string{
		console.log(value);
		let str:string='';
		for(let ipu of value){
			str+='srv_list='.concat(ipu.srv).concat(',pu_new_serial_number=').concat(ipu.ipuNum?.toString()).concat(',pu_begin_date=').concat((ipu.dateIpu !== undefined) ? this.getFormattedDate(ipu.dateIpu) : 'null')
				.concat(',pu_type=').concat(ipu.typeIpu?.toString()).concat(',pu_begin_ind=').concat(ipu.indicationIpu?.toString())
				.concat(',pu_typeset=').concat(ipu.localIpu)
				.concat(',prove_date=').concat((ipu.dateNextCheck != undefined) ? this.getFormattedDate(ipu.dateNextCheck) : 'null')
				.concat(',pu_old_serial_number=').concat(ipu.isReplaced ? ipu.ipuNumTakeOf : '')
				.concat(',pu_ind_act=').concat(ipu.isReplaced ? ipu.indicationIpuTakeOf?.toString(): '')
				.concat(',pu_replacement=').concat(ipu.isReplaced?.toString()).concat('~');
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
	onExecute(form: NgForm) {
		if(form.valid){
			const parameter: Parameter[] = [];

			parameter.push(new Parameter(0,'', 'ipu_list','TCHAR', '',this.parseStrIpu(this.ipus)));
			parameter.push(new Parameter(0,'', 'declarant_name','TCHAR', '',this.fio_st));
			parameter.push(new Parameter(0,'', 'acc_pu','TCHAR', '',this.accpu));
			parameter.push(new Parameter(0,'', 'phone','TCHAR', '',this.tel));
			parameter.push(new Parameter(0,'', 'email','TCHAR', '',this.registerForm.value.email));
			parameter.push(new Parameter(0,'', 'statement_scan','TFILE','', this.statement_scan));
			parameter.push(new Parameter(0,'', 'act_scan','TFILE','', this.act_scan));
			parameter.push(new Parameter(0,'', 'scan_passport_ipu','TCHAR','', this.scan_id));

			//сканкопия заявления


			console.log(JSON.stringify(parameter));
			setTimeout(()=>{
				this.loadingSubmit = true;
				this.demandService.createOrder(this.alias_program,parameter).subscribe(data=>{
					if(data){
						this.loadingSubmit = false;
						this.message = 'Ваша заявка № ' +data+ ' принята в работу.'
						this.showInfo();
						setTimeout(()=>{
							this.onCleanForm();
							this.ngOnInit();
							form.onReset();
						},1500);

						this.onCleanForm();
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

	//проверка устройства
	checkDevice() {
		this.deviceInfo = this.deviceService.getDeviceInfo();
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
	change(){ this.flagChange = true; }
	get f() { return this.registerForm.controls; }
	showInfo() {
		this.messageService.add({severity:'info', summary: 'Информация', detail: this.message, life:5000});
	}

	showError() {
		this.messageService.add({severity:'error', summary: 'Ошибка', detail: this.message,life:5000});
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

	addIpu() {
  		if(this.ipus.length < 4){
			this.ipus.push(new Ipu(null,null,null,null,null,null,null,false,null,null));
		}
	}

	delIpu() {
		if(this.ipus.length>1){
			this.ipus.pop();
		}
	}

	onCleanForm() {
		this.ipus = [];
		this.tel = null;
		this.statement_scan = null;
		this.scan_id = null;
		this.act_scan = null;
		this.accpu = null;
		this.registerForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email,Validators.pattern('^[A-Za-zА-ЯЁа-яё0-9._%+-]+@[A-Za-zА-ЯЁа-яё0-9.-]+\\.[A-Za-zА-ЯЁа-яё]{2,4}$')]]
		});
		this.fio_st = '';
	}
}
