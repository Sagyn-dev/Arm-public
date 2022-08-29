import {Component, OnInit} from '@angular/core';
import {AddressId, City, CityType, FlatsByHouse, House, Street, StreetType} from '@app/_models/address';
import {AccountInfo} from '@app/_models/account';
import {AccountService} from '@app/_services/account.service';
import {FormService} from '@app/_services/form.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {tabService} from '@app/_services/tab.service';
import {AddressService} from '@app/_services/address.service';
import {MatDialog} from '@angular/material/dialog';
import {FileConfiguration, Sub} from '@app/_models/schemas';
import {DemandService} from '@app/_services/demand.service';
import {ShareService} from '@app/_services';
import {Parameter, Value} from '@app/_models';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {ComponentCanDeactivate} from '@app/exit.guard';
import {DeviceDetectorService} from "ngx-device-detector";
import {InfoMessage} from "@app/_models/infoMessage";

@Component({
	selector: 'app-tko',
	templateUrl: './tko.component.html',
	styleUrls: ['./tko.component.less'],
	providers: [MessageService, tabService, ConfirmationService]
})
export class TkoComponent implements OnInit, ComponentCanDeactivate {
	infoMessage = InfoMessage;
	/// <summary>
	/// Тип населенного пункта
	/// </summary>
	cityType: CityType[];
	/// <summary>
	/// ИД выбраного населенного пункта
	/// </summary>
	selectedCityTypeID: any;
	/// <summary>
	/// Тип улицы
	/// </summary>
	streetType: StreetType[];
	/// <summary>
	/// ИД выбраного населеного пункта
	/// </summary>
	selectedStreetTypeID: number;
	/// <summary>
	/// Населенный пункт
	/// </summary>
	city: City[];
	/// <summary>
	/// ИД выбраного населеного пункта
	/// </summary>
	selectedCityID: any;
	/// <summary>
	/// улица
	/// </summary>
	street: Street[];
	/// <summary>
	/// ИД выбраного населеного пункта
	/// </summary>
	selectedStreetID: any;
	/// <summary>
	/// дома
	/// </summary>
	house: House[];
	/// <summary>
	/// ИД выбраного населеного пункта
	/// </summary>
	selectedHouseID: any;
	/// <summary>
	/// квартиры
	/// </summary>
	flat: FlatsByHouse [];
	/// <summary>
	/// ИД выбраной кв
	/// </summary>
	selectedFlatID: any;
	/// <summary>
	/// account info
	/// </summary>
	accountInfo: AccountInfo[];
	// @loadingCityType используется для проверки загрузки
	loadingCityType: boolean;
	loadingCity: boolean;
	loadingStreetType: boolean;
	loadingStreet: boolean;
	loadingHouse: boolean;
	loadingFlat: boolean;
	loadingAccount: boolean;
	loadingStatus: boolean;
	show = true;
	dateBegin: any;
	dateEnd: any;
	tel: any;

	fio_st: string;
	fileConfig: FileConfiguration;
	loadingSubmit: any;
	status_sub: any; // список статусов абонента
	selectedStatus: any; // выбранный статус
	image: any;
	scan_id: number;

	message: any;
	alias_progam = 'cn_statement_tko';
	registerForm: FormGroup;
	flagChange: boolean;
	// абоненты
	subs: Sub[] = [];
	deviceInfo = null;
	statement_scan: any;

	address: AddressId;
	accountInfoService: AccountInfo;
	selectItemAccpu: string;

	constructor(private dialog: MatDialog, private accountService: AccountService,
					private formService: FormService, private messageService: MessageService,
					private addressService: AddressService, private demandService: DemandService,
					private shareService: ShareService,
					private formBuilder: FormBuilder,
					private deviceService: DeviceDetectorService, private confirmationService: ConfirmationService) {
	}


	saved = false;

	save() {
		this.saved = true;
	}

	canDeactivate(): boolean | Observable<boolean> {
		if (this.flagChange) {
			return confirm('Вы хотите покинуть страницу?');
		} else {
			return true;
		}
	}

