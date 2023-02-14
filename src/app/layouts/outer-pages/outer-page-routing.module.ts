import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from 'src/app/components/pages/inner-pages/forgot-password/forgot-password.component';
import { OuterPageComponent } from './outer-page/outer-page.component';


const routes: Routes = [{
  path: '',
  component: OuterPageComponent,
  children: [
    { path: '', redirectTo: 'forgotPassword', pathMatch: 'full' },
    { path: 'forgotPassword', component: ForgotPasswordComponent, pathMatch: 'full', canActivate: [], data: { title: 'Forgot Password' } },
    { path: 'forgotPassword/:uuid/:token/:name', component: ForgotPasswordComponent, canActivate: [], pathMatch: 'full', data: { title: 'Forgot Password' } },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OuterPageRoutingModule { }
