import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SitesService } from 'src/app/services/sites/sites.service';

@Component({
  selector: 'app-risks-logs-detail-update',
  templateUrl: './risks-logs-detail-update.component.html',
  styleUrls: ['./risks-logs-detail-update.component.scss']
})
export class RisksLogsDetailUpdateComponent implements OnInit {
  public newNotes = ''
  public isEdit = false;
  public risksLogsDetailForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RisksLogsDetailUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private riskService: SitesService,
    private activatedRoute: ActivatedRoute
  ) {
    this.dialogRef.disableClose = true;
  }

  public paramId: any;
  ngOnInit(): void {
    this.initializeFormgroup();
  }

  public initializeFormgroup() {
    const selectedLogRisks = JSON.parse(localStorage.getItem('selectedLogRisks')!);
    this.risksLogsDetailForm = new FormGroup({
      isDeleted: new FormControl(false),
      businessRiskId: new FormControl(selectedLogRisks.id),
      notes: new FormControl(this.data.selectedRow.notes),
    })
  }

  closeModalClicked() {
    this.dialogRef.close();
  }

  editSaveRisk(val: any) {
    this.isEdit = val;
    this.data.selectedRow.notes = this.risksLogsDetailForm.value.notes;
    if (this.risksLogsDetailForm.valid && !val) {
      this.riskService.updateBusinessRisksLogs(this.risksLogsDetailForm.value, this.data.selectedRow.id).subscribe((res: any) => {
        this.dialogRef.close();
      });
    }
  }

  saveNewRisk() {
    const selectedLogRisks = JSON.parse(localStorage.getItem('selectedLogRisks')!);
    const body = {
      notes: this.newNotes,
      businessRiskId: selectedLogRisks.id
    }
    this.riskService.createBusinessRisksLogs(body).subscribe((res: any) => {
      this.dialogRef.close();
    })
  }
}
