import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import "rxjs/add/operator/toPromise";


@Injectable()
export class AuthenticationService
{
    public token: string;
    public userName: string;

    private loginUrl = "http://localhost:4730/authenticate";

    constructor(private http: HttpClient,
                private router: Router) {}

    public async login(userName: string, password: string)
    {
        this.http
            .post(this.loginUrl, { userName, password })
            .toPromise()
            .then((token: string) =>
            {
                this.token = token;
                this.router.navigate(["dashboard"]);
            });
    }
}
