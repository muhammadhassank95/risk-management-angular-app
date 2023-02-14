import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-grid-acion-icons',
  templateUrl: './grid-acion-icons.component.html',
  styleUrls: ['./grid-acion-icons.component.scss']
})
export class GridActionIconsComponent implements ICellRendererAngularComp {
  public params!: any;
  public type: string = '';
  public currentRoute: string = '';
  public categoryActions: any[] = [];
  public isAdmin: boolean;
  @Input() showtestRun: boolean = true;

  agInit(params: any): void {
    this.params = params;
    if(params.data.roles){
      params.data.roles.toString().includes('Admin') ? this.isAdmin = true : this.isAdmin = false;
    }
    this.SetType(params);
  }

  refresh(params: any): boolean {
    this.params = params;
    this.SetType(params);
    return true;
  }

  SetType(params: any) {
    this.type = params?.type ?? '';
  }

  OnView(event: any) {
    if (this.params.onView instanceof Function) {
      const params: any = {
        event: event,
        rowData: this.params.node.data,
      };
      this.params.onView(params);
    }
  }

  OnLogView(event: any) {
    if (this.params.onLogView instanceof Function) {
      const params: any = {
        event: event,
        rowData: this.params.node.data,
      };
      this.params.onLogView(params);
    }
  }

  OnArchive(event: any) {
    if (this.params.onArchive instanceof Function) {
      const params: any = {
        event: event,
        rowData: this.params.node.data,
      };
      this.params.onArchive(params);
    }
  }

  OnEdit(event: any) {
    if (this.params.onEdit instanceof Function) {
      const params: any = {
        event: event,
        rowData: this.params.node.data,
      };
      this.params.onEdit(params);
    }
  }

  onChangePassword(event: any) {
    if (this.params.onEdit instanceof Function) {
      const params: any = {
        event: event,
        rowData: this.params.node.data,
      };
      this.params.onChangePassword(params);
    }
  }

  onDownload(event: any) {
    if (this.params.onDownload instanceof Function) {
      const params: any = {
        event: event,
        rowData: this.params.node.data,
      };
      this.params.onDownload(params);
    }
  }

  onTrash(event: any) {
    if (this.params.onTrash instanceof Function) {
      const params: any = {
        event: event,
        rowData: this.params.node.data,
      };
      this.params.onTrash(params);
    }
  }

  onCheck(event: any) {
    if (this.params.onCheck instanceof Function) {
      const params: any = {
        event: event,
        rowData: this.params.node.data,
      };
      this.params.onCheck(params);
    }
  }

  onCross(event: any) {
    if (this.params.onCross instanceof Function) {
      const params: any = {
        event: event,
        rowData: this.params.node.data,
      };
      this.params.onCross(params);
    }
  }

}

