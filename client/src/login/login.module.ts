import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { BlogMaterialModule } from "../common/blog-material.module";
import { AuthenticationService } from "../services/authentication.service";
import { LoginComponent } from "./login.component";


@NgModule({
    imports: [
        FormsModule,
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
