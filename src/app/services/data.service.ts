import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Prova {
  id: number;
  nome: string;
  dataCriacao: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl: string = `http://localhost:8080`;
  constructor(private http: HttpClient) {}

  getProvas(): Observable<any> {
    return this.http.get(this.apiUrl + `/provas/buscar`);
  }
}
