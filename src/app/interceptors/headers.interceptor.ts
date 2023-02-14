import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { delay, Observable, of, Subscription } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    public authToken: any;
    public user: any;
    public tokenSubscription = new Subscription()
    public timeout: any;
    public jwtHelper = new JwtHelperService();
    constructor(
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authorization = localStorage.getItem('access-token')
        let isTokenExpired: any = localStorage.getItem('access-token');
        if (!excludedUrl.includes(new URL(req.url).pathname)) {
            if (this.jwtHelper.isTokenExpired(isTokenExpired)) {
                this.logout();
            }
        }
        const authHeaders = { Authorization: `Bearer ${authorization}` }
        const request: HttpRequest<any> = req.clone({
            setHeaders: {
                ...authHeaders
            }
        });
        return next.handle(request)
    }

    logout(): void {
        this.router.navigateByUrl('/');
        localStorage.clear();
    }
}

const excludedUrl = ['/api/Authenticate/SendCode', '/api/Authenticate/ValidateCode']