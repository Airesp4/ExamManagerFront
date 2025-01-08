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
    return this.http.get(this.apiUrl + `/provas/buscar`);
  }

  atualizarProva(id: number, prova: Prova): Observable<Prova> {
    const url = `http://localhost:8080/provas/atualizar/${id}?nome=${prova.nome}&descricao=${prova.descricao}`;
    console.log('URL de atualização:', url); // Verificação
  
    // Enviando os dados como parâmetros na URL
    return this.http.put<Prova>(url, {});
  }

  cadastrarProva(nome: string, descricao: string): Observable<Prova> {
    const prova: Partial<Prova> = { nome, descricao };
    const url = `${this.apiUrl}/provas/cadastro`;
    return this.http.post<Prova>(url, prova);
  }
  
}
