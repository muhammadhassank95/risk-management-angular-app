import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { SitesService } from 'src/app/services/sites/sites.service';

@Component({
  selector: 'app-archive-risk-confirmation-modal',
  templateUrl: './archive-risk-confirmation-modal.component.html',
  styleUrls: ['./archive-risk-confirmation-modal.component.scss']
})
export class ArchiveRiskConfirmationModalComponent implements OnInit {
  public modalCategory = '';
  constructor(
    public dialogRef: MatDialogRef<ArchiveRiskConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private riskService: SitesService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    if (this.data.isDeclineClick) {
      this.modalCategory = 'decline';
    } else {
      this.modalCategory = 'approve';
    }

    if (this.data.isArchiveClick) {
      this.modalCategory = 'archive';
    }
  }

  async onConfirmClick() {
    let body;
    if (this.data.isDeclineClick) {
      body = {
        ...this.data.selectedRisk,
        status: 'Declined',
        date: moment(this.data.selectedRisk.date)
      }
    } else {
      body = {
        ...this.data.selectedRisk,
        status: 'Approved',
        date: moment(this.data.selectedRisk.date)
      }
    }
    if (this.data.isArchiveClick) {
      body = {
        ...this.data.selectedRisk,
        archived: true,
        date: moment(this.data.selectedRisk.date)
      }
    }
    this.riskService.updateBusinessRisk(body, this.data.selectedRisk.id).subscribe((res: any) => {
      this.closeModalClicked()
    })
  }

  closeModalClicked() {
    this.dialogRef.close();
  }

}
