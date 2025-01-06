import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [RouterModule, FormsModule],
  providers: [HttpClient],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  pesquisa: string = '';

  constructor(private searchService: SearchService) {}

  onPesquisar(): void {
    this.searchService.atualizarPesquisa(this.pesquisa); // Atualiza a pesquisa no serviço
  }
}
