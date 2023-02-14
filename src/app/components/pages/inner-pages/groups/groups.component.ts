import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { DeleteModalComponent } from 'src/app/components/modal/delete-modal/delete-modal.component';
import { AssignUsersToGroupModalComponent } from 'src/app/components/modal/groups/assign-users-to-group-modal/assign-users-to-group-modal.component';
import { CreateUpdateGroupsModalComponent } from 'src/app/components/modal/groups/create-update-groups-modal/create-update-groups-modal.component';
import { GridActionIconsComponent } from 'src/app/components/partials/ag-grid-helper/grid-acion-icons/grid-acion-icons.component';
import { GroupsService } from 'src/app/services/groups/groups.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  public loading = false;
  public columnDefs: ColDef[] = [
    { headerName: 'Group', field: 'name' },
    { headerName: 'No. of users', field: 'users.length' },
    { headerName: 'Created By', field: 'createdBy' },
    { headerName: 'Created Date', field: 'createdDate' },
    {
      headerName: 'Actions',
      cellRenderer: 'iconRenderer',
      cellRendererParams: {
        onLogView: this.onGroupDetailViewClicked.bind(this),
        onCross: this.onGroupDelete.bind(this),
      },
    },
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
    private dialog: MatDialog,
    private groupService: GroupsService,
  ) {
    this.frameworkComponents = {
      iconRenderer: GridActionIconsComponent,
    }
  }

  ngOnInit(): void {
    this.getAllGroups();
  }

  onGroupDelete(e: any) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      data: { title: 'Delete Group', selectedRisk: e.rowData, type: 'group' },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.groupService.deleteGroups(e.rowData.id).subscribe((response: any) => {
        this.getAllGroups();
      })
    });
  }

  getAllGroups() {
    this.loading = true;
    this.groupService.getAllGroups().subscribe((res: any) => {
      if (res) {
        res.forEach((re: any) => {
          re.createdDate = moment(re.createdDate).format("MM/DD/YYYY");
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

  onGroupDetailViewClicked(e: any) {
    const dialogRef = this.dialog.open(AssignUsersToGroupModalComponent, {
      data: { ...e.rowData }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllGroups();
    });
  }

  createGroupClicked() {
    const dialogRef = this.dialog.open(CreateUpdateGroupsModalComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.getAllGroups();
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.api = params.api;
    params.api.sizeColumnsToFit();
  }

}
