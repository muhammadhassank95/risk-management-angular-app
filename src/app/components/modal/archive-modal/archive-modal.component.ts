import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SitesService } from 'src/app/services/sites/sites.service';

@Component({
  selector: 'app-archive-modal',
  templateUrl: './archive-modal.component.html',
  styleUrls: ['./archive-modal.component.scss']
})
export class ArchiveModalComponent implements OnInit {
  public reasonToDecline = '';
  constructor(
    public siteService: SitesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ArchiveModalComponent>,
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void { }

  public deleteRisk(action: any): void {
    if(this.reasonToDecline && action === 'decline') {
      this.data.selectedRisk.status = 'Decline'
      this.data.selectedRisk.date = null;
      this.data.selectedRisk.reason = this.reasonToDecline;
      this.siteService.updateBusinessRisk(this.data.selectedRisk, this.data.selectedRisk.id).subscribe((response: any) => {
        this.closeModal();
      });
      return;
    }

    if (action === 'delete') {
      this.siteService.deleteBusinessRisk(this.data.selectedRisk.id).subscribe((response: any) => {
        this.closeModal();
      })
      return;
    }
  }

  public mitigated(): void {
    this.data.selectedRisk.archived = true;
    this.data.selectedRisk.date = null;
    this.siteService.updateBusinessRisk(this.data.selectedRisk, this.data.selectedRisk.id).subscribe((response: any) => {
      this.closeModal();
    })
  }

  approveRisk() {
    this.data.selectedRisk.status = 'Approved';
    this.data.selectedRisk.date = null;
    this.siteService.updateBusinessRisk(this.data.selectedRisk, this.data.selectedRisk.id).subscribe((response: any) => {
      this.closeModal();
    })
  }

  closeModal() {
    this.dialogRef.close()
  }
}
