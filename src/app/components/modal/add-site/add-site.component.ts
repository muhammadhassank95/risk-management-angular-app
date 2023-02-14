import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SitesService } from 'src/app/services/sites/sites.service';
@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.scss']
})
export class AddSiteComponent implements OnInit {

  public formGroup: FormGroup;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public addOnBlur = true;
  public selectable = true;
  public removable = true;
  public color: string = '#384ea3';
  public fontColor: string = '#ffffff'

  constructor(
    public siteService: SitesService,
    public dialogRef: MatDialogRef<AddSiteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.verifyIsEdit();
  }

  public verifyIsEdit(): void {

    if (!this.data.isAdd) {
      this.formGroup.get('name')!.patchValue(this.data.selectedSiteDatas.name),
        this.formGroup.get('color')!.patchValue(this.data.selectedSiteDatas.color)

      this.color = this.data.selectedSiteDatas.color;
    }
  }

  public initializeFormGroup(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      color: new FormControl('', Validators.email),
    })
  }

  public addSite(): void {
    this.formGroup.get('color')?.patchValue(this.color);
    this.siteService.createSites(this.formGroup.value).subscribe((response: any) => {
      this.dialogRef.close({ isSuccess: true});
    })
  }

  public updateSite(): void {
    this.formGroup.get('color')?.patchValue(this.color);
    let userIds: any[] = [];
    this.data.selectedSiteDatas.users.forEach((user: any) => {
      userIds.push(user.userId)
    })
    const payload = {
      name: this.formGroup.value.name,
      location: '',
      color: this.formGroup.value.color,
      users: userIds
    }

    this.siteService.updateSites(this.data.selectedSiteDatas.id, payload).subscribe((response: any) => {
      this.dialogRef.close({ isSuccess: true});
    })
  }

  public deleteSite(): void {
    this.siteService.deleteSites(this.data.selectedSiteDatas.id).subscribe((response: any) => {
      this.dialogRef.close('success-delete');
    })
  }

  cancel() {
    this.dialogRef.close();
  }
}
