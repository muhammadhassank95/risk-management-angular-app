import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { THREE } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss']
})
export class UserEditModalComponent implements OnInit {
  public formGroup!: FormGroup;
  public userName: string;
  constructor(
    public dialogRef: MatDialogRef<UserEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initializeFormgroup();
  }

  public initializeFormgroup(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      teams: new FormControl(''),
    })
    this.formGroup.patchValue({
      name: this.data.selectedUser.firstName + ' ' + this.data.selectedUser.lastName,
    });
  }


  compareWithFunction(item1: any, item2: any) {
    return item1 && item2 ? item1.name === item2.name : item1 === item2;
  }

  public editUser(): void {

    if (this.formGroup.valid) {
      this.dialogRef.close({ formGroup: this.formGroup.value });
      this.formGroup.reset();
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  closeModalClicked() {
    this.dialogRef.close(this.data);
  }
}
