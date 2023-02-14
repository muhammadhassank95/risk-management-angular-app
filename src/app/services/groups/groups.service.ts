import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(
    private api: ApiService
  ) { }

  public getAllGroups(): Observable<any> {
    return this.api.get('/Groups')
  }

  public getAllUsers(): Observable<any> {
    return this.api.get('/Authenticate/GetUsers')
  }

  public createGroups(bodyPayLoad: any): Observable<any> {
    return this.api.post('/Groups', bodyPayLoad)
  }

  public updateGroups(bodyPayLoad: any, id: any): Observable<any> {
    return this.api.put(`/Groups/${id}`, bodyPayLoad)
  }

  public deleteGroups(id: any): Observable<any> {
    return this.api.delete(`/Groups/${id}`)
  }

}
