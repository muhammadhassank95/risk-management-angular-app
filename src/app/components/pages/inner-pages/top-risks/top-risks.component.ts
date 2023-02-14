import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import * as moment from 'moment';
import { RiskDetailModalComponent } from 'src/app/components/modal/risks/risk-detail-modal/risk-detail-modal.component';
import { ButtonRendererComponent } from 'src/app/components/partials/ag-grid-helper/button-renderer/button-renderer.component';
import { GridActionIconsComponent } from 'src/app/components/partials/ag-grid-helper/grid-acion-icons/grid-acion-icons.component';
import { SitesService } from 'src/app/services/sites/sites.service';

@Component({
  selector: 'app-top-risks',
  templateUrl: './top-risks.component.html',
  styleUrls: ['./top-risks.component.scss']
})
export class TopRisksComponent implements OnInit {
  public api: any;
  public value: any;
  public rowData = [];
  public defaultChecked = true;
  public fetchedGlobalRisks: any;
  public frameworkComponents: any;
  public columnDefs: ColDef[] = [
    { headerName: '#', field: 'orderNum', width: 50, filter: false },
    { field: 'siteName', headerName: 'Site', width: 80 },
    { field: 'name', headerName: 'Business Risk', width: 200 },
    { field: 'date', headerName: 'Added Date', width: 100 },
    { field: 'likelihood', headerName: 'Likelihood', width: 80 },
    { field: 'outcome', valueGetter: this.outcomeValueGetter, headerName: 'Outcome', width: 100 },
    { field: 'group.name', headerName: 'Key Contributor' },
    {
      headerName: 'Actions',
      cellRenderer: 'iconRenderer',
      cellRendererParams: {
        onView: this.onDetailViewClicked.bind(this),
        onLogView: this.onOpenLogViewClicked.bind(this),
      },
    },
  ];
  public defaultColDef: ColDef = {
    resizable: true,
    filter: true,
  };

  constructor(
    public siteService: SitesService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      iconRenderer: GridActionIconsComponent,
    }
  }
  public selectedToggleValue = '';
  ngOnInit(): void {
    this.selectedToggleValue = JSON.parse(localStorage.getItem('lastSelectedToggleValue')!)
    this.getTopRisks(10);
  }

  getTopRisks(numberToFetch: any) {
    this.siteService.getTopBusinessRisk(numberToFetch).subscribe((response: any) => {
      this.fetchedGlobalRisks = response;
      response.forEach((res: any) => {
        res.date = moment(res.date).format("MM/DD/YYYY");
      });

      const initialRowData = this.fetchedGlobalRisks.filter((res: any) => this.selectedToggleValue == '' ? res.orderNum == 1 : res.orderNum <= this.selectedToggleValue);

      this.rowData = initialRowData;
    });
  }

  onToggleGroupChange(e: any) {
    localStorage.setItem('lastSelectedToggleValue', e.value);
    this.defaultChecked = false;
    const toggleRiskData = this.fetchedGlobalRisks.filter((res: any) => this.selectedToggleValue == '' ? res.orderNum <= this.selectedToggleValue : res.orderNum <= e.value);
    this.rowData = toggleRiskData;
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

  onDetailViewClicked(e: any) {
    const dialogRef = this.dialog.open(RiskDetailModalComponent, {
      data: {
        title: 'Global Risk Details',
        selectedRow: e.rowData,
        selectedSiteId: e.siteId
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getTopRisks(10)
    });
  }

  onOpenLogViewClicked(e: any) {
    e.rowData.from = 'globalRisksTab';
    localStorage.setItem('selectedLogRisks', JSON.stringify(e.rowData));
    this.router.navigateByUrl(`risks/logs/${e.rowData.id}`)
  }

  onGridReady(params: GridReadyEvent) {
    this.api = params.api;
    params.api.sizeColumnsToFit();
  }
}
