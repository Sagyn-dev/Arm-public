import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AccountService} from '@app/_services/account.service';
import {FormService} from '@app/_services/form.service';
import {AccountInfo} from '@app/_models/account';
import {
	DebitorBasicData,
	DebitorDataAndDecoding, DebitorDecoding, DebitorTableData,
	Field,
	Group,
	HeaderTable,
	TurnParams,
	ValueParameter
} from '@app/_models/schemas';
import {environment} from '@environments/environment';
import {NavItem} from '@app/_models/nav-item';
import {ShareService} from '@app/_services';
import {FilterService, MessageService, SelectItem} from 'primeng/api';
import {tabService} from '@app/_services/tab.service';
import {FastReportService} from '@app/_services/fastreport.service';
// @ts-ignore
import {formatDate} from '@angular/common';
import {Value} from "@app/_models";
import {saveAs} from 'file-saver';
import { trigger,state,style,transition,animate } from '@angular/animations';
@Component({
	selector: 'app-debit',
	templateUrl: './debit.component.html',
	styleUrls: ['./debit.component.css'],
	animations: [
		trigger('rowExpansionTrigger', [
			state('void', style({
				transform: 'translateX(-10%)',
				opacity: 0
			})),
			state('active', style({
				transform: 'translateX(0)',
				opacity: 1
			})),
			transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
		])
	],
	providers:[tabService, MessageService]
})

export class DebitComponent implements OnInit {
	private FrmId: number = 1598;
	flagFilter: boolean;

	constructor(public accountService:AccountService, public formService:FormService, private shareService: ShareService, private fastReportService: FastReportService, private messageService: MessageService) { }
	loading: boolean;
	accountInfo:AccountInfo;
	accountFlataccs:ValueParameter[];
	selectItemAccpu:string;
	loadingTable:boolean;
	loadingData:boolean;
	dateBegin:string="";
	dateEnd:string="";
	dateCalc:string = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
	message:string;
	loadReport: boolean;
	dataMainTable: DebitorBasicData[]=[];
	header_table: HeaderTable[] = [];
	dataDecodingTable: DebitorDecoding[]=[];
	header_decoding: HeaderTable[] = [];
	matchModeOptions : SelectItem[];


	// для colgrupp нужно передать количество колонок
	colgroup = Array.apply(null, {length: 9}).map(Number.call, Number);
	ck_ignore_rules = false;
	ck_peny_enclosure2 = false;
	ck_peny_enclosure = false;
	ck_default = false;

	shortName : any;
	@ViewChild('dt2') dt :any;
	filterStr:string;

	idform:number = 1598;
	abonOtdel:any;

