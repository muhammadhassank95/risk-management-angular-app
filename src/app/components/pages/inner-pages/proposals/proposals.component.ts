import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


import { AgGridAngular } from 'ag-grid-angular';
import * as moment from 'moment';
import { ArchiveRiskConfirmationModalComponent } from 'src/app/components/modal/risks/archive-risk-confirmation-modal/archive-risk-confirmation-modal.component';
import { CellClickedEvent, ColDef, GetContextMenuItemsParams, GridReadyEvent, RowDragEvent, RowNode, ValueGetterParams } from 'ag-grid-community';
import { CreateUpdateRiskModalComponent } from 'src/app/components/modal/risks/create-update-risk-modal/create-update-risk-modal.component';
import { RiskDetailModalComponent } from 'src/app/components/modal/risks/risk-detail-modal/risk-detail-modal.component';
import { ButtonRendererComponent } from 'src/app/components/partials/ag-grid-helper/button-renderer/button-renderer.component';
import { GridActionIconsComponent } from 'src/app/components/partials/ag-grid-helper/grid-acion-icons/grid-acion-icons.component';
import { SitesService } from 'src/app/services/sites/sites.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.scss']
})
export class ProposalsComponent implements OnInit {
  public loading = false;
  public formGroup!: FormGroup;
  public selectedSiteId!: number;
  public sitesList: any;
  public businessRiskList: any;
  public rowSelection: 'single' | 'multiple' = 'multiple';

  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = {
    resizable: true,
    filter: true,
  };
  public rowData = [];
  public frameworkComponents: any;
  public api: any;
  abValueGetter(params: ValueGetterParams) {
    return params.node ? params.node.childIndex + 1 : 1;
  }
  outcomeValueGetter(params: ValueGetterParams) {
    if (params.data.duration === 'monthly') {
      return `${params.data.outcome} per month`;
    } else if (params.data.duration === 'quarterly') {
      return `${params.data.outcome} per quarter`;
    } else if (params.data.duration === 'yearly') {
      return `${params.data.outcome} per year`;
    } else {
      return '';
    }
  }

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private siteService: SitesService,
    private _snackBar: MatSnackBar
  ) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      iconRenderer: GridActionIconsComponent,
    }
  }
  public userRoles = JSON.parse(localStorage.getItem('user-roles')!);

  ngOnInit() {
    this.getSites();
    this.initializeFormGroup();
    this.generateColDef()
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

  generateColDef() {
    this.columnDefs.push(
      { headerName: '#', filter: false, valueGetter: this.abValueGetter, width: 80 },
      { field: 'name', headerName: 'Business Risk' },
      { field: 'date', headerName: 'Added Date' },
      { field: 'likelihood', headerName: 'Likelihood' },
      { field: 'outcome', valueGetter: this.outcomeValueGetter, headerName: 'Outcome' },
      { field: 'group.name', headerName: 'Key Contributor' },
      { field: 'description', headerName: 'Description' },
      {
        headerName: 'Actions',
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onView: this.onDetailViewClicked.bind(this),
          onCheck: this.userRoles.includes('Admin') ? this.onProposalAccepted.bind(this) : null,
          onCross: this.userRoles.includes('Admin') ? this.onProposalDecline.bind(this) : null,
        },
      },
    )
  }

  public selectSite(site: any): void {
    this.selectedSiteId = site.value;
    localStorage.removeItem('persistedSite');
    localStorage.setItem('persistedSite', this.selectedSiteId.toString());
    this.getRisks()
  }

  onProposalAccepted(e: any) {
    const dialogRef = this.dialog.open(ArchiveRiskConfirmationModalComponent, {
      data: { title: 'Confirmation Modal', selectedRisk: e.rowData, isDeclineClick: false },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getRisks()
    });
  }


  onProposalDecline(e: any) {
    const dialogRef = this.dialog.open(ArchiveRiskConfirmationModalComponent, {
      data: { title: 'Confirmation Modal', selectedRisk: e.rowData, isDeclineClick: true },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getRisks()
    });
  }

  onEditClicked() {
    this.dialog.open(CreateUpdateRiskModalComponent, {
      data: { title: 'Update Proposal', selectedSiteId: this.selectedSiteId },
    });
  }

  onDetailViewClicked(e: any) {
    const dialogRef = this.dialog.open(RiskDetailModalComponent, {
      data: {
        title: 'Business Risk Details',
        selectedRow: e.rowData,
        selectedSiteId: this.selectedSiteId
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getRisks()
    });
  }

  openCreateRiskModal() {
    const dialogRef = this.dialog.open(CreateUpdateRiskModalComponent, {
      data: {
        title: 'New Proposal',
        formGroup: this.formGroup
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      const payload = {
        siteId: this.selectedSiteId,
        date: new Date(),
        ...result.formGroup
      }
      this.siteService.postBusinessRisk(payload).subscribe((response: any) => {
        if (response) {
          this.getRisks();
        }
      })
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.api = params.api;
    params.api.sizeColumnsToFit();
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

  public getRisks() {
    this.loading = true;
    this.siteService.getBusinessRisk(this.selectedSiteId).subscribe((response: any) => {
      if (response) {
        this.businessRiskList = response;
        response = response.filter((res: any) => res.status === 'New')
        response.forEach((res: any) => {
          res.date = moment(res.date).format("MM/DD/YYYY");
        });
        /* sort grid Data */
        response.sort((a: any, b: any) => {
          return b.id - a.id;
        });
        const rowDataRisk = response.filter((res: any) => !res.archived)
        this.rowData = rowDataRisk;
        this.loading = false;
      } else {
        this.loading = false;
      }
    })
  };

  public onRowDragEnd(dragEndEvent: any): void {
    const nodes = this.getSelectedNodes(dragEndEvent);
    const orderPayload = [{
      id: parseInt(dragEndEvent.overNode.id),
      order: dragEndEvent.overIndex
    }]
    this.siteService.updateOrder(this.selectedSiteId, orderPayload).subscribe((response: any) => {
      const rowDataRisk = response.value.filter((res: any) => !res.archived)
      this.rowData = rowDataRisk;
    })
    this.api.refreshCells();
  }

  public getSelectedNodes(getContextMenuItemsParams: GetContextMenuItemsParams | RowDragEvent): any {
    const api = getContextMenuItemsParams.api;
    const selectedNodes = api.getSelectedNodes();
    const nodes = [];
    if (selectedNodes && selectedNodes.length > 0) {
      selectedNodes.forEach(node => {
        nodes.push(node);
      });
    } else {
      nodes.push(getContextMenuItemsParams.node);
    }
    return nodes.filter(node => node && node.data && node.data.id);
  }
}
