import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "../login/login.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";
import { AuthGuard } from "../utils/authentication.guard";


const appRoutes: Routes = [
    { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
    { path: "login", component: LoginComponent },
    { path: "", redirectTo: "/dashboard", pathMatch: "full" },
    { path: "**", component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } // <-- debugging purposes only
        )
    ],
    declarations: [PageNotFoundComponent],
    providers: [AuthGuard],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
