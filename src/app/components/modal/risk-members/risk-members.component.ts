import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'src/app/services/users/users.service';
import { ArchiveModalComponent } from '../archive-modal/archive-modal.component';

@Component({
  selector: 'app-risk-members',
  templateUrl: './risk-members.component.html',
  styleUrls: ['./risk-members.component.scss']
})
export class RiskMembersComponent implements OnInit {

  public userData: Array<any> = [];
  public inviteMemberFormGroup: FormGroup;
  constructor(
    public usersService: UsersService,
    public dialogRef: MatDialogRef<ArchiveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initializeMemberFormGroup();
    this.getUsers();
  }

  public initializeMemberFormGroup(): void {
    this.inviteMemberFormGroup = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
    })
  }

  public getUsers(): void {
    this.usersService.getAllUsers().subscribe((response: any) => {
      response.forEach((data: any) => {
        if (data.sites.length > 0) {
          data.sites.forEach((site: any) => {
            if (site.id === this.data.selectedRisk.siteId) {
              this.userData.push(data);
            }
          })
        }
      });
    })
  }

  public invite(): void {
    this.usersService.inviteUser(this.inviteMemberFormGroup.value).subscribe((response: any) => {
      if (response.status == 'Success') {
        this.inviteMemberFormGroup.reset();
      }
    })
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

}
