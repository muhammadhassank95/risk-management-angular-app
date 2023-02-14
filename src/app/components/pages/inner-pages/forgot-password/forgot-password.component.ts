import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MustMatch, passwordRegexCapital, passwordRegexSpecialCharacter, passwordRegexNumber } from 'src/app/shared/utility/confirm-password-validator'
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public uuid: any;
  public token: any;
  public userName: any;

  public hide: boolean = true;
  public hideConfirm: boolean = true;
  public formGroup: FormGroup
  public user: any = null;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.uuid = params.uuid;
      this.token = params.token;
      this.userName = params.name;

    })
    this.initializeFormGroup();
    this.getUsers();
  }

  public getUsers(): void {
    // this.userService.getAllUsers().subscribe((response: any) => {
    //   response.forEach((user: any) => {
    //     if(user.id == this.uuid){
    //       this.user = user;
    //     }
    //   })
    // })
  }

  public initializeFormGroup(): void {
    this.formGroup = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.pattern(passwordRegexCapital), Validators.pattern(passwordRegexNumber), Validators.pattern(passwordRegexSpecialCharacter)]),
      confirmPassword: new FormControl('', Validators.required),
    }, {
      validators: MustMatch('password', 'confirmPassword') as ValidatorFn
    })
  }

  public setPassword(): void {
    const payload = {
      userId: this.uuid,
      password: this.formGroup.value.password,
      token: this.token
    }
    if (this.formGroup.valid) {
      this.userService.resetPassword(payload).subscribe((response: any) => {
        if (response.status == 'Success') {
          this.formGroup.reset();
          localStorage.clear();
          this.router.navigateByUrl('/signin');
          this.snackBar.open('Password was successfully set.', '', {
            duration: 2000,
            panelClass: ['success-snackbar']
          })
        }
      })
    }
  }

}
