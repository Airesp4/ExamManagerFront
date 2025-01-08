import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Prova } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SearchService } from '../../services/search.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [HttpClient],
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.css']
})
export class InfoScreenComponent implements OnInit {
  provas: Prova[] = [];
  provasFiltradas: Prova[] = [];
  provaSelecionada: Prova | null = null;
  editando: boolean = false;

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

  salvarAlteracoes(): void {
    console.log("Método salvarAlteracoes chamado"); // Verificação
    if (this.provaSelecionada != null) {
      const id = this.provaSelecionada.id; // O id da prova que você deseja atualizar
      this.dataService.atualizarProva(id, this.provaSelecionada).subscribe({
        next: (updatedProva) => {
          console.log('Prova atualizada com sucesso:', updatedProva);
          this.fecharModal();
          // Realize qualquer outra ação após a atualização, como mostrar uma mensagem de sucesso
        },
        error: (err) => {
          console.error('Erro ao atualizar a prova:', err);
          // Trate erros, como mostrar uma mensagem de erro para o usuário
        }
      });
    } else {
      console.error('Nenhuma prova selecionada para atualizar');
    }
  }
  
  
  
  ativarEdicao(): void {
    if (this.provaSelecionada != null) {
      this.editando = true;
      alert('Modo de edição ativado para: ' + this.provaSelecionada.nome);
    }
  }
  
  desativarEdicao(): void {
    this.editando = false;
    alert('Modo de edição desativado.');
  }
  
  fecharModal(): void {
    this.provaSelecionada = null;
    this.editando = false;
  }
  
}

