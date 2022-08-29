import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {AddressId, City, CityType, FlatsByHouse, House, Street, StreetType} from "@app/_models/address";
import {AccountInfo} from "@app/_models/account";
import {FileConfiguration} from "@app/_models/schemas";
import {MatDialog} from "@angular/material/dialog";
import {AccountService} from "@app/_services/account.service";
import {FormService} from "@app/_services/form.service";
import {AddressService} from "@app/_services/address.service";
import {DemandService} from "@app/_services/demand.service";
import {ShareService} from "@app/_services";
import {tabService} from "@app/_services/tab.service";
import {Observable} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {Parameter} from "@app/_models";
import {InfoMessage} from "@app/_models/infoMessage";

@Component({
  selector: 'app-new-accpu',
  templateUrl: './new-accpu.component.html',
  styleUrls: ['./new-accpu.component.css'],
  providers:[tabService,MessageService, ConfirmationService]
})
export class NewAccpuComponent implements OnInit {
	private loading: boolean;


  constructor(private dialog: MatDialog,private accountService:AccountService,
				  private formService:FormService,private messageService: MessageService,
				  private addressService: AddressService, private demandService:DemandService,
				  private shareService:ShareService,
				  private formBuilder: FormBuilder, private deviceService: DeviceDetectorService,private confirmationService: ConfirmationService) { }
	infoMessage = InfoMessage;
	/// <summary>
	/// Тип населенного пункта
	/// </summary>
	cityType: CityType[];
	/// <summary>
	/// ИД выбраного населенного пункта
	/// </summary>
	selectedCityTypeID : any;
	/// <summary>
	/// Тип улицы
	/// </summary>
	streetType: StreetType[];
	/// <summary>
	/// ИД выбраного населеного пункта
	/// </summary>
	selectedStreetTypeID:number;
	/// <summary>
	/// Населенный пункт
	/// </summary>
	city: City[];
	/// <summary>
	/// ИД выбраного населеного пункта
	/// </summary>
	selectedCityID:any;
	/// <summary>
	/// улица
	/// </summary>
	street: Street[];
	/// <summary>
	/// ИД выбраного населеного пункта
	/// </summary>
	selectedStreetID:any;
	/// <summary>
	/// дома
	/// </summary>
	house: House[];
	/// <summary>
	/// ИД выбраного населеного пункта
	/// </summary>
	selectedHouseID:any;
	/// <summary>
	/// квартиры
	/// </summary>
	flat: FlatsByHouse [];
	/// <summary>
	/// ИД выбраной кв
	/// </summary>
	selectedFlatID:any;
	/// <summary>
	/// account info
	/// </summary>
	accountInfo: AccountInfo[];

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
	scan_d: number;
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

	flagSobst: boolean = false;
	s_dolya:number;

	// @loadingCityType используется для проверки загрузки
	loadingCityType: boolean;
	loadingCity: boolean;
	loadingStreetType: boolean;
	loadingStreet: boolean;
	loadingHouse: boolean;
	loadingFlat: boolean;
	loadingAccount: boolean;

	show = true;
	dateBegin: any;
	dateEnd: any;
	tel: any;
	statement_scan: any;
	registerForm: FormGroup;

	fileConfig: FileConfiguration;
	loadingSubmit: any;
	message: string;
	flagChange:boolean;
	alias_progam = 'cn_opennew_accpu';

	address:AddressId;
	accountInfoService:AccountInfo;
	selectItemAccpu:string;
	//паспорт иного госудаства
	passport_another_country: boolean;

	get f() { return this.registerForm.controls; }

