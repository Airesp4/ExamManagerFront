import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private pesquisaSubject = new BehaviorSubject<string>('');
  pesquisa$ = this.pesquisaSubject.asObservable();

  atualizarPesquisa(texto: string): void {
    this.pesquisaSubject.next(texto);
  }
}
