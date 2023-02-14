import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SigninService } from 'src/app/services/auth/signin/signin.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SigninComponent implements OnInit {

  public signinFormGroup!: FormGroup;
  public hide: boolean = true;
  constructor(
    private router: Router,
    private signinService: SigninService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeFormgroup();
    this.authCheck();
  }

  public authCheck(): void {
    const token = localStorage.getItem('access-token');
    if (token !== null) {
      this.router.navigateByUrl('/community')
    }
  }

  public initializeFormgroup(): void {
    this.signinFormGroup = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  public loading = false;

  public login(): void {
    this.loading = true;
    if (this.signinFormGroup.valid) {
      this.signinService.processSignin(this.signinFormGroup.value)
        .subscribe((response: any) => {
          const token = response.token;
          const userRoles = response.userRoles;
          const expiration = response.expiration;
          localStorage.setItem('access-token', token);
          localStorage.setItem('user', JSON.stringify(response));

          localStorage.setItem('user-roles', JSON.stringify(userRoles));
          if (response.token !== null) {
            this.router.navigateByUrl('/community')
            this.loading = false;
          }
        },
          error => {
            this.loading = false;
            console.log(error)
            if (error.error.status === 401) {
              this._snackBar.open('Username or Password is incorrect. Please try again','', {
                duration: 2000,
                panelClass: ['tbr-background-danger']
              })
            } else {
              this._snackBar.open('Something went wrong. Please try again.','', {
                duration: 2000,
                panelClass: ['tbr-background-danger']
              })
            }
          },)
    } else {
      this.loading = false;
    }
  }

  signUp() {
    this.router.navigateByUrl('/signup')
  }
}
