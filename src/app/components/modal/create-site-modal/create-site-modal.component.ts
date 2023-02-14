import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SitesService } from 'src/app/services/sites/sites.service';

@Component({
  selector: 'app-create-site-modal',
  templateUrl: './create-site-modal.component.html',
  styleUrls: ['./create-site-modal.component.scss']
})
export class CreateSiteModalComponent implements OnInit {
  public createSiteForm!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CreateSiteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private siteService: SitesService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initializeFormgroup();
  }

  public initializeFormgroup(): void {
    this.createSiteForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      location: new FormControl(''),
    })
  }

  closeModalClicked() {
    this.dialogRef.close();
  }

  createSite() {
    if (this.createSiteForm.valid) {
      this.siteService.createSites(this.createSiteForm.value).subscribe((res: any) => {
        if (res) {
          this.dialogRef.close();
        }
      });
    }
  }
}