	ngOnInit(): void {
		//получение лс
		this.getAccpu();
		this.registerForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email, Validators.pattern('^[A-Za-zА-ЯЁа-яё0-9._%+-]+@[A-Za-zА-ЯЁа-яё0-9.-]+\.[A-Za-zА-ЯЁа-яё]{2,4}$')]]
		});

		// получаем id формы
		this.shareService.itemNav.subscribe((data) => {
			if (data) this.alias_progam = data.alias;
			// console.log(this.alias_progam);
		}, error => {
			console.log(error)
		});

		// @getSaveService получение данных из службы
		// this.getSaveService();


		//получаем тип населенного пункта
		this.getTypeCity();

		//получаем тип улицы
		this.getTypeStreet();

		// получение статуса абонента
		setTimeout(() => {
			this.loadingStatus = true;
			this.demandService.getSubStatus().subscribe(data => {
				this.status_sub = data;
				this.loadingStatus = false;
				this.selectedStatus = this.status_sub[0];
				if (this.selectedStatus) {
					this.subs = [];
					this.subs.push(new Sub('', this.selectedStatus.id, this.dateBegin, this.dateBegin));
				} else {
					this.addSub();
				}
				// console.log(this.status_sub[0],this.status_sub)
			}, error => {
				this.loadingStatus = false;
				this.message = error.error.message;
				this.showError();
			})
		})

		this.checkDevice();
	}

	//проверка устройства
	checkDevice() {
		this.deviceInfo = this.deviceService.getDeviceInfo();
		const isMobile = this.deviceService.isMobile();
		const isTablet = this.deviceService.isTablet();
		const isDesktopDevice = this.deviceService.isDesktop();
		if (isTablet || isMobile) {
			this.fileConfig = new FileConfiguration(false, false, true, true, true);
		}
		if (isDesktopDevice) {
			this.fileConfig = new FileConfiguration(true, false, true, true, true);
		}
	}

	change() {
		this.flagChange = true;
	}

	get f() {
		return this.registerForm.controls;
	}

	// добавить абонента
	addSub() {
		this.subs.push(new Sub('', this.selectedStatus.id, this.dateBegin, this.dateEnd));
	}

	// удаление абонента

	delSub() {
		if (this.subs.length > 1) {
			this.subs.pop();
		}
	}

	parseStrSubs(value: Sub[]): string {
		console.log(value);
		let str: string = '';
		for (let sub of value) {
			str += 'fio='.concat(sub.fio).concat(',d_in=').concat((sub.d_in !== undefined) ? this.getFormattedDate(sub.d_in) : 'null')
				.concat(',d_out=').concat((sub.d_out !== undefined) ? this.getFormattedDate(sub.d_out) : 'null')
				.concat(',reg=').concat(sub.reg.toString()).concat('~');
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

	// кнопка выполнить
	onExecute(form: NgForm) {
		if (form.valid) {
			const parameter: Parameter[] = [];
			this.parseStrSubs(this.subs); //тут нужно закомментировать
			parameter.push(new Parameter(0, '', 'lstreet', 'TCHAR', '', this.selectedStreetID.id));
			parameter.push(new Parameter(0, '', 'lhouse', 'TCHAR', '', this.selectedHouseID.id));
			parameter.push(new Parameter(0, '', 'lflat', 'TCHAR', '', this.selectedFlatID.id));
			parameter.push(new Parameter(0, '', 'lfio_list', 'TCHAR', '', this.parseStrSubs(this.subs)));
			parameter.push(new Parameter(0, '', 'phone', 'TCHAR', '', this.tel));
			//parameter.push(new Parameter(0,'', 'statement_tko','TCHAR', this.templateId));
			parameter.push(new Parameter(0, '', 'scan_apply', 'TCHAR', '', this.scan_id));
			parameter.push(new Parameter(0, '', 'email', 'TCHAR', '', this.registerForm.value.email));
			//сканкопия заявления
			parameter.push(new Parameter(0, '', 'statement_tko', 'TCHAR', '', this.statement_scan));
			parameter.push(new Parameter(0, '', 'declarant_name', 'TCHAR', '', this.fio_st));
			console.log(JSON.stringify(parameter));
			setTimeout(() => {
				this.loadingSubmit = true;
				this.demandService.createOrder(this.alias_progam, parameter).subscribe(data => {
					if (data) {
						this.loadingSubmit = false;
						this.message = 'Ваша заявка № ' + data + ' принята в работу.'
						this.showInfo();
						setTimeout(() => {
							this.onCleanForm();
							this.ngOnInit();
							form.onReset();
						}, 1500);

						//this.onCleanForm();
					}
				}, error => {
					this.loadingSubmit = false;
					if (error.error) {
						let err = error.error;
						let arr = [];

						Object.keys(err).map(function (key) {
							arr.push(err[key]);
							return arr;
						})
						console.log(arr);
						for (let ms of arr) {
							ms.forEach(x => {
								this.message = x;
								this.showError();
							})
						}
					} else {
						this.message = error.message;
						this.showError();
					}
				})
			})

		}

	}

	//получение лс из панели
	getAccpu() {
		// получаем данные об аккаунте
		setTimeout(() => {
			this.accountService.accInfo.subscribe((data: AccountInfo) => {
				if (data) {
					this.accountInfoService = data;
					this.selectItemAccpu = this.accountInfoService.accpu;
					//получить аддрессид и заполнить поля поиска
					this.getAddressId();


				}
			})
		})
	}

	//заполнение поиска
	getAddressId() {
		setTimeout(() => {
			this.addressService.getAddressId(this.selectItemAccpu).subscribe(data => {
				if (data) {
					this.address = data[0];
					if (this.address) {
						this.fillAddress(this.address);
					}

				}
			});
		})
	}

	//заполнение полей
	fillAddress(address: AddressId) {
		if (address) {
			setTimeout(() => {
				this.getTypeCity();
				this.getTypeStreet();
				this.onSelectStreetType(address.idCity, address.idTypeStreet);
				this.onSelectHouse(address.idStreet);
				this.onSelectFlat(address.idHouse);
			}, 500)
		}
	}

	onCleanForm() {
		this.selectedCityID = null;
		this.selectedCityTypeID = null;
		this.selectedStreetTypeID = null;
		this.selectedStreetID = null;
		this.selectedHouseID = null;
		this.selectedFlatID = null;
		this.subs = null;
		this.tel = null;
		this.statement_scan = null;
		this.scan_id = null;
		this.registerForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email, Validators.pattern('^[A-Za-zА-ЯЁа-яё0-9._%+-]+@[A-Za-zА-ЯЁа-яё0-9.-]+\\.[A-Za-zА-ЯЁа-яё]{2,4}$')]]
		});
		this.fio_st = '';
	}

	//получаем тип населенного пункта
	getTypeCity() {
		if (!this.cityType) {
			setTimeout(() => {
				// получить тип населеного пункта
				this.loadingCityType = true;
				this.addressService.getCityType().subscribe((data: CityType[]) => {
						if (data) {
							this.cityType = data;
							this.loadingCityType = false;
							this.selectedCityTypeID = this.cityType[0];
							if (this.selectedCityTypeID) {
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
		} else {
			if (this.address) {
				this.cityType.forEach(value => {
					if (value.id == this.address.idTypeCity) {
						this.selectedCityTypeID = value;
						this.onSelectCityType(this.selectedCityTypeID);
					}
				})
			}
		}
	}

	//получение типа улиц
	getTypeStreet() {
		// @streetType пустой то загружать с сервера
		if (!this.streetType) {
			setTimeout(() => {
				// получить тип улицы
				this.loadingStreetType = true;
				this.addressService.getStreetType().subscribe((data: StreetType[]) => {
						this.streetType = data;
						this.loadingStreetType = false;
					},
					error => {

						this.message = error.error.message;
						this.showError();
						this.loadingStreetType = false;
					});
			});
		} else {
			if (this.address) {
				this.streetType.forEach(value => {
					if (value.id == this.address.idTypeStreet) {
						this.selectedStreetTypeID = value.id;
					}
				})
			}
		}
	}

	/// @onSelectCityType получение населеного пункта
	onSelectCityType(value: any) {
		this.selectedCityID = null;
		this.city = [];
		this.selectedStreetTypeID = null;
		this.selectedStreetID = null;
		this.street = [];
		this.selectedHouseID = null;
		this.house = [];
		this.selectedFlatID = null;
		this.flat = [];
		this.flagChange = true;
		if (value) {
			setTimeout(() => {
				this.loadingCity = true;
				this.addressService.getCityWithoutAcc(value.id).subscribe((data: City[]) => {
						this.city = data;
						this.loadingCity = false;
						if (this.address) {
							this.city.forEach(value1 => {
								if (value1.id == this.address.idCity) {
									this.selectedCityID = value1;
								}
							})
						}
					},
					error => {
						console.log(error);
						this.message = error.error.message;
						this.showError();
						this.loadingCity = false;
					});
			});
		}
	}

	/// @onSelectCity влияет на измение списков идущих после населеного пункта
	onSelectCity(value: any) {
		console.log(value)
		console.log(this.selectedCityID)
		this.selectedStreetTypeID = null;
		this.selectedStreetID = null;
		this.street = [];
		this.selectedHouseID = null;
		this.house = [];
		this.selectedFlatID = null;
		this.flat = [];
		this.flagChange = true;
	}

	/// @onSelectStreetType получение улиц
	onSelectStreetType(selectedCityID, selectedStreetTypeID) {
		this.selectedStreetID = null;
		this.street = [];
		this.selectedHouseID = null;
		this.house = [];
		this.selectedFlatID = null;
		this.flat = [];
		this.flagChange = true;
		let city: any | number;

		if (typeof selectedCityID == "object") {
			city = selectedCityID.id
		} else {
			city = selectedCityID;
		}
		if (city && selectedStreetTypeID) {
			setTimeout(() => {
				this.loadingStreet = true;
				console.log(city);
				this.addressService.getStreetWithoutAcc(city, selectedStreetTypeID).subscribe((data: Street[]) => {
						this.street = data;
						this.loadingStreet = false;
						if (this.address) {
							this.street.forEach(value => {
								if (value.id == this.address.idStreet) {
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
	onSelectHouse(selectStreetID: any) {
		this.selectedHouseID = null;
		this.house = [];
		this.selectedFlatID = null;
		this.flat = [];
		this.flagChange = true;
		let street: any | number;
		if (typeof selectStreetID == "object") {
			street = selectStreetID.id
		} else {
			street = selectStreetID;
		}

		if (selectStreetID) {
			setTimeout(() => {
				this.loadingHouse = true;
				this.addressService.getHouseWithoutAcc(street).subscribe((data: House[]) => {
						this.house = data;
						this.loadingHouse = false;
						if (this.address) {
							this.house.forEach(value => {
								if (value.id == this.address.idHouse) {
									this.selectedHouseID = value;
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
	onSelectFlat(selectHouseId: any) {
		this.selectedFlatID = null;
		this.flat = [];
		this.flagChange = true;
		let house: any | number;
		if (typeof selectHouseId == "object") {
			house = selectHouseId.id;
		} else {
			house = selectHouseId;
		}
		if (house) {
			setTimeout(() => {
				this.loadingFlat = true;
				this.addressService.getFlatWithoutAcc(house).subscribe((data: FlatsByHouse[]) => {
						if (data) {
							this.flat = data;
							this.loadingFlat = false;
							if (this.flat.length == 1) {
								this.selectedFlatID = this.flat[0];
							}
							if (this.address) {
								this.flat.forEach(value => {
									if (value.id == this.address.idflat) {
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

	// @searchItem поиск по первому вхождению дом
	searchItemHouse(term: string, item: any) {
		term = term.toLocaleLowerCase();
		return item.house.toLocaleLowerCase().startsWith(term);
	}

	// @searchItemFlat поиск по первому вхождению квартира


	searchItemFlat(term: string, item: any) {
		term = term.toLocaleLowerCase();
		return item.flat.toLocaleLowerCase().startsWith(term);
	}

	showInfo() {
		this.messageService.add({severity: 'info', summary: 'Информация', detail: this.message, life: 5000});
	}

	showError() {
		this.messageService.add({severity: 'error', summary: 'Ошибка', detail: this.message, life: 5000});
	}

	onSelectAport(selectedHouseID: any) {
		console.log(selectedHouseID);
		if (selectedHouseID) {
			this.selectedFlatID = selectedHouseID.id;
		}
	}

	info(event: Event, message: string) {
		this.confirmationService.confirm({
			target: event.target,
			message: message,
			icon: 'pi pi-info-circle',
			rejectVisible: false,
			acceptVisible: true,
			acceptLabel: 'OK',
			accept: () => {
			}
		});
	}
}
