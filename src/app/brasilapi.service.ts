import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado, Municipio } from './brasilapi.model';

@Injectable({
  providedIn: 'root'
})
export class BrasilapiService {

  baseApiUrl = 'https://brasilapi.com.br/api';

  constructor(private http: HttpClient) { }

  listarUFs(): Observable<Estado[]> {
    return this.http.get<Estado[]>(`${this.baseApiUrl}/ibge/uf/v1`);
  }

  listarMunicipios(estado: string): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${this.baseApiUrl}/ibge/municipios/v1/${estado}`);
  }

}
