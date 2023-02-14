import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, Observable, of, startWith } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users/users.service';
import { SitesService } from 'src/app/services/sites/sites.service';

@Component({
  selector: 'app-risk-manager',
  templateUrl: './risk-manager.component.html',
  styleUrls: ['./risk-manager.component.scss']
})
export class RiskManagerComponent implements OnInit {

  public formGroup: FormGroup;
  public addOnBlur = true;
  public selectable = true;
  public removable = true;
  public visible = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  riskManagerCtrl = new FormControl('');
  filteredRiskManager: Observable<any[]>;
  selectedUsers: any[] = [];
  selectedUsersPayload: any[] = [];
  allUsers: any[] = [];

  @ViewChild('riskManagerInput') riskManagerInput: ElementRef<HTMLInputElement>;
  constructor(
    public usersService: UsersService,
    public sitesService: SitesService,
    public dialogRef: MatDialogRef<RiskManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dialogRef.disableClose = true;
    this.allUsers = this.data.users;
    this.riskManagerCtrl.valueChanges.subscribe((search: any) => {
      this.filteredRiskManager = of(this.allUsers?.filter(item =>
        item?.name?.toLowerCase()?.includes(search) || item?.email?.toLowerCase()?.includes(search)
      ));
    });
  }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.selectedUser();
  }

  public selectedUser(): void {
    const token = localStorage.getItem('user');
    const parsed = JSON.parse(token!);
    const defaultUser = {
      name: parsed?.user?.name,
      userId: parsed?.user?.id
    }
    const existingId = this.data?.selectedSiteDatas?.users?.find((user: any) => user?.userId === defaultUser?.userId);

    if (!existingId) {
      this.selectedUsers.push(defaultUser);
    }

    if (this.data?.selectedSiteDatas?.users?.length > 0) {
      this.data?.selectedSiteDatas?.users?.forEach((user: any) => {
        this.selectedUsers.push(user)
      })
    }

  }

  public initializeFormGroup(): void {
    this.formGroup = new FormGroup({
      users: new FormControl([])
    })
  }

  public add(event: MatChipInputEvent): void {
    const input = event?.input;
    const value = event?.value;
    if ((value || '').trim()) {
      this.membersArrForm!.setValue([...this.membersArrForm!.value, value.trim()]);
      this.membersArrForm!.updateValueAndValidity();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    const userData = {
      userId: event?.option?.value?.id,
      name: event?.option?.value?.name
    }
    const existingId = this.selectedUsers?.some((user: any) => user?.userId === userData?.userId);

    this.selectedUsers!.push(userData);
    this.selectedUsersPayload!.push(userData.userId);
    this.riskManagerInput.nativeElement.value = '';
    this.riskManagerCtrl.setValue(null);
  }

  public updateCommunity(): void {
    let userIds: any[] = [];

    this.selectedUsers.forEach((user: any) => {
      userIds.push(user.userId)
    })

    const payload = {
      name: this.data?.selectedSiteDatas?.name,
      location: '',
      color: this.data?.selectedSiteDatas?.color,
      users: userIds
    }

    this.sitesService.updateSites(this.data?.selectedSiteDatas?.id, payload).subscribe((response: any) => {
      this.dialogRef.close(response.status)
    })
  }

  public remove(member: any): void {
    const index = this.selectedUsers?.indexOf(member);

    if (index > 0) {
      this.selectedUsers?.splice(index, 1);
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  get membersArrForm(): FormArray {
    return this.formGroup.get('users') as FormArray;
  }

}
