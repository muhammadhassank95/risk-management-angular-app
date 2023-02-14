import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { GroupsService } from 'src/app/services/groups/groups.service';
import { SitesService } from 'src/app/services/sites/sites.service';
import { CreateUpdateRiskModalComponent } from '../create-update-risk-modal/create-update-risk-modal.component';

@Component({
  selector: 'app-risk-detail-modal',
  templateUrl: './risk-detail-modal.component.html',
  styleUrls: ['./risk-detail-modal.component.scss']
})
export class RiskDetailModalComponent implements OnInit {
  public selectedRisk: any;
  public isEdit = false;
  public riskDetailForm!: FormGroup

  constructor(
    public dialogRef: MatDialogRef<RiskDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private riskService: SitesService,
    private siteService: SitesService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.selectedRisk = this.data.selectedRow;
    this.initializeFormGroup();
  }

  public initializeFormGroup(): void {
    this.riskDetailForm = new FormGroup({
      order: new FormControl(this.selectedRisk.order),
      name: new FormControl(this.selectedRisk.name),
      likelihood: new FormControl(this.selectedRisk.likelihood),
      outcome: new FormControl(this.selectedRisk.outcome),
      duration: new FormControl(this.selectedRisk.duration ? this.selectedRisk.duration : ''),
      group: new FormControl(this.selectedRisk.group ? this.selectedRisk.group : ''),
      description: new FormControl(this.selectedRisk.description),
      archived: new FormControl(false),
      status: new FormControl(this.selectedRisk?.status)
    })
  }

  duration(type: string): string {
    if (type === 'monthly') {
      return 'per month';
    } else if (type === 'quarterly') {
      return 'per quarter';
    } else if (type === 'yearly') {
      return 'per year';
    } else {
      return '';
    }
  }

  editSaveRisk(val: any) {
    const dialogRefEdit = this.dialog.open(CreateUpdateRiskModalComponent, {
      data: {
        title: 'Edit Proposal',
        formGroup: this.riskDetailForm
      },
    });

    dialogRefEdit.afterClosed().subscribe(result => {
      const payload = {
        siteId: this.data.selectedSiteId,
        date: new Date(),
        ...result.formGroup
      }

      this.siteService.updateBusinessRisk(payload, this.selectedRisk.id).subscribe((response: any) => {
      })
      this.closeModalClicked();
    });
  }

  closeModalClicked() {
    this.dialogRef.close();
  }
}
