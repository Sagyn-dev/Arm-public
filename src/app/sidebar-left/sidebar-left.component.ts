import { Component, EventEmitter, HostBinding,  Input, OnInit, Output } from '@angular/core';
import { NavItem } from "@app/_models/nav-item";
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ShareService } from "@app/_services";
import {LocalStorageService} from "@app/_services/localstorage.service";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.less'],
  providers:[LocalStorageService],
  animations: [
		trigger('indicatorRotate', [
			state('collapsed', style({transform: 'rotate(0deg)'})),
			state('expanded', style({transform: 'rotate(180deg)'})),
			transition('expanded <=> collapsed',
				animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
			),
		])
	],

})
export class SidebarLeftComponent implements OnInit {
	expanded: boolean = false;

	@HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
	@Input() item: NavItem;
	@Input() depth: number;
	//для вывода в page-header.html
	@Input() titleName:string;
	@Output() onChangeTitle = new EventEmitter<string>();
	//для передачи в param-table-component
	@Output() onChangeItem = new EventEmitter<NavItem>();


	constructor(public router: Router, public shareService: ShareService,private localStg: LocalStorageService,  private titleService: Title) {
		if (this.depth === undefined) {
			this.depth = 0;
		}
	}

	ngOnInit() {}


	onItemSelected(item: NavItem) {
		//для изменения titleHeader
		//console.log(item);
		this.onChangeTitlePageHeader(item.name);
		//для передачи action
      if(item.route){
			this.onChangeItemAction(item);
			//для изменения Title вкладке сайта <title>
			this.titleService.setTitle(item.name);
		}
		if (!item.childItems || !item.childItems.length) {
			if(item.route == 'demands/any'){
				this.router.navigate(['demands/any/',item.id]);
			}else {
				//console.log("маршрут не установлен !")
			}
			if(item.route && item.route !== 'demands/any'){
				this.router.navigate([item.route]);
			}
		}
		if (item.childItems && item.childItems.length) {
			this.expanded = !this.expanded;
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


}
