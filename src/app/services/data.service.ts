import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Prova {
  id: number;
  nome: string;
  descricao: string | null;
  dataCriacao: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl: string = `http://localhost:8080`;
  constructor(private http: HttpClient) {}

  getProvas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/provas/buscar`);
  }

  atualizarProva(id: number, prova: Prova): Observable<Prova> {
    const url = `${this.apiUrl}/provas/atualizar/${id}?nome=${prova.nome}&descricao=${prova.descricao}`;
    console.log('URL de atualização:', url);
  
    return this.http.put<Prova>(url, {});
  }

  cadastrarProva(nome: string, descricao: string): Observable<Prova> {
    const url = `${this.apiUrl}/provas/cadastro?nome=${nome}&descricao=${descricao}`;
    console.log('URL de atualização:', url);

    return this.http.post<Prova>(url, {});
  }

  excluirProva(id: number): Observable<Prova> {

    return this.http.delete<Prova>(`${this.apiUrl}/provas/delete/${id}`);
  }
  
}
