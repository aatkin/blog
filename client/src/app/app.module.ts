import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { AppComponent } from './app.component';
import { BlogMaterialModule } from "../common/blog-material.module";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxDatatableModule,
    BlogMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
