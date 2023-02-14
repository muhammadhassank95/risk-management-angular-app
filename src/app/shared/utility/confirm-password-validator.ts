import { FormGroup } from "@angular/forms";

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if(matchingControl.errors && !matchingControl.errors.mustMatch){
            return;
        }

        if(control.value !== matchingControl.value){
            matchingControl.setErrors({ mustMatch:true })
        } else {
            matchingControl.setErrors(null)
        }
    }
}

export const passwordRegexCapital = new RegExp('^(?=.*[a-z])(?=.*[A-Z])');
export const passwordRegexNumber = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])');
export const passwordRegexSpecialCharacter = new RegExp('(?=.*[-?()?,.<>`|_={}~:;+"!@#$%^&*])(?=.{8,})');
