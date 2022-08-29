import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from "./api-authorization/authorize.guard";
import { ReportTableComponent } from './order/reportTable.component';
import { ReportOrderComponent } from './order/reportOrder.component';
import { ReportOrderDoneComponent } from './order/reportOrderDone.component';
import { HomeComponent } from './home.component';
import { StatementComponent } from "@app/statement/statement.component";
import { AdminComponent } from '@app/administrator/admin.component';
import { DemandsComponent } from '@app/demands/demands.component';
import { EducationComponent } from '@app/education/education.component';
import {AccountManagerComponent} from "@app/administrator/account-manager/account-manager.component";

const routes: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full' },
	{ path: 'reports', component: ReportTableComponent, canActivate: [AuthorizeGuard] },
	{ path: 'reports/order/:id', component: ReportOrderComponent, canActivate: [AuthorizeGuard] },
	{ path: 'reports/orderdone', component: ReportOrderDoneComponent, canActivate: [AuthorizeGuard] },
	{ path: 'statement', component: StatementComponent, canActivate: [AuthorizeGuard] },
	{ path: 'admin', component: AdminComponent, canActivate: [AuthorizeGuard] },
	{ path: 'demands', component: DemandsComponent, canActivate: [AuthorizeGuard] },
	{ path: 'education', component: EducationComponent, canActivate: [AuthorizeGuard] },
	//{ path: 'cn', component: AccountManagerComponent, canActivate: [AuthorizeGuard] },
	//{ path: 'demands/any/:id', component: DynamicDemandComponent, canActivate: [AuthorizeGuard] },
	//{ path: "**", redirectTo: "" }

];

export const appRoutingModule = RouterModule.forRoot(routes);
