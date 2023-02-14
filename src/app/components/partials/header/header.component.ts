
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  @Output() headerButton = new EventEmitter<Event>();
  public userInitials: string;
  public currentRoute: string;
  public userRoles: any;
  public title = ''
  public headerUserName: any;
  public optionList: { id: number, name: string, route: string }[] = [];
  constructor(
    private router: Router,
  ) {
    this.getCurrentRoute();
  }

  ngOnInit(): void {
    this.userRoles = JSON.parse(localStorage.getItem('user-roles')!);
    this.headerMenuBasedOnRoles();
    const userObj = JSON.parse(localStorage.getItem('user')!);
    this.headerUserName = userObj?.user?.name;
    this.onRouteChange(this.router.url);
    this.router.events.subscribe((event: any) => {
      this.onRouteChange(event.url)
    })
    this.userInitials = userObj?.user?.name;

    this.getCurrentRoute();
  }

  headerMenuBasedOnRoles() {
    if (this.userRoles?.includes('Admin')) {
      this.optionList = [
        { id: 0, name: "USER ADMIN PANEL", route: "/users" },
        { id: 1, name: "CAPABILITIES PANEL", route: "/capabilities" },
        { id: 2, name: "LOGOUT", route: "/logout" },
      ];
    } else {
      this.optionList = [
        { id: 2, name: "LOGOUT", route: "/logout" },
      ]
    }
  }

  public getCurrentRoute(): void {
    this.router.events.subscribe((val: any) => {
      this.currentRoute = this.router.url;
    });
  }

  onRouteChange(url: any) {
    if (['/risks'].includes(url)) {
      this.title = 'Top Business Risks'
    } else if (url === '/users') {
      this.title = 'Users'
    } else if (url === '/archived') {
      this.title = 'Mitigated Risks'
    } else if (url === '/proposals') {
      this.title = 'Proposals'
    } else if (url === '/groups') {
      this.title = 'Contributors'
    } else if (url === '/sites') {
      this.title = 'Sites'
    } else if (url === '/global-risks') {
      this.title = 'Global Risks'
    } else {
      this.title = 'Top Business Risks'
    }
  }

  navigateTo(route: any) {
    if (route == '/logout') {
      localStorage.removeItem('access-token');
      this.router.navigateByUrl('/signin');
    } else {
      this.router.navigateByUrl(route);
    }
  }
}
