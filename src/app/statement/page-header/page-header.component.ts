import {Input, Component, OnInit, Pipe, Output, EventEmitter, Inject, ViewChild, ElementRef} from '@angular/core';
import {AccountService} from "@app/_services/account.service";
import {AccountInfo} from "@app/_models/account";
import {LocalStorageService} from "@app/_services/localstorage.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogRecalculationAccpu} from '@app/statement/recalculation-accpu/recalculation-accpu.component';
import {tabService} from '@app/_services/tab.service';
import {FormService} from "@app/_services/form.service";
import {RuleObjView, UserInfo} from "@app/_models/schemas";
import {NavItem} from "@app/_models/nav-item";
import {Router} from "@angular/router";
import {ShareService} from "@app/_services";
import {Title} from "@angular/platform-browser";
// компонент может быть удален так как функционал перенс в абонент инфо
@Component({
	selector: 'app-page-header',
	templateUrl: './page-header.component.html',
	styleUrls: ['./page-header.component.less'],
	providers:[LocalStorageService, tabService]
})

export class PageHeaderComponent implements OnInit {

	@Input() titleName: string;
	accp: string;
	accountInfo: AccountInfo;
	private messageDialog: string;
	loading: boolean;
	constructor(public shareService:ShareService,public router: Router,public accountService: AccountService,public localStg: LocalStorageService,private formService:FormService,
					public dialog:MatDialog,private titleService: Title) { }
	//проверка права
	formRule  :RuleObjView =  new RuleObjView('EDIT_OPERATIONPOINT','CONNECTION','YES');
	flagRuleForm:boolean = false;

	//Право доступа до действия - Учет обращений в абонентский отдел
	countPointRule  :RuleObjView =  new RuleObjView('ACTION$ACTION','PROG_NAME','DEMANDVISITTOABNCENTERACTION');
	//Право доступа до действия - Учет звонков горячей линии
	countRegRule  :RuleObjView =  new RuleObjView('ACTION$ACTION','PROG_NAME','DEMANDCALLCENTERACTION');
	//Право доступа до действия - Регистрация обращений по горячей линии для ПУ
	RegRule  :RuleObjView =  new RuleObjView('ACTION$ACTION','PROG_NAME','DEMANDCALLCENTERACTION_PU');

	flagRulReg: boolean = false;
	flagRulRegCount: boolean = false;
	flagRulCountPoint: boolean = false;

	//права для работы с регистрацию обращений
	@Output() onChangeRegRule = new EventEmitter<boolean>();
	@Output() onChangeRegCount = new EventEmitter<boolean>();
	@Output() onChangeCountPoint = new EventEmitter<boolean>();
	//показать скрыть блок
	@Output() onChange = new EventEmitter<boolean>();
	@Output() onChangePoint = new EventEmitter<boolean>();
	@Output() onChangeReg = new EventEmitter<boolean>();
	@Output() onChangeShowSavePhone = new EventEmitter<boolean>();
	@Output() getPhone = new EventEmitter<string>();

	@Output() onChangeTitle = new EventEmitter<string>();
	//для передачи в param-table-component
	@Output() onChangeItem = new EventEmitter<NavItem>();
	@ViewChild('content') content;
	show:boolean = true;
	phone:string;
	loadFastMenu :boolean = false;
	fastMenu:NavItem[];
	@ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;
	userInfo:UserInfo;
	//поиск акк в системе
	searchAccount(accNum:string):void {
		//запрос на получения accountа
		setTimeout(()=>{
			this.loading = true;
			if(accNum){
				this.accountService.getAccountInfo(accNum).subscribe((data:AccountInfo) => {
					if(data){
						console.log(data);
						this.accountInfo=data;
						this.loading = false;
						if(this.accountInfo){
							//сохраняем в сервис
							this.accountService.setaccInfo(this.accountInfo);
						}
					}
				},error =>
				{
					this.loading = false;
					if(error.status === 500){
						this.messageDialog = "Ошибка сервера загрузки данных";
						this.openDialog();
					}
					if(error.status === 404){
						this.messageDialog = "Лицевой счет не найден";
						this.accountInfo = null;
						this.openDialog();
					}else
						console.log(error)
				})
			}else{
				this.accountService.setaccInfo(null);
				this.messageDialog = "Лицевой счет не найден"
				this.accountInfo = null;
				this.openDialog();
				this.loading = false;
			}
		},1200)

	}

