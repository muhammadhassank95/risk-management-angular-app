import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { InnerPageRoutingModule } from './inner-page.routing';
import { SharedModule } from 'src/app/shared/shared-module';

// components
import { HeaderComponent } from 'src/app/components/partials/header/header.component';
import { RisksComponent } from 'src/app/components/pages/inner-pages/risks/risks.component';
import { InnerPageComponent } from './inner-page.component';
import { LeftNavBarComponent } from 'src/app/components/partials/left-nav-bar/left-nav-bar.component';
import { CreateUpdateRiskModalComponent } from 'src/app/components/modal/risks/create-update-risk-modal/create-update-risk-modal.component';
import { GridActionIconsComponent } from 'src/app/components/partials/ag-grid-helper/grid-acion-icons/grid-acion-icons.component';
import { RiskDetailModalComponent } from 'src/app/components/modal/risks/risk-detail-modal/risk-detail-modal.component';
import { RisksLogComponent } from 'src/app/components/pages/inner-pages/risks-log/risks-log.component';
import { GroupsComponent } from 'src/app/components/pages/inner-pages/groups/groups.component';
import { CreateUpdateGroupsModalComponent } from 'src/app/components/modal/groups/create-update-groups-modal/create-update-groups-modal.component';
import { AssignUsersToGroupModalComponent } from 'src/app/components/modal/groups/assign-users-to-group-modal/assign-users-to-group-modal.component';
import { UsersComponent } from 'src/app/components/pages/inner-pages/users/users.component';
import { ChangePasswordComponent } from 'src/app/components/modal/users/change-password/change-password.component';
import { RisksLogsDetailUpdateComponent } from 'src/app/components/modal/risks/risks-logs-detail-update/risks-logs-detail-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SitesComponent } from 'src/app/components/pages/inner-pages/sites/sites.component';
import { CreateSiteModalComponent } from 'src/app/components/modal/create-site-modal/create-site-modal.component';
import { NgxLoadingModule } from "ngx-loading";
import { ArchiveRiskConfirmationModalComponent } from 'src/app/components/modal/risks/archive-risk-confirmation-modal/archive-risk-confirmation-modal.component';
import { ArchivesComponent } from 'src/app/components/pages/inner-pages/archives/archives.component';
import { ProposalsComponent } from 'src/app/components/pages/inner-pages/proposals/proposals.component';
import { ButtonRendererComponent } from 'src/app/components/partials/ag-grid-helper/button-renderer/button-renderer.component';
import { PageNotFoundComponent } from 'src/app/components/partials/page-not-found/page-not-found.component';
import { DeleteModalComponent } from 'src/app/components/modal/delete-modal/delete-modal.component';
import { EntryPageModule } from '../entry-pages/entry-page.module';
import { TopRisksComponent } from 'src/app/components/pages/inner-pages/top-risks/top-risks.component';
import { RiskCommunityComponent } from 'src/app/components/pages/inner-pages/risk-community/risk-community.component';
import { InviteTeamMembersComponent } from 'src/app/components/modal/invite-team-members/invite-team-members.component';
import { AddSiteComponent } from 'src/app/components/modal/add-site/add-site.component';
import { ArchiveModalComponent } from 'src/app/components/modal/archive-modal/archive-modal.component';
import { FooterComponent } from 'src/app/components/partials/footer/footer.component';
import { RiskMembersComponent } from 'src/app/components/modal/risk-members/risk-members.component';
import { UserEditModalComponent } from 'src/app/components/modal/users/user-edit-modal/user-edit-modal.component';
import { LegalComponent } from 'src/app/components/pages/inner-pages/legal/legal.component';
import { AddUpdateComponent } from 'src/app/components/modal/add-update/add-update.component';
import { RiskManagerPanelComponent } from 'src/app/components/pages/inner-pages/risk-manager-panel/risk-manager-panel.component';
import { RiskManagerComponent } from 'src/app/components/modal/risk-manager/risk-manager.component';
import { MaterialExampleModule } from 'src/app/shared/material-module';
import { QuillModule } from 'ngx-quill';
import { CapabilitiesPanelComponent } from 'src/app/components/pages/inner-pages/capabilities-panel/capabilities-panel.component';
import { DeleteGroupComponent } from 'src/app/components/modal/delete-group/delete-group.component';
import { FileUploadModalComponent } from 'src/app/components/modal/file-upload-modal/file-upload-modal.component';

@NgModule({
  declarations: [
    InnerPageComponent,
    TopRisksComponent,
    RisksComponent,
    LeftNavBarComponent,
    HeaderComponent,
    CreateUpdateRiskModalComponent,
    GridActionIconsComponent,
    RiskDetailModalComponent,
    RisksLogComponent,
    GroupsComponent,
    CreateUpdateGroupsModalComponent,
    AssignUsersToGroupModalComponent,
    UsersComponent,
    ChangePasswordComponent,
    RisksLogsDetailUpdateComponent,
    SitesComponent,
    CreateSiteModalComponent,
    ArchiveRiskConfirmationModalComponent,
    ArchivesComponent,
    ProposalsComponent,
    ButtonRendererComponent,
    PageNotFoundComponent,
    DeleteModalComponent,
    RiskCommunityComponent,
    InviteTeamMembersComponent,
    AddSiteComponent,
    ArchiveModalComponent,
    FooterComponent,
    RiskMembersComponent,
    LegalComponent,
    AddUpdateComponent,
    UserEditModalComponent,
    RiskManagerPanelComponent,
    RiskManagerComponent,
    CapabilitiesPanelComponent,
    DeleteGroupComponent,
    FileUploadModalComponent,
  ],
  imports: [
    CommonModule,
    InnerPageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SharedModule,
    MaterialExampleModule,
    EntryPageModule,
    NgxLoadingModule.forRoot({}),
    QuillModule.forRoot()
  ],
  exports: []
})
export class InnerPageModule { }

