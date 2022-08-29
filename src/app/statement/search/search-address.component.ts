import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddressService} from "@app/_services/address.service";
import {City, CityType, FlatsByHouse, House, Street, StreetType} from "@app/_models/address";
import {AccountInfo} from "@app/_models/account";
import {AccountService} from "@app/_services/account.service";
import {LocalStorageService} from "@app/_services/localstorage.service";
import {NgSelectComponent} from "@ng-select/ng-select";
import {tabService} from "@app/_services/tab.service";



/**
 * @title для шаблона
 */

@Component({
  selector: 'app-search-address',
  templateUrl: 'search.component.html',
  styleUrls:['search.component.css']
})

export class SearchAddressComponent {

	accountInfo: AccountInfo[];

   //@error ошибки
	error ='';

	constructor(public dialog: MatDialog) {

	}

  openDialog(): void {
    const dialogRef = this.dialog.open(SearchDialog, {
    	 minWidth:'768px',
    	 width: 'auto',
		 height:'auto',
      data: { accountInfo: this.accountInfo, error: this.error}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      	this.accountInfo = result;
      },
		 error => {
			 console.log(error);
			 this.error = error.error.message;
		 });
  }
}

//----------------------------------------------------------------------------------------------------------------------
//для диалога
@Component({
  selector: 'dialog-search',
  templateUrl: 'dialog-search.component.html',
	styleUrls:['dialog-search.component.css'],
  providers:[LocalStorageService,tabService],

})

export class SearchDialog implements OnInit{

		///<summary>
		///Тип населенного пункта
		///</summary>
		cityType: CityType[];
		///<summary>
		///ИД выбраного населенного пункта
		///</summary>
		selectedCityTypeID : number;
		///<summary>
		///Тип улицы
		///</summary>
		streetType: StreetType[];
		///<summary>
		///ИД выбраного населеного пункта
		///</summary>
		selectedStreetTypeID:number;
		///<summary>
		///Населенный пункт
		///</summary>
		city: City[];
		///<summary>
		///ИД выбраного населеного пункта
		///</summary>
		selectedCityID:number;
		///<summary>
		///улица
		///</summary>
		street: Street[];
		///<summary>
		///ИД выбраного населеного пункта
		///</summary>
		selectedStreetID:number;
		///<summary>
		///дома
		///</summary>
		house: House[];
		///<summary>
		///ИД выбраного населеного пункта
		///</summary>
		selectedHouseID:number;
		///<summary>
		///квартиры
		///</summary>
		flat: FlatsByHouse [];
		///<summary>
		///ИД выбраной кв
		///</summary>
		selectedFlatID:number;
		///<summary>
		///account info
		///</summary>
		accountInfo: AccountInfo[];
		selectAccount : AccountInfo;
		//@error для ошибок
		error = '';
		//@loadingCityType используется для проверки загрузки
		loadingCityType: boolean;
		loadingCity: boolean;
		loadingStreetType: boolean;
		loadingStreet: boolean;
		loadingHouse: boolean;
		loadingFlat: boolean;
		loadingAccount: boolean;
		//@cols для фильтрация в таблице
		cols:any[];
		//@isResultSearchAccount результат поиска
	   isResultSearchAccount:boolean;

	   //@isSaveSelect проверяет сохранять ли данные
		isSaveSelect:boolean;

	@ViewChild('scityType') cityType_s: NgSelectComponent;
	@ViewChild('scity') city_s: NgSelectComponent;
	@ViewChild('sstreetType') streetType_s: NgSelectComponent;
	@ViewChild('sstreet') street_s: NgSelectComponent;
	@ViewChild('shouse') house_s: NgSelectComponent;
	@ViewChild('sflat') flat_s: NgSelectComponent;

  constructor(
    public dialogRef: MatDialogRef<SearchDialog>,
	 private addressService: AddressService,
	 private accountService: AccountService,
	 private localStg: LocalStorageService) {}



  onNoClick(): void {
    this.dialogRef.close();
    if(this.isSaveSelect){
		 //сохранять состояние формы
		 this.onSaveService();
	 }
  }

