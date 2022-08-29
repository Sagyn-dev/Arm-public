import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { FormHeaderComponent } from '@app/form-header/form-header.component';
import {AbonentInfoComponent} from "@app/abonent-info/abonent-info.component";
import {StatementModule} from "@app/statement/statement.module";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ToastModule} from "primeng/toast";

@NgModule({
	imports: [
		SharedModule,
		StatementModule,
		FormsModule,
		CommonModule,
		ToastModule
	],
    declarations: [ FormHeaderComponent,AbonentInfoComponent],
	exports: [FormHeaderComponent, AbonentInfoComponent],
    providers: [ ]
})
export class FormHeaderModule { }
