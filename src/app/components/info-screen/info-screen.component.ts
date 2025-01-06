import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Prova } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-info-screen',
  standalone: true,
  imports: [CommonModule],
  providers: [HttpClient],
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.css']
})
export class InfoScreenComponent implements OnInit {
  provas: Prova[] = [];
  provasFiltradas: Prova[] = [];
  provaSelecionada: Prova | null = null;

  constructor(
    private dataService: DataService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.carregarProvas();

    // Inscrevendo-se para ouvir mudanças no texto da pesquisa
    this.searchService.pesquisa$.subscribe((texto) => {
      this.filtrarProvas(texto);
    });
  }

  carregarProvas(): void {
    this.dataService.getProvas().subscribe({
      next: (dados) => {
        this.provas = dados;
        this.provasFiltradas = dados; // Exibe todas as provas inicialmente
      },
      error: (erro) => {
        console.error('Erro ao buscar provas:', erro);
      }
    });
  }

  filtrarProvas(texto: string): void {
    const filtro = texto.toLowerCase();
    this.provasFiltradas = this.provas.filter((prova) =>
      prova.nome.toLowerCase().includes(filtro)
    );
  }

  exibirDetalhes(prova: Prova): void {
    this.provaSelecionada = prova;  // Armazena os dados da prova clicada
  }

  fecharModal(): void {
    this.provaSelecionada = null;  // Fecha o modal ao limpar a prova selecionada
  }
}

