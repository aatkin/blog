import { NgModule } from "@angular/core";

import { BlogMaterialModule } from "../common/blog-material.module";
import { AuthenticationService } from "../services/authentication.service";
import { LoginComponent } from "./login.component";


@NgModule({
    imports: [
        BlogMaterialModule
    ],
    declarations: [
        LoginComponent
    ],
    exports: [
    ],
    providers: [
        AuthenticationService
    ]
})
export class LoginModule {}
