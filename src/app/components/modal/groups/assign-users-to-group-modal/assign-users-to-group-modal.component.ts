import { Component, Inject, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupsService } from 'src/app/services/groups/groups.service';

@Component({
  selector: 'app-assign-users-to-group-modal',
  templateUrl: './assign-users-to-group-modal.component.html',
  styleUrls: ['./assign-users-to-group-modal.component.scss']
})
export class AssignUsersToGroupModalComponent implements OnInit {
  public assignUserForm!: FormGroup;
  public allUsersList: any;
  constructor(
    public dialogRef: MatDialogRef<AssignUsersToGroupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupService: GroupsService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.getAllUsersList();
    this.initializeFormgroup();
  }

  public initializeFormgroup() {
    this.assignUserForm = new FormGroup({
      name: new FormControl(this.data.name),
      users: new FormControl(this.data.users),
      assignUsers: new FormControl([]),
    })
  }

  getAllUsersList() {
    this.groupService.getAllUsers().subscribe((res: any) => {
      this.allUsersList = res;
    })
  }

  closeModalClicked() {
    this.dialogRef.close();
  }

  updateGroupClicked() {
    if (this.assignUserForm.valid) {
      this.groupService.updateGroups(this.assignUserForm.value, this.data.id).subscribe((res: any) => {
        this.dialogRef.close();
      });
    }
  }
}
