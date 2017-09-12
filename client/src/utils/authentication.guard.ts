import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from "../services/authentication.service";


@Injectable()
export class AuthGuard implements CanActivate
{
    constructor(private authenticationService: AuthenticationService,
                private router: Router) {}

    public canActivate()
    {
        if (this.authenticationService.token != null)
        {
            return true;
        }

        this.router.navigate(["/login"]);
        return false;
    }
}
