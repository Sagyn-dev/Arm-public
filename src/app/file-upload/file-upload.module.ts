import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FileUploadComponent} from '@app/file-upload/file-upload.component';
import {ToastModule} from 'primeng/toast';
import {SharedModule} from '@app/shared/shared.module';
import {PdfViewerModule} from "ng2-pdf-viewer";
import {DialogModule} from "primeng/dialog";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        ToastModule,
        SharedModule,
        PdfViewerModule,
        DialogModule
    ],
	declarations:[FileUploadComponent],
	exports:[FileUploadComponent]
})
export class FileUploadingModule {

}
