import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { EntryPageComponent } from './entry-page.component';
import { EntryPageRoutingModule } from './entry-page.routing.module';
import { RouterModule } from '@angular/router';
import { SignupComponent } from 'src/app/components/pages/entry-pages/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SigninComponent } from 'src/app/components/pages/entry-pages/signin/signin.component';
import { BillingComponent } from 'src/app/components/pages/entry-pages/billing/billing.component';
import { EntryPageLeftbarComponent } from 'src/app/components/pages/entry-pages/entry-page-navbar/entry-page-leftbar.component';
import { SharedModule } from 'src/app/shared/shared-module';
import { NgxLoadingModule } from "ngx-loading";
import { LoaderComponent } from 'src/app/components/loader/loader.component';

@NgModule({
  declarations: [
    SignupComponent,
    EntryPageComponent,
    SigninComponent,
    BillingComponent,
    EntryPageLeftbarComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    EntryPageRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxLoadingModule.forRoot({})
  ],
  exports: [
    LoaderComponent
  ]
})
export class EntryPageModule { }
