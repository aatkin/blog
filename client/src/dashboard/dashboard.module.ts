import { NgModule } from "@angular/core";

import { BlogMaterialModule } from "../common/blog-material.module";
import { DashboardComponent } from "./dashboard.component";


@NgModule({
    imports: [
        BlogMaterialModule
    ],
    declarations: [
        DashboardComponent
    ],
    exports: [
    ]
})
export class DashboardModule {}
