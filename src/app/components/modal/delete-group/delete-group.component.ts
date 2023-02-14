import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupsService } from 'src/app/services/groups/groups.service';

@Component({
  selector: 'app-delete-group',
  templateUrl: './delete-group.component.html',
  styleUrls: ['./delete-group.component.scss']
})
export class DeleteGroupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupService: GroupsService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  public deleteTeam(): void {
    this.groupService.deleteGroups(this.data.selectedUser.id).subscribe((response: any) => {
      this.dialogRef.close({ isSuccess: true })
    })
  }

  public cancel(): void {
    this.dialogRef.close({ isSuccess: false })
  }

}
