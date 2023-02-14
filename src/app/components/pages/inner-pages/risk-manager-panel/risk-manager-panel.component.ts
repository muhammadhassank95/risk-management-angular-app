import { CdkDragDrop, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ColDef, ValueGetterParams } from 'ag-grid-community';
import * as moment from 'moment';
import { AddSiteComponent } from 'src/app/components/modal/add-site/add-site.component';
import { AddUpdateComponent } from 'src/app/components/modal/add-update/add-update.component';
import { ArchiveModalComponent } from 'src/app/components/modal/archive-modal/archive-modal.component';
import { RiskManagerComponent } from 'src/app/components/modal/risk-manager/risk-manager.component';
import { CreateUpdateRiskModalComponent } from 'src/app/components/modal/risks/create-update-risk-modal/create-update-risk-modal.component';
import { SitesService } from 'src/app/services/sites/sites.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-risk-manager-panel',
  templateUrl: './risk-manager-panel.component.html',
  styleUrls: ['./risk-manager-panel.component.scss']
})
export class RiskManagerPanelComponent implements OnInit {
  public rowData = [];
  public sitesList: any;
  public userRoles: any;
  public loading = false;
  public riskTableData: any;
  public businessRiskList: any;
  public formGroup!: FormGroup;
  public selectedRiskData: any;
  public selectedRiskDrag: any;
  public selectedSiteId!: number;
  public selectedSite: any;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  public users: Array<any> = [];
  public selectedSiteDatas: any
  public risksList = [
    {
      id: 'proposedRisks', name: 'Proposed Risks'
    },
    {
      id: 'archivedRisks', name: 'Archived Risks'
    },
    {
      id: 'acceptedRisks', name: 'Accepted Risks'
    }
  ]