  ngOnInit(): void {
		//проверка устройства
  	  this.checkDevice();
  	  //получение лс
	  this.getAccpu();

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
			 // console.log(error);
		  })
	  })


	  this.registerForm = this.formBuilder.group({
		  email: ['', [Validators.required, Validators.email,Validators.pattern('^[A-Za-zА-ЯЁа-яё0-9._%+-]+@[A-Za-zА-ЯЁа-яё0-9.-]+\\.[A-Za-zА-ЯЁа-яё]{2,4}$')]]
	  });


	  //получаем тип населенного пункта
	  this.getTypeCity();

	  //получаем тип улицы
	  this.getTypeStreet();

  }
  //получение лс из панели
	getAccpu(){
		// получаем данные об аккаунте
		setTimeout(()=>{
			this.accountService.accInfo.subscribe((data: AccountInfo) =>
				{
					this.loading = true;
					if(data){
						this.accountInfoService = data;
						this.selectItemAccpu = this.accountInfoService.accpu;
						this.loading=false;
						//получить аддрессид и заполнить поля поиска
						this.getAddressId();
					}
				},
				error => {
					this.loading=false;
					console.log(error)
				})
		})
	}
	//заполнение поиска
	getAddressId(){
		setTimeout(()=>{
			this.addressService.getAddressId(this.selectItemAccpu).subscribe(data=>{
				if(data){
					this.address = data[0];
					if(this.address){
						this.fillAddress(this.address);
					}

				}
			});
		})
	}
	//заполнение полей
	fillAddress(address:AddressId){
		if(address) {
			setTimeout(() => {
				this.getTypeCity();
				this.getTypeStreet();

				this.onSelectStreetType(address.idCity, address.idTypeStreet);
				this.onSelectHouse(address.idStreet);
				this.onSelectFlat(address.idHouse);
			},500)
		}
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

	onExecute(form: NgForm) {
		if(form.valid) {
			const parameter: Parameter[] = [];
			//* Тип правоустанавливающего документа
			parameter.push(new Parameter(0,'', 'doc_type','TCHAR','', this.selectDoc.ID));
			//Серия правоустанавливающего документа
			parameter.push(new Parameter(0,'', 'doc_serial','TCHAR','', this.serial_doc));
			//Номер правоустанавливающего документа
			parameter.push(new Parameter(0,'', 'doc_number','TCHAR', '',this.num_doc));
			//Номер записи регистрации
			parameter.push(new Parameter(0,'', 'num_record_reg','TCHAR', '',this.num_reg));
			//Дата выдачи правоустанавлиющего документа
			parameter.push(new Parameter(0,'', 'doc_date','TDATE', '',this.data_v));
			//* Учреждение, выдавшее правоустанавливающий документ
			parameter.push(new Parameter(0,'', 'doc_institution','TCHAR', '',this.selectInst.ID));
			//* Сканкопия правоустанавливающего документа
			parameter.push(new Parameter(0,'', 'doc_scan','TCHAR', '',this.scan_id));
			//* Сканкопия документа-основания перехода права
			parameter.push(new Parameter(0,'', 'base_doc_scan','TCHAR', '',this.scan_d));
			//* Тип населенного пункта
			parameter.push(new Parameter(0,'', 'id_type_city','TCHAR', '',this.selectedCityTypeID.id));
			//* Населенный пункт
			parameter.push(new Parameter(0,'', 'id_city','TCHAR', '',this.selectedCityID.id));
			//* Тип улицы
			parameter.push(new Parameter(0,'', 'id_type_street','TCHAR', '',this.selectedStreetTypeID));
			//* Улица
			parameter.push(new Parameter(0,'', 'id_street','TCHAR','', this.selectedStreetID.id));
			//Дом
			parameter.push(new Parameter(0,'', 'id_house','TCHAR','', this.selectedHouseID.id));
			//Квартира
			parameter.push(new Parameter(0,'', 'id_flat','TCHAR','', this.selectedFlatID.id));
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
			//* Ф.И.О. собственника
			parameter.push(new Parameter(0,'', 'owner_name','TCHAR', '',this.fio_ab));
			//* Общая площадь жилого (нежилого) помещения
			parameter.push(new Parameter(0,'', 'room_space','TNUMBER', '',this.s_room));
			//* Форма собственности
			parameter.push(new Parameter(0,'', 'ownership_type','TCHAR','', this.selectForms.ID));
			//* Размер доли в праве общей собственности
			parameter.push(new Parameter(0,'', 'share_size','TCHAR','', this.s_dolya));
			//	Общая совместная собственность
			parameter.push(new Parameter(0,'', 'shared_ownership','TCHECK','',this.flagSobst));
			//сканкопия заявления
			parameter.push(new Parameter(0,'', 'statement_scan','TCHAR','', this.statement_scan));
			//* Номер телефона
			parameter.push(new Parameter(0,'', 'phone','TCHAR','',this.tel));
			//* Ваш Email-адрес
			parameter.push(new Parameter(0,'', 'email','TCHAR', '',this.registerForm.value.email));
			//Паспорт иного государства
			parameter.push(new Parameter(0,'', 'passport_another_country','TCHECK', '',this.passport_another_country));

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
		this.selectedCityID = null;
		this.selectedCityTypeID = this.cityType[0];
		this.selectedStreetTypeID=null;
		this.selectedStreetID = null;
		this.selectedHouseID = null;
		this.selectedFlatID = null;
		this.selectForms = this.forma_sobst[0];
		this.selectKodPodr = this.kod_podr[0];
		this.selectInst = this.inst[0];
		this.selectDoc = this.typeDoc[0];
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
		this.statement_scan = null;
		this.tel = null;
		this.passport_another_country = false;
		this.registerForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email,Validators.pattern('^[A-za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
		});

	}
	//получаем тип населенного пункта
	getTypeCity(){
		if(!this.cityType){
			setTimeout(()=> {
				// получить тип населеного пункта
				this.loadingCityType = true;
				this.addressService.getCityType().subscribe((data: CityType[]) => {
						if(data){
							this.cityType = data;
							this.loadingCityType = false;
							this.selectedCityTypeID = this.cityType[0];
							if(this.selectedCityTypeID){
								this.onSelectCityType(this.selectedCityTypeID);
							}
						}

					},
					error => {
						//  console.log(error);
						this.message = error.error.message;
						this.showError()
						this.loadingCityType = false;
					});
			});
		}else{
			if(this.address){
				this.cityType.forEach(value => {
					if(value.id == this.address.idTypeCity){
						this.selectedCityTypeID = value;
						this.onSelectCityType(this.selectedCityTypeID);
					}
				})
			}
		}
	}


	/// @onSelectCityType получение населеного пункта
	onSelectCityType(value:any){
		console.log(value);
		this.selectedCityTypeID = value;
		this.selectedCityID=null;
		this.city = [];
		this.selectedStreetTypeID = null;
		this.selectedStreetID=null;
		this.street = [];
		this.selectedHouseID=null;
		this.house = [];
		this.selectedFlatID=null;
		this.flat = [];
		this.flagChange = true;
		if(value) {
			setTimeout(() => {
				this.loadingCity = true;
				this.addressService.getCityWithoutAcc(value.id).subscribe((data: City[]) => {
						this.city = data;
						this.loadingCity = false;
						if(this.address){
							this.city.forEach(value1 => {
								if(value1.id == this.address.idCity){
									this.selectedCityID = value1;
								}
							})
						}
					},
					error => {
						this.message = error.error.message;
						this.showError();
						this.loadingCity = false;
					});
			});
		}
	}
	//получение типа улиц
	getTypeStreet(){
		// @streetType пустой то загружать с сервера
		if(!this.streetType){
			setTimeout(()=>{
				// получить тип улицы
				this.loadingStreetType = true;
				this.addressService.getStreetType().subscribe((data:StreetType[]) => {
						this.streetType = data;
						this.loadingStreetType = false;
					},
					error => {

						this.message = error.error.message;
						this.showError();
						this.loadingStreetType = false;
					});
			});
		}else{
			if(this.address){
				this.streetType.forEach(value => {
					if(value.id == this.address.idTypeStreet){
						this.selectedStreetTypeID = value.id;
					}
				})
			}
		}
	}

	/// @onSelectCity влияет на измение списков идущих после населеного пункта
	onSelectCity(value:any){
		this.selectedStreetTypeID=null;
		this.selectedStreetID=null;
		this.street = [];
		this.selectedHouseID=null;
		this.house = [];
		this.selectedFlatID=null;
		this.flat = [];
		this.flagChange = true;
	}

	/// @onSelectStreetType получение улиц
	onSelectStreetType(selectedCityID,selectedStreetTypeID:number){
		this.selectedStreetID=null;
		this.street=[];
		this.selectedHouseID=null;
		this.house = [];
		this.selectedFlatID=null;
		this.flat = [];
		this.flagChange = true;
		let city:any | number;

		if(typeof selectedCityID == "object"){
			city = selectedCityID.id
		}else {
			city = selectedCityID;
		}
		if(city && selectedStreetTypeID){
			setTimeout(()=>{
				this.loadingStreet = true;
				console.log(city);
				this.addressService.getStreetWithoutAcc(city,selectedStreetTypeID).subscribe((data:Street[]) => {
						this.street = data;
						this.loadingStreet = false;
						if(this.address){
							this.street.forEach(value => {
								if(value.id == this.address.idStreet){
									this.selectedStreetID = value;
								}
							})
						}
					},
					error => {
					console.log(error);
						this.message = error.error.message;
						this.showError();
						this.loadingStreet = false;
					});
			});
		}
	}

	/// @onSelectHouse получение домов
	onSelectHouse(selectStreetID:any|number){
		this.selectedHouseID=null;
		this.house=[];
		this.selectedFlatID=null;
		this.flat = [];
		this.flagChange = true;
		let street:any|number;
		if(typeof selectStreetID == "object"){
			street = selectStreetID.id
		}else {
			street = selectStreetID;
		}

		if(selectStreetID){
			setTimeout(()=>{this.loadingHouse = true;
				this.addressService.getHouseWithoutAcc(street).subscribe((data:House[]) => {
						this.house = data;
						this.loadingHouse = false;
						if(this.address){
							this.house.forEach(value => {
								if(value.id == this.address.idHouse){
									this.selectedHouseID  = value;
								}
							})
						}
					},
					error => {

						this.message = error.error.message;
						this.showError();
						this.loadingHouse = false;
					});
			});
		}
	}

	/// @onSelectFlat получение квартир
	onSelectFlat(selectHouseId:any){
		this.selectedFlatID=null;
		this.flat = [];
		this.flagChange = true;
		let house:any | number;
		if(typeof selectHouseId == "object"){
			house = selectHouseId.id;
		}else {
			house = selectHouseId;
		}
		if(house) {
			setTimeout(() => {
				this.loadingFlat = true;
				this.addressService.getFlatWithoutAcc(house).subscribe((data: FlatsByHouse[]) => {
						if (data){
							this.flat = data;
							this.loadingFlat = false;
							if(this.flat.length == 1){
								this.selectedFlatID = this.flat[0];
							}
							if(this.address){
								this.flat.forEach(value => {
									if(value.id == this.address.idflat){
										this.selectedFlatID = value;
									}
								})
							}
						}

					},
					error => {
						this.message = error.error.message;
						this.showError();
						this.loadingFlat = false;
					});
			});
		}
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

	// @searchItem поиск по первому вхождению дом
	searchItemHouse(term: string, item: any) {
		term = term.toLocaleLowerCase();
		return item.house.toLocaleLowerCase().startsWith(term);
	}

	showInfo() {
		this.messageService.add({severity:'info', summary: 'Информация', detail: this.message, life:5000});
	}

	showError() {
		this.messageService.add({severity:'error', summary: 'Ошибка', detail: this.message,life:5000});
	}

	onSelectAport(selectedHouseID: any) {
		if(selectedHouseID){
			this.selectedFlatID = selectedHouseID.id;
		}
	}

	// @searchItemFlat поиск по первому вхождению квартира
	searchItemFlat(term: string, item: any) {
		term = term.toLocaleLowerCase();
		return item.flat.toLocaleLowerCase().startsWith(term);
	}

	onSelectDoc(value: any) {
		this.selectDoc = value;
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
}
