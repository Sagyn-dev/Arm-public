import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TableModule} from 'primeng/table';
import {ActionModule} from '@app/action/action.module';
import {InputTextModule} from 'primeng/inputtext';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {FileUploadModule} from 'primeng/fileupload';
import {ToastModule} from 'primeng/toast';
import {SidebarLeftModule} from '@app/sidebar-left/sidebar-left.module';
import {AuthorizeGuard} from '@app/api-authorization/authorize.guard';
import {DemandsComponent} from '@app/demands/demands.component';
import {TkoComponent} from '@app/demands/tko/tko.component';
import {SharedModule} from '@app/shared/shared.module';
import {StatementModule} from '@app/statement/statement.module';
import {FormHeaderModule} from '@app/form-header/form-header.module';
import {CameraComponent} from '@app/file-upload/camera/camera.component';
import {WebcamModule} from 'ngx-webcam';
import {CameraDialog, PreviewDialog} from '@app/file-upload/file-upload.component';
import {NgxMaskModule} from 'ngx-mask';
import {DynamicDemandComponent} from '@app/demands/dynamic-demand/dynamic-demand.component';
import {ExitGuard} from '@app/exit.guard';
import {PdfViewerModule} from "ng2-pdf-viewer";
import {NewAccpuComponent} from "@app/demands/new-accpu/new-accpu.component";
import {RenAccpuComponent} from "@app/demands/ren-accpu/ren-accpu.component";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {SidebarModule} from "primeng/sidebar";
import {CommunalTempComponent} from "@app/demands/communal-temp/communal-temp.component";
import {IpuEnterComponent} from "@app/demands/ipu-enter/ipu-enter.component";


const routes: Routes = [
	{
		path: 'demands', component: DemandsComponent,
		children: [
			{
				path: 'tko',
				component: TkoComponent,
				canActivate: [AuthorizeGuard],
				canDeactivate:[ExitGuard]
			},
			{
				path: 'new_accpu',
				component: NewAccpuComponent,
				canActivate: [AuthorizeGuard],
				canDeactivate:[ExitGuard]
			},
			{
				path: 'ren_accpu',
				component: RenAccpuComponent,
				canActivate: [AuthorizeGuard],
				canDeactivate:[ExitGuard]
			},
			{
				path: 'comm_temp',
				component: CommunalTempComponent,
				canActivate: [AuthorizeGuard],
				canDeactivate:[ExitGuard]
			},{
				path: 'ipu_entered',
				component: IpuEnterComponent,
				canActivate: [AuthorizeGuard],
				canDeactivate:[ExitGuard]
			},
			{
				path: 'any/:id',
				component: DynamicDemandComponent,
				canActivate: [AuthorizeGuard],
				canDeactivate:[ExitGuard]
			}
		]
	}
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
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
        StatementModule,
        FormHeaderModule,
        WebcamModule,
        NgxMaskModule.forRoot(),
        PdfViewerModule,
        ConfirmPopupModule,
        SidebarModule,
    ],
	declarations:[
		DemandsComponent,
		TkoComponent,
		CameraComponent,
		CameraDialog,
		PreviewDialog,
		DynamicDemandComponent,
		NewAccpuComponent,
		RenAccpuComponent,
		CommunalTempComponent,
		IpuEnterComponent
	],
    exports:[],
	providers:[ExitGuard]
})
export class DemandsModule {
	constructor() {}
}
