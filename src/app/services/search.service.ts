import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private pesquisaSubject = new BehaviorSubject<string>(''); // Texto inicial vazio
  pesquisa$ = this.pesquisaSubject.asObservable(); // Observable para os componentes se inscreverem

  atualizarPesquisa(texto: string): void {
    this.pesquisaSubject.next(texto); // Atualiza o valor da pesquisa
  }
}
