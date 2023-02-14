import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { CreateSiteModalComponent } from 'src/app/components/modal/create-site-modal/create-site-modal.component';
import { GridActionIconsComponent } from 'src/app/components/partials/ag-grid-helper/grid-acion-icons/grid-acion-icons.component';
import { SitesService } from 'src/app/services/sites/sites.service';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {
  public loading = false;
  public columnDefs: ColDef[] = [
    { headerName: 'Site', field: 'name' },
    { headerName: 'Location', field: 'location' },
    { headerName: 'Added By', field: 'addedby' },
    { headerName: 'Added Date', field: 'date' }
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };

  public rowData = [];
  public frameworkComponents: any;
  public api: any;

  constructor(
    private sitesService: SitesService,
    private dialog: MatDialog,
  ) {
    this.frameworkComponents = {
      iconRenderer: GridActionIconsComponent,
    }
  }

  ngOnInit(): void {
    this.getAllSites();
  }

  getAllSites() {
    this.loading = true;
    this.sitesService.getSites().subscribe((res: any) => {
      if (res) {
        res.forEach((re: any) => {
          re.date = moment(re.date).format("MM/DD/YYYY");
        });
        /* sort grid Data */
        res.sort((a: any, b: any) => {
          return b.id - a.id;
        });
        this.rowData = res;
        this.loading = false;
      } else {
        this.loading = false;
      }
    })
  }

  createSiteClicked() {
    const dialogRef = this.dialog.open(CreateSiteModalComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.getAllSites();
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.api = params.api;
    params.api.sizeColumnsToFit();
  }

}
