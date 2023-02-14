import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupsService } from 'src/app/services/groups/groups.service';
import { SitesService } from 'src/app/services/sites/sites.service';

@Component({
  selector: 'app-create-update-risk-modal',
  templateUrl: './create-update-risk-modal.component.html',
  styleUrls: ['./create-update-risk-modal.component.scss']
})
export class CreateUpdateRiskModalComponent implements OnInit {
  public formGroup!: FormGroup;
  public showAdditionalFields = false;
  public usersList: Array<any> = [];
  public groupList: Array<any> = [];
  public BusinessRiskGroup = new FormControl([]);
  public BusinessRiskUsers = new FormControl([]);
  public selectedUsers: Array<any> = [];
  public allUsersList: any;
  public units: any[] = [
    { value: 'dollars', name: 'Dollars' },
    { value: 'lbs', name: 'Lbs' },
    { value: 'tons', name: 'Tons' },
    { value: 'mt', name: 'MT' },
    { value: 'gallonns', name: 'Gallons' },
    { value: 'barrels', name: 'Barrels' },
  ];

  constructor(
    public dialogRef: MatDialogRef<CreateUpdateRiskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupService: GroupsService,
    private risksLogsService: SitesService,
  ) { 
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.initializeFormgroup();
    this.parentData();
    this.getAllUserAndGroupList();
    if(this.data.isEdit){
      this.patchProposalValues();
    }
  }

  public patchProposalValues(): void {
    this.formGroup.controls.name.patchValue(this.data.selectedRiskData.name);
    this.formGroup.controls.description.patchValue(this.data.selectedRiskData.description);
    this.formGroup.controls.likelihood.patchValue(this.data.selectedRiskData.likelihood);
    this.formGroup.controls.outcome.patchValue(this.data.selectedRiskData.outcome);
    this.formGroup.controls.unit.patchValue(this.data.selectedRiskData.unit);
    this.formGroup.controls.group.patchValue(this.data.selectedRiskData.group);
  }

  public getAllUserAndGroupList(): void {
    this.groupService.getAllGroups().subscribe((res: any) => {
      this.groupList = res;
    })
  }

  public initializeFormgroup(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      likelihood: new FormControl('', Validators.required),
      outcome: new FormControl('',Validators.required),
      unit: new FormControl('',Validators.required),
      group: new FormControl('',Validators.required),
      status: new FormControl('')
    })
  }

  public parentData(): void {
    this.formGroup.get('status')?.patchValue('new');
  }

  public createProposal(): void {
    let group = {
      name: this.formGroup.value.group.name,
      id: this.formGroup.value.group.id
    }
    if(this.data.currentRiskType == 'acceptedRisks'){
      this.formGroup.get('status')?.patchValue('Approved')
    }
    this.formGroup.get('group')?.patchValue(group);
    if (this.formGroup.valid) {
      this.dialogRef.close({ formGroup: this.formGroup.value, isEdit: this.data.isEdit ? true : false });
      this.formGroup.reset();
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  compareWithFunction(item1: any, item2: any) {
    return item1 && item2 ? item1.name === item2.name : item1 === item2;
  }

  closeModalClicked() {
    this.dialogRef.close('closed');
  }

  fileUpload(fileInputEvent: any) {
    let formData = new FormData();
    formData.append('file', fileInputEvent.target.files[0]);
    const fileSize = fileInputEvent.target.files[0].size
    this.risksLogsService.uploadBusinessRisksFiles(formData).subscribe((res: any) => {
      if (res.fileName) {
        let body = {
          name: res.fileName,
          size: fileSize
        }
        this.risksLogsService.sendUploadFileName(body).subscribe((res: any) => {
        })
      }
    })
  }
}
