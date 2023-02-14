import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SitesService } from 'src/app/services/sites/sites.service';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss']
})
export class AddUpdateComponent implements OnInit {

  public formGroup: FormGroup;
  constructor(
    public sitesService: SitesService,
    public dialogRef: MatDialogRef<AddUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initializeFOrmGroup();
  }

  public initializeFOrmGroup(): void {
    this.formGroup = new FormGroup({
      log: new FormControl('', Validators.required)
    })
  }

  public cancel(): void {
    this.dialogRef.close('close');
  }

  public submit(): void {
    const payload = {
      businessRiskId: this.data.selectedRisk.id,
      notes: this.formGroup.value.log,
      isDeleted: true
    }
    this.sitesService.createBusinessRisksLogs(payload).subscribe((response: any) => {
      if (response) {
        this.dialogRef.close('success');
      }
    })
  }
}
