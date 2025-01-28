import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { User } from './user.service';

export interface Prova {
  id: number;
  nome: string;
  descricao: string | null;
  dataCriacao: string;
  numQuestao: number;
  questoes: Questao[];
}

export interface Questao {
  id: number;
  enunciado: string;
  prova: Prova;
  respostas: Resposta[];
}

export interface Resposta {
  id: number;
  descricao: string;
  questao: Questao;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl: string = `http://localhost:8080/provas`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  buscarProvaPorId(id: number): Observable<Prova> {
    const headers = this.getAuthHeaders();

    return this.http.get<Prova>(`${this.apiUrl}/${id}`, { headers });
  }

  getProvas(): Observable<Prova[]> {
    const headers = this.getAuthHeaders();
  
    return this.http.get<Prova[]>(this.apiUrl, { headers }).pipe(
      switchMap((provas) => {
        return this.getQuestoes().pipe(
          switchMap((questoes) => {
            return this.getRespostas().pipe(
              map((respostas) => {
                if (questoes && questoes.length > 0) {
                  return provas.map((prova) => {

                    prova.questoes = questoes.filter((questao) => questao.prova.id === prova.id);

                    prova.questoes.forEach((questao) => {
                      questao.respostas = respostas.filter((resposta) => resposta.questao.id === questao.id);
                    });
                    return prova;
                  });
                }
                return provas;
              })
            );
          })
        );
      }),
      catchError((error) => {
        console.error('Erro ao buscar provas:', error);
        return throwError(() => error);
      })
    );
  }

  atualizarProva(id: number, prova: Prova): Observable<Prova> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/${id}?nome=${encodeURIComponent(
      prova.nome
    )}&descricao=${encodeURIComponent(prova.descricao || '')}`;

    return this.http.put<Prova>(url, {}, { headers });
  }

  cadastrarProva(nome: string, descricao: string): Observable<Prova> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}?nome=${encodeURIComponent(
      nome
    )}&descricao=${encodeURIComponent(descricao)}`;

    return this.http.post<Prova>(url, {}, { headers });
  }

  excluirProva(id: number): Observable<void> {
    const headers = this.getAuthHeaders();

    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers,
    });
  }

  getQuestoes(): Observable<Questao[]> {
    const headers = this.getAuthHeaders();

    return this.http.get<Questao[]>(`http://localhost:8080/questoes`, { headers });
  }

  cadastrarQuestao(enunciado: string, prova_id: number): Observable<Questao> {
    const headers = this.getAuthHeaders();

    const url = `http://localhost:8080/questoes/${prova_id}?enunciado=${encodeURIComponent(enunciado)}`;

    return this.http.post<Questao>(url, {}, { headers });
  }

  getNumQuestoes(prova_id: number): Observable<number> {
    const headers = this.getAuthHeaders();

    return this.http.get<Questao[]>(`http://localhost:8080/questoes`, { headers }).pipe(
      map(questoes => {
        const questoesFiltradas = questoes.filter(questao => questao.prova.id === prova_id);

        return questoesFiltradas.length;
      })
    );
  }

  atualizarQuestao(id: number, enunciado: string): Observable<Questao> {
    const headers = this.getAuthHeaders();

    const url = `http://localhost:8080/questoes/${id}?enunciado=${encodeURIComponent(
      enunciado
    )}`;

    return this.http.put<Questao>(url, {}, { headers });
  }

  excluirQuestao(id: number): Observable<void> {
    const headers = this.getAuthHeaders();

    return this.http.delete<void>(`http://localhost:8080/questoes/${id}`, {
      headers,
    });
  }

  buscarUsuarios(): Observable<number> {
    const headers = this.getAuthHeaders();
  
    return this.http.get<User[]>(`http://localhost:8080/user`, { headers }).pipe(
      map((usuarios) => usuarios.length)
    );
  }

  getRespostas(): Observable<Resposta[]> {
    const headers = this.getAuthHeaders();

    return this.http.get<Resposta[]>(`http://localhost:8080/respostas`, { headers });
  }

  cadastrarResposta(questao_id: number, descricao: string): Observable<Resposta> {
    const headers = this.getAuthHeaders();
  
    const url = `http://localhost:8080/respostas/${questao_id}?descricao=${encodeURIComponent(descricao)}`;
      
    return this.http.post<Resposta>(url, {}, { headers });
  }

  atualizarResposta(id: number, descricao: string): Observable<Resposta> {
    const headers = this.getAuthHeaders();

    const url = `http://localhost:8080/respostas/${id}?descricao=${encodeURIComponent(
      descricao
    )}`;

    return this.http.put<Resposta>(url, {}, { headers });
  }
}
