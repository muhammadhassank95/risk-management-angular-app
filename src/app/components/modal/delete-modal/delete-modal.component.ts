import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { SitesService } from 'src/app/services/sites/sites.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

  public modalCategory = '';
  public isConfirm: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.data.type
  }

  onConfirmClick(isConfirm: boolean) {
    this.isConfirm = isConfirm;
    this.closeModalClicked(this.isConfirm)
  }

  closeModalClicked(isConfirm: boolean) {
    this.dialogRef.close(isConfirm);
  }

}