	groups:Group[]=[];
	_groups:Group[]=[];
	cols:any[];
	format:string;
	formatList:any[];
	sourceFilter:any;
	filterValue:any[]=[];
	//колонки для выбора
	_selectedColumns: any;
	isGroup: boolean = true;
	//расскрывать все списки или нет
	isAll:boolean = false;
	dataTable:DebitorTableData[]= [];
	record:DebitorTableData;
	ngOnInit(): void {
		this.groups = [
			{id:1,fields:[],title:''},
			{id:2,fields:[],title:''},
			{id:3,fields:[],title:''},
			{id:4,fields:[
					{field:'DOLG',header:'Долг', type:'Decimal',orientation:null,position:1,totalSum:false},
					{field:'AVANS',header:'Аванс', type:'Decimal',orientation:null,position:2,totalSum:false},
				],title:'Сумма долга'},
			{id:5,fields:[
					{field:'PENYNACH',header:'Начисленная', type:'Decimal',orientation:null,position:1,totalSum:false},
					{field:'PENY',header:'Расчетная', type:'Decimal',orientation:null,position:2,totalSum:false},],title:'Пеня'},
			{id:6,fields:[],title:''},
			{id:7,fields:[],title:''},
		];
		this.cols = [
			{ field: 'DATEB', header: 'Дата распределения',type:'Date' },
			{ field: 'OPMONTH', header: 'Операционный месяц',type:'Date' },
			{ field: 'SHORTNAME', header: 'Услуга',type:'String' },
			{ field: 'DOLG', header: 'Долг',type:'Decimal',totalSum:true },
			{ field: 'AVANS', header: 'Аванс',type:'Decimal',totalSum:true},
			{ field: 'PENYNACH', header: 'Начисленная',type:'Decimal',totalSum:true},
			{ field: 'PENY', header: 'Расчетная',type:'Decimal',totalSum:true},
			{ field: 'NOTE', header: 'Причина отсутствия пени начисленной',type:'String' },
			{ field: 'SUPP', header: 'Поставщик',type:'String' }
		]
		this._selectedColumns = this.cols;
		this._groups = this.groups;

		this.formatList = [
			{id:"pdf",name:"PDF"},
			{id:"xlsx",name:"XLSX"},
			{id:"rtf",name:"RTF"}
		];
		this.format = "pdf";
		this.shareService.abonOtdel.subscribe(data=>{
			if(data){
				this.abonOtdel = data;
			}else {
				this.message = 'Абонентский отдел не выбран!';
				this.showError();
			}
		})
		// получаем id формы
		this.shareService.itemNav.subscribe((data: NavItem) => {
			if (data) this.FrmId = data.id;
		}, error => {
			console.log(error)
		});

		// получаем данные об аккаунте
		this.accountService.accInfo.subscribe((data: AccountInfo) =>
			{
				this.accountFlataccs=[];
				this.selectItemAccpu=null;
				this.accountInfo = data;

				setTimeout(()=>{
					// получаем связанные лц
					if(this.accountInfo){
						this.loading=true;
						this.accountService.getFlatAccs(this.accountInfo.accpu).subscribe((data:ValueParameter[])=>{
							this.accountFlataccs = data;
							if(this.accountFlataccs){
								for(let i= 0;  i<this.accountFlataccs.length; i++){
									if(this.accountFlataccs[i].id !== this.accountInfo.accpu){
										this.selectItemAccpu = this.accountFlataccs[i].id;
									}else {
										this.selectItemAccpu = this.accountInfo.accpu;
										break;
									}
								}

							}
							this.loading=false;
							console.log(this.accountFlataccs);
						},error => {
							console.log(error);
							this.loading=false;

						})
					}else console.log('accpu is null')
				})

			},
			error => {
				this.loadingTable=false;
				console.log(error)
			})

		this.matchModeOptions = this.shareService.onFilter();
	}
	@Input() get selectedColumns(): any[] {
		return this._selectedColumns;
	}

	set selectedColumns(val: any[]) {
		//restore original order
		this._selectedColumns = this.cols.filter(col => val.includes(col));
	}

	parseDate(dateString: string): Date {
		if (dateString) {
			return new Date(dateString);
		}
		return null;
	}

	getShortName(value:string):any[]{
		const setResult = new Set();
		let index=0;
		let result=[];
		if(this.dataMainTable) {
			for (let item of this.dataMainTable) {
				if (item[value]) {
					setResult.add(item[value]);
				}
			}
		}
		for (let item of setResult){
			result.push(new Value(index,item));
			index++;
		}
		return result;
	}

