import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleName } from './RoleName.model';

@Injectable({
  providedIn: 'root'
})
export class RolesNameService {

  constructor(private http:HttpClient) { }
  getRolesName(): Observable<RoleName[]> {
    return this.http.get<RoleName[]>('https://localhost:7268/api/RoleName')
  }
}
