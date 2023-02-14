import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddSiteComponent } from 'src/app/components/modal/add-site/add-site.component';
import { SitesService } from 'src/app/services/sites/sites.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RealTimeService } from 'src/app/services/real-time/real-time.service';

@Component({
  selector: 'app-risk-community',
  templateUrl: './risk-community.component.html',
  styleUrls: ['./risk-community.component.scss']
})
export class RiskCommunityComponent implements OnInit {

  public sitesList: any;
  public selectedSiteId!: number;

  public clickEventsubscription: Subscription;
  public fontColor: string = '#ffffff';
  public colors = ['#96e8d8', '#bce896', '#a696e8', '#96dde8']
  constructor(
    private siteService: SitesService,
    private router: Router,
    private dialog: MatDialog,
    private realTimeService: RealTimeService
  ) { }

  ngOnInit(): void {
    this.getSites();
  }

  public colorGetter(index: any, site: any): string {
    let c = site.color.substring(1);      
    let rgb = parseInt(c, 16);   
    let r = (rgb >> 16) & 0xff; 
    let g = (rgb >>  8) & 0xff;
    let b = (rgb >>  0) & 0xff; 

    let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (luma > 200) {
      // pick a different colour
      this.fontColor = '#131314';
    } else {
      this.fontColor = '#ffffff';
    }

    if (site.color !== '') {
      return site.color;
    } else {
      return '#d742e1'
    }
    
  }

  public getSites(): void {
    const persistedSite = localStorage.getItem('persistedSite');
    this.siteService.getSites().subscribe((res: any) => {
      this.sitesList = res;
    })
  };

  public selectSite(site: any): void {
    localStorage.setItem('persistedSite', site.id.toString());
    this.router.navigateByUrl('/risks')
  }

  public addSite(): void {
    const dialogRef = this.dialog.open(AddSiteComponent, {
      data: { title: 'Add Community', panelClass: 'invite-team-members', isAdd: true },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data.isSuccess) {
        this.getSites();
      }
    });
  }

}
