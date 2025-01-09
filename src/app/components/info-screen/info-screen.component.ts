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
  confirmarExclusao: boolean = false;

  constructor(
    private dataService: DataService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.carregarProvas();

    this.searchService.pesquisa$.subscribe((texto) => {
      this.filtrarProvas(texto);
    });
  }

  carregarProvas(): void {
    this.dataService.getProvas().subscribe({
      next: (dados) => {
        this.provas = dados;
        this.provasFiltradas = dados;
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
    this.provaSelecionada = prova;
  }

  salvarAlteracoes(): void {
    console.log("Método salvarAlteracoes chamado");
    if (this.provaSelecionada != null) {
      const id = this.provaSelecionada.id;
      this.dataService.atualizarProva(id, this.provaSelecionada).subscribe({
        next: (updatedProva) => {
          console.log('Prova atualizada com sucesso:', updatedProva);
          this.fecharModal();
          
        },
        error: (err) => {
          console.error('Erro ao atualizar a prova:', err);
         
        }
      });
    } else {
      console.error('Nenhuma prova selecionada para atualizar');
    }
  }
  
  ativarEdicao(): void {
    if (this.provaSelecionada != null) {
      this.editando = true;
    }
  }
  
  desativarEdicao(): void {
    this.editando = false;
  }
  
  fecharModal(): void {
    this.provaSelecionada = null;
    this.editando = false;
  }

  efetuarExclusao(): void {
    if (!this.provaSelecionada || !this.provaSelecionada.id) {
      console.error('Nenhuma prova selecionada para exclusão.');
      return;
    }
  
    const id = this.provaSelecionada.id;
  
    this.dataService.excluirProva(id).subscribe({
      next: () => {
        console.log('Prova excluída com sucesso:');
        this.provaSelecionada = null;
        this.confirmarExclusao = false;
        this.fecharModal();
        this.carregarProvas();
      },
      error: (err) => {
        console.error('Erro ao excluir a prova:', err);
      }
    });
  }
}
