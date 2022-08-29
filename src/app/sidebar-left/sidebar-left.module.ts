import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SidebarLeftComponent } from "@app/sidebar-left/sidebar-left.component";
import { RouterModule } from "@angular/router";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShareService} from '@app/_services/share.service';
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterModule,
        NgbModule,
		  MatIconModule,
		  MatListModule,
		  ReactiveFormsModule
    ],
    declarations: [ SidebarLeftComponent ],
    exports: [ SidebarLeftComponent ],
    providers: [ ShareService ]
})
export class SidebarLeftModule { }

