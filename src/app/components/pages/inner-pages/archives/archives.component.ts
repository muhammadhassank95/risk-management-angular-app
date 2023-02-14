import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ButtonRendererComponent } from 'src/app/components/partials/ag-grid-helper/button-renderer/button-renderer.component';
import { GridActionIconsComponent } from 'src/app/components/partials/ag-grid-helper/grid-acion-icons/grid-acion-icons.component';
import { GroupsService } from 'src/app/services/groups/groups.service';
import { SitesService } from 'src/app/services/sites/sites.service';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.scss']
})
export class ArchivesComponent implements OnInit {
  public loading = false;
  public selectedSiteId!: number;
  public sitesList: any;
  public businessRiskList: any;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  public groupsList: Array<any> = [];

  public columnDefs: ColDef[] = [
    { field: 'name', headerName: 'Business Risk' },
    { field: 'date', headerName: 'Added Date' },
    { field: 'likelihood', headerName: 'Likelihood' },
    { field: 'outcome', headerName: 'Outcome' },
    { field: 'group.name', headerName: 'Key Contributor' },
    { field: 'description', headerName: 'Description' },
    {
      headerName: 'Actions',
      cellRenderer: 'iconRenderer',
      cellRendererParams: {
        onLogView: this.onOpenLogViewClicked.bind(this),
      },
    },
  ];

  public defaultColDef: ColDef = {
    resizable: true,
    filter: true,
  };

  public rowData = [];

  public frameworkComponents: any;
  public api: any;
  constructor(
    private router: Router,
    private siteService: SitesService,
    private groupService: GroupsService,
  ) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      iconRenderer: GridActionIconsComponent,
    }
  }
  ngOnInit(): void {
    this.getGroups();
    this.getSites();
  }

  getGroups() {
    this.loading = true;
    this.groupService.getAllGroups().subscribe((res: any) => {
      this.groupsList = res;
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.api = params.api;
    params.api.sizeColumnsToFit();
  }

  public selectSite(site: any): void {
    localStorage.removeItem('persistedSite');
    localStorage.setItem('persistedSite', this.selectedSiteId.toString());
    this.selectedSiteId = site.value;
    this.getRisks()
  }

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
        response.forEach((res: any) => {
          res.date = moment(res.date).format("MM/DD/YYYY");
        });

        const rowDataRisk = response.filter((res: any) => res.status === 'Declined' || res.archived)
        /* sort grid Data */
        rowDataRisk.sort((a: any, b: any) => {
          return Date.parse(a.mitigatedDate) - Date.parse(b.mitigatedDate);
        });
        this.rowData = rowDataRisk;
        this.loading = false;
      } else {
        this.loading = false;
      }
    })
  };

  onOpenLogViewClicked(e: any) {
    e.rowData.from = 'archiveTab';
    localStorage.setItem('selectedLogRisks', JSON.stringify(e.rowData));
    this.router.navigateByUrl(`risks/logs/${e.rowData.id}`)
  }
}