	onExecute() {
		// конструктор устанавливает параметры для пакетных переменных в бд
		const parameters: TurnParams = new TurnParams(this.selectItemAccpu,this.parseDate(this.dateBegin),this.parseDate(this.dateEnd),this.parseDate(this.dateCalc));
		console.log(parameters);
		setTimeout(()=>{
			this.loadingTable = true;
			this.loadingData = false;
			this.formService.postDebit(parameters,this.ck_ignore_rules).subscribe((data=>{
				console.log(data);
				if(data) {
					let source : DebitorDataAndDecoding = data;
					this.dataMainTable = source.dataBasic;
					this.header_table = source.headerBasic;
					this.dataDecodingTable = source.dataDecoding;
					this.header_decoding = source.headerDecoding;
					console.log(this.dataDecodingTable,this.header_decoding);

					this.dataTable = this.convertDataTable();

					this.loadingTable = false;
					this.loadingData = true;
					this.dt?.clear();
					//получить набор после выбора
					this.sourceFilter=this.shareService.getFilterSource(this.dataMainTable);
				}
			}),error => {
				console.log(error);
				this.loadingTable=false;
			})
		})

	}
	convertDataTable():DebitorTableData[]{
		let result:DebitorTableData[] = [];
		this.dataMainTable.forEach(value => {
			let dec_c: DebitorDecoding [] = [];
			this.dataDecodingTable.forEach(dec=>{
				if(value.SRV == dec.SRV && value.OPMONTH == dec.OPMONTH && value.DATEB == dec.DATEB){
					dec_c.push(dec);
				}
			})
			result.push(new DebitorTableData(this.parseDate(value.DATEB),this.parseDate(value.OPMONTH),value.SHORTNAME,
														value.DOLG,value.AVANS,value.PENYNACH,
														value.PENY,value.NOTE,value.SUPP,dec_c));
			dec_c = [];
		})
		return result;
	}
	onClosePanelFilter(filterTb: any) {
		if(filterTb?.filteredValue) {
			this.filterValue = Array.from(filterTb?.filteredValue);
			this.sourceFilter = this.shareService.getFilterSource(this.filterValue)
		}else {
			this.sourceFilter = this.shareService.getFilterSource(this.dataMainTable);
		}
	}
	getSum(field: Field): number {
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
				this.dt.filteredValue.forEach(
					el => {
						summa += el[field.field];
					})
				return summa;
			}

		} else return 0;
	}


	openFastReport(val:boolean){
		let guid:any;
		let data = this.dt.filteredValue ? this.dt.filteredValue : this.dataMainTable;
		console.log(this.dt.filters);
		let filter:any[] = this.dt.filters.SHORTNAME.value ?  this.dt.filters.SHORTNAME.value : [];
		let filter_supp:any[] = this.dt.filters.SUPP?.value ?  this.dt.filters.SUPP?.value : [];
		console.log(filter,filter_supp);

		let filter_ = {SRVNAME : null, SUPPNAME:null};
		if(filter != null){
			filter_.SRVNAME = JSON.stringify(filter);
		}
		if(filter_supp != null){
			filter_.SUPPNAME = JSON.stringify(filter_supp);
		}

		setTimeout(()=>{
			this.loadReport = true;
			this.fastReportService.postDebitReport(data,this.ck_ignore_rules,this.ck_peny_enclosure,this.ck_peny_enclosure2,this.ck_default,JSON.stringify(filter_),this.accountInfo, this.header_table,this.dateCalc,this.dateBegin,this.dateEnd).subscribe((data:string)=>{
				if(data){
					guid = data;
					this.loadReport = false;
					for(let item of guid){
						console.log(item);
						setTimeout(()=>{
							//this.fastReportService.openWindwow(item,this.format);
							this.fastReportService.getFileReport(item,this.format).subscribe(data=>{
								console.log(data);
								let blob:any = new Blob([data], { type: 'text/file; charset=utf-8' });
								saveAs(blob,item+'.'+this.format);
							},error => {
								this.message = error.message;
								this.showError();
							})
						},150);

					}
					if(val){
						setTimeout(()=>{
							this.formService.setWhoPrint(Number(this.abonOtdel?.ID),this.idform,this.accountInfo.accpu).subscribe(data=>{
							},error1 => console.log(error1))
						})
					}
				}
			},error => {

				this.loadReport = false;
				this.message = error.message;
				this.showError();
				console.log(error)
			})
		})
	}

	showInfo() {
		this.messageService.add({severity:'info', summary: 'Информация', detail: this.message});
	}

	showError() {
		this.messageService.add({severity:'error', summary: 'Ошибка', detail: this.message});
	}

	onFilter() {
		this.flagFilter = this.dt.filteredValue != undefined;
	}

	onChangeIgnoreRules(value: any) {
		this.dataMainTable = null;
	}

	onShowGroup(val:boolean) {
		if(val){
			this._groups = this.groups;
		}else{
			this._groups = [];
		}
	}

	dd(item: any) {
		console.log(item);
	}

	onSelectItemTable(value) {
		this.record = value;
	}
}
