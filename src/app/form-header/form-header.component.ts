import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NavItem} from "@app/_models/nav-item";
import {LocalStorageService} from "@app/_services/localstorage.service";

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.less'],
  providers:[LocalStorageService]
})
export class FormHeaderComponent implements OnInit {

	constructor(private localStg:LocalStorageService) { }

	ngOnInit(): void {
		setTimeout(()=>{
			if(this.localStg.get('menuItem')){
				let menuItem:NavItem = this.localStg.get('menuItem');
				this.titleName = menuItem.name;
			}
		})
	}
	@Input() titleName: string;
  	//показать скрыть блок
	@Output() onChange = new EventEmitter<boolean>();
	show:boolean = true;
	showHide() {
		this.show = !this.show;
		//console.log(this.show);
		setTimeout(()=>{
			this.onChange.emit(this.show);
		},100);
	}
}
