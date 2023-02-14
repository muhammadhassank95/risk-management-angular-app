import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationData } from 'src/app/shared/constants/left-nav.constant';

@Component({
  selector: 'app-left-nav-bar',
  templateUrl: './left-nav-bar.component.html',
  styleUrls: ['./left-nav-bar.component.scss']
})
export class LeftNavBarComponent implements OnInit {
  public navBarMenuObj = NavigationData;
  constructor(private router: Router) {
  }

  ngOnInit() {
    this.navOnBaseOfRole();
    this.setActiveNav();
  }

  navOnBaseOfRole() {
    const getUserRoles = JSON.parse(localStorage.getItem('user-roles')!);
    if (!(getUserRoles?.includes('Global'))) return this.navBarMenuObj.shift();
  }

  public setActiveNav(currentRoute?: string) {
    let route: any;
    currentRoute ? route = currentRoute : route = this.router.url;
    this.navBarMenuObj = this.navBarMenuObj.map((data: any) => {
      data.link == route ? data.active = true : data.active = false;
      return data;
    })
  }

  navigateTo(route: any) {
    this.setActiveNav(route)
    if (route == '/logout') {
      localStorage.removeItem('access-token');
      this.router.navigateByUrl('/signin');
    } else {
      this.router.navigateByUrl(route);
    }
  }

  public isIcons = false;
  showIconsOnly() {
    this.isIcons = !this.isIcons
  }
}
