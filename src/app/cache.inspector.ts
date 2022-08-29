import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
		if (req.method === "GET") {
			const httpRequest = req.clone({
				setHeaders: {
					'Cache-Control': 'no-cache',
					'Pragma': 'no-cache',
					'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
				}
			});
			return next.handle(httpRequest);
		}
		return next.handle(req);
 	}
}

