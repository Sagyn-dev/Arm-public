import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AccountService} from '@app/_services/account.service';
import {AccountInfo} from '@app/_models/account';
import {FormService} from '@app/_services/form.service';
import {Field, FilterSource, HeaderTable, TurnParams, TurnParsChild, ValueParameter} from '@app/_models/schemas';
import {NavItem} from '@app/_models/nav-item';
import {ShareService} from '@app/_services';
import {tabService} from '@app/_services/tab.service';
import {FastReportService} from '@app/_services/fastreport.service';
import {MessageService, PrimeNGConfig, SelectItem} from 'primeng/api';
import {DatePipe, formatDate} from '@angular/common';
import {DomSanitizer} from "@angular/platform-browser";
import {Guid} from 'guid-typescript';
import {Table} from "primeng/table";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {AuthorizeService} from "@app/api-authorization/authorize.service";
import {Value} from '@app/_models';
import {LocalStorageService} from "@app/_services/localstorage.service";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
	selector: 'app-turn-deploy',
	templateUrl: './turn-deploy.component.html',
	styleUrls: ['./turn-deploy.component.css'],
	providers: [tabService, MessageService]
})
export class TurnDeployComponent implements OnInit {

	constructor(public accountService: AccountService, public formService: FormService, public shareService: ShareService,
					private fastReportService: FastReportService, private messageService: MessageService, private primengConfig: PrimeNGConfig,
					private sanitizer: DomSanitizer, private authorizeService: AuthorizeService,private localStg: LocalStorageService) {
	}
	flagFilter:boolean = false;
	loading: boolean;
	action: any;
	accountInfo: AccountInfo;
	accountFlataccs: ValueParameter[];

	selectItemAccpu: string;
	//результат по нажатию кнопки выполнить вывод. в главную таблицу на форме
	dataMainTable: any;
	//для отслеживания спинера загрузки данных в таблицу
	loadingTable: boolean = false;
	//для подсчета итого
	loadingData: boolean;
	//для документов гашения
	loadingDoc: boolean;
	//данные докуменов гашения
	dataDoc: any;
	header_table: HeaderTable[] = [];
	dataSubRate: any;
	dateBegin: string;
	dateEnd: string;
	dateCalc: string = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
	summa_KO: number;
	sm_doc: number;
	helpText: string;
	loadReport: boolean;
	message: string;
	//нужен для получения id формы
	FrmId: number = 56;
	//для colgrupp нужно передать количество колонок
	colgroup = Array.apply(null, {length: 11}).map(Number.call, Number);
	matchModeOptions: SelectItem[];
	record: any;
	link: any;
	idform: number = 56;
	abonOtdel: any;
	testField: any = [];
	@ViewChild('dtmain') dt_main: Table;
	@ViewChild('de') de: Table;
	cols: any[];

	//-------------- для просмотра изображения
	@ViewChild('zoom') zoom: any;
	//zoom = document.getElementById('zoom');
	scale: number = 1;
	panning: boolean = false;
	pointX: number = 0;
	pointY: number = 0;
	start = {x: 0, y: 0};
	rotationAmount: number = 0;

	iconShowHide: string = 'pi pi-eye-slash';

	setTransform() {
		this.zoom.nativeElement.style.transform = "translate(" + this.pointX + "px, " + this.pointY + "px) scale(" + this.scale + ")";
	}

	//-------

	///форматы файлов для просмотра
	img: any;
	html_d: any;
	selectRec: any;
	blobPrint: any;
	pdf_load: boolean;
	pdfImage: any;

	userName: string;
	user: any;
	select_fields: any;
	colsDoc: any;
	colsTariff: any;
	selectColsTariff: any;
	sourceFilter: any;
	filterValue: any[] = [];
	sourceFilterDoc: any;
	filterValueDoc: any;
	formatList = [
		{id: "pdf", name: "PDF"},
		{id: "xlsx", name: "XLSX"},
		{id: "rtf", name: "RTF"}
	];
	format: string = this.formatList[0].id;
	//колонки для выбора
	_selectedColumns: any;