  abValueGetter(params: ValueGetterParams) {
    return params.node ? params.node.childIndex + 1 : 1;
  }
  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = {
    resizable: true,
    filter: true,
  };

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private siteService: SitesService,
    public usersService: UsersService,
    public location: Location,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.initializeFormGroup();
    this.getSites();
    this.getUsers();
    this.getSitesById();
    this.userRoles = JSON.parse(localStorage.getItem('user-roles')!);
  }

  public openCommunityModal(): void {
    const dialogRef = this.dialog.open(AddSiteComponent, {
      data: { 
        title: 'Update Community', 
        panelClass: 'invite-team-members', 
        selectedSiteDatas: this.selectedSiteDatas, 
        isAdd: false,
        currentRiskType: this.selectedDropdownRiskId 
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data == 'success') {
        this.getSites();
        this.getSitesById();
      }
      if (data == 'success-delete') {
        this.getSites();
        this.getSitesById();
        this.router.navigateByUrl("/community");
        this._snackBar.open(`Community was successfully deleted.`, 'Ok', {
          duration: 2000,
          panelClass: 'tbr-background-danger'
        });
      }
    });
  }

  public getSitesById(): void {
    const persistedSite = localStorage.getItem('persistedSite');
    this.selectedSiteId = persistedSite ? parseInt(persistedSite) : this.sitesList[0].id;

    this.siteService.getSitesById(this.selectedSiteId).subscribe((response: any) => {
      this.selectedSiteDatas = response;
    })
  }

  public openRiskManagerModal(): void {
    const dialogRef = this.dialog.open(RiskManagerComponent, {
      data: { title: 'Users', selectedRisk: this.selectedRiskData, users: this.users, selectedSiteDatas: this.selectedSiteDatas, type: 'group' },
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data === 'Success') {
        this.getSitesById();
      }
    })
  }

  public getUsers(): void {
    this.usersService.getAllUsers().subscribe((response: any) => {
      this.users = response;
    })
  }

  navigateTo(route: any) {
    if (route == '/logout') {
      localStorage.removeItem('access-token');
      this.router.navigateByUrl('/signin');
    } else {
      this.router.navigateByUrl(route);
    }
  }

  public getUnit(unit: string): string {
    if(unit == 'lbs') {
      return 'LBS'
    } else if(unit == 'tons') {
      return 'Tons'
    } else if(unit == 'mt') { 
      return 'MT'
    } else if(unit == 'gallonns') {
      return 'GL'
    } else if(unit == 'barrels') {
      return 'Barrels'
    } else {
      return '';
    };
  }

  public initializeFormGroup(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      likelihood: new FormControl(null,),
      outcome: new FormControl(null,),
      duration: new FormControl('',),
      contributor: new FormControl('',),
      description: new FormControl('', Validators.required),
      group: new FormControl(''),
      status: new FormControl('new',)
    })
  }

  public selectedDropdownRiskId: any;
  onRiskChange(risk: any) {
    this.selectedDropdownRiskId = risk.value;
    this.getRisks();
  }

  selectSite(site: any): void {
    this.selectedSiteId = site.value;
    localStorage.removeItem('persistedSite');
    localStorage.setItem('persistedSite', this.selectedSiteId.toString());
    this.getRisks()
  }

  addUpdate(): void {
    const dialogRef = this.dialog.open(AddUpdateComponent, {
      data: { title: 'Add Update', selectedRisk: this.selectedRiskData, isArchiveClick: true },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data === 'success') {
        this.getLogs();
      }
    });
  }

  openCreateRiskModal(isEdit: boolean = false) {
    const dialogRef = this.dialog.open(CreateUpdateRiskModalComponent, {
      data: {
        title: isEdit ? 'Edit Risk Proposal' : 'New Risk Proposal',
        formGroup: this.formGroup,
        isEdit: isEdit,
        selectedRiskData: this.selectedRiskData,
        selectedSite: this.selectedSite,
        currentRiskType: this.selectedDropdownRiskId 
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result !== 'closed') {
        const payload = {
          siteId: this.selectedSiteId,
          date: new Date(),
          ...result.formGroup
        }
        if (!result.isEdit) {
          this.siteService.postBusinessRisk(payload).subscribe((response: any) => {
            this.getRisks();
          })
        } else {
          
          this.siteService.updateBusinessRisk(payload, this.selectedRiskData.id).subscribe((response: any) => {
            this.getRisks();
          })

        }
      }
    });
  }

  // api calls
  getSites() {
    const persistedSite = localStorage.getItem('persistedSite');
    this.siteService.getSites().subscribe((res: any) => {
      this.sitesList = res;
      this.selectedSiteId = persistedSite ? parseInt(persistedSite) : this.sitesList[0].id;
      this.selectedSite = this.sitesList[0];
      this.selectedDropdownRiskId = this.risksList[0].id;
      this.getRisks();
    })
  };

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.businessRiskList, event.previousIndex, event.currentIndex);
    const newRiskList = this.businessRiskList.map((risk: any) => {
      if (risk.id === this.selectedRiskDrag.id) {
        risk.order = event.currentIndex;
      }
      return risk;
    })
    this.siteService.updateOrder(this.selectedSiteId, this.businessRiskList).subscribe((response: any) => { })
  }

  dragStart(event: CdkDragStart, selectedRisk: any): void {
    this.selectedRiskDrag = selectedRisk;
  }

  getRisks() {
    this.loading = true;
    this.siteService.getBusinessRisk(this.selectedSiteId).subscribe((response: any) => {
      if (response) {
        response.forEach((res: any) => {
          res.date = moment(res.date).format("MM/DD/YYYY");
        });

        response = response.filter((res: any) => res.status !== 'Decline')
        if (this.selectedDropdownRiskId === 'archivedRisks') {
          response = response.filter((res: any, i: any) => res.archived);
        } else if (this.selectedDropdownRiskId === 'acceptedRisks') {
          response = response.filter((res: any, i: any) => res.status === 'Approved' && res.archived === false);
        } else {
          response = response.filter((res: any, i: any) => res.status !== 'Approved' && res.archived === false);
        }
        /* sort grid Data */
        response.sort((a: any, b: any) => a.order - b.order);
        this.businessRiskList = response;
        this.selectedRiskData = response[0];
        this.getLogs();
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  };

  getLogs(): void {
    if (this.selectedRiskData?.id) {
      this.siteService.getBusinessRisksLogs(this.selectedRiskData?.id).subscribe((response: any) => {
        if (response) {
          this.riskTableData = response;
          this.riskTableData.reverse();
        }
      })
    }
  }

  approveRisk() {
    const dialogRef = this.dialog.open(ArchiveModalComponent, {
      data: { title: 'Approve Risk', selectedRisk: this.selectedRiskData, type: 'approveRisk' },
    })

    dialogRef.afterClosed().subscribe(result => {
      this.getRisks();
    })

  }

  archive() {
    const dialogRef = this.dialog.open(ArchiveModalComponent, {
      data: { title: 'Archive Risk', selectedRisk: this.selectedRiskData, type: 'archiveRisk' },
    })
    dialogRef.afterClosed().subscribe(result => {
      this.getRisks();
    })
  }

  deleteRisk() {
    const dialogRef = this.dialog.open(ArchiveModalComponent, {
      data: { title: 'Delete Risk', selectedRisk: this.selectedRiskData, type: 'deleteRisk' },
    })
    dialogRef.afterClosed().subscribe(result => {
      this.getRisks();
    })
  }

  selectRisk(risk: any): void {
    this.selectedRiskData = risk;
    this.getLogs();
  }

  duration(duration: any): any {
    if (duration == 'monthly') {
      return 'month';
    } else if (duration == 'yearly') {
      return 'year';
    } else {
      return 'quarter';
    }
  }

  numberWithCommas(x: any): any {
    if (x) {
      x = x.toString();
      var pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
      return x;
    }
  }

  openMembers() {
    console.log("OPEN MEMBERS WORKS")
  }

  goToCommunity(): void {
    this.location.back();
  }

  riskManagerPanelClicked() {
    this.router.navigateByUrl("/risk-manager-panel");
  }
}
