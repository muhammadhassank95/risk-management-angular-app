import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SitesService } from 'src/app/services/sites/sites.service';

@Component({
  selector: 'app-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['./file-upload-modal.component.scss']
})
export class FileUploadModalComponent implements OnInit {
  public uploadedFiles: any;

  constructor(
    private risksLogsService: SitesService,
    public dialogRef: MatDialogRef<FileUploadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getUploadedFiles();
  }

  getUploadedFiles() {
    this.risksLogsService.getBusinessRisksFiles(this.data.selectedRisk.id).subscribe((res: any) => {
      this.uploadedFiles = res;
    })
  }

  onDownloadClick(file: any) {
    window.open(file?.url, '_blank');
  }

  fileUpload(fileInputEvent: any) {
    let formData = new FormData();
    formData.append('file', fileInputEvent.target.files[0]);
    const fileSize = fileInputEvent.target.files[0].size;
    const originalFileName = fileInputEvent.target.files[0].name;
    this.risksLogsService.uploadBusinessRisksFiles(formData).subscribe((res: any) => {
      if (res.fileName) {
        let body = {
          name: res.fileName,
          size: fileSize,
          businessRiskId: this.data.selectedRisk.id,
          originalName: originalFileName
        }
        this.risksLogsService.sendUploadFileName(body).subscribe((res: any) => {
          this.getUploadedFiles();
        })
      }
    })
  }

  closeModal() {
    this.dialogRef.close();
  }
}
