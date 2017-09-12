import { NgModule } from "@angular/core";

import { FlexLayoutModule } from "@angular/flex-layout";
import { MdButtonModule, MdTooltipModule, MdToolbarModule } from "@angular/material";


@NgModule({
    imports: [
        FlexLayoutModule,
        MdButtonModule,
        MdTooltipModule,
        MdToolbarModule
    ],
    exports: [
        FlexLayoutModule,
        MdButtonModule,
        MdTooltipModule,
        MdToolbarModule
    ]
})
export class BlogMaterialModule {}