	ngOnInit(): void {

		this.matchModeOptions = this.shareService.onFilter();
		this.authorizeService.getUser().subscribe(value => {
			if (value) {
				this.user = value;
				this.userName = this.user?.name;
			}
		}, error1 => {
			this.message = 'Не авторизовано !'
			this.showError();
		});

		this.cols = [
			{field: 'ID', header: 'УИД документа', type: 'String'},
			{field: 'KO_SUMM', header: 'Сумма', type: 'Decimal', totalSum: true,},
			{field: 'DATEB', header: 'Начальная дата', type: 'Date'},
			{field: 'DATEE', header: 'Конечная дата ', type: 'Date'},
			{field: 'OPMONTH', header: 'Оп.месяц', type: 'Date'},
			{field: 'NAME', header: 'Операция', type: 'String'},
			{field: 'FINE', header: 'Пеня', type: 'String'},
			{field: 'NAMESER', header: 'Услуга', type: 'String'},
			{field: 'NOTE', header: 'Основание', type: 'String'},
			{field: 'DIR_LINK', header: 'Ссылка', type: 'String'},
			{field: 'ENTRIED', header: 'Дата создания', type: 'DateTime'},
			{field: 'NAME_USER', header: 'Оператор', type: 'String'}
		]

		this.colsDoc = [
			{field: 'ID', header: 'УИД документа', type: 'String'},
			{field: 'SM', header: 'Сумма', type: 'Decimal', totalSum: true,},
			{field: 'DATEB', header: 'Начальная дата', type: 'Date'},
			{field: 'DATEE', header: 'Конечная дата ', type: 'Date'},
			{field: 'KONAME', header: 'Операция', type: 'String'},
			{field: 'OPMONTH', header: 'Оп.месяц', type: 'Date'},
			{field: 'FINE', header: 'Пеня', type: 'String'},
			{field: 'NOTE', header: 'Основание', type: 'String'},
			{field: 'ENTRIED', header: 'Дата создания', type: 'DateTime'},
			{field: 'SUPP_NAME', header: 'Поставщик', type: 'String'},
			{field: 'COMP_NAME', header: 'Компания', type: 'String'}
		];
		this.colsTariff = [
			{field: 'TYPE_TARIF', header: 'Тип субтарифа', type: 'String'},
			{field: 'TARIF', header: 'Тариф', type: 'Decimal'},
			{field: 'VOLUME', header: 'Объем', type: 'Decimal'},
			{field: 'SUMM', header: 'Сумма', type: 'Decimal'},
		]
		this._selectedColumns = this.cols;
		this.selectColsTariff = this.colsTariff;
		this.select_fields = this.colsDoc;
		this.shareService.abonOtdel.subscribe(data => {
			if (data) {
				this.abonOtdel = data;
			} else {
				this.message = 'Абонентский отдел не выбран!';
				this.showError();
			}
		})
		this.primengConfig.ripple = true;
		//получаем id формы
		this.shareService.itemNav.subscribe((data: NavItem) => {
			if (data) this.FrmId = data.id;
		}, error => {
			console.log(error)
		});

		//получаем данные об аккаунте
		this.accountService.accInfo.subscribe((data: AccountInfo) => {
				this.accountFlataccs = [];

				this.accountInfo = data;

				//очищаем параметры
				// this.param.accpu = null;
				// this.param.dateBegin = null;
				// this.param.dateEnd = null;
				// this.param.dateCalculate = new Date();
				this.dataMainTable = [];

				setTimeout(() => {
					//получаем связанные лц
					if (this.accountInfo) {
						this.loading = true;
						this.accountService.getFlatAccs(this.accountInfo.accpu).subscribe((data: ValueParameter[]) => {

							this.accountFlataccs = data;
							if (this.accountFlataccs) {
								for (let i = 0; i < this.accountFlataccs.length; i++) {
									if (this.accountFlataccs[i].id !== this.accountInfo.accpu) {
										this.selectItemAccpu = this.accountFlataccs[i].id;
									} else {
										this.selectItemAccpu = this.accountInfo.accpu;
										break;
									}
								}

							}

							this.loading = false;
						}, error => {
							console.log(error);
							this.loading = false;

						})
					}
				})
			},
			error => {
				console.log(error)
			})
		//восстанавливаем данные из localStore
		setTimeout(()=>{
			this.getDataFromLocalStore();
		},100)
	}

	@Input() get selectedColumns(): any[] {
		return this._selectedColumns;
	}

	set selectedColumns(val: any[]) {
		//restore original order
		this._selectedColumns = this.cols.filter(col => val.includes(col));
	}

