import { Component } from '@angular/core';

import { AuthenticationService } from "../services/authentication.service";


@Component({
    selector: 'blog-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent
{
    constructor(private authenticationService: AuthenticationService) {}

    public userName: string;
    public password: string;

    public async login()
    {
        await this.authenticationService.login(this.userName, this.password);
    }
}
