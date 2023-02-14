import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';
import { PageNotFoundComponent } from './components/partials/page-not-found/page-not-found.component';

const entryRoutes: Route = { 
    path: '', 
    loadChildren: () => import('./layouts/entry-pages/entry-page.module').then((m) => m.EntryPageModule)
}

const innerRoutes: Route = { 
    path: '', 
    loadChildren: () => import('./layouts/inner-pages/inner-page.module').then((m) => m.InnerPageModule)
}

const outerRoutes: Route = { 
    path: '', 
    loadChildren: () => import('./layouts/outer-pages/outer-page.module').then((m) => m.OuterPageModule)
}

const pageNotFound: Route = { 
  path: '**',
  component: PageNotFoundComponent, pathMatch: 'full', data: { title: '404 Page' }
}

const routes: Routes = [entryRoutes, innerRoutes, outerRoutes, pageNotFound]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
