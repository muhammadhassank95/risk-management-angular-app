import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISignup } from 'src/app/shared/interfaces/signup.interface';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(
    private api: ApiService
  ) { }

  public signUp(data: ISignup): Observable<any> {
    return this.api.post('/Authenticate/register', data)
  }

  public sendCodeApi(data: any): Observable<any> {
    return this.api.post(`/Authenticate/SendCode`, data)
  }

  public validateCodeApi(data: any): Observable<any> {
    return this.api.post(`/Authenticate/ValidateCode`, data)
  }

  public createAccountApi(data: any, companyName: any): Observable<any> {
    return this.api.post(`/Authenticate/register-admin/Company/${companyName}`, data)
  }

}