	onSelectItem(value: any) {
		this.record = value;
		this.helpText = value.HELPTEXT;
	}

	parseDate(dateString: string): Date {
		if (dateString) {
			return new Date(dateString);
		}
		return null;
	}

	onExecute() {
		//получаем данные для главной таблицы 1, тут данные динамические
		setTimeout(() => {
			this.dataMainTable = null;
			this.loadingTable = true;
			this.loadingData = false;
			let param = new TurnParams(this.selectItemAccpu,this.parseDate(this.dateBegin),this.parseDate(this.dateEnd),this.parseDate(this.dateCalc))
			this.formService.postTurnTableDeploy(param).subscribe((data => {
				if (data) {
					let source: any = data;
					this.dataMainTable = source.dataTable;
					this.header_table = source.header;
					this.loadingTable = false;
					this.loadingData = true;
					this.summa_KO = this.getSum(this.dataMainTable, 'KO_SUMM');
					//получить набор после выбора
					this.sourceFilter = this.shareService.getFilterSource(this.dataMainTable);
					this.saveLocalStore();
				}
			}), error => {
				console.log(error);
				this.loadingTable = false;
			})
		})
	}
	//сохранение в хранилище
	saveLocalStore(){
		this.localStg.set('accpu',JSON.stringify(this.accountFlataccs));
		let param = new TurnParams(this.selectItemAccpu,this.parseDate(this.dateBegin),this.parseDate(this.dateEnd),this.parseDate(this.dateCalc))
		this.localStg.set('param',JSON.stringify(param));
		this.localStg.set('dataTable',JSON.stringify(this.dataMainTable));
		this.localStg.set('headerTable',JSON.stringify(this.header_table));
	}
	// восстановление данных из хранилища
	getDataFromLocalStore(){
		if(this.localStg.get('accpu')){
			this.accountFlataccs = this.localStg.get('accpu');
		}
		if(this.localStg.get('param')){
			let param:TurnParams = this.localStg.get('param');
			this.selectItemAccpu = param.accpu;
			console.log(param);
			this.dateBegin = param.dateBegin ? formatDate(param.dateBegin,'yyyy-MM-dd','en_US'): null;
			this.dateEnd 	= param.dateEnd ? formatDate(param.dateEnd, 'yyyy-MM-dd', 'en_US') : null;
			this.dateCalc 	= param.dateCalculate ? formatDate(param.dateCalculate, 'yyyy-MM-dd', 'en_US'):null;
		}
		if(this.localStg.get('dataTable')){
			this.dataMainTable = this.localStg.get('dataTable');
			this.header_table = this.localStg.get('headerTable');
			this.sourceFilter = this.shareService.getFilterSource(this.dataMainTable);
			this.loadingData = true;
			this.onFilter();
		}
	}
	//getSum итог по полям
	getSumMain(field: Field): number {
		let summa: number = 0;
		if (field.totalSum) {
			summa = 0;
			if (!this.flagFilter) {
				this.dataMainTable.forEach(
					el => {
						summa += el[field.field];
					})
				return summa;
			} else {
				this.dt_main.filteredValue.forEach(
					el => {
						summa += el[field.field];
					})
				return summa;
			}

		} else return 0;
	}

	getSum(data_summ: any, field: string): number {
		let summa: number;
		summa = 0;
		for (let item of data_summ) {
			if (item[field]) {
				summa += item[field];
			}
		}
		return summa;
	}

	//получение расшифровки документов
	onActionDocCancel(value: any) {
		this.de?.clear();
		let parameters: TurnParsChild = new TurnParsChild(this.selectItemAccpu, this.parseDate(this.dateBegin), this.parseDate(this.dateEnd), this.parseDate(this.dateCalc), value.ID, value.KO);
		setTimeout(() => {
			this.loadingDoc = false;
			this.formService.postDocCancel(parameters).subscribe((data => {
				if (data) {
					this.dataDoc = data;
					this.sm_doc = this.getSum(this.dataDoc, 'SM');
					this.loadingDoc = true;
					this.sourceFilterDoc = this.shareService.getFilterSource(this.dataDoc);
				}
			}), error => {
				this.message = error.console.log(error);
				this.loadingDoc = false;
			})
		})

		//Получение субтарифов
		setTimeout(() => {
			this.formService.getSubRate(value.ID).subscribe((data => {
				this.dataSubRate = data;
			}), error => {
			})
		})
	}

