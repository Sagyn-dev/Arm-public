import {
	Component,
	EventEmitter,
	Inject,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import {ShareService} from '@app/_services';
import {NavItem} from '@app/_models/nav-item';
import {Subscription} from 'rxjs';
import {ActionOptions, ActionScheme, Parameter, SortType, Value} from '@app/_models';
import {Field, Group, HeaderPDF, HeaderTable, QueryForm} from '@app/_models/schemas';
import {FormService} from '@app/_services/form.service';
import {AccountInfo} from '@app/_models/account';
import {AccountService} from '@app/_services/account.service';
import {tabService} from '@app/_services/tab.service';
import {FastReportService} from '@app/_services/fastreport.service';
import {FilterService, MessageService, PrimeNGConfig, SelectItem} from 'primeng/api';
import {DatePipe} from '@angular/common';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {first, map} from 'rxjs/operators';
import {AuthorizeService} from '@app/api-authorization/authorize.service';
import {Table} from 'primeng/table';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

/// компонент для формы типа 1 для вывода таблицы.ы

@Component({
	selector: 'app-param-table-display',
	templateUrl: './param-table-display.component.html',
	styleUrls: ['./param-table-display.component.css'],
	providers: [tabService, MessageService]
})
export class ParamTableDisplayComponent implements OnInit, OnDestroy, OnChanges {


	constructor(public dialog: MatDialog, private shareService: ShareService, private formService: FormService,
					private accountService: AccountService, private fastReportService: FastReportService,
					private messageService: MessageService, private primengConfig: PrimeNGConfig,
					private authorizeService: AuthorizeService, private filterService: FilterService) {
	}
	record:any;
	filterValue: any;
	sourceFilter: any;
	private subscriptions: Subscription[] = [];
	nav_item: NavItem;
	action: ActionOptions;
	//data_table получает данные по параметрам, динамический массив
	data_table: any;
	header_table: HeaderTable[] = [];

	//accountInfo
	account_accp: AccountInfo;
	//queryForm объект хранит поля таблицы
	private queryForm: QueryForm;
	//fieldTable объект хранит поля таблицы
	groups: Group[]
	fields: Field[] = new Array<Field>();
	//выбранные столбцы
	select_fields: any [] = null;
	error = '';
	haveGroup: boolean;
	loadTable: boolean;
	loadingTable: boolean;
	//параметры формы
	pars: Parameter[] = new Array<Parameter>();
	//Флаг проверки Action Component
	flagChange: boolean;
	message: string;
	loadReport: boolean;
	havePrint: boolean;
	print: any;
	@ViewChild('dt2') dt: Table
	matchModeOptions: SelectItem[];
	flag_exec: boolean = false
	flag_printTable: boolean = false;
	flagFilter: boolean;
	abonOtdel: any;
	loadAction: boolean = false;
	loadReportWnd: boolean;
	public userName: string;
	private user: any;
	//флаг добавляет кнопки печать и выбор колонок
	formNeed: boolean = false;
	format: string = "pdf";
	formatList: any[];
	ngOnInit(): void {

		this.formatList = [
			{id: 'pdf', name: 'PDF'},
			{id: 'xlsx', name: 'XLSX'},
			{id: 'rtf', name: 'RTF'}
		];
		this.authorizeService.getUser().subscribe(value => {
			if (value) {
				this.user = value;
				this.userName = this.user?.name;
			}
		}, error1 => {
			this.message = 'Не авторизовано !'
			this.showError();
		});

		this.shareService.abonOtdel.subscribe(data => {
			if (data) {
				this.abonOtdel = data;
			} else {
				this.message = 'Абонентский отдел не выбран!';
				this.showError();
			}
		})

		this.primengConfig.ripple = true;
		//заполняем action и получаем форму
		this.getActionForm();
		//получаем данные об аккаунте
		this.accountService.accInfo.subscribe((data: AccountInfo) => {
			this.account_accp = data;
			//устанавливаем параметры для формы
			//this.setParamForm();
			if (this.account_accp) {
				this.getParamForm();
			}
		})
	}

	//получение action и формы
	getActionForm = () => {
		return new Promise((resolve, reject) => {
			const item = this.shareService.itemNav.subscribe((data: NavItem) => {
				if (data) {
					if (this.nav_item !== data) {
						this.nav_item = data;
						if (this.nav_item.id) {
							//получаем данные полей таблиц
							this.getQueryForm(this.nav_item.id.toString());
							this.checkPrintTemplate();

							//добавляем кнопки печать под форму
							this.addPrintBt(this.nav_item.id);

						}
					}
				}
			}, error => {
				console.log(error)
			});
			this.subscriptions.push(item);
			resolve(true);
		})

	}
	//заполнение параметров формы
	setParamForm = async () => {
		let result = await this.getActionForm();
		if (result) {
			setTimeout(() => {
				this.getParamForm();
			}, 500);
		}
	}

	//проверяем наличия шаблона
	checkPrintTemplate() {
		setTimeout(() => {
			this.formService.getPrintTemplate(this.nav_item.id).subscribe(data => {
				if (data) {
					this.print = data;
					if (this.print[0]?.PRINT) {
						console.log('печатный шаблон', this.print[0]?.PRINT.replace('fr3', 'frx'));
						this.havePrint = true;
						this.flag_printTable = false;
					} else {
						this.havePrint = false;
						//печать таблицы есть только в тех формах 1 типа в которых отсутствует печатный шаблон фастрепорт
						this.flag_printTable = true;
					}
				}
			}, error1 => {
				console.log(error1);
				this.message = error1.message;
				this.showError();
			})
		})
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(s => s.unsubscribe());
	}

	//получаем шапрку таблицы
	getQueryForm(action: string) {
		this.action = new ActionOptions(action, SortType.GroupName, ActionScheme.Statement);
		if (this.action) {
			this.fields = null;

			this.flag_exec = false;
			setTimeout(() => {
				this.formService.getForm(this.action.action).subscribe((data: QueryForm) => {
					this.queryForm = data;
					this.groups = this.queryForm.groups;
					if (this.groups.length == 1) {
						this.haveGroup = false;
					} else {
						this.haveGroup = true;
					}
				}, error1 => {
					console.log(error1)
				})
			});
		}
	}

	// получение шапки для таблицы
	getFields() {
		this.fields = [];
		//заполняем массив полей таблицы
		this.queryForm.groups.forEach(element => {
			this.fields = this.fields.concat(element.fields);
			//console.log(element.fields);
		})
	}

	//получение параметров введеные в форму
	getParamForm() {
		this.pars = [];
		if (this.action && this.action.groups)
			this.action.groups.forEach(element => {
				this.pars = this.pars.concat(element.parameters);
				element.parameters.forEach(el => {
					if (el.alias.toLowerCase().replace(new RegExp('_', 'g'), '') == 'accpu') {
						if (this.account_accp?.accpu && (el.value == null || el.value == '')) {
							//поиск аккаунта и сохранение в сервис
							el.value = this.account_accp.accpu;
						}
					}
				})
			});
	}

	// переводим типы из C# в js для шапки таблицы
	getHeaderType(header: any) {
		for (let item of header) {
			for (let obj of this.fields) {
				if (item.Field === obj.field) {
					let type: string = item.Type.split(',')[0];
					obj.type = type.split('.')[1];
				}
			}
		}
	}

	//кнопка выполнить и получить тело таблицы
	onExecute() {
		this.dt?.clear();
		this.flag_exec = true;
		//получение параметров введеные в форму
		this.getParamForm();
		//получение данных для заполнения тела таблицы
		//console.log(JSON.stringify(this.pars));
		setTimeout(() => {
			this.loadingTable = true;
			this.formService.postFormData(this.action.action, this.pars).subscribe((data) => {
				if (data) {
					let source: any = data;
					this.data_table = source.dataTable;
					this.header_table = source.header;
					this.getFields();
					this.sourceFilter = this.shareService.getFilterSource(this.data_table);
					console.log(this.sourceFilter);
					setTimeout(() => {
						if (this.header_table) {
							this.getHeaderType(this.header_table);
						}
						//метод выбора колонок с не 0 значениями
						this.selectedField();
					})
					//console.log(this.header_table);
					this.loadTable = true;
					this.loadingTable = false;
				} else {
					this.loadingTable = false;
				}
			}, error => {
				if (error.status == 500) {
					this.loadingTable = false;
					this.loadTable = false;
					console.log(error);
					console.log('500')
				}
				this.loadingTable = false;
				this.loadTable = false;
				this.error = error;
				this.message = error;
				this.showError();
			});
		})
		this.matchModeOptions = this.shareService.onFilter(); //для фильтра
	}

	parseDate(dateString: string): Date {
		if (dateString) {
			return new Date(dateString);
		}
		return null;
	}

	//getSum итог по полям
	getSum(field: Field): number {
		let summa: number = 0;
		if (field.totalSum) {
			summa = 0;
			if (!this.flagFilter) {
				this.data_table.forEach(
					el => {
						summa += el[field.field];
					})
				return summa;
			} else {
				this.dt.filteredValue.forEach(
					el => {
						summa += el[field.field];
					})
				return summa;
			}

		} else return 0;
	}

	//метод выбирает колонки которые имею в сумме не 0 значения
	selectedField() {
		let summa: number = 0;
		const setResult = new Set<Field>();
		for (let field of this.fields) {
			if (field.totalSum) {
				summa = 0;
				this.data_table.forEach(
					el => {
						summa += el[field.field];
						if (summa != 0) {
							setResult.add(field);
						}
					})
			}
		}
		this.select_fields = [];
		let temp_field: Field[] = [];
		for (let item of setResult) {
			temp_field.push(item);
		}
		this.select_fields = this.getFieldAndGroupTitle(temp_field);
	}

	onChanged(val: any) {
		this.flagChange = val;
		if (!this.flagChange) {
			setTimeout(() => {
				if (this.action.groups) {
					this.getParamForm();
					this.data_table = null; //очистил данные
				}
			})
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('change' + changes);
	}

	//выбор записи и передача его по событию dbclick по записи, данный метод использует компонент accurals (Начисление)
	@Output() onDblclickGetData = new EventEmitter<any>();

	onSelectItem(column: any) {
		//console.log(column)
		this.onDblclickGetData.emit(column);
	}

	openFastReport(val: boolean) {
		let guid: string;
		let data = this.dt.filteredValue ? this.dt.filteredValue : this.data_table;
		setTimeout(() => {
			if (val) {
				this.loadReport = true;
			} else {
				this.loadReportWnd = true;
			}

			this.fastReportService.postParamTableDisplayReport(this.nav_item.id, data, this.account_accp, this.header_table).subscribe(data => {
				console.log(data)
				if (data) {
					guid = data;
					this.fastReportService.openWindwow(guid,this.format);
					//добавить отметку об печати
					if (val) {
						this.loadReport = false;
					} else {
						this.loadReportWnd = false;
					}
					if (val) {
						setTimeout(() => {
							this.formService.setWhoPrint(Number(this.abonOtdel?.ID), this.nav_item.id, this.account_accp.accpu).subscribe(data => {
							}, error1 => console.log(error1))
						})
					}
				}
			}, error => {
				if (val) {
					this.loadReport = false;
				} else {
					this.loadReportWnd = false;
				}
				console.log(error)
				if (error.status == 500) this.message = 'Ошибка формирования отчета';
				else this.message = error.message;
				//console.log(JSON.parse(this.message));
				this.showError();
			})
		})
	}

	showInfo() {
		this.messageService.add({severity: 'info', summary: 'Информация', detail: this.message});
	}

	showError() {
		this.messageService.add({severity: 'error', summary: 'Ошибка', detail: this.message});
	}

	//печатает таблицу
	printTable() {
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
		this.pars.forEach(element => {
			if (element.value) {
				let val: string;
				console.log(element);
				if (element.type == 'TDATE') {
					val = datePipe.transform(this.parseDate(element.value), 'dd.MM.yyyy');
				}
				if (element.type == 'TLIST') {
					val = element.value?.name;
				}
				if (element.type == 'TCHAR') {
					val = element.value;
				}
				if (element.type == 'TNUMBER') {
					val = element.value;
				}
				if (element.type == 'TCHECK') {
					val = element.value;
				}
				if (element.type == 'TLISTCH') {
					val = element.value;
				}
				parameter.push(element.name.concat('\t' + val).concat('\n'));
			}

		})
		//console.log(parameter);
		console.log(parameter);
		//field
		let col = [];
		//название - title
		let head = [];
		// ширина
		let width = [];
		//итог по колонкам
		let itog = [];
		//данные
		let data = this.dt.filteredValue ? this.dt.filteredValue : this.data_table;
		//проверяем если колонки выбраны
		if (this.select_fields != undefined || this.select_fields != null) {
			//пока закоменнтировал так как геморно будет реализовать получение групп от поля
			//let temp_fields:Field[]=[];
			for (let item of this.fields) {
				for (let otem of this.select_fields) {
					if (otem.field == item.field) {
						//temp_fields.push(item);
						head.push(otem.title);
						col.push(otem.field)
						width.push(90);
						if (item.totalSum == true) {
							//console.log(item.field);
							itog.push(this.getSum(item).toFixed(3));
						} else itog.push('');
					}
				}
			}
		}
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
						headerRows: 1,
						body: this.buildTableBody(data, head, col, itog), itog,
						footer: itog,
						styles: {
							fontSize: 10,
							margin: [0, 0, 0, 0]
						}
					}
				},
				{text: 'Источник: АО "Система Город" \n АРМ "Выписка"', fontSize: 12, margin: [0, 10, 0, 0]},
				{text: 'Оператор: '.concat(this.userName), fontSize: 12},
				{text: datePipe.transform(new Date(), 'dd.MM.yyyy'), fontSize: 12},
				{text: 'Компания: '.concat(this.user?.company), fontSize: 12},
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
				if (row[column] === undefined || row[column] === null) dataRow.push('');
				else {
					let value = this.canDate(row[column]) //пробует перевести в дату
					dataRow.push(value.toString());
				}
			})
			btable.push(dataRow);
		});
		//btable.push(itog); //добавляет в последнюю строку итог
		console.log(btable);
		return btable;
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

	// получение колонок с названием группы
	getFieldAndGroupTitle(fields: Field[]): HeaderPDF[] {
		let tt: HeaderPDF[] = [];
		for (let item of this.groups) {
			item.fields.forEach(value => {
				fields.forEach(value1 => {
					if (value1 == value) {
						tt.push(new HeaderPDF(item.title + value1.header, value1.field, value1.type, value1.header, item.title));
					}
				})
			})
		}

		return tt;
	}

	onLoadAction(val: boolean) {
		this.loadAction = val;
	}

	//выбор колонок для печати
	// если тестреру не понравится у наследовать от Field и расширить добавив состояние выбора, в начале все поля false потом взависимости от checkbox
	selectHeader() {
		const dialogRef = this.dialog.open(DialogSettingColumn, {
			minWidth: '350px',
			width: '350px',
			height: 'auto',
			data: {data_table: this.getFieldAndGroupTitle(this.fields), selected: this.select_fields}
		});

		dialogRef.afterClosed().subscribe(result => {
				console.log('The dialog was closed');
				if (result) {
					this.select_fields = result;
					console.log(this.select_fields);
				}
			},
			error => {
				console.log(error);
			});
	}

	onFilter() {
		this.flagFilter = this.dt.filteredValue != undefined;
	}

	//проверяем условие, если форма подходит добавляем кнопку
	selectRecord: any;
	addPrintBt(id: number) {
		if (id == 3276) {
			this.formNeed = true;
		}
	}

	getShortName(value: string): any[] {
		const setResult = new Set();
		let index = 0;
		let result = [];
		if (this.data_table) {
			for (let item of this.data_table) {
				if (item[value]) {
					setResult.add(item[value]);
				}
			}
		}
		for (let item of setResult) {
			result.push(new Value(index, item));
			index++;
		}
		return result;
	}

	globalFilter(value, field: string) {
		console.log(value)
		if(value.length != 0){
			this.dt.filter(value, field, 'in');
		}else this.dt.clear();
	}

	clear(dt: Table) {
		dt.clear();
	}

	onClosePanelFilter(filterTb: any) {
		console.log(filterTb);
		if(filterTb?.filteredValue) {
			this.filterValue = Array.from(filterTb?.filteredValue);
			this.sourceFilter = this.shareService.getFilterSource(this.filterValue)
		}else {
			this.sourceFilter = this.shareService.getFilterSource(this.data_table);
		}
	}

	onSelectItemTable(column: any) {
		this.record = column;
	}
}

//для выбора колонок
@Component({
	selector: 'dialog-table',
	templateUrl: 'param-table-display-dialog.html'
})
export class DialogSettingColumn implements OnInit {
	constructor(private dialogRef: MatDialogRef<DialogSettingColumn>,
					@Inject(MAT_DIALOG_DATA) public data: any) {
		this.dialogRef.beforeClosed().subscribe(() => {
			dialogRef.close(this.selectedItem);
		})
	}

	header_tb: any;
	selectedItem: any;

	ngOnInit(): void {
		this.header_tb = this.data.data_table;
		if (this.data.selected) {
			console.log(this.data.selected);
			this.selectedItem = this.data.selected;
		}
	}

	onSelectItem(column: any) {
		console.log(column);
		this.selectedItem = column;
	}
}