	getShortName(value:string){
		const setResult = new Set();
		if(this.accountInfo) {
			for (let item of this.accountInfo) {
				if (item[value]) {
					setResult.add(item[value])
				}
			}
		}
		return Array.from(setResult);
	}

	ngOnInit(): void {

		this.cols = [
			{ field: 'status',  header: 'Status'},
			{ field: 'address', header: 'Address' },
			{ field: 'accpu',   header: 'accpu' },
			{ field: 'fio',     header: 'FIO' },
			{ field: 'type',    header: 'Type' }
		];

		//@isSelectSave получение из службы
		this.getSelectSaveCh();
		//@getSaveService получение данных из службы
		this.getSaveService();
		//@ получаем данные из localstore если данные в сервисе пусты
		if(!this.cityType || this.cityType.length==0){
			this.getSaveAll();
		}
		//@cityType пустой то загружать с сервера
  	   if(!this.cityType){
			setTimeout(()=> {
				//получить тип населеного пункта
				this.loadingCityType = true;
				this.addressService.getCityType().subscribe((data: CityType[]) => {
						this.cityType = data;
						this.loadingCityType = false;
					},
					error => {
						console.log(error);
						this.error = error.error.message;
						this.loadingCityType = false;
					});
			});
		}
		//@streetType пустой то загружать с сервера
  	   if(!this.streetType){
			setTimeout(()=>{
				//получить тип улицы
				this.loadingStreetType = true;
				this.addressService.getStreetType().subscribe((data:StreetType[]) => {
						this.streetType = data;
						this.loadingStreetType = false;
					},
					error => {
						console.log(error);
						this.error = error.error.message;
						this.loadingStreetType = false;
					});
			});
		}
	}
	//onSaveService сохранили в сервис
	onSaveService(){
  		this.addressService.City=this.city;
  		this.addressService.CityType=this.cityType;
  		this.addressService.StreetType=this.streetType;
  		this.addressService.Street=this.street;
  		this.addressService.House=this.house;
  		this.addressService.Flat=this.flat;

  		this.addressService.select_id_cityType = this.selectedCityTypeID;
  		this.addressService.select_id_city = this.selectedCityID;
  		this.addressService.select_id_streetType = this.selectedStreetTypeID;
  		this.addressService.select_id_street = this.selectedStreetID;
  		this.addressService.select_id_house = this.selectedHouseID;
  		this.addressService.select_id_flat = this.selectedFlatID;

		this.accountService.account = this.accountInfo;
	}
	//получили из сервиса
	getSaveService(){
		this.cityType=this.addressService.CityType;
		this.city=this.addressService.City;
		this.streetType=this.addressService.StreetType;
		this.street=this.addressService.Street;
		this.house=this.addressService.House;
		this.flat=this.addressService.Flat;

		this.selectedCityTypeID = this.addressService.select_id_cityType;
		this.selectedCityID = this.addressService.select_id_city;
		this.selectedStreetTypeID = this.addressService.select_id_streetType ;
		this.selectedStreetID = this.addressService.select_id_street;
		this.selectedHouseID = this.addressService.select_id_house;
		this.selectedFlatID = this.addressService.select_id_flat;

		this.accountInfo = this.accountService.account;
	}
	//@getSelectSaveCh получаем состояние чекбокса из службы
	getSelectSaveCh(){
		this.isSaveSelect=this.accountService.getChSelectSave();
	}
	//@chSelectSave устанавлием чекбокс и сохраняем в службу
	onSaveSelect($event){
  	   this.isSaveSelect = $event;
		this.accountService.setChSelectSave(this.isSaveSelect);
	}
	///@onSelectCityType получение населеного пункта
	onSelectCityType(value:number){

  		this.selectedCityID=null;
  		this.city = [];
  		this.selectedStreetTypeID = null;
		this.selectedStreetID=null;
		this.street = [];
		this.selectedHouseID=null;
		this.house = [];
		this.selectedFlatID=null;
		this.flat = [];

		setTimeout(()=>{
				this.loadingCity = true;
				this.addressService.getCity(value).subscribe((data:City[]) => {
					this.city = data;
					this.loadingCity = false;
				},
					error => {
						console.log(error);
						this.error = error.error.message;
						this.loadingCity = false;
					});
		});

  }
	///@onSelectCity влияет на измение списков идущих после населеного пункта
	onSelectCity(){
		this.selectedStreetTypeID=null;
		this.selectedStreetID=null;
		this.street = [];
		this.selectedHouseID=null;
		this.house = [];
		this.selectedFlatID=null;
		this.flat = [];
	}

