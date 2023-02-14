import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from 'src/app/components/pages/entry-pages/billing/billing.component';
import { SigninComponent } from 'src/app/components/pages/entry-pages/signin/signin.component';
import { SignupComponent } from 'src/app/components/pages/entry-pages/signup/signup.component';
import { EntryPageComponent } from './entry-page.component';
import { ForgotPasswordComponent } from 'src/app/components/pages/inner-pages/forgot-password/forgot-password.component';


const routes: Routes = [{
  path: '',
  component: EntryPageComponent,
  children: [
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: 'signup', component: SignupComponent, pathMatch: 'full', data: { title: 'Sign up' } },
    { path: 'signin', component: SigninComponent, pathMatch: 'full', data: { title: 'Sign in' } },
    { path: 'billing', component: BillingComponent, pathMatch: 'full' },
    { path: 'forgot-password', component: ForgotPasswordComponent, pathMatch: 'full' },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryPageRoutingModule { }
