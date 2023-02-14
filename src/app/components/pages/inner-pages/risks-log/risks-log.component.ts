import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import * as moment from 'moment';
import { RisksLogsDetailUpdateComponent } from 'src/app/components/modal/risks/risks-logs-detail-update/risks-logs-detail-update.component';
import { GridActionIconsComponent } from 'src/app/components/partials/ag-grid-helper/grid-acion-icons/grid-acion-icons.component';
import { SitesService } from 'src/app/services/sites/sites.service';

@Component({
  selector: 'app-risks-log',
  templateUrl: './risks-log.component.html',
  styleUrls: ['./risks-log.component.scss']
})
export class RisksLogComponent implements OnInit {
  public columnDefs: ColDef[] = [
    { headerName: 'Added Date', field: 'date' },
    { headerName: 'Notes', field: 'notes' },
    { headerName: 'Group Lead', field: 'user' },
    {
      headerName: 'Actions',
      cellRenderer: 'iconRenderer',
      cellRendererParams: {
        onLogView: this.onOpenLogViewClicked.bind(this),
      },
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };

  public rowData = [];

  public api: any;
  public frameworkComponents: any;
  public fileFrameworkComponents: any;

  fileValueGetter(params: ValueGetterParams) {
    return `${params.data.size} kb`;
  }

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private risksLogsService: SitesService,
    private router: Router
  ) {
    this.frameworkComponents = {
      iconRenderer: GridActionIconsComponent,
    }

    this.fileFrameworkComponents = {
      iconRenderer: GridActionIconsComponent,
    }
  }

  public paramId: any;
  public selectedLogRisks: any;
  ngOnInit(): void {
    this.selectedLogRisks = JSON.parse(localStorage.getItem('selectedLogRisks')!);
    this.paramId = this.activatedRoute.snapshot.paramMap.get("id");
    this.getBusinessRisksLogs();
    this.getFiles();
  }

  getBusinessRisksLogs() {
    this.risksLogsService.getBusinessRisksLogs(this.paramId).subscribe((res: any) => {
      res.forEach((re: any) => {
        re.date = moment(re.date).format("MM/DD/YYYY");
      });
      /* sort grid Data */
      res.sort((a: any, b: any) => {
        return b.id - a.id;
      });
      this.rowData = res;
    })
  }

  onOpenLogViewClicked(e: any) {
    const dialogRef = this.dialog.open(RisksLogsDetailUpdateComponent, {
      data: {
        title: 'Log Details',
        selectedRow: e.rowData
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getBusinessRisksLogs();
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.api = params.api;
    params.api.sizeColumnsToFit();
  }

  onNewLogClicked() {
    const dialogRef = this.dialog.open(RisksLogsDetailUpdateComponent, {
      data: {
        title: 'Create Log',
        selectedRow: ''
      },

    });
    dialogRef.afterClosed().subscribe(result => {
      this.getBusinessRisksLogs();
    });
  }

  onBackClicked() {
    if (this.selectedLogRisks?.from === 'archiveTab') {
      this.router.navigateByUrl('/archived');
    } else if (this.selectedLogRisks?.from === 'globalRisksTab') {
      this.router.navigateByUrl('/global-risks');
    } else {
      this.router.navigateByUrl('/risks');
    }
    localStorage.removeItem('selectedLogRisks')
  }

  // files
  public fileColumnDefs: ColDef[] = [
    { headerName: 'Added Date', field: 'date' },
    { headerName: 'File Name', field: 'name', },
    { headerName: 'Size', valueGetter: this.fileValueGetter },
    { headerName: 'Added By', field: 'user' },
    {
      headerName: 'Actions',
      cellRenderer: 'iconRenderer',
      cellRendererParams: {
        onDownload: this.onDownloadClicked.bind(this),
        onTrash: this.onDeleteClicked.bind(this),
      },
    },
  ];

  public defaultFileColDef: ColDef = {
    sortable: true,
    width: 350,
    resizable: true,
    filter: true,
  };

  public fileRowData = [];
  getFiles() {
    this.risksLogsService.getBusinessRisksFiles(this.paramId).subscribe((res: any) => {
      res.forEach((re: any) => {
        re.date = moment(re.date).format("MM/DD/YYYY");
      });
      /* sort grid Data */
      res.sort((a: any, b: any) => {
        return b.id - a.id;
      });
      this.fileRowData = res;
    })
  }

  onFileGridReady(params: GridReadyEvent) {
    this.api = params.api;
    params.api.sizeColumnsToFit();
  }

  onDownloadClicked(e: any) {
    window.open(e.rowData.url, '_blank');
  }

  onDeleteClicked(e: any) {
    this.risksLogsService.deleteBusinessRisksFiles(e.rowData.id).subscribe((res: any) => {
      this.getFiles();
    })
  }

  fileUpload(fileInputEvent: any) {
    let formData = new FormData();
    formData.append('file', fileInputEvent.target.files[0]);

    const fileSize = fileInputEvent.target.files[0].size

    this.risksLogsService.uploadBusinessRisksFiles(formData).subscribe((res: any) => {
      if (res.fileName) {
        let body = {
          name: res.fileName,
          businessRiskId: this.paramId,
          size: fileSize
        }
        this.risksLogsService.sendUploadFileName(body).subscribe((res: any) => {
          this.getFiles();
        })
      }
    })
  }
}
