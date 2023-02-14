import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { ColDef, ValueGetterParams } from 'ag-grid-community';
import { CreateUpdateRiskModalComponent } from 'src/app/components/modal/risks/create-update-risk-modal/create-update-risk-modal.component';
import { SitesService } from 'src/app/services/sites/sites.service';
import { CdkDragDrop, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { ArchiveModalComponent } from 'src/app/components/modal/archive-modal/archive-modal.component';
import { AddUpdateComponent } from 'src/app/components/modal/add-update/add-update.component';
import { FileUploadModalComponent } from 'src/app/components/modal/file-upload-modal/file-upload-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-risks',
  templateUrl: './risks.component.html',
  styleUrls: ['./risks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RisksComponent implements OnInit {
  public sitesList: any;
  public loading = false;
  public businessRiskList: any;
  public formGroup!: FormGroup;
  public selectedSiteId!: number;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  public selectedRiskData: any;
  public userRoles: any;
  public riskTableData: Array<any> = [];
  public isNotificationOn: any = false;
  public isNotificationOnText: string = 'on';

  abValueGetter(params: ValueGetterParams) {
    return params.node ? params.node.childIndex + 1 : 1;
  }
  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = {
    resizable: true,
    filter: true,
  };
  public rowData = [];
  public selectedRiskDrag: any;

  public selectedSiteDatas: any;
  public showRiskManagerPanel = false;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private siteService: SitesService
  ) { }
  ngOnInit() {
    this.initializeFormGroup();
    this.getSites();
    this.getSitesById();
    this.userRoles = JSON.parse(localStorage.getItem('user-roles')!);
  }

  public getSitesById(): void {
    this.showRiskManagerPanel = false;
    const persistedSite = localStorage.getItem('persistedSite');
    const userStored = JSON.parse(localStorage.getItem('user')!);
    this.selectedSiteId = persistedSite ? parseInt(persistedSite) : this.sitesList[0].id;
    this.siteService.getSitesById(this.selectedSiteId).subscribe((response: any) => {
      this.selectedSiteDatas = response;
      response?.users?.forEach((user: any) => {
        if (user.userId === userStored.user.id) this.showRiskManagerPanel = true;
      })
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

  public selectSite(site: any): void {
    this.selectedSiteId = site.value;
    localStorage.removeItem('persistedSite');
    localStorage.setItem('persistedSite', this.selectedSiteId.toString());
    this.getRisks();
    this.getSitesById();
  }

  public addUpdate(): void {
    const dialogRef = this.dialog.open(AddUpdateComponent, {
      data: { title: 'Add Update', selectedRisk: this.selectedRiskData, isArchiveClick: true, },
      panelClass: 'add-update-modal'
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data === 'success') {
        this.getLogs();
      }
    });
  }

  openCreateRiskModal() {
    const dialogRef = this.dialog.open(CreateUpdateRiskModalComponent, {
      data: {
        title: 'New Risk Proposal',
        formGroup: this.formGroup,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'closed' && result) {
        const payload = {
          siteId: this.selectedSiteId,
          date: new Date(),
          ...result.formGroup
        }
        this.siteService.postBusinessRisk(payload).subscribe((response: any) => {
          this.getRisks();
          this.snackBar.open('Risk was successfully proposed','Risk', {
            duration: 2000,
            panelClass: ['success-snackbar']
          })
        })
      }
    });
  }

  // api calls
  getSites() {
    const persistedSite = localStorage.getItem('persistedSite');
    this.siteService.getSites().subscribe((res: any) => {
      this.sitesList = res;
      this.selectedSiteId = persistedSite ? parseInt(persistedSite) : this.sitesList[0].id;
      this.getRisks();
    })
  };

  public drop(event: CdkDragDrop<string[]>) {
    if(this.showRiskManagerPanel){
      moveItemInArray(this.businessRiskList, event.previousIndex, event.currentIndex);
  
      const newRiskList = this.businessRiskList.map((risk: any) => {
        if (risk.id === this.selectedRiskDrag.id) {
          risk.order = event.currentIndex;
        }
        return risk;
      })
      this.siteService.updateOrder(this.selectedSiteId, this.businessRiskList).subscribe((response: any) => { })
    }
  }

  public dragStart(event: CdkDragStart, selectedRisk: any): void {
    this.selectedRiskDrag = selectedRisk;
  }

  public getRisks() {
    this.loading = true;
    this.siteService.getBusinessRisk(this.selectedSiteId).subscribe((response: any) => {
      if (response) {
        response.forEach((res: any) => {
          res.date = moment(res.date).format("MM/DD/YYYY");
        });

        response = response.filter((res: any) => res.status === 'Approved' && res.archived === false);
        /* sort grid Data */
        response.sort((a: any, b: any) => {
          return a.order - b.order;
        });
        this.rowData = response;
        response = response.filter((res: any, i: any) => i <= 10);
        this.businessRiskList = response;
        this.selectedRiskData = response[0];
        this.getLogs();
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  };

  public getLogs(): void {
    if (this.selectedRiskData?.id) {
      this.siteService.getBusinessRisksLogs(this.selectedRiskData?.id).subscribe((response: any) => {
        if (response) {
          this.riskTableData = response;
          this.riskTableData.reverse();
        }
      })
    }
  }

  public archive(): void {
    const dialogRef = this.dialog.open(ArchiveModalComponent, {
      data: { title: 'Archive Risk', selectedRisk: this.selectedRiskData, type: 'group' },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getRisks();
    })
  }

  public selectRisk(risk: any): void {
    this.selectedRiskData = risk;
    this.getLogs();
  }

  public duration(duration: any): any {
    if (duration == 'monthly') {
      return 'month';
    } else if (duration == 'yearly') {
      return 'year';
    } else {
      return 'quarter';
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

  public numberWithCommas(x: any): any {
    if (x) {
      x = x.toString();
      var pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
      return x;
    }
  }

  public openMembers() {
    console.log("OPEN MEMBERS WORKS")
  }

  public goToCommunity(): void {
    this.router.navigateByUrl("/community");
  }

  public setNotification(): void {
    this.isNotificationOn = !this.isNotificationOn
    this.isNotificationOn ? this.isNotificationOnText = 'off' : this.isNotificationOnText = 'on';
  }

  riskManagerPanelClicked() {
    this.router.navigateByUrl("/risk-manager-panel");
  }

  onAttachmentClickModal() {
    const dialogRef = this.dialog.open(FileUploadModalComponent, {
      data: { title: 'File Upload', selectedRisk: this.selectedRiskData, type: 'fileUpload' },
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }
}