	//показать скрыть блок
	buttonName: string = "Скрыть";
	show: boolean = true;

	showHide() {
		this.show = !this.show

		if (this.show) {
			this.buttonName = 'Скрыть'
			this.iconShowHide = 'pi pi-eye-slash';
			console.log(this.show)
		} else {
			this.buttonName = 'Показать'
			this.iconShowHide = 'pi pi-eye';
		}
	}

	openFastReport(val: boolean) {
		let guid: string;
		let data = this.dt_main?.filteredValue ? this.dt_main.filteredValue : this.dataMainTable;
		setTimeout(() => {
			this.loadReport = true;
			this.fastReportService.postTurnDeployReport(this.FrmId, data, this.header_table).subscribe(data => {
				if (data) {
					guid = data;
					this.loadReport = false;
					this.fastReportService.openWindwow(guid, this.format);
					if (val) {
						setTimeout(() => {
							this.formService.setWhoPrint(Number(this.abonOtdel?.ID), this.idform, this.accountInfo.accpu).subscribe(data => {
							}, error1 => console.log(error1))
						})
					}
				}
			}, error => {
				this.loadReport = false;
				if (error.status == 500) {
					this.message = "Ошибка при загрузке файла отчета";
				} else this.message = error.message;

				console.log(this.message)
				this.showError();
				console.log(error)
			})
		})
	}

	onFilter() {
		this.flagFilter = this.dt_main?.filteredValue != undefined;
		setTimeout(() => {
			this.summa_KO = this.getSum(this.dt_main.filteredValue ? this.dt_main.filteredValue : this.dataMainTable, 'KO_SUMM');
		}, 150)
	}

	showInfo() {
		this.messageService.add({severity: 'info', summary: 'Информация', detail: this.message});
	}

	showError() {
		this.messageService.add({severity: 'error', summary: 'Ошибка', detail: this.message});
	}

	//связанные документы
	display: boolean = false;
	docList: any;
	flag: boolean = true;
	loadingDoclink: boolean;

	linkDock() {
		this.img = null;
		this.html_d = null;
		this.display = true;
		setTimeout(() => {
			this.loadingDoclink = true;
			this.formService.getListDocTurnDeploy(this.selectItemAccpu, this.flag).subscribe(data => {
				console.log(data);
				if (data) {
					this.loadingDoclink = false;
					this.docList = data;
				}
			}, error => {
				console.log(error);
				this.loadingDoclink = false;
			})
		})
	}


	onShow(column: any) {
		this.selectRec = column;
		this.html_d = null;
		this.img = null;
		this.pdfImage = null;
		let regexp = /\.[A-z]{3,4}$/gm;
		let result = (regexp.exec(column.FILENAME?.toString().toLowerCase()));
		if (result) {
			let extension = result[0].toString().split(".").pop();

			//let extension = column.FILENAME.toString().toLowerCase().substring(column.FILENAME.toString().length-3);

			if (extension === 'png' || extension === 'jpeg' || extension === 'bmp' || extension === 'jpg') {
				let base64 = 'data:image/jpeg;base64,' + column.PICTURE;
				this.img = this.sanitizer.bypassSecurityTrustUrl(base64);
				let imageBlob = this.dataURItoBlob(base64, 'image/jpg');
				this.blobPrint = imageBlob;
			}
			if (extension === 'html') {
				this.html_d = this.b64DecodeUnicode(column.PICTURE);
				let base64 = 'data:text/html;base64,' + column.PICTURE;
				let imageBlob = this.dataURItoBlob(base64, 'text/html');
				this.blobPrint = imageBlob;
			}
			if (extension === 'pdf') {
				let base64 = 'data:application/pdf;base64,' + column.PICTURE;
				let imageBlob = this.dataURItoBlob(base64, 'application/pdf');
				this.blobPrint = imageBlob;
				const imageFile: File = new File([imageBlob], Guid.create().toString().concat('.pdf'));
				this.pdfImage = base64;
			}
			if (extension !== 'png' && extension !== 'jpeg' && extension !== 'bmp'
				&& extension !== 'jpg' && extension !== 'html' && extension !== 'pdf') {
				this.img = null;
				this.html_d = null;
				this.pdfImage = null;
				this.message = "Формат не поддерживается !"
				this.showError();
			}
		}
	}

