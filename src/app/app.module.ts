import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';
import { ErrorInterceptor } from './_helpers';
import { ApiAuthorizationModule } from './api-authorization/api-authorization.module';
import { AuthorizeInterceptor } from "./api-authorization/authorize.interceptor";
import { HomeComponent } from './home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { CommonModule } from "@angular/common";
import { StatementModule } from "@app/statement/statement.module";
import { DemandsModule } from '@app/demands/demands.module';
import { CacheInterceptor } from '@app/cache.inspector';
import {DialogModule} from "primeng/dialog";
import {NgSelectModule} from "@ng-select/ng-select";



@NgModule({
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		HttpClientModule,
		appRoutingModule,
		ApiAuthorizationModule,
		BrowserAnimationsModule,
		NgbModule,
		CommonModule,
		//модуль выписки
		StatementModule,
		//модуль ведения заявок
		DemandsModule,
		//модуль поиска
		// Material
		MatButtonModule,
		MatButtonToggleModule,
		MatMenuModule,
		FormsModule,
		DialogModule,
		NgSelectModule,
	],
    declarations: [
        AppComponent,
        HomeComponent
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
		  {provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true},
		  NgForm
    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
