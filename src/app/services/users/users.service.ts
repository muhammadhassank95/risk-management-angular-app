import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private api: ApiService) { }

  public forgotPassword(email: string): Observable<any> {
    const payload = {
      email: email
    }
    return this.api.post('/Authenticate/ForgotPassword', payload)
  }

  public getAllUsers(): Observable<any> {
    return this.api.get('/Authenticate/GetUsers')
  }

  public resetPassword(data: any): Observable<any> {
    return this.api.put('/Authenticate/RestPassword', data);
  }

  public changePassword(data: any): Observable<any> {
    return this.api.put('/Authenticate/ChangePassword', data);
  }

  public updateUser(data: any): Observable<any> {
    return this.api.put('/Authenticate/UpdateUser', data);
  }

  public updateUserSites(data: any): Observable<any> {
    return this.api.put('/Sites/UpdateUserSites', data);
  }

  public deleteUser(data: any): Observable<any> {
    return this.api.delete(`/Authenticate/DeleteUser/UserId/${data.id}`,);
  }

  public addUser(data: any): Observable<any> {
    return this.api.post(`/Authenticate/register`, data);
  }

  public updateUserRoles(data: any): Observable<any> {
    return this.api.put(`/Authenticate/UpdateRoles`, data);
  }

  public inviteUser(data: any): Observable<any> {
    return this.api.post(`/Authenticate/invite`, data);
  }

  public getCountersApi(): Observable<any> {
    return this.api.get(`/Authenticate/GetCounters`);
  }

}