	///@onSelectStreetType получение улиц
	onSelectStreetType(selectedCityID,selectedStreetTypeID){
  		this.selectedStreetID=null;
  		this.street=[];
		this.selectedHouseID=null;
		this.house = [];
		this.selectedFlatID=null;
		this.flat = [];

		setTimeout(()=>{
			this.loadingStreet = true;

			this.addressService.getStreet(selectedCityID,selectedStreetTypeID).subscribe((data:Street[]) => {
				this.street = data;
				this.loadingStreet = false;
			},
				error => {
					console.log(error);
					this.error = error.error.message;
					this.loadingStreet = false;
				});
		});
	}
	///@onSelectHouse получение домов
	onSelectHouse(selectStreetID:number){
		this.selectedHouseID=null;
		this.house=[];
		this.selectedFlatID=null;
		this.flat = [];

  		setTimeout(()=>{this.loadingHouse = true;
			this.addressService.getHouse(selectStreetID).subscribe((data:House[]) => {
				this.house = data;
				this.loadingHouse = false;
			},
				error => {
					console.log(error);
					this.error = error.error.message;
					this.loadingHouse = false;
				});
		});
   }

	///@onSelectFlat получение квартир
	onSelectFlat(selectHouseId:number){
		this.selectedHouseID = selectHouseId;
  		this.selectedFlatID=null;
		this.flat = [];

  		setTimeout(()=> {
			this.loadingFlat = true;
			this.addressService.getFlat(selectHouseId).subscribe((data: FlatsByHouse[]) => {
					this.flat = data;
					this.loadingFlat = false;
				},
				error => {
					console.log(error);
					this.error = error.error.message;
					this.loadingFlat = false;
				});
		});

	}

	///@onSearchAccount получение accountInfo
	onSearchAccount(flatID: number){
  		setTimeout(()=>{
			this.loadingAccount = true;
			this.accountService.getSearchByFlat(flatID).subscribe((data:AccountInfo[]) => {
				this.accountInfo = data;
				console.log(this.accountInfo);
				this.loadingAccount = false;
				},
			error => {
				console.log(error);
				this.error = error.error.message;
				this.loadingAccount = false;
			});
		});
	}
	//поиск акк в системе
	searchAccp(accNum:string):void {
		console.log(accNum);
		//запрос на получения accountа
		if(accNum){
			this.accountService.getAccountInfo(accNum).subscribe((data:AccountInfo) => {
				if(data){
					this.selectAccount=data;
					this.accountService.setaccInfo(this.selectAccount);
					console.log("сохранено в сервис" + this.selectAccount.accpu);
				}
			},error =>
			{
				console.log(error);
			})
		}else{
			this.selectAccount = null;
		}
	}

	//@onSelectAccp выводит в page-header.component выбранный аккаунт
	onSelectAccp(value: AccountInfo){
  		//сохраняем в сервис AccountInfo
		console.log(value);

			this.searchAccp(value.accpu);
		//this.accountService.setaccInfo(value)
		//@ сохраняет ранее выбраный id в localstore
		//this.setLocalStorage('accp',value.accpu);
		this.dialogRef.close();
	}



