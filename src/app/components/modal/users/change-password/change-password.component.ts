import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { _ } from 'ag-grid-community';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public hide: boolean = true;
  public hideConfirm: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void { }

  public changePassword(): void {
    const payload = {
      userId: this.data.data.id,
      password: this.data.formGroup.value.newPassword
    }
    if (this.data.formGroup.valid) {
      this.dialogRef.close({ payload: payload });
      this.data.formGroup.reset();
    } else {
      this.data.formGroup.markAllAsTouched();
      this.data.formGroup.reset();
    }
  }

  public closeModalClicked(): void {
    this.dialogRef.close();
    this.data.formGroup.reset();
  }

}