	ngOnInit(): void {
		//получаем от сервиса accountInfo
		this.accountService.accInfo.subscribe((data:AccountInfo)=>{
			this.accountInfo=data;
		},error => {console.log(error)});

		setTimeout(()=>{
			this.formService.getRuleObjView(this.formRule).subscribe((data:boolean )=>{
				this.flagRuleForm = data;
			},error => {
				this.flagRuleForm = false;
				console.log(error);
			})
		})

		//права для регистрации обращений
		setTimeout(()=>{
			this.formService.getRuleObjView(this.countPointRule).subscribe((data:boolean )=>{
				this.flagRulCountPoint = data;
				this.onChangeCountPoint.emit(data);
			},error => {
				this.flagRulCountPoint = false;
				console.log(error);
			})
		})

		setTimeout(()=>{
			this.formService.getRuleObjView(this.countRegRule).subscribe((data:boolean )=>{
				this.flagRulRegCount = data;
				this.onChangeRegCount.emit(data);

			},error => {
				this.flagRulRegCount = false;
				console.log(error);
			})
		})

		setTimeout(()=>{
			this.formService.getRuleObjView(this.RegRule).subscribe((data:boolean )=>{
				this.flagRulReg = data;
				this.onChangeRegRule.emit(data);
			},error => {
				this.flagRulReg = false;
				console.log(error);
			})
		})

		//получение номера  пользователя
		setTimeout(()=>{
			this.formService.userInfo.subscribe((data:UserInfo)=>{
				if(data){
					this.phone = data.arm_Phone;
					this.getPhone.emit(this.phone);
				}
			})
		})
		// setTimeout(()=>{
		// 	this.formService.getUserPhone().subscribe((data:number)=>{
		// 		if(data){
		// 			this.phone = data;
		// 			this.getPhone.emit(this.phone);
		// 		}
		// 	},error => {
		// 		console.log(error);
		// 	})
		// })


		//не используется
		// try {
		// 	setTimeout(()=>{
		// 		if(!this.accountInfo){
		// 			this.accp = this.localStg.get('accp');
		// 			this.onSelectAccount(this.accp);
		// 		}
		// 	},1000)
		// }
		// catch (e) {
		// 	console.log(e);
		// }

		this.getFastMenu();
	}

	getFastMenu(){
		setTimeout(()=>{
			this.loadFastMenu = true;
			this.formService.getFastMenu().subscribe((data:NavItem[])=>{
				if(data){
					this.loadFastMenu = false;
					this.fastMenu = data;
				}
			},error => {
				this.loadFastMenu = false;
				console.log(error);
			})
		})
	}

	///@onSelectAccount выбор аккаунта
	onSelectAccount(value:string){
		if(value !== null){
			this.accountService.getAccountInfo(value).subscribe((data:AccountInfo)=>{
				this.accountInfo=data;
				this.accountService.setaccInfo(this.accountInfo); //сохраняем в сервис
			},error => {
				console.log(error);
			})
		}
	}

	showHide() {
		this.show = !this.show;
		//console.log(this.show);
		setTimeout(()=>{
			this.onChange.emit(this.show);
		},100);

	}

	//показ диалогового окна
	openDialog(): void {
		const dialogRef = this.dialog.open(DialogRecalculationAccpu, {
			minWidth:'300px',
			width: 'auto',
			height:'auto',
			data: this.messageDialog
		});

		dialogRef.afterClosed().subscribe(result => {
			},
			error => {
				console.log(error);
			});
	}

	onShowOtdel() {
		this.onChangePoint.emit(true);
	}
	//показ обращения в регистрацию
	onShowReg() {
		this.onChangeReg.emit(true);
	}
	//показ сохранить номер
	onShowSavePhone() {
		this.onChangeShowSavePhone.emit(true);
	}

	scrollLeft() {
		this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
	}

	scrollRight() {
		this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
	}

	onSelectRoute(item: NavItem) {
		if(item.route){
			this.router.navigate([item.route]);
			this.titleName = item.name;
			this.onChangeItemAction(item);
			//для изменения Title вкладке сайта <title>
			this.titleService.setTitle(item.name);
		}
	}

	//метод для изменения титл заголовка
	onChangeTitlePageHeader(item:string){
		this.onChangeTitle.emit(item);
	}

	//метод для изменения action
	onChangeItemAction(item:NavItem){
		//console.log('выбрано элемент',item);
		this.shareService.setItemNav(item);
		// сохранить в локал стор и получить
		this.saveLocalStorageSelectItemMenu(item);
	}
	//сохранение пункта меню в локал сторе для того чтобы выбранный пункт меню отображался корректно
	saveLocalStorageSelectItemMenu(item:NavItem){
		this.localStg.set('menuItem',JSON.stringify(item));
	}
	//метод для прокрутки блока
	scrollWheel(val: any) {
		console.log(this.content);
		this.shareService.blockContent.next(true);
		if(val.deltaY>0){
			this.scrollRight();
		}
		if(val.deltaY<0){
			this.scrollLeft();
		}
	}

	unBlockContent() {
		this.shareService.blockContent.next(false);
	}
}

@Component({
	selector:'dialog-page-header',
	templateUrl:'dialog-page-header.html'
})
export class DialogPageHeader implements OnInit {
	constructor(public dialogRef: MatDialogRef<DialogPageHeader>,
					@Inject(MAT_DIALOG_DATA) public data: string) {
	}

	messageDialog:string;
	ngOnInit(): void {
		this.messageDialog = this.data;
	}

	onClose(){
		this.dialogRef.close();
	}
}