	//@searchAccount ищет акаунт по ид квартиры @flat
	searchAccount(){
  		if(this.selectedFlatID){
			this.onSearchAccount(this.selectedFlatID);
			//вызов метода сохранения данных в localstorage если выбран checkbox
			if(this.isSaveSelect){
				setTimeout(()=>{
					this.onSaveAll();
				},1500)
				//@saveService сохранение данных в сервис
				this.onSaveService();
			}
			if(this.selectedFlatID){
				this.isResultSearchAccount=true;
			}else this.isResultSearchAccount=false;
		}else {
  			//запрос аккаунтов в доме
			this.accInHouse();
		}
	}
	//запрос аккаунтов в доме
	accInHouse(){
		setTimeout(()=>{
			this.loadingAccount = true;
			this.accountService.getSearchByHouse(this.selectedHouseID).subscribe((data:AccountInfo[]) => {
					this.accountInfo = data;
					console.log(this.accountInfo);
					this.loadingAccount = false;
				},
				error => {
					console.log(error);
					this.error = error.error.message;
					this.loadingAccount = false;
				});
				this.isResultSearchAccount = !!this.selectedHouseID;
		});
	}

	//@searchItem поиск по первому вхождению
	searchItem(term: string, item: any) {
		term = term.toLocaleLowerCase();
		if(item.name){
			return item.name?.toString().toLocaleLowerCase().startsWith(term);
		}else
			return item;

	}
	//@searchItem поиск по первому вхождению дом
	searchItemHouse(term: string, item: any) {
		term = term.toLocaleLowerCase();
		return item.house?.toString().toLocaleLowerCase().startsWith(term);
	}
	//@searchItemFlat поиск по первому вхождению квартира
	searchItemFlat(term: string, item: any) {
		term = term.toLocaleLowerCase();
		return item.flat?.toString().toLocaleLowerCase().startsWith(term);
	}

	///@onSaveAll метод сохраняет в localstorage все объекты использующийся в форме поиска
	onSaveAll(){
  		this.setLocalStorage('selectCityTypeId',this.selectedCityTypeID);
  		this.setLocalStorage('selectCityId',this.selectedCityID);
  		this.setLocalStorage('selectStreetTypeId',this.selectedStreetTypeID);
  		this.setLocalStorage('selectStreetId',this.selectedStreetID);
  		this.setLocalStorage('selectHouseId',this.selectedHouseID);
  		this.setLocalStorage('selectFlatId',this.selectedFlatID);
		this.setLocalStorage('cityType',this.cityType);
		this.setLocalStorage('city',this.city);
		this.setLocalStorage('streetType',this.streetType);
		this.setLocalStorage('street',this.street);
		this.setLocalStorage('house',this.house);
		this.setLocalStorage('flat',this.flat);
		//this.setLocalStorage('accountInfo',this.accountInfo);
	}
	///@getSaveAll метод получает данные из localstorage все объекты использующийся в форме поиска
	getSaveAll(){
  		this.selectedCityTypeID = this.localStg.get('selectCityTypeId');
  		this.selectedCityID = this.localStg.get('selectCityId');
  		this.selectedStreetTypeID = this.localStg.get('selectStreetTypeId');
  		this.selectedStreetID = this.localStg.get('selectStreetId');
  		this.selectedHouseID = this.localStg.get('selectHouseId');
  		this.selectedFlatID = this.localStg.get('selectFlatId');
  		this.cityType = this.localStg.get('cityType');
  		this.city = this.localStg.get('city');
  		this.streetType = this.localStg.get('streetType');
  		this.street = this.localStg.get('street');
  		this.house = this.localStg.get('house');
  		this.flat = this.localStg.get('flat');
  		//this.accountInfo = this.localStg.get('accountInfo');
	}

	///@setLocalStorage метод для сохранения в local storage
	setLocalStorage(key: string,data: any){
		this.localStg.set(key,JSON.stringify(data));
  }
	buttonName: string = "Скрыть";
	show:boolean = true;
	showHide() {
		this.show = !this.show

		if(this.show) {
			this.buttonName = 'Скрыть'
			console.log(this.show)
		}
		else {
			this.buttonName = 'Показать'
		}
	}

	setFocus(key:KeyboardEvent,select: NgSelectComponent) {
		console.log(key);
		console.log(key.key == 'Enter')
		if(key.key == 'Enter'){
			this.city_s.focus();
		}
	}
	keyStreet(key:KeyboardEvent){
		if(key.key == 'Enter'){
			this.street_s.focus();
		}
	}
}

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
