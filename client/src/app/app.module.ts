import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { AppComponent } from "./app.component";
import { BlogMaterialModule } from "../common/blog-material.module";
import { LoginModule } from "../login/login.module";
import { DashboardModule } from "../dashboard/dashboard.module";
import { AuthenticationInterceptor } from "../utils/authentication.interceptor";
import { AuthenticationService } from "../services/authentication.service";
import { AppRoutingModule } from "./app-routing.module";


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        NgxDatatableModule,
        BlogMaterialModule,
        DashboardModule,
        LoginModule
    ],
    providers: [
        AuthenticationService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
