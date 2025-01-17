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
  providedIn: 'root',
})
export class DataService {
  private apiUrl: string = `http://localhost:8080`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProvas(): Observable<Prova[]> {
    const headers = this.getAuthHeaders();

    return this.http.get<Prova[]>(`${this.apiUrl}/provas/buscar`, { headers });
  }

  atualizarProva(id: number, prova: Prova): Observable<Prova> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/provas/atualizar/${id}?nome=${encodeURIComponent(
      prova.nome
    )}&descricao=${encodeURIComponent(prova.descricao || '')}`;

    return this.http.put<Prova>(url, {}, { headers });
  }

  cadastrarProva(nome: string, descricao: string): Observable<Prova> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/provas/cadastro?nome=${encodeURIComponent(
      nome
    )}&descricao=${encodeURIComponent(descricao)}`;

    return this.http.post<Prova>(url, {}, { headers });
  }

  excluirProva(id: number): Observable<void> {
    const headers = this.getAuthHeaders();

    return this.http.delete<void>(`${this.apiUrl}/provas/delete/${id}`, {
      headers,
    });
  }
}
