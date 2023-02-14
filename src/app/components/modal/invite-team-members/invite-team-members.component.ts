import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupsService } from 'src/app/services/groups/groups.service';

@Component({
  selector: 'app-invite-team-members',
  templateUrl: './invite-team-members.component.html',
  styleUrls: ['./invite-team-members.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InviteTeamMembersComponent implements OnInit {

  public formGroup: FormGroup;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public addOnBlur = true;
  public selectable = true;
  public removable = true;
  public isGlobal = false;

  public communities: Array<any> = [];
  public groupList: Array<any> = [];
  constructor(
    public dialogRef: MatDialogRef<InviteTeamMembersComponent>,
    public groupService: GroupsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.initSelectedUser();
    this.getGroups();
  }

  public getGroups(): void {
    this.groupService.getAllGroups().subscribe((response: any) => {
      this.groupList = response;
    })
  }

  public initSelectedUser(): void {
    if(this.data.selectedUser?.roles?.includes('Admin')){
      this.isGlobal = true;
    }
    if(this.data.isEdit){
      this.formGroup.addControl('group', new FormControl(this.data?.selectedUser?.groupId, Validators.required));
      this.formGroup.addControl('global', new FormControl(Boolean, Validators.required));
      this.formGroup.get('name')?.patchValue(`${this.data?.selectedUser?.name}`);
      this.formGroup.get('email')?.patchValue(this.data?.selectedUser?.email);
      this.formGroup.patchValue({
        global: this.isGlobal
      });
    }
  }

  public initializeFormGroup(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
    })
  }

  public sendInvite(): void {
    const inviteData = {
      payload: this.formGroup.value,
      isValid: this.formGroup.valid ? true : false
    }
    if (this.formGroup.valid) {
      this.dialogRef.close(inviteData)
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public updateUser(): void {
    const updateData = {
      payload: this.formGroup.value,
      isValid: this.formGroup.valid ? true : false,
      userId: this.data.selectedUser.id
    }
    if (this.formGroup.valid) {
      this.dialogRef.close(updateData)
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
