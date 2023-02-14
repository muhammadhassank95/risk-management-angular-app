import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupsService } from 'src/app/services/groups/groups.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-update-groups-modal',
  templateUrl: './create-update-groups-modal.component.html',
  styleUrls: ['./create-update-groups-modal.component.scss']
})
export class CreateUpdateGroupsModalComponent implements OnInit {
  public createGroupForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateUpdateGroupsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupService: GroupsService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initializeFormgroup();
    this.getAllUsersList();
    this.patchFormValues();
  }

  public patchFormValues(): void {
    if (!this.data.isAdd) {
      this.createGroupForm.get('name')!.patchValue(this.data.selectedUser.name)
    }
  }

  public initializeFormgroup(): void {
    this.createGroupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      users: new FormControl([])
    })
  }

  closeModalClicked() {
    this.dialogRef.close();
  }

  public allUsersList: any;
  getAllUsersList() {
    this.groupService.getAllUsers().subscribe((res: any) => {
      this.allUsersList = res;
    })
  }

  createGroup() {
    if (this.createGroupForm.valid) {
      this.groupService.createGroups(this.createGroupForm.value).subscribe((res: any) => {
        if (res) {
          this.dialogRef.close({ isSuccess: true });
        }
      });
    }
  }

  updateGroup() {
    if (this.createGroupForm.valid) {
      this.groupService.updateGroups(this.createGroupForm.value, this.data.selectedUser.id).subscribe((res: any) => {
        this.dialogRef.close({ isSuccess: true });
      });
    }
  }
}
