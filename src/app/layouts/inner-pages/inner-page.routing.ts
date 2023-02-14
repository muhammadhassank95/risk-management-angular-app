
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArchivesComponent } from 'src/app/components/pages/inner-pages/archives/archives.component';
import { GroupsComponent } from 'src/app/components/pages/inner-pages/groups/groups.component';
import { ProposalsComponent } from 'src/app/components/pages/inner-pages/proposals/proposals.component';
import { RiskCommunityComponent } from 'src/app/components/pages/inner-pages/risk-community/risk-community.component';
import { RisksLogComponent } from 'src/app/components/pages/inner-pages/risks-log/risks-log.component';

// components
import { RisksComponent } from 'src/app/components/pages/inner-pages/risks/risks.component';
import { SitesComponent } from 'src/app/components/pages/inner-pages/sites/sites.component';
import { TopRisksComponent } from 'src/app/components/pages/inner-pages/top-risks/top-risks.component';
import { UsersComponent } from 'src/app/components/pages/inner-pages/users/users.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { InnerPageComponent } from './inner-page.component';
import { LegalComponent } from 'src/app/components/pages/inner-pages/legal/legal.component';
import { RiskManagerPanelComponent } from 'src/app/components/pages/inner-pages/risk-manager-panel/risk-manager-panel.component';
import { CapabilitiesPanelComponent } from 'src/app/components/pages/inner-pages/capabilities-panel/capabilities-panel.component';


const routes: Routes = [{
  path: '',
  component: InnerPageComponent,
  canActivate: [AuthGuard],
  children: [
    { path: '', redirectTo: 'community', pathMatch: 'full' },
    { path: 'risks', component: RisksComponent, pathMatch: 'full', data: { title: 'Risks' } },
    { path: 'risks/logs/:id', component: RisksLogComponent, pathMatch: 'full', data: { title: 'Risks Logs' } },
    { path: 'groups', component: GroupsComponent, pathMatch: 'full', data: { title: 'Groups' } },
    { path: 'users', component: UsersComponent, pathMatch: 'full', data: { title: 'Users' } },
    { path: 'sites', component: SitesComponent, pathMatch: 'full', data: { title: 'Sites' } },
    { path: 'archived', component: ArchivesComponent, pathMatch: 'full', data: { title: 'Archived' } },
    { path: 'proposals', component: ProposalsComponent, pathMatch: 'full', data: { title: 'Proposals' } },
    { path: 'community', component: RiskCommunityComponent, pathMatch: 'full', data: { title: 'Risk Community' } },
    { path: 'risk-manager-panel', component: RiskManagerPanelComponent, pathMatch: 'full', data: { title: 'Risk Community' } },
    { path: 'legal/:term', component: LegalComponent, pathMatch: 'full', data: { title: 'Legal Documents' } },
    { path: 'capabilities', component: CapabilitiesPanelComponent, pathMatch: 'full', data: { title: 'Capabilities Panel' } },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InnerPageRoutingModule { }
