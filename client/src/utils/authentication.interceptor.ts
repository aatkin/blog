import { Injectable, Injector } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import { AuthenticationService } from "../services/authentication.service";


@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor
{
    constructor(private injector: Injector) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        const authenticationService = this.injector.get(AuthenticationService);
        const authToken = authenticationService.token;
        const authRequest = req.clone({ headers: req.headers.set("Authorization", "Bearer " + authToken) });
        return next.handle(req);
    }
}
