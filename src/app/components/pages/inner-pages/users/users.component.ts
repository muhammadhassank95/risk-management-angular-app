import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { ColDef, ValueGetterParams, RowSelectedEvent } from 'ag-grid-community';
import { DeleteModalComponent } from 'src/app/components/modal/delete-modal/delete-modal.component';
import { SigninService } from 'src/app/services/auth/signin/signin.service';
import { SitesService } from 'src/app/services/sites/sites.service';
import { UsersService } from 'src/app/services/users/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InviteTeamMembersComponent } from 'src/app/components/modal/invite-team-members/invite-team-members.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public formGroup: FormGroup;
  public sitesGroup: FormGroup;
  public rolesGroup: FormGroup;
  public changePasswordFormGroup: FormGroup;
  public sideNav: MatSidenav;
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
  public addUserDsabled: boolean = false;
  constructor(
    public dialog: MatDialog,
    public usersService: UsersService,
    public signInService: SigninService,
    private siteService: SitesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.setColDefs();
    this.getUsers();
    this.getSites();
    this.getCounters();
  }

  getCounters() {
    this.usersService.getCountersApi().subscribe(res => {
      this.counters = res;
      this.counters.licenses == 40 ? this.addUserDsabled = true : this.addUserDsabled = false;
    })
  }

  public setColDefs(): void {
    this.columnDefs = [
      {
        headerCheckboxSelection: false,
        checkboxSelection: true,
        field: `name`,
        headerName: 'Full Name',
        maxWidth: 250
      },
      { field: 'email' },
      { field: 'roles', headerName: 'Role(s)', valueGetter: this.roleValueGetter }
    ];
  }

  onGridReady(params: any): void {

  }

  onModelUpdated(params: any): void {
    params.api.sizeColumnsToFit();
  }


  public onRowSelected(params: any) {
    if (params?.api?.getSelectedRows()?.length > 0) {
      this.selectedUser = params?.api?.getSelectedRows()[0];
    } else {
      this.selectedUser = null;
    }
  }

  navigateTo(route: any) {
    if (route == '/logout') {
      localStorage.removeItem('access-token');
      this.router.navigateByUrl('/signin');
    } else {
      this.router.navigateByUrl(route);
    }
  }

  public getSites(): void {
    this.siteService.getSites().subscribe((res: any) => {
      this.sitesList = res;
    })
  }

  public getUsers(): void {
    this.usersService.getAllUsers().subscribe((response: any) => {
      this.rowData = response;
      this.userCount = this.rowData.length
    })
  }

  addUser() {
    const dialogRef = this.dialog.open(InviteTeamMembersComponent, {
      data: { title: 'Add User', selectedUser: this.selectedUser, isEdit: false,  isDisabledAddUser: this.addUserDsabled },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.usersService.inviteUser(data.payload).subscribe((response: any) => {
          if (response.status === 'Success') {
            this.getUsers();
            this.snackBar.open(`Invite sent successfully.`, 'Ok', {
              duration: 3000,
              panelClass: 'tbr-background-success'
            });
          }
        })
      }
    });
  }

  public updateUser(): void {
    if (this.selectedUser) {
      const dialogRef = this.dialog.open(InviteTeamMembersComponent, {
        data: { title: 'Edit User', selectedUser: this.selectedUser, isEdit: true },
      });
      dialogRef.afterClosed().subscribe((data: any) => {
        const payload = {
          name: data?.payload?.name,
          email: data?.payload?.email,
          userId: data?.userId,
          groupId: data?.payload?.group,
          isAdmin: data?.payload?.global,
        }
        if (data) {
          this.usersService.updateUser(payload).subscribe((response: any) => {
            if (response.status === 'Success') {
              this.getUsers();
            }
          })
        }
      });
    }
  }

  public resetPassword() {
    if (this.selectedUser) {
      this.usersService.forgotPassword(this.selectedUser.email).subscribe((response: any) => {
        this.snackBar.open(`Reset password link has been sent to ${this.selectedUser.email}`, 'Ok', {
          duration: 3000,
          panelClass: 'tbr-background-success'
        });
      })
      // this.selectedUser = null;
    }
  }


  public deleteUser(): void {
    if (this.selectedUser) {
      const dialogRef = this.dialog.open(DeleteModalComponent, {
        data: { title: 'Delete User', selectedRisk: this.selectedUser, type: 'user' },
      });

      dialogRef.afterClosed().subscribe((data: boolean) => {
        if (data) {
          this.usersService.deleteUser(this.selectedUser).subscribe((response: any) => {
            if (response.status === 'Success') {
              this.getUsers();
              this.selectedUser = null;
            }
          })
        }
      });
    }
  }

  nameValueGetter(params: ValueGetterParams) {
    return `${params.data.firstName} ${params.data.lastName}`;
  }

  siteValueGetter(params: ValueGetterParams) {
    let dataArr: Array<string> = [];
    params.data.sites.forEach((data: any) => {
      dataArr.push(data.name)
    })
    return dataArr;
  }

  roleValueGetter(params: ValueGetterParams) {
    let dataArr: Array<string> = [];
    params.data.roles.forEach((data: any) => {
      if (data == 'User') {
        dataArr.push('Member')
      } else if (data == 'Admin') {
        dataArr.push('Global Admin')
      }
    })
    return dataArr;
  }

  public goToCommunity(): void {
    this.router.navigateByUrl("/community");
  }
}
