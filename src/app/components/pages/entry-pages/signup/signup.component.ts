import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SignupService } from 'src/app/services/auth/signup/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public password?: string;
  public formGroup: FormGroup;
  public hide: boolean = true;
  public isValidEmail = false;
  public passwordVisible = false;
  public showValidateSubGroup = false;
  public showPasswordSubGroup = false;
  public confirmPasswordVisible = false;
  public isUserSignedup: boolean = false;
  public createAccountFormGroup!: FormGroup;
  public hideConfirmPassword: boolean = true;

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private signupService: SignupService
  ) { }

  ngOnInit() {
    this.initializeFormgroup();
  }

  initializeFormgroup() {
    this.createAccountFormGroup = new FormGroup({
      sendCodeSubGroup: new FormGroup({
        fullName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        company: new FormControl('', Validators.required),
        position: new FormControl('')
      }),

      validateSubGroup: new FormGroup({
        code: new FormControl('', Validators.required)
      }),

      passwordSubGroup: new FormGroup({
        isAgreeOnCondition: new FormControl(false, Validators.required),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required)
      })
    });
  }

  sendCodeClicked() {
    if (this.createAccountFormGroup.controls.sendCodeSubGroup.status === 'VALID') {
      this.isValidEmail = false;
      this.signupService.sendCodeApi(this.createAccountFormGroup.value.sendCodeSubGroup).subscribe((res: any) => {
        if (res.status === 'Success') {
          this.showValidateSubGroup = true;
          // alert(res.code);
          this.snackbar.open('Code has been sent via Email.','', {
            duration: 2000,
            panelClass: ['success-snackbar']
          })
        }
      },
        (err: any) => {
          console.error(err);
        });
    } else {
      this.isValidEmail = true;
    }
  }

  onValidateCodeClicked() {
    if (this.createAccountFormGroup.controls.validateSubGroup.status === 'VALID') {
      const validateCodePayload = {
        ...this.createAccountFormGroup.value.validateSubGroup,
        email: this.createAccountFormGroup.value.sendCodeSubGroup.email
      }
      this.signupService.validateCodeApi(validateCodePayload).subscribe((res: any) => {
        if (res.status === 'Success') {
          this.showPasswordSubGroup = true;
        }
      },
        (err: any) => {
          console.error(err);
        });
    }
  }

  onAccountCreationSaveClicked() {
    if (this.createAccountFormGroup.status === 'VALID') {

      const createAccountPayload = {
        lastName: '',
        code: this.createAccountFormGroup.value.validateSubGroup.code,
        email: this.createAccountFormGroup.value.sendCodeSubGroup.email,
        password: this.createAccountFormGroup.value.passwordSubGroup.password,
        firstName: this.createAccountFormGroup.value.sendCodeSubGroup.fullName,
      }

      this.signupService.createAccountApi(createAccountPayload, this.createAccountFormGroup.value.sendCodeSubGroup.company).subscribe((res: any) => {
        if (res?.status === 'Success') {
          this.router.navigateByUrl('/signin')
          this.snackbar.open('Account Created Successfully.','', {
            duration: 2000,
            panelClass: ['success-snackbar']
          })
        }
      },
        (err: any) => {
          console.error(err);
          // check error status code is 500, if so, do some action
        });
    } else {
    }
  }
}
