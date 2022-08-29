import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {MenuService} from '@app/_services/menu.service';
import {tabService} from '@app/_services/tab.service';
import {SidebarLeftComponent} from '@app/sidebar-left/sidebar-left.component';
import {NavItem} from '@app/_models/nav-item';
import {DemandService} from '@app/_services/demand.service';
import {DeviceDetectorService} from "ngx-device-detector";
import {LocalStorageService} from "@app/_services/localstorage.service";


@Component({
  selector: 'app-demands',
  templateUrl: './demands.component.html',
  styleUrls: ['./demands.component.less'],
  providers: [MenuService, tabService,LocalStorageService]
})
export class DemandsComponent implements OnInit {
	@ViewChild( SidebarLeftComponent ) viewChild: SidebarLeftComponent;
	@ViewChild('container',{read: ViewContainerRef}) container: ViewContainerRef;
	navItems: NavItem;
	headerTitle: string = "Ведение заявок";
	loading:boolean;
	isMobile: boolean;
	isPc:boolean;
	showM: boolean=false;
   constructor(private menuService: MenuService,private demandService: DemandService,private deviceService: DeviceDetectorService, private localStorage: LocalStorageService) { }
	@Input() show:boolean=true;

   ngOnInit(): void {
	  setTimeout(()=>{
		  this.loading=true;
		  this.demandService.getLetterTypeData().subscribe((data) => {
			  this.loading=false;
			  this.navItems = data;
			  // console.log(this.navItems);
		  }) //получение данных об меню
	  })
	  this.checkDevice();

	  this.headerTitle = "Ведение заявок";
	  //console.log(this.headerTitle);

   }

	//проверка устройства
	checkDevice() {
		const isMobile_ = this.deviceService.isMobile();
		const isTablet = this.deviceService.isTablet();
		const isDesktopDevice = this.deviceService.isDesktop();
		if(isTablet || isMobile_){
			this.isMobile = true;
		}
		if(isDesktopDevice){
			this.isPc = true;
		}
	}

	//процедура изменения header title
	changeTitle(event: string) {
		this.headerTitle = event;
	}

	onChange(show: boolean) {
		this.show = show;
		this.showM = true;
	}

}
