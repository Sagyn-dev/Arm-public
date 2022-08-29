import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ActionComponent } from './action.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionService} from '@app/_services'
import { SharedModule } from '@app/shared/shared.module';
import { TableModule } from 'primeng/table';
import {FileUploadingModule} from '@app/file-upload/file-upload.module';
import {FileUploadComponent} from '@app/file-upload/file-upload.component';
import {NgxMaskModule} from 'ngx-mask';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TComboComponent} from '@app/tcombo/tcombo.component';
import {TComboModule} from '@app/tcombo/tcombo.module';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        NgSelectModule,
        NgbModule,
        SharedModule,
        TableModule,
        FileUploadingModule,TComboModule,
        NgxMaskModule,
        ReactiveFormsModule,
        ConfirmPopupModule,
        InputTextareaModule
    ],
    declarations: [ActionComponent],
    exports: [ActionComponent, FileUploadComponent,TComboComponent],
    providers: [ActionService]
})
export class ActionModule { }
