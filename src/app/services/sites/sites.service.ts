import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class SitesService {

  constructor(
    private api: ApiService
  ) { }

  public getSites(): Observable<any> {
    return this.api.get('/Sites')
  }

  public getSitesById(id: any): Observable<any> {
    return this.api.get(`/Sites/${id}`)
  }

  public createSites(data: any): Observable<any> {
    return this.api.post('/Sites', data)
  }

  public deleteSites(id: any): Observable<any> {
    return this.api.delete(`/Sites/${id}`)
  }

  public updateSites(id: any, data: any): Observable<any> {
    return this.api.put(`/Sites/${id}`, data)
  }

  // risk service should be seperate...
  public postBusinessRisk(data: any): Observable<any> {
    return this.api.post('/BusinessRisks', data)
  }

  public updateBusinessRisk(data: any, id: any): Observable<any> {
    return this.api.put(`/BusinessRisks/${id}`, data)
  }

  public deleteBusinessRisk(id: any): Observable<any> {
    return this.api.delete(`/BusinessRisks/${id}`)
  }

  public getTopBusinessRisk(numberToFetchRecords: any): Observable<any> {
    return this.api.get(`/BusinessRisks/Top/${numberToFetchRecords}`)
  }

  public getBusinessRisk(site: any): Observable<any> {
    return this.api.get(`/BusinessRisks/Site/${site}`)
  }

  public updateOrder(site: any, data: any): Observable<any> {
    return this.api.put(`/BusinessRisks/UpdateOrder/Site/${site}`, data)
  }

  public getBusinessRisksLogs(riskId: any): Observable<any> {
    return this.api.get(`/BusinessRiskLogs/BusinessrRisk/${riskId}`)
  }

  public updateBusinessRisksLogs(data: any, risksLogsId: any): Observable<any> {
    return this.api.put(`/BusinessRiskLogs/${risksLogsId}`, data)
  }

  public createBusinessRisksLogs(data: any): Observable<any> {
    return this.api.post(`/BusinessRiskLogs`, data)
  }

  // files
  public getBusinessRisksFiles(riskId: any): Observable<any> {
    return this.api.get(`/BusinessRiskFiles/BusinessrRisk/${riskId}`)
  }

  public deleteBusinessRisksFiles(riskId: any): Observable<any> {
    return this.api.delete(`/BusinessRiskFiles/${riskId}`)
  }

  public uploadBusinessRisksFiles(file: any): Observable<any> {
    return this.api.uploadFile(`/Blob/BusinessRiskImport`, file)
  }

  public sendUploadFileName(body: any): Observable<any> {
    return this.api.post(`/BusinessRiskFiles`, body)
  }
}
