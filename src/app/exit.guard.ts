import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from "rxjs";

export interface ComponentCanDeactivate{
	canDeactivate: () => boolean | Observable<boolean>;
}

export class ExitGuard implements CanDeactivate<ComponentCanDeactivate>{

	canDeactivate(
		component: ComponentCanDeactivate
	 ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
		return component.canDeactivate ? component.canDeactivate() : true;
	 }
}
