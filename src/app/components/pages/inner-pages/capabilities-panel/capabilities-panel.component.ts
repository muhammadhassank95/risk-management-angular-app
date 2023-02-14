import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ColDef, RowSelectedEvent } from 'ag-grid-community';
import { GroupsService } from 'src/app/services/groups/groups.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdateGroupsModalComponent } from 'src/app/components/modal/groups/create-update-groups-modal/create-update-groups-modal.component';
import { DeleteGroupComponent } from 'src/app/components/modal/delete-group/delete-group.component';
@Component({
  selector: 'app-capabilities-panel',
  templateUrl: './capabilities-panel.component.html',
  styleUrls: ['./capabilities-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CapabilitiesPanelComponent implements OnInit {

  public formGroup: FormGroup;
  public sitesGroup: FormGroup;
  public rolesGroup: FormGroup;
  public changePasswordFormGroup: FormGroup;
  public api: any;
  public frameworkComponents: any;
  public isEdit: boolean = false;
  public selectedRowData: any;
  public userInitials: string;
  public sitesList: any;
  public rolesList = ['Admin', 'User', 'Global'];
  public userRoles = JSON.parse(localStorage.getItem('user-roles')!);
  public rowSelection: 'single' | 'multiple' = 'single';
  public selectedUser: any = null;
  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };
  public rowData = [];
  public userCount: number;
  public counters: any;

  constructor(
    public location: Location,
    public groupsService: GroupsService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.setColDefs();
    this.getAllGroups();
  }

  public setColDefs(): void {
    this.columnDefs = [
      {
        headerCheckboxSelection: false,
        checkboxSelection: true,
        field: `name`,
        headerName: 'Capability Team'
      },
      { field: 'users', headerName: '# of Members', maxWidth: 250, valueGetter: (param) => param.data.users.length }
    ];
  }

  public getAllGroups(): void {
    this.groupsService.getAllGroups().subscribe((response: any) => {
      this.rowData = response
    })
  }

  public onModelUpdated(params: any): void {
    params.api.sizeColumnsToFit();
  }

  public onRowSelected(params: any) {
    this.selectedUser = params.api.getSelectedRows()[0];
  }

  public addGroup(): void {
    const dialogRef = this.dialog.open(CreateUpdateGroupsModalComponent, {
      data: { title: 'Add New Capability', isAdd: true },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data?.isSuccess) {
        this.getAllGroups();
      }
    });
  }

  public deleteGroup(): void {
    if (this.selectedUser) {
      const dialogRef = this.dialog.open(DeleteGroupComponent, {
        data: { title: 'Delete Capability', selectedUser: this.selectedUser, isAdd: false },
      });

      dialogRef.afterClosed().subscribe((data: any) => {
        if (data?.isSuccess) {
          this.getAllGroups();
        }
      });
    }
  }

  public editGroup(): void {
    if (this.selectedUser) {
      const dialogRef = this.dialog.open(CreateUpdateGroupsModalComponent, {
        data: { title: 'Edit Capability', selectedUser: this.selectedUser, isAdd: false },
      });

      dialogRef.afterClosed().subscribe((data: any) => {
        if (data?.isSuccess) {
          this.getAllGroups();
        }
      });
    }
  }

  public back(): void {
    this.location.back();
  }
}
