import {LOCALE_ID, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {StatementComponent} from "@app/statement/statement.component";
import {DialogPageHeader, PageHeaderComponent} from '@app/statement/page-header/page-header.component';
import {SharedModule} from "@app/shared/shared.module";
import {RouterModule, Routes} from "@angular/router";
import {SearchAddressComponent, SearchDialog} from "@app/statement/search/search-address.component";
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from "@ng-select/ng-select";
import {MydirDirective} from "@app/statement/mydir.directive";
import { TableModule} from "primeng/table";
import {InputTextModule} from 'primeng/inputtext';
import {MultiSelectModule} from 'primeng/multiselect';
import {ActionModule} from "@app/action/action.module";
import {
	DialogSettingColumn,
	ParamTableDisplayComponent
} from "@app/statement/param-table-display/param-table-display.component";
import {AuthorizeGuard} from '@app/api-authorization/authorize.guard';
import {TurnDeployComponent} from '@app/statement/turn-deploy/turn-deploy.component';
import {TabDirective} from '@app/tab/tab.directive';
import {ArmDatePipe} from '@app/arm-date.pipe';
import {DebitComponent} from '@app/statement/debit/debit.component';
import {ViewFineComponent} from '@app/statement/view-fine/view-fine.component';
import {DropdownModule} from 'primeng/dropdown';
import {FileUploadModule} from 'primeng/fileupload';
import {FileUploadComponent} from '@app/file-upload/file-upload.component';
import {ToastModule} from 'primeng/toast';
import {ReturnSumComponent} from '@app/statement/return-sum/return-sum.component';
import { SidebarLeftModule } from '@app/sidebar-left/sidebar-left.module';
import {FileUploadingModule} from '@app/file-upload/file-upload.module';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {ArmDateTimePipe} from "@app/arm-datetime.pipe";
import {ToolbarModule} from "primeng/toolbar";
import {SplitButtonModule} from "primeng/splitbutton";
import {SprSumpayComponent} from "@app/statement/srp-sumpay/spr-sumpay.component";
import {SprSubsidComponent} from "@app/statement/spr-subsid/spr-subsid.component";
import {ReturnCnComponent} from "@app/statement/return-cn/return-cn.component";
import {DialogModule} from "primeng/dialog";
import {TooltipModule} from "primeng/tooltip";
import {PayCnComponent} from "@app/statement/pay-cn/pay-cn.component";
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {NgxPrintModule} from 'ngx-print';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {SUOComponent} from "@app/statement/suo/suo.component";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NgxMaskModule} from "ngx-mask";
import {RippleModule} from "primeng/ripple";
import {CalendarModule} from "primeng/calendar";





registerLocaleData(localeFr);

const routes: Routes = [
	{
		path: 'statement', component: StatementComponent,
		children: [
			{
				path: 'pay-cn',
				component: PayCnComponent,
				canActivate: [AuthorizeGuard]
			},{
				path: 'suo',
				component: SUOComponent,
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'spr-subsid',
				component: SprSubsidComponent,
				canActivate: [AuthorizeGuard]
			},{
				path: 'return-cn',
				component: ReturnCnComponent,
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'spr-sumpay',
				component: SprSumpayComponent,
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'turn-deploy',
				component: TurnDeployComponent,
				canActivate: [AuthorizeGuard]
			},
			{
				path: 'debit',
				component: DebitComponent,
				canActivate: [AuthorizeGuard]
			},
			{
				path:'view-fine',
				component:ViewFineComponent,
				canActivate:[AuthorizeGuard]
			},
			{
				path:'return-sum',
				component:ReturnSumComponent,
				canActivate:[AuthorizeGuard]
			}
		]
	}
];

@NgModule({
    imports: [CommonModule,
        SharedModule, RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        TableModule,
        ActionModule,
        InputTextModule,
        MultiSelectModule,
        DropdownModule,
        FileUploadModule,
        ToastModule,
        SidebarLeftModule,
        FileUploadingModule, ToolbarModule, SplitButtonModule, DialogModule, TooltipModule, PdfViewerModule,
        NgxPrintModule, ConfirmDialogModule, InputTextareaModule, NgxMaskModule, RippleModule, CalendarModule,

    ],
	declarations: [
		StatementComponent,
		PageHeaderComponent,
		DialogPageHeader,
		SearchAddressComponent,
		SearchDialog,
		MydirDirective,
		ParamTableDisplayComponent,
		DialogSettingColumn,
		TurnDeployComponent,
		TabDirective,
		ArmDatePipe,
		ArmDateTimePipe,
		DebitComponent,
		ViewFineComponent,
		ReturnSumComponent,
		SprSumpayComponent,
		SprSubsidComponent,
		ReturnCnComponent,
		PayCnComponent,
		SUOComponent,
	],
    exports: [
        SearchAddressComponent,
        MydirDirective,
        TabDirective,
        SearchDialog,
        FileUploadComponent,
        ArmDatePipe,
    ], providers:[{provide:LOCALE_ID, useValue:'fr-FR'}]
})
export class StatementModule {	constructor() {} }