	printBlob() {
		let fileURL = window.URL.createObjectURL(this.blobPrint);
		window.open(fileURL).print();
	}


	// декодирует из base64 в utf8
	b64DecodeUnicode(str) {
		// Going backwards: from bytestream, to percent-encoding, to original string.
		return decodeURIComponent(atob(str).split('').map(function (c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
	}


	//флаг включение выключения
	onChange(flag: boolean) {
		this.flag = flag;
		this.linkDock();
	}

	//конвверт из base64 в blob

	dataURItoBlob(dataURI, type): Blob {
		// convert base64 to raw binary data held in a string
		let byteString = atob(dataURI.split(',')[1]);

		// separate out the mime component
		let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

		// write the bytes of the string to an ArrayBuffer
		let ab = new ArrayBuffer(byteString.length);
		let ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		let bb = new Blob([ab], {type: type});
		return bb;
	}

	downloadDoc(column: any) {
		let extension = column.FILENAME.toString().toLowerCase().substring(column.FILENAME.toString().length - 3);

		if (extension === 'png' || extension === 'jpeg' || extension === 'bmp' || extension === 'jpg') {
			let base64 = 'data:image/jpeg;base64,' + column.PICTURE;
			let imageBlob = this.dataURItoBlob(base64, 'image/jpg');
			let fileURL = window.URL.createObjectURL(imageBlob);
			window.open(fileURL);
		}
		if (extension === 'html') {
			let base64 = 'data:text/html;base64,' + column.PICTURE;
			let imageBlob = this.dataURItoBlob(base64, 'text/html');
			let fileURL = window.URL.createObjectURL(imageBlob);
			window.open(fileURL);
		}
		if (extension === 'pdf') {
			let base64 = 'data:application/pdf;base64,' + column.PICTURE;
			let imageBlob = this.dataURItoBlob(base64, 'application/pdf');
			let fileURL = window.URL.createObjectURL(imageBlob);
			window.open(fileURL);

		}
		if (extension !== 'png' && extension !== 'jpeg' && extension !== 'bmp'
			&& extension !== 'jpg' && extension !== 'html' && extension !== 'pdf') {
			let base64 = 'data:application/pdf;base64,' + column.PICTURE;
			let imageBlob = this.dataURItoBlob(base64, 'application/octet-stream');
			let fileURL = window.URL.createObjectURL(imageBlob);
			window.open(fileURL);
		}
	}

	haveLink(column: any): boolean {
		const regex2 = new RegExp('http://vm-direc-srv:8081');
		let result = (regex2.exec(column.DIR_LINK));
		let flag: boolean;
		if (result) {
			flag = true
			this.link = this.sanitizer.bypassSecurityTrustUrl(column.DIR_LINK.toString());
		} else flag = false;
		return flag;
	}

	clear(dt: Table) {
		dt?.clear();
	}

	mousedown(e: MouseEvent) {
		e.preventDefault();
		this.start = {x: e.clientX - this.pointX, y: e.clientY - this.pointY};
		this.panning = true;
	}

	mouseup(e: MouseEvent) {
		console.log(e);
		this.panning = false;
	}


	mousemove(e: MouseEvent) {
		e.preventDefault();
		if (!this.panning) {
			return;
		}
		this.pointX = (e.clientX - this.start.x);
		this.pointY = (e.clientY - this.start.y);
		this.setTransform();
	}

	mousewheel(e: any) {
		e.preventDefault();
		var xs = (e.clientX - this.pointX) / this.scale,
			ys = (e.clientY - this.pointY) / this.scale,
			delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
		(delta > 0) ? (this.scale *= 1.2) : (this.scale /= 1.2);
		this.pointX = e.clientX - xs * this.scale;
		this.pointY = e.clientY - ys * this.scale;
		this.setTransform();
	}

	rotate(deg: number) {
		if (deg > 0) {
			this.rotationAmount += 90;
		}
		if (deg < 0) {
			this.rotationAmount -= 90;
		}
	}

	getSumField(field: any, dataTable: any[], dt: Table): number {
		let summa: number = 0;
		if (field.totalSum) {
			summa = 0;
			if (!dt.filteredValue) {
				dataTable.forEach(
					el => {
						summa += el[field.field];
					})
				return summa;
			} else {
				dt.filteredValue.forEach(
					el => {
						summa += el[field.field];
					})
				return summa;
			}

		} else return 0;
	}

	canDate(value): any {
		let regexp = /(\d{4}-\d{2}-\d{2})[A-Z]/g;
		let result = (regexp.exec(value));
		if (result) {
			let datePipe = new DatePipe('en');
			return datePipe.transform(result[1], 'dd.MM.yyyy');
		}
		return value;
	}

	onClosePanelFilter(filterTb: any) {
		if (filterTb?.filteredValue) {
			this.filterValue = Array.from(filterTb?.filteredValue);
			this.sourceFilter = this.shareService.getFilterSource(this.filterValue)
		} else {
			this.sourceFilter = this.shareService.getFilterSource(this.dataMainTable);
		}
	}

	onClosePanelFilterDoc(filterTb: any) {
		if (filterTb?.filteredValue) {
			this.filterValueDoc = Array.from(filterTb?.filteredValue);
			this.sourceFilterDoc = this.shareService.getFilterSource(this.filterValueDoc)
		} else {
			this.sourceFilterDoc = this.shareService.getFilterSource(this.dataDoc);
		}
	}

	onFilterDoc() {
		this.sm_doc = this.getSum(this.de.filteredValue ? this.de.filteredValue : this.dataDoc, 'SM');
	}

	exportPdf(dataTable: any, dt: Table, selectField: any[], cols: any[]) {
		//получаем наименование формы
		let formName: string;
		this.shareService.itemNav.subscribe(data => {
			if (data) {
				formName = data.name;
			} else formName = '';
		})

		//параметры формы проходимся по массиву pars
		let parameter = [];
		let datePipe = new DatePipe('en');

		//field
		let col = [];
		//название - title
		let head = [];
		// ширина
		let width = [];
		//итог по колонкам
		let itog = [];
		//данные
		let data = dt.filteredValue ? dt.filteredValue : dataTable;
		//проверяем если колонки выбраны
		if (selectField != undefined || selectField != null) {
			//пока закоменнтировал так как геморно будет реализовать получение групп от поля
			//let temp_fields:Field[]=[];
			for (let item of cols) {
				for (let otem of selectField) {
					if (otem.field == item.field) {
						//temp_fields.push(item);
						head.push(otem.header);
						col.push(otem.field)
						width.push(65);
						if (item.totalSum) {
							//console.log(item.field);
							itog.push(this.getSumField(item, dataTable, dt).toFixed(2));
						} else itog.push('');
					}
				}
			}
		}
		console.log(itog)
		//структура пдф
		let docDefinition = {
			pageSize: 'A4',
			pageOrientation: 'landscape',
			pageMargins: [5, 5, 5, 5],
			defaultStyle: {
				fontSize: 8
			},
			content: [
				{text: formName, fontSize: 12, margin: [0, 0, 0, 8]},
				{text: parameter, fontSize: 12, margin: [0, 0, 0, 8]},
				{
					table: {
						widths: width,
						headerRows: 1,
						body: this.buildTableBody(data, head, col, itog), itog,
						styles: {
							fontSize: 10,
							margin: [0, 0, 0, 0]
						}
					}
				},
				{text: 'Источник: АО "Система Город" \n АРМ "Выписка"', fontSize: 10, margin: [0, 10, 0, 0]},
				{text: 'Оператор: '.concat(this.userName), fontSize: 10},
				{text: datePipe.transform(new Date(), 'dd.MM.yyyy'), fontSize: 10},
				{text: 'Компания: '.concat(this.user?.company), fontSize: 10},
			]
		};

		pdfMake.createPdf(docDefinition).open();
	}
	//создание тела таблицы
	buildTableBody(data, header, columns, itog) {
		var btable = [];
		btable.push(header); //добавляет заголовки
		//заполняем тело таблицы
		data.forEach((row) => {
			var dataRow = [];
			columns.forEach((column) => {
				if (row[column] === undefined || row[column] === null) dataRow.push("");
				else {
					let value = this.canDate(row[column]) //пробует перевести в дату
					dataRow.push(value.toString());
				}
			})
			btable.push(dataRow);
		});
		btable.push(itog); //добавляет в последнюю строку итог
		return btable;
	}
}
