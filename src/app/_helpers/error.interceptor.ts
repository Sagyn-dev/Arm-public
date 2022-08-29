import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPaths } from '@app/api-authorization/api-authorization.constants';
//import { AuthenticationResultStatus, AuthorizeService } from '../api-authorization/authorize.service';
//import { INavigationState } from '../api-authorization/logout/logout.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(//private authorizeService: AuthorizeService,
        //private activatedRoute: ActivatedRoute,
        private router: Router, ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.router.navigate([ApplicationPaths.Login]);
                //const fromQuery = (this.activatedRoute.snapshot.queryParams as INavigationState).returnUrl
            } else if (err.status===0) {
                if (err.hasOwnProperty('error')) err.error.message='Ошибка соединения';
				} else if (err.status === 400) {
					if (err.hasOwnProperty('error') && err.error.hasOwnProperty('detail')) err.error.message=err.error.detail;
				}
            //console.log(err);
            //const error = err.error.message || err.statusText;
            return throwError(err);
        }))
    }
}
